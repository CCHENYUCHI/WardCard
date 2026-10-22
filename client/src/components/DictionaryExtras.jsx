import React, { useCallback, useEffect, useState } from 'react';
import { Table2 } from 'lucide-react';
import { getEntryDetails, getCardDictionary } from '../utils/dictionary';
import SpeakButton from './SpeakButton';
import FormsModal from './FormsModal';

function VerbForms({ forms }) {
  const moods = [];
  for (const table of forms.tables) {
    let mood = moods.find(m => m.key === table.mood);
    if (!mood) moods.push(mood = { key: table.mood, label: table.moodLabel, tables: [] });
    mood.tables.push(table);
  }
  return (
    <div className="dx-verb">
      {forms.nonfinite.length > 0 && (
        <div className="dx-nonfinite">
          {forms.nonfinite.map(n => (
            <span key={n.key} className="dx-nf"><span className="dx-nf-label">{n.label}</span> {n.forms.join(' / ')}</span>
          ))}
        </div>
      )}
      {moods.map((mood, i) => (
        <details key={mood.key} className="dx-fold" open={i === 0}>
          <summary>{mood.label}</summary>
          <div className="dx-tenses">
            {mood.tables.map(t => (
              <table key={t.tense} className="dx-table">
                <caption>{t.tenseLabel}</caption>
                <tbody>
                  {t.rows.map(r => (
                    <tr key={r.person}><th scope="row">{r.person}</th><td lang="es">{r.form}</td></tr>
                  ))}
                </tbody>
              </table>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}

function DetailSections({ data, showStory, onOpenForms }) {
  const { forms, examples, etymology } = data;
  const hasAnything = data.ipa || forms || examples?.length || etymology;
  if (!hasAnything && !(showStory && data.story)) return null;
  return (
    <>
      {data.ipa && <div className="dx-ipa">發音 <span lang="es">{data.ipa}</span></div>}

      {forms && (
        <button type="button" className="btn btn-secondary btn-sm dx-open-forms" onClick={onOpenForms}>
          <Table2 size={14} /> {forms.kind === 'verb' ? '動詞變位表' : '變化表（陰陽性、單複數）'}
        </button>
      )}
      {forms && forms.kind === 'verb' && (
        <details className="dx-fold dx-section">
          <summary>動詞變位（摘要）</summary>
          <VerbForms forms={forms} />
        </details>
      )}
      {forms && forms.kind === 'inflection' && forms.items.length > 0 && (
        <details className="dx-fold dx-section" open>
          <summary>變形（陰陽性、單複數）</summary>
          <div className="dx-inflection">
            {forms.items.map(item => (
              <span key={`${item.label}-${item.form}`} className="dx-chip"><span className="dx-chip-label">{item.label}</span> <span lang="es">{item.form}</span></span>
            ))}
          </div>
        </details>
      )}

      {etymology && (etymology.text || etymology.chain.length > 0) && (
        <details className="dx-fold dx-section">
          <summary>字源（Wiktionary，英文）</summary>
          {etymology.chain.length > 0 && (
            <div className="dx-chain">
              {etymology.chain.map((c, i) => (
                <React.Fragment key={`${c.lang}-${c.word}`}>
                  {i > 0 && <span className="dx-arrow" aria-hidden="true">→</span>}
                  <span className="dx-chain-item"><span className="dx-chip-label">{c.lang_zh}</span> <span>{c.word}</span></span>
                </React.Fragment>
              ))}
            </div>
          )}
          {etymology.text && <p className="dx-text">{etymology.text}</p>}
        </details>
      )}

      {examples?.length > 0 && (
        <details className="dx-fold dx-section">
          <summary>字典例句</summary>
          <ul className="dx-examples">
            {examples.map(ex => (
              <li key={ex.es}>
                <span lang="es">{ex.es}</span><SpeakButton text={ex.es} />
                <div className="lookup-sub">{ex.en}</div>
              </li>
            ))}
          </ul>
          <div className="lookup-credit">英文翻譯，僅供參考 · Wiktionary · CC BY-SA</div>
        </details>
      )}
    </>
  );
}

/**
 * What the offline dictionary knows beyond the meaning: IPA, verb conjugation / noun and adjective forms,
 * etymology and example sentences. Sections only appear when there is data, and the dictionary may be an
 * older build without any of it.
 *
 * @param {number} [cardId] - load the entry the card is linked to (card detail)
 * @param {string} [lemma] - or load a dictionary entry directly (dictionary page)
 * @param {string} [pos] - wiktextract part of speech of that entry
 * @param {boolean} [lazy] - wait for the first tap on "字典資料" before loading (many entries on one page)
 * @param {React.ReactNode} [children] - rendered above the sections, e.g. the lexicon StoryCard
 */
export default function DictionaryExtras({ cardId, lemma, pos = '', lazy = false, children, renderStory }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [wanted, setWanted] = useState(!lazy);
  const [formsOpen, setFormsOpen] = useState(false);

  const load = useCallback(() => {
    setError('');
    const request = cardId ? getCardDictionary(cardId) : getEntryDetails(lemma, pos);
    return request.then(setData).catch(err => setError(err.message));
  }, [cardId, lemma, pos]);

  useEffect(() => {
    setData(null);
    if (wanted) load();
  }, [wanted, load]);

  const body = (
    <>
      {error && <div className="lookup-error">{error}</div>}
      {!data && !error && wanted && <div className="spinner lookup-spinner" />}
      {data && (
        <>
          {renderStory && data.story ? renderStory(data.story) : null}
          <DetailSections data={data} showStory={Boolean(renderStory)} onOpenForms={() => setFormsOpen(true)} />
          {formsOpen && <FormsModal lemma={data.lemma || lemma} pos={data.pos || pos} onClose={() => setFormsOpen(false)} />}
          {data && data.linked === false && !data.story && !data.ipa && (
            <div className="lookup-sub">字典裡沒有這個字的額外資料。</div>
          )}
        </>
      )}
    </>
  );

  if (lazy) {
    return (
      <details className="dx-fold dx-lazy" onToggle={e => { if (e.currentTarget.open) setWanted(true); }}>
        <summary>字典資料：變位、字源、例句</summary>
        {wanted && <div className="dx-body">{body}</div>}
      </details>
    );
  }
  return <div className="dx-root">{children}{body}</div>;
}
