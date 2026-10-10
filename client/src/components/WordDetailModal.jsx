import React from 'react';
import { X, Volume2, Edit3, Trash2, Star, Flame, Calendar, Award, BookOpen, Clock, CheckCircle } from 'lucide-react';
import { playSpanishPronunciation } from '../utils/speech';

export default function WordDetailModal({ 
  card, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete, 
  onToggleStar, 
  onQuickStatusChange 
}) {
  if (!isOpen || !card) return null;

  const st = card.lifecycle_status || 'active';
  const stage = Number(card.mastery_stage) || 1;

  let badgeBg = '#f1f3f4';
  let badgeBorder = '#dadce0';
  let badgeColor = '#5f6368';
  let badgeText = '📥 隨手暫存 (Inbox)';

  if (st === 'ready') {
    badgeBg = 'var(--google-blue-light)';
    badgeBorder = '#aecbfa';
    badgeColor = 'var(--google-blue)';
    badgeText = '🎯 待學核心 (Ready)';
  } else if (st === 'mastered') {
    badgeBg = 'var(--google-green-light)';
    badgeBorder = '#a8dab5';
    badgeColor = 'var(--google-green)';
    badgeText = '🏆 已精通 (Mastered)';
  } else if (st === 'active') {
    badgeBg = 'var(--google-yellow-light)';
    badgeBorder = '#fce8b2';
    badgeColor = 'var(--google-yellow-dark)';
    badgeText = `⚡ 活躍學習 (Stage ${stage})`;
  }

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', padding: '24px 28px' }}
      >
        {/* Header: badges & close */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{
              background: badgeBg,
              border: `1px solid ${badgeBorder}`,
              color: badgeColor,
              padding: '3px 10px',
              borderRadius: '12px',
              fontSize: '0.8rem',
              fontWeight: 700
            }}>
              {badgeText}
            </span>
            <span className="badge-dele">{card.dele_level || 'A2'}</span>
            {card.category && <span className="badge-category">{card.category}</span>}
            {card.curriculum_unit && card.curriculum_unit !== card.category && (
              <span className="badge-category">{card.curriculum_unit}</span>
            )}
            {card.gender && card.gender !== 'none' && (
              <span className={`badge-gender ${card.gender}`}>
                {card.gender === 'masculino' ? '♂ 陽性' : '♀ 陰性'}
              </span>
            )}
            {card.part_of_speech && (
              <span style={{ background: '#f1f3f4', color: 'var(--text-secondary)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
                {card.part_of_speech}
              </span>
            )}
          </div>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Word Title + Star + Sound */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            {card.article && (
              <span style={{ color: 'var(--text-muted)', fontSize: '1.4rem', fontWeight: 600 }}>
                {card.article}
              </span>
            )}
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              {card.word}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={(e) => onToggleStar(card, e)}
              className="btn-icon"
              style={{ width: '38px', height: '38px' }}
              title={card.is_starred ? "取消核心標記" : "標記為核心詞"}
            >
              <Star 
                size={20} 
                fill={card.is_starred ? "var(--google-yellow)" : "none"} 
                color={card.is_starred ? "var(--google-yellow)" : "var(--text-muted)"} 
              />
            </button>
            <button
              className="btn-icon"
              style={{ width: '38px', height: '38px', background: 'var(--google-blue-light)', color: 'var(--google-blue)' }}
              onClick={() => playSpanishPronunciation(card.article ? `${card.article} ${card.word}` : card.word)}
              title="播放西語發音"
            >
              <Volume2 size={20} />
            </button>
          </div>
        </div>

        {/* Translation */}
        <div style={{ 
          fontSize: '1.35rem', 
          fontWeight: 700, 
          color: 'var(--google-blue)', 
          padding: '10px 14px', 
          background: 'var(--google-blue-light)', 
          borderRadius: 'var(--radius-md)', 
          marginBottom: '16px' 
        }}>
          {card.translation}
        </div>

        {/* Example Sentence */}
        {card.example_es && (
          <div style={{ 
            background: '#f8f9fa', 
            border: '1px solid var(--border-color)', 
            borderRadius: 'var(--radius-md)', 
            padding: '14px', 
            marginBottom: '14px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>例句應用</span>
              <button
                className="btn-icon"
                style={{ width: '26px', height: '26px' }}
                onClick={() => playSpanishPronunciation(card.example_es)}
                title="播放例句發音"
              >
                <Volume2 size={14} />
              </button>
            </div>
            <div style={{ color: 'var(--text-primary)', fontSize: '0.98rem', fontWeight: 500, lineHeight: 1.4, marginBottom: '4px' }}>
              {card.example_es}
            </div>
            {card.example_zh && (
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                {card.example_zh}
              </div>
            )}
          </div>
        )}

        {/* Grammar Notes */}
        {card.notes && (
          <div style={{ 
            background: 'var(--google-yellow-light)', 
            border: '1px solid #fce8b2', 
            borderRadius: 'var(--radius-md)', 
            padding: '12px 14px', 
            marginBottom: '16px',
            fontSize: '0.88rem',
            color: 'var(--google-yellow-dark)'
          }}>
            <span style={{ fontWeight: 700 }}>💡 文法解析與重點：</span>
            <div style={{ marginTop: '4px', color: '#3c4043', lineHeight: 1.45 }}>
              {card.notes}
            </div>
          </div>
        )}

        {/* FSRS Learning Metrics Grid */}
        <div style={{ 
          background: '#ffffff', 
          border: '1px solid var(--border-color)', 
          borderRadius: 'var(--radius-md)', 
          padding: '14px', 
          marginBottom: '20px' 
        }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Flame size={14} color="var(--google-red)" />
            <span>FSRS 記憶科學數據</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>記憶階段</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                Stage {stage} / 5
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>記憶穩定度 (S)</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                {card.fsrs_stability ? `${Math.round(card.fsrs_stability * 10) / 10} 天` : '未評估'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>複習次數</div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                {card.repetition || card.fsrs_reps || 0} 次
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>遺忘次數 (Lapse)</div>
              <div style={{ fontWeight: 700, color: card.lapse_count > 0 ? 'var(--google-red)' : 'var(--text-primary)', fontSize: '0.95rem' }}>
                {card.lapse_count || 0} 次
              </div>
            </div>
          </div>
        </div>

        {/* Quick Triage Buttons */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
            快速調整狀態：
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              className={`btn btn-sm ${st === 'inbox' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={(e) => onQuickStatusChange(card, 'inbox', e)}
            >
              📥 隨手暫存
            </button>
            <button
              className={`btn btn-sm ${st === 'ready' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={(e) => onQuickStatusChange(card, 'ready', e)}
            >
              🎯 待學核心
            </button>
            <button
              className={`btn btn-sm ${st === 'active' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={(e) => onQuickStatusChange(card, 'active', e)}
            >
              ⚡ 活躍學習
            </button>
            <button
              className={`btn btn-sm ${st === 'mastered' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={(e) => onQuickStatusChange(card, 'mastered', e)}
            >
              🏆 標記精通
            </button>
          </div>
        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
          <button
            className="btn btn-secondary btn-sm"
            style={{ color: 'var(--google-red)' }}
            onClick={() => {
              onClose();
              onDelete(card.id);
            }}
          >
            <Trash2 size={16} />
            <span>刪除單字</span>
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary" onClick={onClose}>
              關閉
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                onClose();
                onEdit(card);
              }}
            >
              <Edit3 size={16} />
              <span>修改單字內容</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
