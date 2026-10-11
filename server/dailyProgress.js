/**
 * Daily task / progress / streak logic.
 *
 * Today's task (study day = local 00:00 ~ 24:00):
 *   - due reviews : previously reviewed active cards whose due_date falls before end of today
 *   - new words   : never-reviewed cards (active first, then 'ready' pool), capped by
 *                   daily_new_quota minus new words already learned today
 * Every review is tagged in review_logs.task_type as 'due' / 'new' / 'extra'.
 */
const db = require('./db');
const { TODAY_START_SQL, TODAY_END_SQL } = require('./time');

const DUE_BATCH_LIMIT = 100;

function getUser(userId) {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(userId) || {};
}

// Same unit scope the agenda uses (active_curriculum)
function unitScope(user) {
  const unit = user.active_curriculum || '';
  if (!unit || unit === 'ALL_ACTIVE') return { sql: '', params: [] };
  return {
    sql: " AND (curriculum_unit = ? OR ((curriculum_unit IS NULL OR curriculum_unit = '') AND category = ?))",
    params: [unit, unit]
  };
}

// Classify a review before the card is updated
function classifyReview(card) {
  const neverReviewed = !card.last_reviewed && !(Number(card.review_count) > 0);
  if (card.lifecycle_status === 'ready' || card.lifecycle_status === 'inbox' || neverReviewed) return 'new';
  if (card.lifecycle_status === 'active' && card.due_date) {
    const end = db.prepare(`SELECT ${TODAY_END_SQL} AS t`).get().t;
    if (String(card.due_date) < end) return 'due';
  }
  return 'extra';
}

function getTodayDone(userId) {
  const row = db.prepare(`
    SELECT
      COUNT(*) AS reviews,
      COUNT(DISTINCT CASE WHEN COALESCE(task_type, 'due') = 'due' THEN card_id END) AS due_done,
      COUNT(DISTINCT CASE WHEN task_type = 'new' THEN card_id END) AS new_done,
      SUM(CASE WHEN task_type = 'extra' THEN 1 ELSE 0 END) AS extra_done,
      SUM(CASE WHEN rating >= 3 THEN 1 ELSE 0 END) AS correct,
      MIN(reviewed_at) AS first_at,
      MAX(reviewed_at) AS last_at
    FROM review_logs
    WHERE user_id = ? AND reviewed_at >= ${TODAY_START_SQL} AND reviewed_at < ${TODAY_END_SQL}
  `).get(userId);
  return {
    reviews: Number(row.reviews) || 0,
    due: Number(row.due_done) || 0,
    new: Number(row.new_done) || 0,
    extra: Number(row.extra_done) || 0,
    correct: Number(row.correct) || 0,
    firstAt: row.first_at || null,
    lastAt: row.last_at || null
  };
}

/**
 * Build today's plan: cards to study now + remaining counts.
 * @param {boolean} withCards - also return the card rows (agenda); counts only otherwise
 */
