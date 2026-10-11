// Helpers for displaying study days ('YYYY-MM-DD') and local timestamps ('YYYY-MM-DD HH:MM:SS')

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

export const weekdayOf = (day) => WEEKDAYS[new Date(`${day}T12:00:00`).getDay()];

// '2026-10-11' -> '10月11日 週日'
export const formatDayLong = (day) => {
  if (!day) return '';
  const [, m, d] = day.split('-').map(Number);
  return `${m}月${d}日 週${weekdayOf(day)}`;
};

// '2026-10-11' -> '10/11 (日)'
export const formatDayShort = (day) => {
  if (!day) return '';
  const [, m, d] = day.split('-').map(Number);
  return `${m}/${d} (${weekdayOf(day)})`;
};

// '2026-10-11 00:27:35' -> '00:27'
export const formatClock = (ts) => (ts ? String(ts).slice(11, 16) : '');

// '00:27–01:52' or '00:27'
export const formatTimeRange = (firstAt, lastAt) => {
  const a = formatClock(firstAt);
  const b = formatClock(lastAt);
  if (!a) return '';
  return a === b ? a : `${a}–${b}`;
};
