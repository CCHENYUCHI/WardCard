import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { tokenizeSentence } from '../utils/spanish';
import WordLookupPanel from './WordLookupPanel';

const MOBILE_QUERY = '(max-width: 768px)';
// Keys the study session uses; swallowed while the popover is open so they don't flip or rate the card
const SESSION_KEYS = new Set([' ', 'Enter', '1', '2', '3', '4']);

function WordPopover({ anchorRect, onClose, children }) {
  const ref = useRef(null);
  const isMobile = window.matchMedia(MOBILE_QUERY).matches;
  const [pos, setPos] = useState(null);

  // Desktop: below the word, or above when there is no room; kept inside the viewport.
  // Re-placed whenever the content grows (lookup results load after the popover opens).
  useLayoutEffect(() => {
    const el = ref.current;
    if (isMobile || !el) return undefined;
    const place = () => {
      const { width, height } = el.getBoundingClientRect();
      const margin = 8;
      let top = anchorRect.bottom + margin;
      if (top + height > window.innerHeight - margin) top = Math.max(margin, anchorRect.top - height - margin);
      const left = Math.min(
        Math.max(margin, anchorRect.left + anchorRect.width / 2 - width / 2),
        window.innerWidth - width - margin
      );
      setPos({ top, left });
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(el);
    return () => observer.disconnect();
  }, [anchorRect, isMobile]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      } else if (SESSION_KEYS.has(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    // Tapping another word switches the popover (handled by that word); anywhere else closes it
    const onPointerDown = (e) => {
      if (ref.current?.contains(e.target) || e.target.closest?.('.tap-word')) return;
      onClose();
    };
    const onScroll = (e) => {
      if (!isMobile && !ref.current?.contains(e.target)) onClose();
    };
    window.addEventListener('keydown', onKey, true); // capture: runs before the session's listener
    document.addEventListener('pointerdown', onPointerDown, true);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      window.removeEventListener('keydown', onKey, true);
      document.removeEventListener('pointerdown', onPointerDown, true);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [onClose, isMobile]);

  return createPortal(
    <div
      ref={ref}
      className={`word-popover ${isMobile ? 'is-sheet' : ''}`}
      style={isMobile ? undefined : { top: pos?.top ?? -9999, left: pos?.left ?? -9999 }}
      onClick={e => e.stopPropagation()}
      role="dialog"
    >
      <button className="btn-icon word-popover-close" onClick={onClose} aria-label="關閉">
        <X size={16} />
      </button>
      {children}
    </div>,
    document.body
  );
}

/**
 * A sentence whose words can be tapped for a translation / usage popover (Duolingo style).
 * `sentence` is what is shown (may contain the BLANK mask, which is not tappable);
 * `fullSentence` is the original, used for the AI sentence analysis.
 */
export default function TappableSentence({ sentence, fullSentence, exampleZh = '' }) {
  const [active, setActive] = useState(null); // { index, word, rect }
  const [analysis, setAnalysis] = useState(null);
  const source = fullSentence || sentence;
  const close = useCallback(() => setActive(null), []);

  // New card: close the popover and forget the old sentence's analysis
  useEffect(() => {
    setActive(null);
    setAnalysis(null);
  }, [source]);

  const tokens = tokenizeSentence(sentence);

  return (
    <>
      {tokens.map((t, i) => (t.isWord ? (
        <span
          key={i}
          className={`tap-word ${active?.index === i ? 'active' : ''}`}
          role="button"
          tabIndex={-1}
          onClick={(e) => {
            e.stopPropagation(); // don't flip the card
            if (active?.index === i) return setActive(null);
            setActive({ index: i, word: t.text, rect: e.currentTarget.getBoundingClientRect() });
          }}
        >
          {t.text}
        </span>
      ) : (
        <React.Fragment key={i}>{t.text}</React.Fragment>
      )))}
      {active && (
        <WordPopover anchorRect={active.rect} onClose={close}>
          <WordLookupPanel
            word={active.word}
            sentence={source}
            exampleZh={exampleZh}
            analysis={analysis}
            onAnalyzed={setAnalysis}
            compact
          />
        </WordPopover>
      )}
    </>
  );
}