function buildTodayPlan(userId, withCards = true) {
  const user = getUser(userId);
  const quota = Number(user.daily_new_quota) || 15;
  const scope = unitScope(user);
  const done = getTodayDone(userId);

  const dueWhere = `
    WHERE user_id = ? AND lifecycle_status = 'active' AND due_date < ${TODAY_END_SQL}
      AND (last_reviewed IS NOT NULL OR review_count > 0) ${scope.sql}`;
  const dueTotal = Number(db.prepare(`SELECT COUNT(*) AS c FROM cards ${dueWhere}`).get(userId, ...scope.params).c) || 0;

  const newAllowance = Math.max(0, quota - done.new);
  const freshWhere = `user_id = ? AND last_reviewed IS NULL AND COALESCE(review_count, 0) = 0 ${scope.sql}`;
  const activeFreshTotal = Number(db.prepare(
    `SELECT COUNT(*) AS c FROM cards WHERE lifecycle_status = 'active' AND ${freshWhere}`
  ).get(userId, ...scope.params).c) || 0;
  const readyTotal = Number(db.prepare(
    `SELECT COUNT(*) AS c FROM cards WHERE user_id = ? AND lifecycle_status = 'ready' ${scope.sql}`
  ).get(userId, ...scope.params).c) || 0;
  const newRemaining = Math.min(newAllowance, activeFreshTotal + readyTotal);

  let dueCards = [];
  let newCards = [];
  if (withCards) {
    dueCards = db.prepare(`
      SELECT * FROM cards ${dueWhere}
      ORDER BY CASE WHEN lapse_count > 0 THEN 0 ELSE 1 END, due_date ASC
      LIMIT ${DUE_BATCH_LIMIT}
    `).all(userId, ...scope.params);

    if (newRemaining > 0) {
      // Already-activated but never-seen words first, then promote from the ready pool
      newCards = db.prepare(`
        SELECT * FROM cards WHERE lifecycle_status = 'active' AND ${freshWhere}
        ORDER BY is_starred DESC, id ASC LIMIT ?
      `).all(userId, ...scope.params, newRemaining);
      if (newCards.length < newRemaining) {
        newCards = newCards.concat(db.prepare(`
          SELECT * FROM cards WHERE user_id = ? AND lifecycle_status = 'ready' ${scope.sql}
          ORDER BY is_starred DESC, id ASC LIMIT ?
        `).all(userId, ...scope.params, newRemaining - newCards.length));
      }
    }
  }

  return { user, quota, done, dueTotal, newRemaining, dueCards, newCards };
}

function currentDay() {
  return db.prepare("SELECT date('now', 'localtime') AS d").get().d;
}

// Current & best streak: consecutive days with at least one review
function getStreak(userId, today) {
  const days = db.prepare(`
    SELECT DISTINCT date(reviewed_at) AS d FROM review_logs WHERE user_id = ? ORDER BY d DESC
  `).all(userId).map(r => r.d);

  const daySet = new Set(days);
  const shift = (d, n) => {
    const dt = new Date(`${d}T12:00:00`);
    dt.setDate(dt.getDate() + n);
    return dt.toISOString().slice(0, 10);
  };

  const practicedToday = daySet.has(today);
  // Streak stays alive until the end of today even if today isn't done yet
  let cursor = practicedToday ? today : shift(today, -1);
  let current = 0;
  while (daySet.has(cursor)) {
    current++;
    cursor = shift(cursor, -1);
  }

  let best = 0;
  let run = 0;
  let prev = null;
  for (const d of [...days].reverse()) {
    run = prev && shift(prev, 1) === d ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  }

  return { current, best, practicedToday };
}

/**
 * Today's summary (also persists the daily snapshot used by history).
 */
function getTodaySummary(userId, plan = null) {
  const p = plan || buildTodayPlan(userId, false);
  const today = currentDay();
  const taskDone = p.done.due + p.done.new;
  const remaining = p.dueTotal + p.newRemaining;
  const goal = taskDone + remaining;

  db.prepare(`
    INSERT INTO daily_progress (user_id, day, goal, done, extra, updated_at)
    VALUES (?, ?, ?, ?, ?, datetime('now', 'localtime'))
    ON CONFLICT(user_id, day) DO UPDATE SET
      goal = excluded.goal, done = excluded.done, extra = excluded.extra, updated_at = excluded.updated_at
  `).run(userId, today, goal, taskDone, p.done.extra);

  return {
    date: today,
    goal,
    done: taskDone,
    remaining,
    remainingDue: p.dueTotal,
    remainingNew: p.newRemaining,
    doneDue: p.done.due,
    doneNew: p.done.new,
    extra: p.done.extra,
    reviews: p.done.reviews,
    accuracy: p.done.reviews > 0 ? Math.round((p.done.correct / p.done.reviews) * 100) : null,
    firstAt: p.done.firstAt,
    lastAt: p.done.lastAt,
    dailyNewQuota: p.quota,
    completed: remaining === 0 && taskDone > 0,
    streak: getStreak(userId, today)
  };
}

