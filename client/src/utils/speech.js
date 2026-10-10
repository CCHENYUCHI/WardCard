/**
 * Spanish Pronunciation Audio Helper
 * Supports resilient dual-engine playback:
 * 1. Online High-Quality TTS Audio (/api/tts) - default, 100% reliable across iOS Safari and all mobile devices
 * 2. Native Web Speech API - fallback/optional with iOS Safari WebKit fixes
 */

let currentAudio = null;

export const TTS_MODES = {
  ONLINE: 'online',
  NATIVE: 'native'
};

export function getTtsMode() {
  return localStorage.getItem('palabracard_tts_mode') || TTS_MODES.ONLINE;
}

export function setTtsMode(mode) {
  if (mode === TTS_MODES.NATIVE || mode === TTS_MODES.ONLINE) {
    localStorage.setItem('palabracard_tts_mode', mode);
  }
}

/**
 * Play native browser SpeechSynthesis with iOS WebKit fixes
 */
function playNativeSpeech(text) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Web Speech synthesis not supported, falling back to online audio.');
    return playOnlineAudio(text);
  }

  try {
    // If paused in WebKit, resume first
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

    // Retain global reference to avoid iOS Safari garbage collection bug
    window.__palabraActiveUtterance = utterance;

    utterance.onend = () => {
      window.__palabraActiveUtterance = null;
    };

    utterance.onerror = (e) => {
      console.warn('Native speech error, falling back to online audio:', e);
      window.__palabraActiveUtterance = null;
      // Fallback to online audio if native synthesis failed
      playOnlineAudio(text);
    };

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn('Native speech error caught, falling back:', err);
    return playOnlineAudio(text);
  }
}

/**
 * Play audio via lightweight server proxy (/api/tts)
 * Works reliably on all iOS Safari, Android, and Desktop browsers.
 */
function playOnlineAudio(text) {
  try {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }

    const audioUrl = `/api/tts?text=${encodeURIComponent(text)}&lang=es`;
    const audio = new Audio(audioUrl);
    currentAudio = audio;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Online audio play failed:', err);
      });
    }
    return audio;
  } catch (err) {
    console.error('Failed to create audio element:', err);
    return null;
  }
}

/**
 * Main pronunciation playback function
 * @param {string} text - Spanish text to pronounce
 * @param {string} [modeOverride] - Optional override mode ('online' or 'native')
 */
export function playSpanishPronunciation(text, modeOverride) {
  if (!text) return;
  const cleanText = text.trim();
  if (!cleanText) return;

  const mode = modeOverride || getTtsMode();

  if (mode === TTS_MODES.NATIVE) {
    return playNativeSpeech(cleanText);
  } else {
    return playOnlineAudio(cleanText);
  }
}

