import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { X, Stethoscope, Check, EyeOff, Undo2, ArrowRight } from 'lucide-react';
import { fetchAPI } from '../utils/api';
import { POS_LABELS, clearLookupCache } from '../utils/dictionary';

const GENDER_LABELS = { masculino: '陽性', femenino: '陰性', none: '無' };
// Rows the dictionary can fix; the rest ("missing") can only be kept as they are
const canFix = (issue) => issue.candidates.length > 0 && !issue.problems.includes('missing');
const keyOf = (c) => `${c.lemma}|${c.pos}`;

async function api(path, body) {
  const res = await fetchAPI(path, body ? { method: 'POST', body: JSON.stringify(body) } : undefined);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || '操作失敗');
  return data;
}

// Mirrors server/cardAudit.js changesFor(): what the card would become with this entry
function diffFor(card, entry) {
  const rows = [];
  if (card.part_of_speech !== entry.part_of_speech) rows.push(['詞性', POS_LABELS[card.part_of_speech] || card.part_of_speech, POS_LABELS[entry.part_of_speech] || entry.part_of_speech]);
  if (entry.part_of_speech === 'sustantivo') {
    if (entry.gender && entry.gender !== 'none' && card.gender !== entry.gender) rows.push(['陰陽性', GENDER_LABELS[card.gender] || card.gender, GENDER_LABELS[entry.gender]]);
    const elA = card.article === 'el' && entry.gender === 'femenino' && /^h?[aá]/i.test(card.word);
    if (entry.article && card.article !== entry.article && !elA) rows.push(['冠詞', card.article || '（無）', entry.article]);
  } else if (card.article) {
    rows.push(['冠詞', card.article, '（無）']);
  }
  return rows;
}

function candidateLabel(c) {
  const pos = POS_LABELS[c.part_of_speech] || c.pos;
  const gender = c.gender && c.gender !== 'none' ? ` ${GENDER_LABELS[c.gender]}` : '';
  return `${c.lemma}（${pos}${gender}）${c.glosses.length ? ` — ${c.glosses.join('; ')}` : ''}`;
}

function IssueRow({ issue, labels, choice, onChoose, rename, onRename, selected, onSelect }) {
  const { card, candidates, problems } = issue;
  const entry = candidates.find(c => keyOf(c) === choice) || candidates[0];
  const diff = entry ? diffFor(card, entry) : [];
  const isForm = problems.includes('form');
  return (
    <li className={`audit-row${selected ? ' is-selected' : ''}`}>
      <div className="audit-row-head">
        <input type="checkbox" checked={selected} onChange={e => onSelect(e.target.checked)} aria-label={`選取 ${card.word}`} />
        <span className="audit-word" lang="es">{card.article ? `${card.article} ` : ''}{card.word}</span>
        <span className="audit-zh">{card.translation}</span>
      </div>
      <div className="audit-problems">
        {problems.map(p => <span key={p} className={`audit-chip audit-${p}`}>{labels[p] || p}</span>)}
      </div>

      {candidates.length > 1 && (
        <label className="audit-choose">
          <span>對應字典條目</span>
          <select value={choice || keyOf(candidates[0])} onChange={e => onChoose(e.target.value)}>
            {candidates.map(c => <option key={keyOf(c)} value={keyOf(c)}>{candidateLabel(c)}</option>)}
          </select>
        </label>
      )}
      {candidates.length === 1 && <div className="audit-entry">字典：{candidateLabel(candidates[0])}</div>}

      {diff.length > 0 && (
        <ul className="audit-diff">
          {diff.map(([field, from, to]) => (
            <li key={field}><span className="audit-field">{field}</span> <s>{from}</s> <ArrowRight size={12} aria-hidden="true" /> <b>{to}</b></li>
          ))}
        </ul>
      )}
      {isForm && entry && entry.lemma !== card.word && (
        <label className="audit-rename">
          <input type="checkbox" checked={rename} onChange={e => onRename(e.target.checked)} />
          把單字改成原形「<span lang="es">{entry.lemma}</span>」
        </label>
      )}
      {problems.includes('duplicate') && issue.duplicates.length > 0 && (
        <div className="audit-note">和單字庫裡的 {issue.duplicates.map(d => `「${d.word}」`).join('、')} 是同一個字，可以到單字庫合併或刪除其中一張。</div>
      )}
      {problems.includes('missing') && <div className="audit-note">字典裡沒有這個字（可能是片語、拼字不同或拼錯），請到單字庫自行確認；不需要的話按「保留」就不會再提醒。</div>}
    </li>
  );
}

