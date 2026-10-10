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
    <div className="agenda-cockpit-container" style={{ maxWidth: '960px', margin: '0 auto', padding: '16px' }}>
      {/* Top Welcome & Mission Header (Google Classroom Course Banner Style) */}
      <div style={{ 
        background: '#ffffff',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: '32px 28px',
        marginBottom: '24px',
        boxShadow: 'var(--shadow-card)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle Google Top Color Accent Bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: 'var(--google-blue)' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ 
                background: 'var(--google-blue-light)', 
                color: 'var(--google-blue)', 
                padding: '4px 12px', 
                borderRadius: '16px', 
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Flame size={14} /> FSRS 記憶科學調度
              </span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                抗遺忘最佳學習曲線
              </span>
            </div>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 700, margin: '6px 0 8px 0', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
              今日學習駕駛艙
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '580px', margin: 0, lineHeight: 1.5 }}>
              系統已為你安排今日最需鞏固與解鎖的詞彙，專注完成今日任務，輕鬆杜絕單字雪崩。
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
              className="btn btn-primary"
              style={{
                padding: '14px 32px',
                fontSize: '1.05rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: totalTodayTasks > 0 ? '0 2px 6px rgba(26, 115, 232, 0.4)' : 'none',
              }}
            >
              {totalTodayTasks > 0 ? (
                <>
                  <span>🚀 開始今日學習 ({totalTodayTasks})</span>
                  <ArrowRight size={18} />
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} color="#1e8e3e" />
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
          marginTop: '24px' 
        }}>
          {/* Urgent / Lapse */}
          <div style={{
            background: 'var(--google-red-light)',
            border: '1px solid #f6aea9',
            borderRadius: 'var(--radius-lg)',
            padding: '18px 20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--google-red)', fontSize: '0.85rem', fontWeight: 700 }}>
              <span>🚨 緊急搶救 (Lapse)</span>
              <AlertCircle size={16} />
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '6px', color: 'var(--google-red)' }}>
              {urgentCount} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>字</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              近期失誤或處於 Stage 1 的單字
            </div>
          </div>

          {/* Regular Due */}
          <div style={{
            background: 'var(--google-blue-light)',
            border: '1px solid #aecbfa',
            borderRadius: 'var(--radius-lg)',
            padding: '18px 20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--google-blue)', fontSize: '0.85rem', fontWeight: 700 }}>
              <span>📚 例行穩固複習</span>
              <RotateCcw size={16} />
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '6px', color: 'var(--google-blue)' }}>
              {regularCount} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>字</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              按 FSRS 曲線到期的高階熟詞
            </div>
          </div>

          {/* Daily New Quota */}
          <div style={{
            background: 'var(--google-green-light)',
            border: '1px solid #a8dab5',
            borderRadius: 'var(--radius-lg)',
            padding: '18px 20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--google-green)', fontSize: '0.85rem', fontWeight: 700 }}>
              <span>🌱 今日新詞解鎖</span>
              <Sparkles size={16} />
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '6px', color: 'var(--google-green)' }}>
              {newCount} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>/ {agenda?.daily_new_quota || 15} 字</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              從課本主修單元提拔的核心詞
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum Track Section */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: 'var(--shadow-card)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Target size={20} color="var(--google-blue)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>當前主修進度 (Active Track)</h2>
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
            background: '#f8f9fa', 
            padding: '16px', 
            borderRadius: 'var(--radius-md)', 
            marginBottom: '16px',
            border: '1px solid var(--border-color)'
          }}>
            <p style={{ margin: '0 0 12px 0', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              選擇你目前正在學習的課本單元或重點分類：
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
              <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                掌握率 {curProgress.percentage}% ({curProgress.proficient} / {curProgress.total} 字達 Stage 3+)
              </span>
            </div>
            {/* Progress Bar */}
            <div style={{ 
              width: '100%', 
              height: '8px', 
              background: '#e8eaed', 
              borderRadius: '4px', 
              overflow: 'hidden',
              marginBottom: '10px'
            }}>
              <div style={{ 
                width: `${curProgress.percentage}%`, 
                height: '100%', 
                background: 'var(--google-blue)',
                borderRadius: '4px',
                transition: 'width 0.4s ease'
              }} />
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              💡 當該單元掌握率達到 80% 時，建議切換進入下一個課本章節。
            </div>
          </div>
        ) : (
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
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
          background: '#ffffff',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          boxShadow: 'var(--shadow-card)'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 16px 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} color="var(--google-blue)" />
            五階詞彙進化梯 (Mastery Ladder)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { stage: 1, label: 'Stage 1: 被動辨認 (西->中)', count: stats?.stages?.[1] || 0, color: '#f29900' },
              { stage: 2, label: 'Stage 2: 提示回想 (中->西)', count: stats?.stages?.[2] || 0, color: '#1a73e8' },
              { stage: 3, label: 'Stage 3: 正字拼寫 (盲測+符號)', count: stats?.stages?.[3] || 0, color: '#8430ce' },
              { stage: 4, label: 'Stage 4: 語境克漏字 (搭配詞)', count: stats?.stages?.[4] || 0, color: '#d93025' },
              { stage: 5, label: 'Stage 5: 自動化精通 (Mastered)', count: stats?.stages?.[5] || 0, color: '#1e8e3e' }
            ].map(item => (
              <div key={item.stage} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem', padding: '6px 8px', borderRadius: '6px', background: '#f8f9fa' }}>
                <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
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
          background: '#ffffff',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Inbox size={18} color="#5f6368" />
                課堂隨記暫存箱 (Inbox)
              </h3>
              <span style={{ 
                background: '#f1f3f4', 
                color: 'var(--text-secondary)', 
                padding: '2px 10px', 
                borderRadius: '12px',
                fontSize: '0.85rem',
                fontWeight: 700
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
