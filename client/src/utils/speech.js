/**
 * Spanish Pronunciation Audio Helper
 * Smart Dual-Engine System:
 * - Desktop (Mac Safari, Chrome, Windows): Defaults to native Web Speech API (zero latency, offline, native macOS voices).
 * - Mobile (iOS Safari, Android): Defaults to online audio stream (bypasses iOS silent switch & missing voice packs).
 * - Bidirectional Fallback: If either engine encounters an error, automatically falls back to the other.
 */

let currentAudio = null;

export const TTS_MODES = {
  AUTO: 'auto',
  ONLINE: 'online',
  NATIVE: 'native'
};

export function isMobileDevice() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const isTouchMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isIpadOS = navigator.maxTouchPoints && navigator.maxTouchPoints > 1 && /MacIntel/.test(navigator.platform);
  return Boolean(isTouchMobile || isIpadOS);
}

export function getTtsMode() {
  return localStorage.getItem('palabracard_tts_mode') || TTS_MODES.AUTO;
}

export function setTtsMode(mode) {
  if (mode === TTS_MODES.AUTO || mode === TTS_MODES.NATIVE || mode === TTS_MODES.ONLINE) {
    localStorage.setItem('palabracard_tts_mode', mode);
  }
}

/**
 * Play native browser SpeechSynthesis with iOS/WebKit resilience
 */
function playNativeSpeech(text, allowFallback = true) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Web Speech synthesis not supported.');
    if (allowFallback) return playOnlineAudio(text, false);
    return null;
  }

  try {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;

    // Pick best Spanish voice
    const voices = window.speechSynthesis.getVoices() || [];
    const esVoice = voices.find(v => 
      v.lang.startsWith('es') && 
      (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Monica') || v.name.includes('Mónica') || v.name.includes('Paulina') || v.name.includes('Jorge') || v.name.includes('Spanish'))
    ) || voices.find(v => v.lang.startsWith('es'));

    if (esVoice) {
      utterance.voice = esVoice;
    }

    // Retain global reference to prevent WebKit garbage collection
    window.__palabraActiveUtterance = utterance;

    utterance.onend = () => {
      window.__palabraActiveUtterance = null;
    };

    utterance.onerror = (e) => {
      window.__palabraActiveUtterance = null;
      console.warn('Native speech error, falling back to online audio:', e);
      if (allowFallback) {
        playOnlineAudio(text, false);
      }
    };

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn('Native speech caught error, falling back:', err);
    if (allowFallback) {
      return playOnlineAudio(text, false);
    }
    return null;
  }
}

/**
 * Play audio via lightweight server proxy (/api/tts)
 */
function playOnlineAudio(text, allowFallback = true) {
  try {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }

    const audioUrl = `/api/tts?text=${encodeURIComponent(text)}&lang=es`;
    const audio = new Audio(audioUrl);
    currentAudio = audio;

    let hasFallenBack = false;
    const triggerFallback = (reason) => {
      if (!hasFallenBack && allowFallback) {
        hasFallenBack = true;
        console.warn('Online audio failed (' + reason + '), falling back to native speech.');
        playNativeSpeech(text, false);
      }
    };

    audio.onerror = () => {
      triggerFallback('audio error event');
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        triggerFallback(err?.message || 'play rejection');
      });
    }
    return audio;
  } catch (err) {
    console.error('Failed to create audio element:', err);
    if (allowFallback) {
      return playNativeSpeech(text, false);
    }
    return null;
  }
}

/**
 * Main pronunciation playback function
 * @param {string} text - Spanish text to pronounce
 * @param {string} [modeOverride] - Optional override mode ('auto', 'online', 'native')
 */
export function playSpanishPronunciation(text, modeOverride) {
  if (!text) return;
  const cleanText = text.trim();
  if (!cleanText) return;

  const mode = modeOverride || getTtsMode();

  if (mode === TTS_MODES.NATIVE) {
    return playNativeSpeech(cleanText, true);
  } else if (mode === TTS_MODES.ONLINE) {
    return playOnlineAudio(cleanText, true);
  } else {
    // AUTO mode: Desktop prefers native; Mobile prefers online audio
    if (isMobileDevice()) {
      return playOnlineAudio(cleanText, true);
    } else {
      return playNativeSpeech(cleanText, true);
    }
  }
}


