// Run with: npm test  (node --test, no extra packages)
process.env.DB_PATH = ':memory:';
const test = require('node:test');
const assert = require('node:assert/strict');

const db = require('./db');
const { buildTodayPlan, getTodaySummary, getWeeklyForecast } = require('./dailyProgress');
const { calculateInterval, initialStability } = require('./fsrs');

const UNIT = '課堂筆記';

function makeUser(name, quota = 15) {
  const { lastInsertRowid } = db.prepare(`
    INSERT INTO users (username, password_hash, daily_new_quota, target_retention, active_curriculum)
    VALUES (?, 'x', ?, 0.9, ?)
  `).run(name, quota, UNIT);
  return Number(lastInsertRowid);
}

let seq = 0;
function addCard(userId, { category = UNIT, status = 'active', reviewed = false, dueInDays = 0, stability = 3, reps = 1 } = {}) {
  seq++;
  db.prepare(`
    INSERT INTO cards (user_id, word, translation, category, lifecycle_status, review_count, last_reviewed,
      fsrs_stability, fsrs_difficulty, fsrs_reps, due_date)
    VALUES (?, ?, 'x', ?, ?, ?, ?, ?, 5, ?, datetime('now', 'localtime', 'start of day', ?, '+12 hours'))
  `).run(
    userId, `w${seq}`, category, status,
    reviewed ? 1 : 0,
    reviewed ? db.prepare("SELECT datetime('now', 'localtime', '-3 days') AS t").get().t : null,
    reviewed ? stability : 0,
    reviewed ? reps : 0,
    `${dueInDays} days`
  );
}

const reviewsOn = (day) => day.dueReviews + day.projectedReviews;

test('today column matches the daily task, not every active card', () => {
  const u = makeUser('today-match');
  for (let i = 0; i < 40; i++) addCard(u);                                        // never studied -> "new"
  addCard(u, { reviewed: true, dueInDays: 0 });
  addCard(u, { reviewed: true, dueInDays: -2 });                                   // overdue counts today
  addCard(u, { reviewed: true, dueInDays: 0, category: '其他單元' });                // other unit: not today's task

  const summary = getTodaySummary(u);
  const { days } = getWeeklyForecast(u);
  assert.equal(summary.remainingDue, 2);
  assert.equal(summary.remainingNew, 15);
  assert.equal(days.length, 7);
  assert.equal(days[0].dueReviews, summary.remainingDue);
  assert.equal(days[0].newWords, summary.remainingNew);
  assert.equal(days[0].totalWorkload, summary.remaining);
});

test('new words come from the unit pool (unstudied active + ready) and run out', () => {
  const u = makeUser('pool', 15);
  for (let i = 0; i < 20; i++) addCard(u);
  for (let i = 0; i < 12; i++) addCard(u, { status: 'ready' });
  for (let i = 0; i < 50; i++) addCard(u, { status: 'ready', category: '其他單元' });

  const { days, newPool } = getWeeklyForecast(u);
  assert.equal(newPool, 32);
  assert.deepEqual(days.map(d => d.newWords), [15, 15, 2, 0, 0, 0, 0]);
});

test('only cards in the active unit are scheduled on future days', () => {
  const u = makeUser('scope');
  addCard(u, { reviewed: true, dueInDays: 5, stability: 30 });
  for (let i = 0; i < 22; i++) addCard(u, { reviewed: true, dueInDays: 5, stability: 30, category: '其他單元' });

  const { days } = getWeeklyForecast(u);
  assert.equal(days[5].dueReviews, 1);
});

test('words learned on a day come back as projected reviews after the first FSRS interval', () => {
  const u = makeUser('projection', 10);
  for (let i = 0; i < 10; i++) addCard(u);

  const firstInterval = calculateInterval(initialStability(3), 0.9);
  const { days } = getWeeklyForecast(u);
  assert.equal(days[0].newWords, 10);
  assert.equal(days[firstInterval].projectedReviews, 10);
  assert.equal(days.reduce((s, d) => s + d.dueReviews, 0), 0);
  for (let i = 1; i < firstInterval; i++) assert.equal(reviewsOn(days[i]), 0);
});

test('a lapsed card due today is projected to come back within the week', () => {
  const u = makeUser('relearn');
  addCard(u, { reviewed: true, dueInDays: 0, stability: 0.5, reps: 0 });  // reps reset by a lapse
  const { days } = getWeeklyForecast(u);
  assert.equal(days[0].dueReviews, 1);
  assert.equal(days[calculateInterval(initialStability(3), 0.9)].projectedReviews, 1);
});

test('a stable card does not come back within the week', () => {
  const u = makeUser('stable');
  addCard(u, { reviewed: true, dueInDays: 1, stability: 20, reps: 4 });
  const { days, beyondWindow } = getWeeklyForecast(u);
  assert.equal(days[1].dueReviews, 1);
  assert.equal(days.reduce((s, d) => s + d.projectedReviews, 0), 0);
  assert.equal(beyondWindow, 0);
});

test('plan exposes the new-word pool used by the forecast', () => {
  const u = makeUser('plan-pool', 15);
  for (let i = 0; i < 3; i++) addCard(u);
  addCard(u, { status: 'ready' });
  assert.equal(buildTodayPlan(u, false).newPool, 4);
});
