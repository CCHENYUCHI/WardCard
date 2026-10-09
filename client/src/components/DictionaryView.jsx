import React from 'react';
import { Search, Sparkles } from 'lucide-react';

export default function DictionaryView() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div className="card-face" style={{ padding: '32px', textAlign: 'center' }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', marginBottom: '16px' }}>
            <Search size={32} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>AI 智慧字典 (開發中)</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '400px', margin: '8px auto' }}>
            未來這裡將支援一鍵查詞。查不到的單字會自動呼叫 AI 翻譯並提供例句，還可以一鍵收錄到你的專屬字卡庫中！
          </p>
        </div>

        <div style={{ position: 'relative', maxWidth: '500px', margin: '0 auto' }}>
          <input 
            type="text" 
            placeholder="Search a word... (Todo)" 
            disabled
            style={{
              width: '100%',
              padding: '16px 24px',
              paddingLeft: '48px',
              borderRadius: '24px',
              border: '1px solid var(--border-color)',
              background: 'rgba(255, 255, 255, 0.05)',
              fontSize: '1.1rem',
              color: 'var(--text-secondary)',
              cursor: 'not-allowed'
            }}
          />
          <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <button 
            disabled
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'var(--accent-primary)',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '16px',
              cursor: 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={16} /> 查詞
          </button>
        </div>
      </div>
    </div>
  );
}
