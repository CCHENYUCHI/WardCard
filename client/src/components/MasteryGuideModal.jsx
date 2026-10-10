import React from 'react';
import { X, HelpCircle, Flame, Star, CheckCircle, BookOpen, Layers, Award } from 'lucide-react';

export default function MasteryGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto', padding: '24px 28px' }}
      >
        <div className="modal-header" style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--google-blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--google-blue)' }}>
              <HelpCircle size={20} />
            </div>
            <div>
              <h2 className="modal-title" style={{ fontSize: '1.25rem', margin: 0 }}>
                單字熟練度、階段與生命週期指南
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                FSRS 記憶科學調度系統運作規則
              </span>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Section 1: ⭐️ 核心星號 */}
        <div style={{ 
          background: 'var(--google-yellow-light)', 
          border: '1px solid #fce8b2', 
          borderRadius: 'var(--radius-lg)', 
          padding: '16px', 
          marginBottom: '20px' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--google-yellow-dark)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '6px' }}>
            <Star size={18} fill="var(--google-yellow)" color="var(--google-yellow)" />
            <span>什麼是「⭐️ 核心星號」？</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.86rem', color: '#3c4043', lineHeight: 1.5 }}>
            <strong>核心星號</strong>是你的<strong>第一優先學習標記</strong>。當系統每日從「課本主修單元」或「待學庫」為你挑選新詞解鎖時（每日配額），<strong>有打星號的單字具有最高優先權</strong>，會最先被派發進入你的今日學習！此外，您也可以在單字庫中一鍵篩選所有星號單字進行集中強化。
          </p>
        </div>

        {/* Section 2: 4 大生命週期狀態 */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={18} color="var(--google-blue)" />
            <span>四大生命週期狀態 (Lifecycle Status)</span>
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
            <div style={{ background: '#f8f9fa', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.88rem', color: '#5f6368', marginBottom: '4px' }}>
                <span>📥 隨手暫存 (Inbox)</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                閱讀、課堂時隨手記下但<strong>尚未準備開始背</strong>的單字。零排程壓力，不會出現在每日複習隊列中。
              </p>
            </div>

            <div style={{ background: 'var(--google-blue-light)', border: '1px solid #aecbfa', borderRadius: 'var(--radius-md)', padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.88rem', color: 'var(--google-blue)', marginBottom: '4px' }}>
                <span>🎯 待學核心 (Ready)</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#174ea6', lineHeight: 1.4 }}>
                課本單元或準備要背的生詞儲備庫。系統會依您設定的「每日新詞配額」自動按順序解鎖提拔。
              </p>
            </div>

            <div style={{ background: 'var(--google-green-light)', border: '1px solid #a8dab5', borderRadius: 'var(--radius-md)', padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.88rem', color: 'var(--google-green)', marginBottom: '4px' }}>
                <span>⚡ 活躍學習 (Active)</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#0d652d', lineHeight: 1.4 }}>
                <strong>正式進入記憶排程</strong>的單字。每天由 FSRS 抗遺忘曲線依到期日排定複習任務。
              </p>
            </div>

            <div style={{ background: '#f6e8ff', border: '1px solid #d7aefb', borderRadius: 'var(--radius-md)', padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.88rem', color: '#8430ce', marginBottom: '4px' }}>
                <span>🏆 已精通 (Mastered)</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#571b87', lineHeight: 1.4 }}>
                已形成深層長期記憶（Stage 5），不再頻繁需要每日排程，代表該單元或課程已徹底掌握。
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: 五階記憶進化梯 */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Award size={18} color="var(--google-green)" />
            <span>五階記憶進化梯 (Mastery Stages 1~5)</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { stage: 'Stage 1', name: '認知識讀 (選擇題)', desc: '初學或失誤 (Lapse) 搶救：看到西語單字辨別中文釋義，快速建立初始認知連結。', color: '#ea4335', bg: '#fce8e6' },
              { stage: 'Stage 2', name: '主動回想 (提示題)', desc: '看到中文釋義與首字母提示，主動在腦中回憶西語單字。', color: '#1a73e8', bg: '#e8f0fe' },
              { stage: 'Stage 3', name: '盲測拼寫 (正字法)', desc: '無提示盲測正字拼寫（驗證重音符號 á/é/í/ó/ú 與字母拼法）。達成此階即計入「精通掌握 (Proficient)」。', color: '#188038', bg: '#e6f4ea' },
              { stage: 'Stage 4', name: '語境克漏字 (應用題)', desc: '在真實西語句子語境中填空，驗證詞性、動詞變位與介系詞搭配。', color: '#f29900', bg: '#fef7e0' },
              { stage: 'Stage 5', name: '長期精通 (Mastered)', desc: '記憶穩定度超越 30~60 天，轉為超低頻間隔鞏固。', color: '#8430ce', bg: '#f6e8ff' },
            ].map(item => (
              <div key={item.stage} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '10px 14px', background: item.bg, borderRadius: 'var(--radius-md)', border: `1px solid ${item.color}30` }}>
                <span style={{ fontWeight: 800, fontSize: '0.85rem', color: item.color, minWidth: '65px' }}>
                  {item.stage}
                </span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#202124', marginBottom: '2px' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#5f6368', lineHeight: 1.35 }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'right', marginTop: '20px' }}>
          <button className="btn btn-primary" onClick={onClose} style={{ padding: '8px 24px' }}>
            知道了
          </button>
        </div>
      </div>
    </div>
  );
}
