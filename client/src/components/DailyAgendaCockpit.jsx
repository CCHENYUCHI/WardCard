import React, { useState, useEffect } from 'react';
import { 
  Flame, BookOpen, Sparkles, CheckCircle2, ArrowRight, 
  Inbox, Layers, Target, ChevronRight, Settings, RotateCcw, AlertCircle
} from 'lucide-react';
import { fetchAPI } from '../utils/api';

export default function DailyAgendaCockpit({ 
  onStartStudy, 
  onNavigateToWords, 
  onOpenSettings,
  onRefresh 
}) {
  const [agenda, setAgenda] = useState(null);
  const [stats, setStats] = useState(null);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isChangingUnit, setIsChangingUnit] = useState(false);

  const fetchAgendaData = async () => {
    try {
      setLoading(true);
      const [agendaRes, unitsRes] = await Promise.all([
        fetchAPI('/api/study/agenda'),
        fetchAPI('/api/study/units')
      ]);

      if (agendaRes.ok) {
        const data = await agendaRes.json();
        setAgenda(data.agenda);
        setStats(data.stats);
      }
      if (unitsRes.ok) {
        setUnits(await unitsRes.json());
      }
    } catch (err) {
      console.error('Failed to load study agenda:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgendaData();
  }, []);

  const handleChangeCurriculum = async (unitName) => {
    try {
      await fetchAPI('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active_curriculum: unitName })
      });
      setIsChangingUnit(false);
      fetchAgendaData();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Error changing active curriculum:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <div className="spinner" style={{ width: '36px', height: '36px' }} />
        <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>正在編排今日學習排程 (FSRS)...</p>
      </div>
    );
  }

  const urgentCount = agenda?.urgent_reviews?.length || 0;
  const regularCount = agenda?.regular_reviews?.length || 0;
  const newCount = agenda?.candidate_new?.length || 0;
  const totalTodayTasks = urgentCount + regularCount + newCount;

  const curProgress = agenda?.curriculum_progress;
  const activeCurriculum = agenda?.active_curriculum;

  return (
    <div className="agenda-cockpit-container" style={{ maxWidth: '960px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Top Welcome & Mission Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(59, 130, 246, 0.15))',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '24px',
        padding: '32px 28px',
        backdropFilter: 'blur(16px)',
        marginBottom: '28px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ 
                background: 'rgba(239, 68, 68, 0.2)', 
                color: '#f87171', 
                padding: '4px 12px', 
                borderRadius: '20px', 
                fontSize: '0.8rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Flame size={14} /> FSRS 記憶科學引擎
              </span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                動態 DSR 遺忘曲線
              </span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '4px 0 10px 0', letterSpacing: '-0.5px' }}>
              今日學習駕駛艙
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '580px', margin: 0, lineHeight: 1.5 }}>
              系統已為你篩選今日最該複習的突觸節點，拒絕單字雪崩，讓每一分鐘都產生最高學習留存。
            </p>
          </div>

          {/* Big Start Action Button */}
          <div style={{ alignSelf: 'center' }}>
            <button
              onClick={() => onStartStudy({ 
                urgent: agenda?.urgent_reviews || [],
                regular: agenda?.regular_reviews || [],
                newCards: agenda?.candidate_new || []
              })}
              disabled={totalTodayTasks === 0}
              style={{
                background: totalTodayTasks > 0 
                  ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' 
                  : 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                border: 'none',
                borderRadius: '18px',
                padding: '16px 36px',
                fontSize: '1.15rem',
                fontWeight: 700,
                cursor: totalTodayTasks > 0 ? 'pointer' : 'default',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: totalTodayTasks > 0 ? '0 10px 25px -5px rgba(239, 68, 68, 0.5)' : 'none',
                transition: 'all 0.2s ease',
              }}
              className="hover-scale"
            >
              {totalTodayTasks > 0 ? (
                <>
                  <span>🚀 開始今日學習 ({totalTodayTasks})</span>
                  <ArrowRight size={20} />
                </>
              ) : (
                <>
                  <CheckCircle2 size={20} color="#34d399" />
                  <span>今日目標全部達成！</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 3 Metric Pillars */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px', 
          marginTop: '28px' 
        }}>
          {/* Urgent / Lapse */}
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '16px',
            padding: '16px 20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#f87171', fontSize: '0.85rem', fontWeight: 600 }}>
              <span>🚨 緊急搶救 (Lapse)</span>
              <AlertCircle size={16} />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '8px', color: '#fca5a5' }}>
              {urgentCount} <span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-secondary)' }}>字</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              近期失誤或處於 Stage 1 的單字
            </div>
          </div>

          {/* Regular Due */}
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            borderRadius: '16px',
            padding: '16px 20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#60a5fa', fontSize: '0.85rem', fontWeight: 600 }}>
              <span>📚 例行穩固複習</span>
              <RotateCcw size={16} />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '8px', color: '#93c5fd' }}>
              {regularCount} <span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-secondary)' }}>字</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              按 FSRS 曲線到期的高階熟詞
            </div>
          </div>

          {/* Daily New Quota */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '16px',
            padding: '16px 20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#34d399', fontSize: '0.85rem', fontWeight: 600 }}>
              <span>🌱 今日新詞解鎖</span>
              <Sparkles size={16} />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '8px', color: '#6ee7b7' }}>
              {newCount} <span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-secondary)' }}>/ {agenda?.daily_new_quota || 15} 字</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              從課本主修單元提拔的核心詞
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum Track Section */}
      <div style={{
        background: 'var(--surface-color)',
        border: '1px solid var(--border-color)',
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '28px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Target size={20} color="var(--primary-color)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>當前主修進度 (Active Track)</h2>
          </div>
          <div>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => setIsChangingUnit(!isChangingUnit)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Layers size={14} />
              <span>{isChangingUnit ? '取消' : '切換主修單元'}</span>
            </button>
          </div>
        </div>

        {isChangingUnit ? (
          <div style={{ 
            background: 'rgba(0,0,0,0.2)', 
            padding: '16px', 
            borderRadius: '14px', 
            marginBottom: '16px',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              選擇你目前正在上的課本單元或重點分類：
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <button
                className={`btn btn-sm ${!activeCurriculum ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleChangeCurriculum('')}
              >
                全局全庫模式
              </button>
              {units.map(u => (
                <button
                  key={u.unit}
                  className={`btn btn-sm ${activeCurriculum === u.unit ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleChangeCurriculum(u.unit)}
                >
                  {u.unit} ({u.total}字 · 掌握率 {u.proficiencyRate}%)
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {activeCurriculum && curProgress ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                📖 {curProgress.unit}
              </span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                掌握率 {curProgress.percentage}% ({curProgress.proficient} / {curProgress.total} 字達 Stage 3+)
              </span>
            </div>
            {/* Progress Bar */}
            <div style={{ 
              width: '100%', 
              height: '10px', 
              background: 'rgba(255,255,255,0.08)', 
              borderRadius: '6px', 
              overflow: 'hidden',
              marginBottom: '12px'
            }}>
              <div style={{ 
                width: `${curProgress.percentage}%`, 
                height: '100%', 
                background: 'linear-gradient(90deg, #3b82f6, #10b981)',
                borderRadius: '6px',
                transition: 'width 0.4s ease'
              }} />
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              💡 當該單元掌握率達到 80% 時，建議切換進入下一個課本章節。
            </div>
          </div>
        ) : (
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            目前設定為「全局全庫模式」，系統會自動從所有標記為 <strong>Ready</strong> 或打星號 ⭐️ 的單字中推薦今日新詞。
          </div>
        )}
      </div>

      {/* 5-Stage Distribution & Inbox Quick Action */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px' 
      }}>
        {/* Stage Mastery Ladder */}
        <div style={{
          background: 'var(--surface-color)',
          border: '1px solid var(--border-color)',
          borderRadius: '20px',
          padding: '24px'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} color="#60a5fa" />
            五階詞彙進化梯 (Mastery Ladder)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { stage: 1, label: 'Stage 1: 被動辨認 (西->中)', count: stats?.stages?.[1] || 0, color: '#f59e0b' },
              { stage: 2, label: 'Stage 2: 提示回想 (中->西)', count: stats?.stages?.[2] || 0, color: '#3b82f6' },
              { stage: 3, label: 'Stage 3: 正字拼寫 (盲測+符號)', count: stats?.stages?.[3] || 0, color: '#8b5cf6' },
              { stage: 4, label: 'Stage 4: 語境克漏字 (搭配詞)', count: stats?.stages?.[4] || 0, color: '#ec4899' },
              { stage: 5, label: 'Stage 5: 自動化精通 (Mastered)', count: stats?.stages?.[5] || 0, color: '#10b981' }
            ].map(item => (
              <div key={item.stage} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
                  {item.label}
                </span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                  {item.count} 字
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Inbox Triage & Quick Access */}
        <div style={{
          background: 'var(--surface-color)',
          border: '1px solid var(--border-color)',
          borderRadius: '20px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Inbox size={18} color="#a78bfa" />
                課堂隨記暫存箱 (Inbox)
              </h3>
              <span style={{ 
                background: 'rgba(167, 139, 250, 0.2)', 
                color: '#c4b5fd', 
                padding: '2px 10px', 
                borderRadius: '12px',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>
                {stats?.inbox || 0} 筆
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
              隨手記下來但尚未開始排程的單字。它們不會產生複習負擔。當課堂教到或需要背誦時，可隨時打星或轉入 Ready 待學庫。
            </p>
          </div>

          <div style={{ marginTop: '20px' }}>
            <button
              onClick={() => onNavigateToWords('inbox')}
              className="btn btn-secondary"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <span>整理暫存箱生詞</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
