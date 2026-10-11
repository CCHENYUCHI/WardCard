import React from 'react';
import { ArrowRight, CheckCircle2, Dumbbell, Clock, Check } from 'lucide-react';
import ProgressRing from './ProgressRing';
import Tooltip from './Tooltip';
import { formatDayLong, formatTimeRange, weekdayOf } from '../utils/studyDay';

// Today's mission: goal ring, breakdown, streak and the 7-day strip
export default function TodayProgressCard({
  today,
  history = [],
  startCount = 0,
  urgentCount = 0,
  onStart,
  onPractice,
  practiceLoading = false
}) {
  if (!today) return null;

  const { goal, done, remaining, completed, streak } = today;
  const reviewGoal = today.doneDue + today.remainingDue;
  const newGoal = today.doneNew + today.remainingNew;
  const timeRange = formatTimeRange(today.firstAt, today.lastAt);

  let headline;
  let subline;
  if (goal === 0 && done === 0) {
    headline = '今天沒有到期的單字';
    subline = '想多練習的話，可以加練一輪鞏固弱點 💪';
  } else if (done === 0) {
    headline = `今天要完成 ${goal} 個單字`;
    subline = `大約 ${Math.max(1, Math.round((goal * 10) / 60))} 分鐘`;
  } else if (!completed) {
    headline = `還差 ${remaining} 個就達成今日目標`;
    subline = `已完成 ${done} 個${today.accuracy !== null ? ` · 正確率 ${today.accuracy}%` : ''}`;
  } else {
    headline = '今日目標達成！🎉';
    subline = `完成 ${done} 個單字${today.accuracy !== null ? ` · 正確率 ${today.accuracy}%` : ''}`;
  }

  // Oldest -> today
  const week = history.slice(0, 7).reverse();

  return (
    <div className={`today-card ${completed ? 'is-complete' : ''}`}>
      <div className="today-card-accent" />

      {/* Header: date + streak */}
      <div className="today-card-header">
        <div>
          <div className="today-card-date">{formatDayLong(today.date)}</div>
          <h1 className="today-card-title">今日任務</h1>
        </div>
        <Tooltip text={`最長連續 ${streak.best} 天`} position="bottom">
          <div className={`streak-pill ${streak.practicedToday ? 'is-lit' : ''}`}>
            <span className="streak-flame">🔥</span>
            {streak.current > 0 ? (
              <span>
                <strong>{streak.current}</strong> 天連續
                {!streak.practicedToday && <span className="streak-hint"> · 今天練習來延續</span>}
              </span>
            ) : (
              <span>今天開始連續紀錄</span>
            )}
          </div>
        </Tooltip>
      </div>

      {/* Ring + status */}
      <div className="today-card-main">
        <ProgressRing done={done} goal={goal}>
          {completed ? (
            <CheckCircle2 size={40} color="var(--google-green)" />
          ) : (
            <>
              <div className="ring-value">{done}<span>/{goal}</span></div>
              <div className="ring-label">已完成</div>
            </>
          )}
        </ProgressRing>

        <div className="today-card-status">
          <div className="today-card-headline">{headline}</div>
          <div className="today-card-subline">{subline}</div>
          <div className="today-card-meta">
            <Clock size={13} />
            {timeRange ? <span>今天練習時段 {timeRange}</span> : <span>今天還沒練習</span>}
            <span className="meta-dot">·</span>
            <span>每天 00:00 重新計算</span>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="today-breakdown">
        <BreakdownItem
          label="📚 到期複習"
          done={today.doneDue}
          total={reviewGoal}
          color="var(--google-blue)"
          note={today.remainingDue > 0
            ? `剩 ${today.remainingDue}${urgentCount > 0 ? ` · 含 ${urgentCount} 個需搶救` : ''}`
            : reviewGoal > 0 ? '全部完成' : '今天沒有到期'}
        />
        <BreakdownItem
          label="🌱 新單字"
          done={today.doneNew}
          total={newGoal}
          color="var(--google-green)"
          note={today.remainingNew > 0 ? `剩 ${today.remainingNew} · 每日上限 ${today.dailyNewQuota}` : `每日上限 ${today.dailyNewQuota}`}
        />
        <div className="breakdown-item">
          <div className="breakdown-label">💪 加練</div>
          <div className="breakdown-value">{today.extra}<span> 次</span></div>
          <div className="breakdown-note">不在今日任務內的額外練習</div>
        </div>
      </div>

      {/* 7-day strip */}
      {week.length > 0 && (
        <div className="week-strip">
          {week.map(d => {
            const isToday = d.date === today.date;
            const state = d.goalMet ? 'met' : d.reviews > 0 ? 'practiced' : 'empty';
            const tip = d.reviews > 0
              ? `${d.date}：完成 ${d.done} 字${d.goal ? ` / 目標 ${d.goal}` : ''}${d.extra ? ` · 加練 ${d.extra}` : ''}`
              : `${d.date}：沒有練習`;
            return (
              <Tooltip key={d.date} text={tip}>
                <div className={`week-day ${isToday ? 'is-today' : ''}`}>
                  <span className="week-day-label">{isToday ? '今天' : weekdayOf(d.date)}</span>
                  <span className={`week-day-dot is-${state}`}>
                    {state === 'met' ? <Check size={14} strokeWidth={3} /> : state === 'practiced' ? d.done || d.reviews : ''}
                  </span>
                </div>
              </Tooltip>
            );
          })}
        </div>
      )}

      {/* Actions */}
      <div className="today-card-actions">
        {remaining > 0 ? (
          <button className="btn btn-primary cockpit-btn-start" onClick={onStart} disabled={startCount === 0}>
            <span>{done > 0 ? `繼續今日任務（剩 ${remaining}）` : `開始今日任務（${remaining}）`}</span>
            <ArrowRight size={18} />
          </button>
        ) : (
          <div className="today-done-banner">
            <CheckCircle2 size={18} />
            <span>{goal === 0 && done === 0 ? '今天沒有排程任務' : '今日任務完成，明天見！'}</span>
          </div>
        )}
        <button
          className={`btn ${remaining > 0 ? 'btn-secondary' : 'btn-primary'} today-practice-btn`}
          onClick={onPractice}
          disabled={practiceLoading}
        >
          <Dumbbell size={16} />
          <span>{practiceLoading ? '準備中...' : remaining > 0 ? '加練' : '加練一輪（弱點優先）'}</span>
        </button>
      </div>
    </div>
  );
}

function BreakdownItem({ label, done, total, color, note }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div className="breakdown-item">
      <div className="breakdown-label">{label}</div>
      <div className="breakdown-value">{done}<span> / {total}</span></div>
      <div className="breakdown-bar">
        <div style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="breakdown-note">{note}</div>
    </div>
  );
}
