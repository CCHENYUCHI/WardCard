/**
 * Learning language of the mobile app (🇪🇸 Spanish / 🇩🇪 German), the same switch as the web navbar.
 *
 * Every API call goes through apiFetch, which sends the choice in the `x-learn-lang` header so the
 * server scopes cards, due reviews, stats and AI prompts to that deck. The choice is kept in
 * AsyncStorage. Texts mirror the `ui` part of shared/languages/{es,de}.json (Metro only bundles
 * files inside mobile/, so the few strings the app needs are copied here).
 */
import { useSyncExternalStore } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_URL } from '@/constants/api';

export type LangCode = 'es' | 'de';

export type LangConfig = {
  code: LangCode;
  flag: string;
  name: string;
  short: string;
  appName: string;
  specialChars: string[];
  wordPlaceholder: string;
  spellPlaceholder: string;
};

export const LANGUAGES: Record<LangCode, LangConfig> = {
  es: {
    code: 'es',
    flag: '🇪🇸',
    name: '西班牙語',
    short: '西語',
    appName: 'PalabraCard',
    specialChars: ['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü', '¿', '¡'],
    wordPlaceholder: '西班牙文',
    spellPlaceholder: '輸入西班牙文拼字...',
  },
  de: {
    code: 'de',
    flag: '🇩🇪',
    name: '德語',
    short: '德語',
    appName: 'WortCard',
    specialChars: ['ä', 'ö', 'ü', 'ß', 'Ä', 'Ö', 'Ü'],
    wordPlaceholder: '德文（名詞字首大寫）',
    spellPlaceholder: '輸入德文拼字（名詞字首大寫）...',
  },
};

export const LANG_CODES = Object.keys(LANGUAGES) as LangCode[];
const STORAGE_KEY = 'palabracard_learn_lang';

let current: LangCode = 'es';
const listeners = new Set<() => void>();

// Read the stored choice once; apiFetch waits for it so the first request already has the right deck
let ready: Promise<void> | null = null;
export function loadLearnLang(): Promise<void> {
  if (!ready) {
    ready = AsyncStorage.getItem(STORAGE_KEY)
      .then((code) => {
        if (code === 'es' || code === 'de') {
          current = code;
          listeners.forEach((l) => l());
        }
      })
      .catch(() => {});
  }
  return ready;
}

export function getLearnLang(): LangCode {
  return current;
}

export function getLangConfig(code: LangCode = current): LangConfig {
  return LANGUAGES[code] ?? LANGUAGES.es;
}

export async function setLearnLang(code: LangCode): Promise<void> {
  if (!LANGUAGES[code] || code === current) return;
  current = code;
  listeners.forEach((l) => l());
  try {
    await AsyncStorage.setItem(STORAGE_KEY, code);
  } catch {
    // keep the choice for this session only
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  loadLearnLang();
  return () => {
    listeners.delete(listener);
  };
}

/** Current learning language; screens list it in their effect deps to reload on switch */
export function useLearnLang(): LangCode {
  return useSyncExternalStore(subscribe, getLearnLang, getLearnLang);
}

/** fetch() that adds `x-learn-lang` to requests for our API */
export async function apiFetch(input: string, init: RequestInit = {}): Promise<Response> {
  await loadLearnLang();
  if (!input.startsWith(API_URL)) return fetch(input, init);
  const headers = new Headers(init.headers);
  if (!headers.has('x-learn-lang')) headers.set('x-learn-lang', current);
  return fetch(input, { ...init, headers });
}
