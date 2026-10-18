import React from 'react';
import { Volume2 } from 'lucide-react';
import { playSpanishPronunciation } from '../utils/speech';

/** Small 🔊 button that reads `text` aloud; doesn't bubble (won't close popovers or flip cards). */
export default function SpeakButton({ text, size = 15 }) {
  if (!text) return null;
  return (
    <button
      type="button"
      className="btn-icon speak-btn"
      title="發音"
      aria-label={`朗讀 ${text}`}
      onClick={(e) => {
        e.stopPropagation();
        playSpanishPronunciation(text);
      }}
    >
      <Volume2 size={size} />
    </button>
  );
}
