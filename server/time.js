/**
 * Time zone & "study day" helpers.
 *
 * All timestamps in the database are stored as local wall-clock strings
 * ('YYYY-MM-DD HH:MM:SS') via SQLite's datetime('now', 'localtime').
 * A study day runs from 00:00 to 24:00 in APP time zone.
 *
 * Must be required before node:sqlite / any Date usage so SQLite's
 * 'localtime' modifier and JS Date agree on the same zone.
 */
process.env.TZ = process.env.TZ || 'Asia/Taipei';

const pad = (n) => String(n).padStart(2, '0');

// Date -> 'YYYY-MM-DD HH:MM:SS' in local time (same format as SQLite 'localtime')
function formatLocalDateTime(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

// SQL expressions for the current study day [start, end)
const TODAY_START_SQL = "datetime('now', 'localtime', 'start of day')";
const TODAY_END_SQL = "datetime('now', 'localtime', 'start of day', '+1 day')";

module.exports = {
  formatLocalDateTime,
  TODAY_START_SQL,
  TODAY_END_SQL,
  timeZone: process.env.TZ
};
