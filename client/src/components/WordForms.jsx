import React from 'react';
import { Table2 } from 'lucide-react';
import SpeakButton from './SpeakButton';

/**
 * Inflection forms of a card (German: plural, genitive, Präteritum / Perfekt, comparison),
 * from parseWordForms(card.notes).rows.
 */
export default function WordForms({ rows, compact = false }) {
  if (!rows || rows.length === 0) return null;
  return (
    <div className={`word-forms${compact ? ' word-forms-compact' : ''}`}>
      <div className="word-forms-title"><Table2 size={14} /> 詞形變化</div>
      <dl className="word-forms-grid">
        {rows.map((row, i) => (
          <div className="word-forms-item" key={`${row.label}-${i}`}>
            {row.label && <dt>{row.label}</dt>}
            <dd>
              <span>{row.value}</span>
              <SpeakButton text={row.value} size={13} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