/** 單字庫健檢: list cards that disagree with the dictionary; fix them in bulk (undoable) or keep them as they are. */
export default function CardAuditModal({ onClose, onChanged }) {
  const [audit, setAudit] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(() => new Set());
  const [choices, setChoices] = useState({});
  const [renames, setRenames] = useState({});
  const [lastBatch, setLastBatch] = useState(null);
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const data = await api('/api/cards/audit');
      setAudit(data);
      setSelected(new Set());
      // Default choice: the entry the card is linked to, else the first one
      setChoices(Object.fromEntries(data.issues.map(i => [i.card.id, i.link ? `${i.link.lemma}|${i.link.pos}` : (i.candidates[0] ? keyOf(i.candidates[0]) : '')])));
      setRenames(Object.fromEntries(data.issues.filter(i => i.problems.includes('form')).map(i => [i.card.id, true])));
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const visible = useMemo(() => (audit?.issues || []).filter(i => filter === 'all' || i.problems.includes(filter)), [audit, filter]);

  const toggle = (id, on) => setSelected(prev => {
    const next = new Set(prev);
    if (on) next.add(id); else next.delete(id);
    return next;
  });

  const afterChange = async (text) => {
    clearLookupCache();
    setMessage(text);
    await load();
    onChanged?.();
  };

  const handleApply = async () => {
    const fixable = new Set((audit?.issues || []).filter(canFix).map(i => i.card.id));
    const items = [...selected].filter(id => fixable.has(id)).map(id => {
      const [lemma, pos] = String(choices[id] || '').split('|');
      return { id, lemma, pos, rename: Boolean(renames[id]) };
    }).filter(i => i.lemma);
    if (!items.length) {
      setMessage('選取的卡字典裡都沒有，無法依字典修正；可以按「保留現狀」');
      return;
    }
    setBusy(true);
    try {
      const result = await api('/api/cards/audit/apply', { items });
      setLastBatch(result.batchId ? { id: result.batchId, count: result.applied.length } : null);
      const skipped = result.skipped.length ? `；${result.skipped.length} 張略過（${result.skipped.map(s => s.reason).join('、')}）` : '';
      await afterChange(`已依字典修正 ${result.applied.length} 張卡${skipped}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDismiss = async () => {
    if (!selected.size) return;
    setBusy(true);
    try {
      const { dismissed } = await api('/api/cards/audit/dismiss', { ids: [...selected] });
      await afterChange(`已保留 ${dismissed} 張卡的現狀，之後不再提醒`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleUndo = async () => {
    if (!lastBatch) return;
    setBusy(true);
    try {
      const { restored } = await api('/api/cards/audit/undo', { batchId: lastBatch.id });
      setLastBatch(null);
      await afterChange(`已復原 ${restored} 張卡`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const summary = audit?.summary || {};
  const labels = audit?.labels || {};

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content audit-content" role="dialog" aria-modal="true" aria-label="單字庫健檢" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title"><Stethoscope size={20} /> 單字庫健檢</h2>
          <button type="button" className="btn-icon" onClick={onClose} aria-label="關閉"><X size={18} /></button>
        </div>

        <p className="audit-intro">比對每張卡和離線字典，列出詞性、陰陽性、冠詞不同，或查不到、可能是變化形、重複的卡。勾選後按「依字典修正」會把字典的值寫回卡片（中文、例句、筆記和學習進度都不會動），可以復原。</p>

        {error && <div className="lookup-error">{error}</div>}
        {message && (
          <div className="audit-message">
            <Check size={14} /> <span>{message}</span>
            {lastBatch && <button type="button" className="btn btn-secondary btn-sm" onClick={handleUndo} disabled={busy}><Undo2 size={14} /> 復原</button>}
          </div>
        )}
        {!audit && !error && <div className="spinner lookup-spinner" />}
        {audit && !audit.available && <div className="lookup-sub">伺服器沒有離線字典，無法比對。請先建置字典（npm run build:dict）。</div>}

        {audit?.available && (
          <>
            <div className="audit-filters" aria-label="問題類型">
              <button type="button" className="audit-filter" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>全部 {audit.issues.length}</button>
              {Object.entries(summary).map(([p, n]) => (
                <button type="button" key={p} className="audit-filter" aria-pressed={filter === p} onClick={() => setFilter(p)}>{labels[p] || p} {n}</button>
              ))}
            </div>

            {audit.issues.length === 0 ? (
              <div className="audit-empty">🎉 所有單字卡都和字典一致。</div>
            ) : (
              <>
                <div className="audit-actions">
                  <label className="audit-select-all">
                    <input
                      type="checkbox"
                      checked={visible.length > 0 && visible.every(i => selected.has(i.card.id))}
                      onChange={e => setSelected(prev => {
                        const next = new Set(prev);
                        for (const i of visible) { if (e.target.checked) next.add(i.card.id); else next.delete(i.card.id); }
                        return next;
                      })}
                    />
                    全選這一類（{visible.length}）
                  </label>
                  <div className="audit-buttons">
                    <button type="button" className="btn btn-secondary btn-sm" onClick={handleDismiss} disabled={busy || !selected.size}><EyeOff size={14} /> 保留現狀</button>
                    <button type="button" className="btn btn-primary btn-sm" onClick={handleApply} disabled={busy || !selected.size}><Check size={14} /> 依字典修正（{selected.size}）</button>
                  </div>
                </div>
                <ul className="audit-list">
                  {visible.map(issue => (
                    <IssueRow
                      key={issue.card.id}
                      issue={issue}
                      labels={labels}
                      choice={choices[issue.card.id]}
                      onChoose={v => setChoices(c => ({ ...c, [issue.card.id]: v }))}
                      rename={Boolean(renames[issue.card.id])}
                      onRename={v => setRenames(r => ({ ...r, [issue.card.id]: v }))}
                      selected={selected.has(issue.card.id)}
                      onSelect={on => toggle(issue.card.id, on)}
                    />
                  ))}
                </ul>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
