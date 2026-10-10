import React from 'react';
import { Award, Flame, CheckCircle, Clock, BookOpen, Layers } from 'lucide-react';

export default function StatsView({ stats }) {
  if (!stats) return null;

  const total = stats.total || 0;
  const masteredPercent = total > 0 ? Math.round((stats.mastered / total) * 100) : 0;
  const learnedPercent = total > 0 ? Math.round((stats.learned / total) * 100) : 0;

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto' }}>
      {/* 4 Stat Boxes */}
      <div className="stats-header">
        <div className="stat-box">
          <div className="stat-icon" style={{ background: 'var(--google-blue-light)', color: 'var(--google-blue)' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div className="stat-val">{stats.total}</div>
            <div className="stat-label">總西語單字量</div>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon" style={{ background: 'var(--google-red-light)', color: 'var(--google-red)' }}>
            <Clock size={24} />
          </div>
          <div>
            <div className="stat-val" style={{ color: stats.due > 0 ? 'var(--google-red)' : 'var(--text-primary)' }}>
              {stats.due}
            </div>
            <div className="stat-label">今日待複習</div>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon" style={{ background: 'var(--google-green-light)', color: 'var(--google-green)' }}>
            <Award size={24} />
          </div>
          <div>
            <div className="stat-val" style={{ color: 'var(--google-green)' }}>{stats.mastered}</div>
            <div className="stat-label">已完全掌握 (熟記)</div>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon" style={{ background: 'var(--google-yellow-light)', color: 'var(--google-yellow-dark)' }}>
            <Flame size={24} />
          </div>
          <div>
            <div className="stat-val" style={{ color: 'var(--google-yellow-dark)' }}>{stats.reviewedToday}</div>
            <div className="stat-label">今日已複習卡次</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {/* Memory Curve / Mastery Progress */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.15rem', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} style={{ color: 'var(--google-blue)' }} />
            <span>記憶週期掌握率</span>
          </h3>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px' }}>
              <span>已開始背誦 (熟練度 &gt; 0)</span>
              <strong>{learnedPercent}% ({stats.learned} 字)</strong>
            </div>
            <div style={{ height: '8px', background: '#e0e0e0', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${learnedPercent}%`, height: '100%', background: 'var(--google-blue)', borderRadius: '10px' }} />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px' }}>
              <span>長期記憶掌握 (熟練度 ≥ 4)</span>
              <strong>{masteredPercent}% ({stats.mastered} 字)</strong>
            </div>
            <div style={{ height: '8px', background: '#e0e0e0', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${masteredPercent}%`, height: '100%', background: 'var(--google-green)', borderRadius: '10px' }} />
            </div>
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, background: '#f8f9fa', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '8px' }}>
            💡 <strong>科學記憶提示：</strong>系統使用現代 FSRS 與間隔重複演算法，根據回想難度與穩定度動態調整下一次複習天數，助你以最高效率達成永久記憶。
          </div>
        </div>

        {/* Categories Breakdown */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.15rem', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={20} style={{ color: 'var(--google-blue)' }} />
            <span>分類統計 (日常 vs 考試)</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stats.catCounts && stats.catCounts.map((cat) => {
              const pct = total > 0 ? Math.round((cat.count / total) * 100) : 0;
              return (
                <div key={cat.category}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600 }}>{cat.category}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{cat.count} 字 ({pct}%)</span>
                  </div>
                  <div style={{ height: '6px', background: '#e0e0e0', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'var(--google-blue)', borderRadius: '10px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DELE Level Breakdown */}
        <div className="glass-card" style={{ gridColumn: '1 / -1' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '16px' }}>DELE 檢定等級分布</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '12px' }}>
            {['A1', 'A2', 'B1', 'B2', 'C1'].map(lvl => {
              const item = stats.levelCounts?.find(l => l.dele_level === lvl);
              const count = item ? item.count : 0;
              return (
                <div
                  key={lvl}
                  style={{
                    background: '#f8f9fa',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px',
                    textAlign: 'center'
                  }}
                >
                  <div className="badge-dele" style={{ marginBottom: '6px' }}>{lvl}</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>{count}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>單字</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
