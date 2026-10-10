import React, { useState, useEffect, useMemo } from 'react';
import { 
  Flame, BookOpen, Sparkles, CheckCircle2, ArrowRight, 
  Inbox, Layers, Target, ChevronRight, Settings, RotateCcw, AlertCircle, HelpCircle,
  Plus, Pause, Play
} from 'lucide-react';
import { fetchAPI } from '../utils/api';
import Tooltip from './Tooltip';

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

  const activeUnits = useMemo(() => {
    return units.filter(u => u.active > 0).sort(lessonSort);
  }, [units]);

  const waitingUnits = useMemo(() => {
    return units.filter(u => u.active === 0).sort(lessonSort);
  }, [units]);

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

  const handlePauseUnit = async (unitName) => {
    if (!window.confirm(`確定要將【${unitName}】暫停主修排程，轉回待學庫嗎？`)) return;
    try {
      const res = await fetchAPI(`/api/cards?category=${encodeURIComponent(unitName)}`);
      if (res.ok) {
        const cardsData = await res.json();
        const activeIds = (cardsData.cards || cardsData).filter(c => c.lifecycle_status === 'active').map(c => c.id);
        if (activeIds.length > 0) {
          await fetchAPI('/api/cards/batch-status', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ card_ids: activeIds, lifecycle_status: 'ready' })
          });
        }
      }
      await fetchAPI('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active_curriculum: '' })
      });
      fetchAgendaData();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Error pausing unit:', err);
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
      <div className="cockpit-banner-card" style={{ 
        background: '#ffffff',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px 28px',
        marginBottom: '20px',
        boxShadow: 'var(--shadow-card)',
        position: 'relative'
      }}>
        {/* Subtle Google Top Color Accent Bar */}
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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Tooltip text="FSRS 記憶科學調度：抗遺忘最佳學習曲線" position="bottom">
                <span 
                  style={{ 
                    background: 'var(--google-blue-light)', 
                    color: 'var(--google-blue)', 
                    padding: '3px 10px', 
                    borderRadius: '12px', 
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Flame size={12} /> FSRS 調度
                </span>
              </Tooltip>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
                今日學習
              </h1>
              <Tooltip text="系統已自動編排今日最需鞏固與解鎖的詞彙，專注完成今日任務，杜絕單字雪崩" position="bottom">
                <span style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center' }}>
                  <HelpCircle size={16} />
                </span>
              </Tooltip>
            </div>
          </div>

          {/* Big Start Action Button */}
          <div className="cockpit-cta-wrap">
            <button
              onClick={() => onStartStudy({ 
                urgent: agenda?.urgent_reviews || [],
                regular: agenda?.regular_reviews || [],
                newCards: agenda?.candidate_new || []
              })}
              disabled={totalTodayTasks === 0}
              className="btn btn-primary cockpit-btn-start"
              style={{
                padding: '12px 28px',
                fontSize: '1rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: totalTodayTasks > 0 ? '0 2px 6px rgba(26, 115, 232, 0.4)' : 'none',
              }}
            >
              {totalTodayTasks > 0 ? (
                <>
                  <span>🚀 開始學習 ({totalTodayTasks})</span>
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
        <div className="cockpit-metrics-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '14px', 
          marginTop: '20px' 
        }}>
          {/* Urgent / Lapse */}
          <div className="cockpit-metric-item" style={{
            background: 'var(--google-red-light)',
            border: '1px solid #f6aea9',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--google-red)', fontSize: '0.85rem', fontWeight: 700 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🚨 緊急搶救</span>
                <Tooltip text="近期失誤或處於 Stage 1 的單字 (Lapse)">
                  <HelpCircle size={14} style={{ opacity: 0.7 }} />
                </Tooltip>
              </span>
              <AlertCircle size={16} />
            </div>
            <div className="cockpit-metric-num" style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '4px', color: 'var(--google-red)' }}>
              {urgentCount} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>字</span>
            </div>
          </div>

          {/* Regular Due */}
          <div className="cockpit-metric-item" style={{
            background: 'var(--google-blue-light)',
            border: '1px solid #aecbfa',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--google-blue)', fontSize: '0.85rem', fontWeight: 700 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>📚 例行穩固</span>
                <Tooltip text="按 FSRS 曲線今日到期的高階熟詞">
                  <HelpCircle size={14} style={{ opacity: 0.7 }} />
                </Tooltip>
              </span>
              <RotateCcw size={16} />
            </div>
            <div className="cockpit-metric-num" style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '4px', color: 'var(--google-blue)' }}>
              {regularCount} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>字</span>
            </div>
          </div>

          {/* Daily New Quota */}
          <div className="cockpit-metric-item" style={{
            background: 'var(--google-green-light)',
            border: '1px solid #a8dab5',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--google-green)', fontSize: '0.85rem', fontWeight: 700 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🌱 今日新詞</span>
                <Tooltip text="從課本主修單元提拔的核心詞 (每日配額)">
                  <HelpCircle size={14} style={{ opacity: 0.7 }} />
                </Tooltip>
              </span>
              <Sparkles size={16} />
            </div>
            <div className="cockpit-metric-num" style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '4px', color: 'var(--google-green)' }}>
              {newCount} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>/ {agenda?.daily_new_quota || 15} 字</span>
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum Track Section */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: '20px 24px',
        marginBottom: '20px',
        boxShadow: 'var(--shadow-card)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={18} color="var(--google-blue)" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>主修進度</h2>
            <span style={{ fontSize: '0.78rem', background: '#e8f0fe', color: 'var(--google-blue)', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
              {activeUnits.length} 個主修類別
            </span>
            <Tooltip text="只追蹤目前處於「活躍學習」的主修單元，達成 80% 時建議推進至下一單元">
              <span style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center' }}>
                <HelpCircle size={15} />
              </span>
            </Tooltip>
          </div>
          <div>
            {waitingUnits.length > 0 && (
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setIsChangingUnit(!isChangingUnit)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={14} />
                <span>{isChangingUnit ? '收合待學單元' : '從待學庫加入主修'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Panel to add waiting units into active curriculum */}
        {isChangingUnit && waitingUnits.length > 0 && (
          <div style={{ 
            background: '#f8f9fa', 
            padding: '14px', 
            borderRadius: 'var(--radius-md)', 
            marginBottom: '16px',
            border: '1px solid var(--border-color)'
          }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              點擊下列待學單元，即可一鍵啟用為活躍主修並加入每日學習排程：
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {waitingUnits.map(u => (
                <button
                  key={u.unit}
                  className="btn btn-sm btn-primary"
                  onClick={() => handleChangeCurriculum(u.unit)}
                  title={`將【${u.unit}】加入主修`}
                >
                  <Plus size={13} />
                  <span>{u.unit} ({u.total}字)</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active Curriculum Units (只顯示主修類別) */}
        {activeUnits.length === 0 ? (
          <div style={{ background: '#f8f9fa', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', padding: '20px', textAlign: 'center' }}>
            <p style={{ margin: '0 0 10px 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              目前尚未啟用任何主修單元（所有單元處於待學狀態）。
            </p>
            {waitingUnits.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px' }}>
                {waitingUnits.map(u => (
                  <button
                    key={u.unit}
                    className="btn btn-sm btn-primary"
                    onClick={() => handleChangeCurriculum(u.unit)}
                  >
                    <span>啟用【{u.unit}】為主修</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Active unit tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
              <button
                className={`btn btn-sm ${(!activeCurriculum || activeCurriculum === 'ALL_ACTIVE') ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleChangeCurriculum('')}
              >
                🌟 全部主修 ({activeUnits.length} 類別)
              </button>
              {activeUnits.map(u => {
                const isSelected = activeCurriculum === u.unit;
                return (
                  <button
                    key={u.unit}
                    className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => handleChangeCurriculum(u.unit)}
                  >
                    <span>📖 {u.unit} ({u.proficiencyRate}% · {u.active}字)</span>
                  </button>
                );
              })}
            </div>

            {/* Selected unit or overall progress bar */}
            {curProgress && (
              <div style={{ background: '#f8f9fa', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '14px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-primary)' }}>
                      {curProgress.unit === '所有主修單元' ? '🌟 所有主修單元綜合掌握率' : `📖 ${curProgress.unit}`}
                    </span>
                    {activeCurriculum && activeCurriculum !== 'ALL_ACTIVE' && (
                      <button
                        onClick={() => handlePauseUnit(curProgress.unit)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '3px' }}
                        title="將此單元暫停，轉回待學庫"
                      >
                        <Pause size={12} />
                        <span>暫停此單元</span>
                      </button>
                    )}
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>掌握率 <strong>{curProgress.percentage}%</strong> ({curProgress.proficient} / {curProgress.total} 字)</span>
                    <Tooltip text="達 Stage 3+ 盲測拼寫掌握計為精通，達到 80% 時建議推進至下一課">
                      <HelpCircle size={14} style={{ opacity: 0.7 }} />
                    </Tooltip>
                  </span>
                </div>
                {/* Progress Bar */}
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  background: '#e8eaed', 
                  borderRadius: '4px', 
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: `${curProgress.percentage}%`, 
                    height: '100%', 
                    background: curProgress.percentage >= 70 ? 'var(--google-green)' : 'var(--google-blue)',
                    borderRadius: '4px',
                    transition: 'width 0.4s ease'
                  }} />
                </div>
              </div>
            )}
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
          padding: '20px 24px',
          boxShadow: 'var(--shadow-card)'
        }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 14px 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <Layers size={18} color="var(--google-blue)" />
            <span>五階熟練梯</span>
            {activeCurriculum ? (
              <span style={{ fontSize: '0.78rem', background: '#e8f0fe', color: 'var(--google-blue)', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
                {activeCurriculum}
              </span>
            ) : (
              <span style={{ fontSize: '0.78rem', background: '#f1f3f4', color: 'var(--text-secondary)', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
                全局全庫
              </span>
            )}
            <Tooltip text="認知階梯：S1 辨認 ➔ S2 回想 ➔ S3 拼寫 ➔ S4 克漏字 ➔ S5 精通">
              <HelpCircle size={14} style={{ opacity: 0.7 }} />
            </Tooltip>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { stage: 1, label: 'S1 被動辨認', tip: '看西語回想中文意義與發音', count: stats?.stages?.[1] || 0, color: '#f29900' },
              { stage: 2, label: 'S2 提示回想', tip: '看中文回想西語單字', count: stats?.stages?.[2] || 0, color: '#1a73e8' },
              { stage: 3, label: 'S3 正字拼寫', tip: '盲測輸入完整拼寫與重音符號', count: stats?.stages?.[3] || 0, color: '#8430ce' },
              { stage: 4, label: 'S4 語境克漏字', tip: '例句克漏字與語境變位', count: stats?.stages?.[4] || 0, color: '#d93025' },
              { stage: 5, label: 'S5 自動化精通', tip: '高穩定度長效永久記憶', count: stats?.stages?.[5] || 0, color: '#1e8e3e' }
            ].map(item => (
              <Tooltip key={item.stage} text={item.tip}>
                <div 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    fontSize: '0.88rem', 
                    padding: '6px 10px', 
                    borderRadius: '6px', 
                    background: '#f8f9fa',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                >
                  <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
                    {item.label}
                  </span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                    {item.count} 字
                  </span>
                </div>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Inbox Triage & Quick Access */}
        <div style={{
          background: '#ffffff',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '20px 24px',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Inbox size={18} color="#5f6368" />
                <span>暫存箱 (Inbox)</span>
                <Tooltip text="隨手記錄但尚未開始排程的單字，零壓力，需要時打星轉入待學庫">
                  <HelpCircle size={14} style={{ opacity: 0.7 }} />
                </Tooltip>
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
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '6px 0 16px 0' }}>
              隨手記錄 · 零排程壓力
            </div>
          </div>

          <div>
            <button
              onClick={() => onNavigateToWords('inbox')}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
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
