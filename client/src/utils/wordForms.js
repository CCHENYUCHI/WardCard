/**
 * Inflection forms of a card, read back from its notes.
 *
 * The AI writes the forms into notes as one line (server/languages/de.js formatForms), so every
 * client — including the mobile app — can show them:
 *   詞形變化 → 複數：die Häuser；屬格：des Hauses
 *   詞形變化 → 三態：ging – ist gegangen
 *   詞形變化 → 比較級：besser – am besten
 * Only languages whose shared/languages/<code>.json has `formsNoteMarker` are parsed.
 */
import { getLangConfig } from './learnLang';

// "三態：ging – ist gegangen" and "比較級：besser – am besten" become two rows each
const SPLIT_LABELS = {
  三態: ['過去式', '完成式'],
  比較級: ['比較級', '最高級'],
};

function splitRow(label, value) {
  const names = SPLIT_LABELS[label];
  if (!names) return [{ label, value }];
  const parts = value.split(/\s+[–-]\s+/).map(s => s.trim()).filter(Boolean);
  if (parts.length !== names.length) return [{ label, value }];
  return parts.map((part, i) => ({ label: names[i], value: part }));
}

/**
 * @returns {{ rows: {label: string, value: string}[], rest: string }}
 *   rows: the forms (empty when the notes have none); rest: the notes without the forms line
 */
export function parseWordForms(notes, code) {
  const text = String(notes || '');
  const marker = getLangConfig(code).formsNoteMarker;
  if (!marker || !text.includes(marker)) return { rows: [], rest: text };

  const lines = text.split(/\r?\n/);
  const index = lines.findIndex(line => line.trim().startsWith(marker));
  if (index < 0) return { rows: [], rest: text };

  const body = lines[index].trim().slice(marker.length).replace(/^\s*(→|->|:|：)\s*/, '');
  const rows = body
    .split(/[；;]/)
    .map(part => part.trim())
    .filter(Boolean)
    .flatMap(part => {
      const m = part.match(/^([^：:]+)[：:]\s*(.+)$/);
      return m ? splitRow(m[1].trim(), m[2].trim()) : [{ label: '', value: part }];
    });
  if (rows.length === 0) return { rows: [], rest: text };

  const rest = lines.filter((_, i) => i !== index).join('\n').trim();
  return { rows, rest };
}
