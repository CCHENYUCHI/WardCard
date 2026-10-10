import React, { useMemo } from 'react';
import { 
  Award, Flame, CheckCircle2, Clock, BookOpen, Layers, 
  Target, TrendingUp, HelpCircle, Star, Sparkles, Check, ChevronRight,
  CalendarDays, Calendar
} from 'lucide-react';
import Tooltip from './Tooltip';

export default function StatsView({ stats }) {
  if (!stats) return null;

  const total = stats.total || 0;
  const activeCount = stats.active || 0;
  const readyCount = stats.ready || 0;
  const inboxCount = stats.inbox || 0;
  const masteredCount = stats.mastered || 0;

  // Natural lesson sorting helper
  const lessonSort = (a, b) => {
    const numA = (a.unit.match(/第\s*(\d+)\s*課/) || [])[1];
    const numB = (b.unit.match(/第\s*(\d+)\s*課/) || [])[1];
    if (numA !== undefined && numB !== undefined) {
      return parseInt(numA, 10) - parseInt(numB, 10);
    }
    if (numA !== undefined) return -1;
    if (numB !== undefined) return 1;
    return a.unit.localeCompare(b.unit, 'zh-Hant');
  };

  const sortedUnits = useMemo(() => {
    if (!stats.unitCounts) return [];
    return [...stats.unitCounts].sort(lessonSort);
  }, [stats.unitCounts]);

  // Stage ladder breakdown
  const stages = stats.stages || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const totalStagesActive = (stages[1] || 0) + (stages[2] || 0) + (stages[3] || 0) + (stages[4] || 0) + (stages[5] || 0);

  // Weekly Review Forecast
  const weeklyForecast = stats.weeklyForecast || [];
  const totalWeeklyDue = weeklyForecast.reduce((acc, d) => acc + (d.dueReviews || 0), 0);
  const totalWeeklyNew = weeklyForecast.reduce((acc, d) => acc + (d.newWords || 0), 0);
  const maxDayWorkload = Math.max(...weeklyForecast.map(d => d.totalWorkload || 0), 10);
  const dailyQuota = stats.dailyQuota || 15;
  const readyReserveTotal = stats.readyReserveTotal || readyCount;
  const longTermDueCount = stats.longTermDueCount || 0;

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 8px' }}>
      {/* Top Banner Header */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: '22px 28px',
        marginBottom: '20px',
        boxShadow: 'var(--shadow-card)',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: 'var(--google-blue)',
          borderTopLeftRadius: 'var(--radius-xl)',
          borderTopRightRadius: 'var(--radius-xl)'
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ background: '#e8f0fe', color: 'var(--google-blue)', padding: '2px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <TrendingUp size={13} /> FSRS 數據分析
              </span>
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
              學習數據與記憶進度
            </h1>
          </div>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', textAlign: 'right' }}>
            累積複習次數：<strong style={{ color: 'var(--text-primary)' }}>{stats.totalReviews || 0}</strong> 次
          </div>
        </div>
      </div>

      {/* 6 Key Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
        marginBottom: '24px'
      }}>
        {/* Total Words */}
        <div className="stat-box" style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', padding: '16px' }}>
          <div className="stat-icon" style={{ background: '#e8f0fe', color: 'var(--google-blue)', width: '42px', height: '42px' }}>
            <BookOpen size={20} />
          </div>
          <div>
            <div className="stat-val" style={{ fontSize: '1.6rem', fontWeight: 800 }}>{total}</div>
            <div className="stat-label">總西語詞庫量</div>
          </div>
        </div>

        {/* Active Study */}
        <div className="stat-box" style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', padding: '16px' }}>
          <div className="stat-icon" style={{ background: '#e8f0fe', color: 'var(--google-blue)', width: '42px', height: '42px' }}>
            <Flame size={20} />
          </div>
          <div>
            <div className="stat-val" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--google-blue)' }}>{activeCount}</div>
            <div className="stat-label">⚡ 活躍學習中</div>
          </div>
        </div>

        {/* Due Today */}
        <div className="stat-box" style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', padding: '16px' }}>
          <div className="stat-icon" style={{ background: '#fce8e6', color: 'var(--google-red)', width: '42px', height: '42px' }}>
            <Clock size={20} />
          </div>
          <div>
            <div className="stat-val" style={{ fontSize: '1.6rem', fontWeight: 800, color: stats.due > 0 ? 'var(--google-red)' : 'var(--text-primary)' }}>
              {stats.due}
            </div>
            <div className="stat-label">⏰ 今日到期複習</div>
          </div>
        </div>

        {/* Mastered */}
        <div className="stat-box" style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', padding: '16px' }}>
          <div className="stat-icon" style={{ background: '#e6f4ea', color: 'var(--google-green)', width: '42px', height: '42px' }}>
            <Award size={20} />
          </div>
          <div>
            <div className="stat-val" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--google-green)' }}>{masteredCount}</div>
            <div className="stat-label">🏆 已長效精通</div>
          </div>
        </div>

        {/* Ready Reserve */}
        <div className="stat-box" style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', padding: '16px' }}>
          <div className="stat-icon" style={{ background: '#f1f3f4', color: '#5f6368', width: '42px', height: '42px' }}>
            <Target size={20} />
          </div>
          <div>
            <div className="stat-val" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-secondary)' }}>{readyCount}</div>
            <div className="stat-label">🎯 待學儲備量</div>
          </div>
        </div>

        {/* Reviewed Today */}
        <div className="stat-box" style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', padding: '16px' }}>
          <div className="stat-icon" style={{ background: '#fef7e0', color: '#f29900', width: '42px', height: '42px' }}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div className="stat-val" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f29900' }}>{stats.reviewedToday}</div>
            <div className="stat-label">🔥 今日複習卡次</div>
          </div>
        </div>
      </div>

      {/* Weekly Review & New Word Forecast */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: '22px 24px',
        marginBottom: '24px',
        boxShadow: 'var(--shadow-card)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CalendarDays size={19} color="var(--google-blue)" />
              <span>本週複習排程與新詞進度預報 (Weekly Forecast)</span>
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              依據 FSRS 遺忘曲線間隔動態排程，結合每日新詞配額規劃
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', background: '#e8f0fe', color: 'var(--google-blue)', padding: '4px 10px', borderRadius: '12px', fontWeight: 700 }}>
              📅 本週複習: {totalWeeklyDue} 張
            </span>
            <span style={{ fontSize: '0.78rem', background: '#e6f4ea', color: 'var(--google-green)', padding: '4px 10px', borderRadius: '12px', fontWeight: 700 }}>
              🌱 預計新詞: +{totalWeeklyNew} 個
            </span>
            <span style={{ fontSize: '0.78rem', background: '#f1f3f4', color: '#5f6368', padding: '4px 10px', borderRadius: '12px', fontWeight: 700 }}>
              🏔️ 遠期穩定 (&gt;7天): {longTermDueCount} 張
            </span>
          </div>
        </div>

        {/* 7-Day Columns Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
          gap: '10px',
          marginBottom: '20px'
        }}>
          {weeklyForecast.map((day) => {
            const isToday = day.dayIndex === 0;
            const reviewHeight = maxDayWorkload > 0 ? (day.dueReviews / maxDayWorkload) * 105 : 0;
            const newHeight = maxDayWorkload > 0 ? (day.newWords / maxDayWorkload) * 105 : 0;

            return (
              <div 
                key={day.dayIndex}
                style={{
                  background: isToday ? '#f8fafd' : '#fafafa',
                  border: isToday ? '1.5px solid var(--google-blue)' : '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '12px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  boxShadow: isToday ? '0 2px 8px rgba(26,115,232,0.12)' : 'none'
                }}
              >
                {isToday && (
                  <span style={{
                    position: 'absolute',
                    top: '-9px',
                    background: 'var(--google-blue)',
                    color: '#ffffff',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '1px 8px',
                    borderRadius: '10px',
                    letterSpacing: '0.5px'
                  }}>
                    TODAY
                  </span>
                )}

                {/* Day Label & Date */}
                <div style={{ textAlign: 'center', marginBottom: '12px', marginTop: isToday ? '4px' : '0' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: isToday ? 'var(--google-blue)' : 'var(--text-primary)' }}>
                    {day.label}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {day.date.substring(5)}
                  </div>
                </div>

                {/* Vertical Stacked Bar Chart */}
                <div style={{
                  height: '105px',
                  width: '32px',
                  background: '#f1f3f4',
                  borderRadius: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  overflow: 'hidden',
                  marginBottom: '10px',
                  position: 'relative'
                }}>
                  {/* New Words Bar (Top, Green) */}
                  {newHeight > 0 && (
                    <div 
                      style={{
                        height: `${newHeight}px`,
                        background: '#34a853',
                        width: '100%',
                        transition: 'height 0.4s ease'
                      }} 
                      title={`預計加入新單字: ${day.newWords} 個`}
                    />
                  )}
                  {/* Due Reviews Bar (Bottom, Blue) */}
                  {reviewHeight > 0 && (
                    <div 
                      style={{
                        height: `${reviewHeight}px`,
                        background: isToday ? 'var(--google-blue)' : '#4285f4',
                        width: '100%',
                        transition: 'height 0.4s ease'
                      }} 
                      title={`到期複習單字: ${day.dueReviews} 張`}
                    />
                  )}
                </div>

                {/* Workload Number */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                    {day.totalWorkload}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', fontSize: '0.72rem', marginTop: '2px' }}>
                    <span style={{ color: '#1a73e8', fontWeight: 600 }}>複 {day.dueReviews}</span>
                    <span style={{ color: '#137333', fontWeight: 600 }}>新 +{day.newWords}</span>
                  </div>
                </div>

                {isToday && day.reviewedToday > 0 && (
                  <div style={{ marginTop: '8px', fontSize: '0.7rem', color: '#f29900', fontWeight: 700, background: '#fef7e0', padding: '2px 6px', borderRadius: '4px' }}>
                    已做 {day.reviewedToday} 次
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend & Spaced Repetition Insights */}
        <div style={{
          background: '#f8f9fa',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          fontSize: '0.82rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.5
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', fontWeight: 600 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', background: 'var(--google-blue)', borderRadius: '3px' }} />
              藍色：到期複習 (依 FSRS 間隔動態到期)
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', background: '#34a853', borderRadius: '3px' }} />
              綠色：預定解鎖新單字 (每日配額 {dailyQuota} 字)
            </span>
          </div>
          <div>
            💡 <strong>複習間隔機制 (Spaced Repetition)：</strong>
            系統根據 FSRS 記憶穩定度演算法動態計算複習間隔（例如：1天 ➔ 3天 ➔ 7天 ➔ 16天 ➔ 45天+），在每個單字即將遺忘的臨界點發送複習，而非每天重複已熟記的單字。
          </div>
          <div>
            🎯 <strong>新單字加入狀況：</strong>
            目前待學儲備庫共有 <strong>{readyReserveTotal}</strong> 個單字，按照您每日 <strong>{dailyQuota}</strong> 個新詞的配額，預計可持續穩定供應約 <strong>{readyReserveTotal > 0 ? Math.ceil(readyReserveTotal / dailyQuota) : 0}</strong> 天的學習量，有效避免複習雪崩。
          </div>
        </div>
      </div>

      {/* Main Grid: FSRS 5-Stage Mastery Ladder & Curriculum Units */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* FSRS 5-Stage Cognitive Mastery Ladder */}
        <div style={{
          background: '#ffffff',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '22px 24px',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="var(--google-blue)" />
              <span>五階記憶認知梯 (FSRS Stages 1~5)</span>
            </h3>
            <Tooltip text="自適應五階演進：從初見辨認到長效永久精通">
              <span style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center' }}>
                <HelpCircle size={15} />
              </span>
            </Tooltip>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { stage: 1, name: 'S1 被動辨認', desc: '看西語辨認中文 (初始認知)', count: stages[1] || 0, color: '#ea4335', bg: '#fce8e6' },
              { stage: 2, name: 'S2 提示回想', desc: '看中文回憶西語 (字首提示)', count: stages[2] || 0, color: '#1a73e8', bg: '#e8f0fe' },
              { stage: 3, name: 'S3 盲測拼寫', desc: '無提示正字盲測 (拼寫精通)', count: stages[3] || 0, color: '#34a853', bg: '#e6f4ea' },
              { stage: 4, name: 'S4 語境克漏字', desc: '例句克漏字與變位應用', count: stages[4] || 0, color: '#137333', bg: '#ceead6' },
              { stage: 5, name: 'S5 長效精通', desc: '高穩定度永久記憶 (歸檔)', count: stages[5] || 0, color: '#8430ce', bg: '#f6e8ff' },
            ].map(item => {
              const pct = totalStagesActive > 0 ? Math.round((item.count / totalStagesActive) * 100) : 0;
              return (
                <div key={item.stage}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.88rem', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 800, color: item.color, fontSize: '0.82rem', background: item.bg, padding: '1px 6px', borderRadius: '4px' }}>
                        {item.name}
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{item.desc}</span>
                    </div>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {item.count} 字 <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>({pct}%)</span>
                    </span>
                  </div>
                  <div style={{ height: '7px', background: '#f1f3f4', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: item.color, borderRadius: '4px', transition: 'width 0.4s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45, background: '#f8f9fa', border: '1px solid var(--border-color)', padding: '10px 14px', borderRadius: '8px', marginTop: '18px' }}>
            💡 <strong>科學記憶原則：</strong>只要單字在學習中達到 <strong>Stage 3 (盲測正字拼寫)</strong>，即算作「熟練掌握 (Proficient)」。
          </div>
        </div>

        {/* Curriculum Units Leaderboard */}
        <div style={{
          background: '#ffffff',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '22px 24px',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={18} color="var(--google-blue)" />
              <span>教材單元掌握度進度排行</span>
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>共 {sortedUnits.length} 單元</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '360px', overflowY: 'auto', paddingRight: '4px' }}>
            {sortedUnits.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                尚無單元資料
              </div>
            ) : (
              sortedUnits.map(unit => {
                const isActive = unit.active > 0;
                let badgeColor = '#5f6368';
                let badgeBg = '#f1f3f4';
                if (isActive) {
                  badgeColor = unit.proficiencyRate >= 70 ? '#137333' : 'var(--google-blue)';
                  badgeBg = unit.proficiencyRate >= 70 ? '#e6f4ea' : '#e8f0fe';
                }

                return (
                  <div key={unit.unit} style={{ background: '#f8f9fa', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '10px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.9rem' }}>{isActive ? '⚡' : '⏳'}</span>
                        <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                          {unit.unit}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.75rem', background: badgeBg, color: badgeColor, padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                          {unit.proficiencyRate}% 掌握
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          ({unit.proficient || 0}/{unit.total}字)
                        </span>
                      </div>
                    </div>
                    {/* Unit Progress Bar */}
                    <div style={{ height: '6px', background: '#e8eaed', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${unit.proficiencyRate}%`,
                        height: '100%',
                        background: unit.proficiencyRate >= 70 ? 'var(--google-green)' : (isActive ? 'var(--google-blue)' : '#bdc1c6'),
                        borderRadius: '4px',
                        transition: 'width 0.4s ease'
                      }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
