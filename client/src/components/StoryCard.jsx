import React, { useEffect, useState } from 'react';
import { ChevronDown, Table2 } from 'lucide-react';
import { getLexiconEntry, getCardDictionary } from '../utils/dictionary';
import SpeakButton from './SpeakButton';
import FormsModal from './FormsModal';

function StoryPicture({ story, size }) {
  if (story.image_url) {
    return <img className="story-pic" src={story.image_url} alt={story.zh} width={size} height={size} loading="lazy" />;
  }
  if (story.emoji) return <span className="story-pic story-emoji" style={{ fontSize: size * 0.55 }} aria-hidden="true">{story.emoji}</span>;
  return null;
}

function StoryDetails({ story }) {
  const chain = story.origin_chain || [];
  return (
    <>
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
        {story.confidence === 'sourced' ? '字源依據 Wiktionary（CC BY-SA）· ' : ''}{story.writer === 'gemini' ? 'Gemini 撰寫、程式檢查 · ' : ''}PalabraCard 字源圖鑑
      </div>
    </>
  );
}

/**
 * Hand-written lexicon entry: picture, where the word comes from, a memory hook.
 * Lookups (dictionary page, tap-a-word popover) show a one-line fold that opens on tap, so the
 * result stays short until the learner is curious. `collapsible={false}` shows everything at once
 * (a study card after it is flipped).
 */
export default function StoryCard({ story, collapsible = true }) {
  const [open, setOpen] = useState(false);
  if (!story) return null;
  const chain = story.origin_chain || [];

  if (collapsible) {
    return (
      <div className={`story-card story-fold${open ? ' is-open' : ''}`}>
        <button type="button" className="story-toggle" aria-expanded={open} onClick={() => setOpen(o => !o)}>
          <StoryPicture story={story} size={44} />
          <span className="story-toggle-text">
            <span className="story-toggle-title">字源與記憶法</span>
            <span className="story-toggle-preview">{chain.length > 1 ? `${chain[0].lang_zh} ${chain[0].word} → ${story.word}` : story.hook_zh}</span>
          </span>
          <ChevronDown size={18} className="story-chevron" aria-hidden="true" />
        </button>
        {open && <div className="story-details"><StoryDetails story={story} /></div>}
      </div>
    );
  }

  return (
    <div className="story-card">
      <StoryDetails story={story} />
    </div>
  );
}

// Tenses offered on a study card, most useful first; the full table is one tap away
const STUDY_TENSES = [['indicative', 'present'], ['indicative', 'preterite'], ['indicative', 'imperfect'], ['indicative', 'future'], ['indicative', 'conditional'], ['subjunctive', 'present']];

/** Person-by-person conjugation of one tense at a time, for a verb card after it is flipped */
function VerbPersons({ forms, onOpenFull }) {
  const tables = STUDY_TENSES.map(([mood, tense]) => forms.tables.find(t => t.mood === mood && t.tense === tense)).filter(Boolean);
  const [selected, setSelected] = useState(0);
  if (tables.length === 0) return null;
  const table = tables[Math.min(selected, tables.length - 1)];
  const nonfinite = forms.nonfinite.filter(n => n.key !== 'infinitive');
  return (
    <div className="story-card verb-persons">
      <div className="verb-persons-head">
        <span className="story-label">人稱變位</span>
        <button type="button" className="btn btn-secondary btn-sm" onClick={e => { e.currentTarget.blur(); onOpenFull(); }}>
          <Table2 size={13} /> 完整變位表
        </button>
      </div>
      <div className="verb-tense-tabs" role="tablist">
        {tables.map((t, i) => (
          <button
            key={`${t.mood}-${t.tense}`}
            type="button"
            role="tab"
            aria-selected={t === table}
            className={`verb-tense-tab${t === table ? ' is-active' : ''}`}
            onClick={e => { e.currentTarget.blur(); setSelected(i); }}
          >
            {t.mood === 'indicative' ? t.tenseLabel : `${t.moodLabel}${t.tenseLabel}`}
          </button>
        ))}
      </div>
      <table className="dx-table verb-persons-table">
        <tbody>
          {table.rows.map(r => (
            <tr key={r.person}>
              <th scope="row">{r.person}</th>
              <td lang="es">{r.form}<SpeakButton text={r.form} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      {nonfinite.length > 0 && (
        <div className="dx-nonfinite verb-persons-nonfinite">
          {nonfinite.map(n => (
            <span key={n.key} className="dx-nf"><span className="dx-nf-label">{n.label}</span> <span lang="es">{n.forms.join(' / ')}</span></span>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Study card helper, shown once the answer is revealed: the full lexicon story for the card's word and, for verbs,
 * the conjugation by person. Reads the dictionary entry the card is linked to; falls back to the lexicon alone.
 */
export function CardStory({ cardId, word }) {
  const [data, setData] = useState(null);
  const [formsOpen, setFormsOpen] = useState(false);
  useEffect(() => {
    let cancelled = false;
    setData(null);
    setFormsOpen(false);
    const request = cardId
      ? getCardDictionary(cardId).catch(() => getLexiconEntry(word).then(story => ({ story })))
      : getLexiconEntry(word).then(story => ({ story }));
    request.then(result => { if (!cancelled) setData(result); }).catch(() => {});
    return () => { cancelled = true; };
  }, [cardId, word]);
  if (!data) return null;
  const verbForms = data.forms?.kind === 'verb' ? data.forms : null;
  return (
    <>
      <StoryCard story={data.story} collapsible={false} />
      {verbForms && <VerbPersons forms={verbForms} onOpenFull={() => setFormsOpen(true)} />}
      {formsOpen && <FormsModal lemma={data.lemma || word} pos={data.pos || 'verb'} onClose={() => setFormsOpen(false)} />}
    </>
  );
}
