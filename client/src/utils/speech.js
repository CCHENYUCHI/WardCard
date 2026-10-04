/**
 * Spanish Web Speech API TTS Helper
 */
export function playSpanishPronunciation(text) {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported on this browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-ES'; // European Spanish or Latin American
  utterance.rate = 0.9; // Slightly slower for language learners

  // Pick a natural Spanish voice if available
  const voices = window.speechSynthesis.getVoices();
  const esVoice = voices.find(v => v.lang.startsWith('es') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Monica') || v.name.includes('Jorge')));
  if (esVoice) {
    utterance.voice = esVoice;
  }

  window.speechSynthesis.speak(utterance);
}
