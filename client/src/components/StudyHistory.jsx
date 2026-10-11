import React, { useState } from 'react';
import { CalendarDays, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDayShort, formatTimeRange } from '../utils/studyDay';

// Per-day study log (last 30 days)
export default function StudyHistory({ history = [], bestStreak = 0, today = '' }) {
  const [expanded, setExpanded] = useState(false);

  const activeDays = history.filter(d => d.reviews > 0);
  const totalReviews = activeDays.reduce((sum, d) => sum + d.reviews, 0);
  const metDays = history.filter(d => d.goalMet).length;
  const rows = expanded ? activeDays : activeDays.slice(0, 5);

  return (
    <div className="surface-card cockpit-section study-history">
      <div className="study-history-header">
        <h2>
          <CalendarDays size={18} color="var(--google-blue)" />
          <span>學習紀錄</span>
          <span className="study-history-range">近 30 天</span>
        </h2>
      </div>

      <div className="study-history-summary">
        <div><strong>{activeDays.length}</strong><span>練習天數</span></div>
        <div><strong>{metDays}</strong><span>達成目標</span></div>
        <div><strong>{totalReviews}</strong><span>總練習次數</span></div>
        <div><strong>{bestStreak}</strong><span>最長連續</span></div>
      </div>

      {activeDays.length === 0 ? (
        <div className="study-history-empty">還沒有練習紀錄，完成第一次今日任務吧！</div>
      ) : (
        <div className="study-history-list">
          {rows.map(d => {
            const pct = d.goal ? Math.min(100, Math.round((d.done / d.goal) * 100)) : 100;
            const status = d.goalMet === true ? 'met'
              : d.date === today ? 'progress'
              : d.goalMet === false ? 'missed' : 'unknown';
            return (
              <div key={d.date} className="history-row">
                <div className="history-row-top">
                  <span className="history-date">{formatDayShort(d.date)}</span>
                  <span className={`history-badge is-${status}`}>
                    {{ met: '✓ 達成', progress: '進行中', missed: '未完成', unknown: '有練習' }[status]}
                  </span>
                  <span className="history-time">{formatTimeRange(d.firstAt, d.lastAt)}</span>
                </div>
                <div className="history-bar">
                  <div className={`is-${status}`} style={{ width: `${pct}%` }} />
                </div>
                <div className="history-detail">
                  <span>任務 <strong>{d.done}</strong>{d.goal ? ` / ${d.goal}` : ''}</span>
                  <span>複習 {d.doneDue}</span>
                  <span>新詞 {d.doneNew}</span>
                  {d.extra > 0 && <span>加練 {d.extra}</span>}
                  {d.accuracy !== null && <span>正確率 {d.accuracy}%</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeDays.length > 5 && (
        <button className="btn btn-secondary btn-sm study-history-toggle" onClick={() => setExpanded(e => !e)}>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          <span>{expanded ? '收合' : `顯示全部 ${activeDays.length} 天`}</span>
        </button>
      )}
    </div>
  );
}