/**
 * Per-day history for the last `days` days (newest first).
 */
function getHistory(userId, days = 30) {
  const n = Math.min(Math.max(Number(days) || 30, 1), 366);
  const rows = db.prepare(`
    SELECT
      date(reviewed_at) AS day,
      COUNT(*) AS reviews,
      COUNT(DISTINCT CASE WHEN COALESCE(task_type, 'due') = 'due' THEN card_id END) AS due_done,
      COUNT(DISTINCT CASE WHEN task_type = 'new' THEN card_id END) AS new_done,
      SUM(CASE WHEN task_type = 'extra' THEN 1 ELSE 0 END) AS extra_done,
      SUM(CASE WHEN rating >= 3 THEN 1 ELSE 0 END) AS correct,
      MIN(reviewed_at) AS first_at,
      MAX(reviewed_at) AS last_at
    FROM review_logs
    WHERE user_id = ? AND reviewed_at >= datetime('now', 'localtime', 'start of day', ?)
    GROUP BY day
  `).all(userId, `-${n - 1} days`);
  const byDay = new Map(rows.map(r => [r.day, r]));

  const goals = db.prepare(`
    SELECT day, goal FROM daily_progress
    WHERE user_id = ? AND day >= date('now', 'localtime', ?)
  `).all(userId, `-${n - 1} days`);
  const goalByDay = new Map(goals.map(g => [g.day, Number(g.goal) || 0]));

  const today = currentDay();
  const result = [];
  const cursor = new Date(`${today}T12:00:00`);
  for (let i = 0; i < n; i++) {
    const day = cursor.toISOString().slice(0, 10);
    const r = byDay.get(day);
    const reviews = r ? Number(r.reviews) : 0;
    const done = r ? Number(r.due_done) + Number(r.new_done) : 0;
    const goal = goalByDay.has(day) ? goalByDay.get(day) : null;
    result.push({
      date: day,
      reviews,
      done,
      doneDue: r ? Number(r.due_done) : 0,
      doneNew: r ? Number(r.new_done) : 0,
      extra: r ? Number(r.extra_done) || 0 : 0,
      accuracy: reviews > 0 ? Math.round((Number(r.correct) / reviews) * 100) : null,
      firstAt: r ? r.first_at : null,
      lastAt: r ? r.last_at : null,
      goal,
      // null = no snapshot (day before this feature, or app never opened that day)
      goalMet: goal === null ? null : (goal > 0 ? done >= goal : reviews > 0)
    });
    cursor.setDate(cursor.getDate() - 1);
  }
  return result;
}

/**
 * Extra practice: previously reviewed cards that are NOT due today, weakest first.
 */
function getPracticeCards(userId, limit = 20) {
  const n = Math.min(Math.max(Number(limit) || 20, 1), 50);
  const query = (scope) => db.prepare(`
    SELECT * FROM cards
    WHERE user_id = ? AND lifecycle_status IN ('active', 'mastered')
      AND (last_reviewed IS NOT NULL OR review_count > 0)
      AND (lifecycle_status = 'mastered' OR due_date IS NULL OR due_date >= ${TODAY_END_SQL}) ${scope.sql}
    ORDER BY fsrs_stability ASC, lapse_count DESC, last_reviewed ASC
    LIMIT ?
  `).all(userId, ...scope.params, n);

  // Prefer the selected unit, then top up from all units
  const scoped = query(unitScope(getUser(userId)));
  if (scoped.length >= n) return scoped;
  const seen = new Set(scoped.map(c => c.id));
  return scoped.concat(query({ sql: '', params: [] }).filter(c => !seen.has(c.id))).slice(0, n);
}

module.exports = {
  classifyReview,
  buildTodayPlan,
  getTodaySummary,
  getHistory,
  getPracticeCards
};
