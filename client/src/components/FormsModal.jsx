import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { getEntryDetails, POS_LABELS } from '../utils/dictionary';
import { playSpanishPronunciation } from '../utils/speech';
import SpeakButton from './SpeakButton';

const WIKT_POS_LABEL = { verb: '動詞', noun: '名詞', adj: '形容詞' };

// A form you can tap to hear
function FormCell({ form }) {
  if (!form) return <span className="fm-empty">—</span>;
  return (
    <button type="button" className="fm-form" lang="es" onClick={() => playSpanishPronunciation(form)} title={`朗讀 ${form}`}>
      {form}
    </button>
  );
}

function VerbTables({ forms }) {
  // One table per mood: persons down, tenses across
  const moods = [];
  for (const table of forms.tables) {
    let mood = moods.find(m => m.key === table.mood);
    if (!mood) moods.push(mood = { key: table.mood, label: table.moodLabel, tables: [] });
    mood.tables.push(table);
  }
  return (
    <>
      {forms.nonfinite.length > 0 && (
        <div className="fm-nonfinite">
          {forms.nonfinite.map(n => (
            <div key={n.key} className="fm-nf">
              <span className="fm-nf-label">{n.label}</span>
              <span className="fm-nf-forms">{n.forms.map(f => <FormCell key={f} form={f} />)}</span>
            </div>
          ))}
        </div>
      )}
      {moods.map(mood => {
        const persons = [];
        for (const t of mood.tables) for (const r of t.rows) if (!persons.includes(r.person)) persons.push(r.person);
        return (
          <section key={mood.key} className="fm-mood">
            <h3>{mood.label}</h3>
            <div className="fm-scroll">
              <table className="fm-table">
                <thead>
                  <tr><th scope="col" className="fm-person-head">人稱</th>{mood.tables.map(t => <th key={t.tense} scope="col">{t.tenseLabel}</th>)}</tr>
                </thead>
                <tbody>
                  {persons.map(person => (
                    <tr key={person}>
                      <th scope="row">{person}</th>
                      {mood.tables.map(t => <td key={t.tense}><FormCell form={t.rows.find(r => r.person === person)?.form} /></td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </>
  );
}

function InflectionTable({ lemma, items }) {
  const find = (...labels) => items.find(i => labels.includes(i.label))?.form || '';
  const gendered = items.some(i => ['陰性', '陰性複數', '陽性複數'].includes(i.label));
  const used = new Set(['陰性', '陰性複數', '陽性複數', '複數', '陰陽性複數']);
  const others = items.filter(i => !used.has(i.label));
  return (
    <>
      <div className="fm-scroll">
        <table className="fm-table">
          <thead><tr><th scope="col" className="fm-person-head" /><th scope="col">單數</th><th scope="col">複數</th></tr></thead>
          <tbody>
            {gendered ? (
              <>
                <tr><th scope="row">陽性</th><td><FormCell form={lemma} /></td><td><FormCell form={find('陽性複數', '複數', '陰陽性複數')} /></td></tr>
                <tr><th scope="row">陰性</th><td><FormCell form={find('陰性')} /></td><td><FormCell form={find('陰性複數', '陰陽性複數')} /></td></tr>
              </>
            ) : (
              <tr><th scope="row">形態</th><td><FormCell form={lemma} /></td><td><FormCell form={find('複數', '陰陽性複數')} /></td></tr>
            )}
          </tbody>
        </table>
      </div>
      {others.length > 0 && (
        <div className="fm-others">
          {others.map(i => <span key={`${i.label}-${i.form}`} className="dx-chip"><span className="dx-chip-label">{i.label}</span> <FormCell form={i.form} /></span>)}
        </div>
      )}
    </>
  );
}

/**
 * Full conjugation table (verbs) or gender / number table (nouns, adjectives) in its own window.
 * Every form can be tapped to hear it.
 */
export default function FormsModal({ lemma, pos = '', onClose }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    getEntryDetails(lemma, pos).then(d => { if (!cancelled) setData(d); }).catch(err => { if (!cancelled) setError(err.message); });
    return () => { cancelled = true; };
  }, [lemma, pos]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); onClose(); } };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onClose]);

  const forms = data?.forms;
  const posLabel = WIKT_POS_LABEL[data?.pos || pos] || POS_LABELS[data?.pos] || '';

  return (
    <div className="modal-overlay fm-overlay" onClick={(e) => { e.stopPropagation(); onClose(); }}>
      <div className="modal-content fm-content" role="dialog" aria-modal="true" aria-label={`${lemma} 變化表`} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="fm-title">
            <h2 className="modal-title" lang="es">{lemma}</h2>
            <SpeakButton text={lemma} />
            {posLabel && <span className="badge-subtle">{posLabel}</span>}
            {data?.ipa && <span className="fm-ipa">{data.ipa}</span>}
          </div>
          <button type="button" className="btn-icon" onClick={onClose} aria-label="關閉"><X size={18} /></button>
        </div>

        {error && <div className="lookup-error">{error}</div>}
        {!data && !error && <div className="spinner lookup-spinner" />}
        {data && !forms && <div className="lookup-sub">字典裡沒有這個字的變化形資料。</div>}
        {forms?.kind === 'verb' && <VerbTables forms={forms} />}
        {forms?.kind === 'inflection' && <InflectionTable lemma={data.lemma || lemma} items={forms.items} />}
        {forms && <div className="lookup-credit">點任一個形態可以聽發音 · 資料：Wiktionary · CC BY-SA</div>}
      </div>
    </div>
  );
}
