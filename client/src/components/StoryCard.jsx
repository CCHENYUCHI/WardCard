import React, { useEffect, useState } from 'react';
import { getLexiconEntry } from '../utils/dictionary';
import SpeakButton from './SpeakButton';

function StoryPicture({ story, size }) {
  if (story.image_url) {
    return <img className="story-pic" src={story.image_url} alt={story.zh} width={size} height={size} loading="lazy" />;
  }
  if (story.emoji) return <span className="story-pic story-emoji" style={{ fontSize: size * 0.55 }} aria-hidden="true">{story.emoji}</span>;
  return null;
}

/**
 * Hand-written lexicon entry: picture, where the word comes from, a memory hook.
 * compact: picture + hook + one-line origin (popover and study cards); full: everything (dictionary page).
 */
export default function StoryCard({ story, compact = false }) {
  if (!story) return null;
  const chain = story.origin_chain || [];

  if (compact) {
    return (
      <div className="story-card story-compact">
        <StoryPicture story={story} size={64} />
        <div className="story-text">
          {chain.length > 1 && (
            <div className="story-chain-line">{chain[0].lang_zh} {chain[0].word} → {story.word}</div>
          )}
          <div className="story-hook">🧠 {story.hook_zh}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="story-card">
      <div className="story-top">
        <StoryPicture story={story} size={96} />
        <div className="story-text">
          {story.breakdown?.length > 0 && (
            <div className="story-parts">
              {story.breakdown.map((p, i) => (
                <React.Fragment key={p.part}>
                  {i > 0 && <span className="story-plus">+</span>}
                  <span className="story-part"><b>{p.part}</b> {p.zh}</span>
                </React.Fragment>
              ))}
            </div>
          )}
          <p className="story-hook"><span className="story-label">記憶聯想</span>{story.hook_zh}</p>
          {story.cognates_en?.length > 0 && (
            <div className="story-cognates">
              英文同源 {story.cognates_en.map(c => <span key={c} className="story-chip">{c}</span>)}
            </div>
          )}
        </div>
      </div>
      {chain.length > 0 && (
        <ol className="story-chain">
          {chain.map((o, i) => (
            <li key={`${o.word}-${i}`}>
              <span className="story-lang">{o.lang_zh}</span>
              <span className="story-w">{o.word}</span>
              <span className="story-g">{o.zh}</span>
            </li>
          ))}
        </ol>
      )}
      {story.story_zh && <p className="story-body"><span className="story-label">字源故事</span>{story.story_zh}</p>}
      {story.usage_zh && <p className="story-usage">💡 {story.usage_zh}</p>}
      <div className="story-example">
        <div>{story.example_es}<SpeakButton text={story.example_es} /></div>
        <div className="lookup-sub">{story.example_zh}</div>
      </div>
      <div className="lookup-credit">
        {story.confidence === 'sourced' ? '字源依據 Wiktionary（CC BY-SA）· ' : ''}PalabraCard 字源圖鑑
      </div>
    </div>
  );
}

/** Study card helper: loads the lexicon entry for a card's word and shows the compact story, if there is one. */
export function CardStory({ word }) {
  const [story, setStory] = useState(null);
  useEffect(() => {
    let cancelled = false;
    setStory(null);
    getLexiconEntry(word).then(entry => { if (!cancelled) setStory(entry); }).catch(() => {});
    return () => { cancelled = true; };
  }, [word]);
  return <StoryCard story={story} compact />;
}
