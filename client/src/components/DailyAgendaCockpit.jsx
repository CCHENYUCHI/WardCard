import React, { useState, useEffect, useMemo } from 'react';
import { Inbox, Layers, Target, ChevronRight, HelpCircle, Plus, Pause } from 'lucide-react';
import { fetchAPI } from '../utils/api';
import Tooltip from './Tooltip';
import TodayProgressCard from './TodayProgressCard';
import StudyHistory from './StudyHistory';

export default function DailyAgendaCockpit({ 
  onStartStudy, 
  onNavigateToWords, 
  onOpenSettings,
  onRefresh 
}) {
  const [agenda, setAgenda] = useState(null);
  const [stats, setStats] = useState(null);
  const [today, setToday] = useState(null);
  const [history, setHistory] = useState([]);
  const [practiceLoading, setPracticeLoading] = useState(false);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isChangingUnit, setIsChangingUnit] = useState(false);

  const fetchAgendaData = async () => {
    try {
      setLoading(true);
      const [agendaRes, unitsRes, historyRes] = await Promise.all([
        fetchAPI('/api/study/agenda'),
        fetchAPI('/api/study/units'),
        fetchAPI('/api/study/history?days=30')
      ]);

      if (agendaRes.ok) {
        const data = await agendaRes.json();
        setAgenda(data.agenda);
        setStats(data.stats);
        setToday(data.today);
      }
      if (historyRes.ok) {
        setHistory((await historyRes.json()).days || []);
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

  const handleStartPractice = async () => {
    try {
      setPracticeLoading(true);
      const res = await fetchAPI('/api/study/practice?limit=20');
      if (!res.ok) return;
      const { cards } = await res.json();
      if (!cards || cards.length === 0) {
        window.alert('目前沒有可以加練的單字（還沒有複習過的單字）。');
        return;
      }
      onStartStudy({ mode: 'practice', extra: cards });
    } catch (err) {
      console.error('Failed to load practice cards:', err);
    } finally {
      setPracticeLoading(false);
    }
  };

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
      <TodayProgressCard
        today={today}
        history={history}
        startCount={totalTodayTasks}
        urgentCount={urgentCount}
        onStart={() => onStartStudy({
          urgent: agenda?.urgent_reviews || [],
          regular: agenda?.regular_reviews || [],
          newCards: agenda?.candidate_new || []
        })}
        onPractice={handleStartPractice}
        practiceLoading={practiceLoading}
      />

      {/* Curriculum Track Section */}
      <div className="surface-card cockpit-section" style={{ marginBottom: '20px' }}>
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

      <StudyHistory history={history} bestStreak={today?.streak?.best || 0} today={today?.date} />

      {/* 5-Stage Distribution & Inbox Quick Action */}
      <div className="cockpit-bottom-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', 
        gap: '20px' 
      }}>
        {/* Stage Mastery Ladder */}
        <div className="surface-card">
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
        <div className="surface-card" style={{
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
