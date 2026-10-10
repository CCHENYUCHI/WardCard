import React from 'react';
import { Layers, Keyboard, BookOpen, BarChart2, Sparkles, Settings, Plus, LogOut, Search } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, dueCount, onOpenAiModal, onOpenAddModal, onOpenSettings, user, onLogout }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand" onClick={() => setActiveTab('review')}>
          <div className="brand-icon">🇪🇸</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="brand-title">PalabraCard</span>
              <span className="brand-badge">FSRS</span>
            </div>
          </div>
        </div>

        <nav className="nav-links">
          <button
            className={`nav-tab ${activeTab === 'agenda' ? 'active' : ''}`}
            onClick={() => setActiveTab('agenda')}
            id="nav-agenda"
          >
            <Sparkles size={18} />
            <span>今日學習</span>
            {dueCount > 0 && <span className="tab-badge">{dueCount}</span>}
          </button>

          <button
            className={`nav-tab ${activeTab === 'review' ? 'active' : ''}`}
            onClick={() => setActiveTab('review')}
            id="nav-review"
          >
            <Layers size={18} />
            <span>自由翻卡</span>
          </button>

          <button
            className={`nav-tab ${activeTab === 'spelling' ? 'active' : ''}`}
            onClick={() => setActiveTab('spelling')}
            id="nav-spelling"
          >
            <Keyboard size={18} />
            <span>盲測拼寫</span>
          </button>

          <button
            className={`nav-tab ${activeTab === 'words' ? 'active' : ''}`}
            onClick={() => setActiveTab('words')}
            id="nav-words"
          >
            <BookOpen size={18} />
            <span>單字庫</span>
          </button>

          <button
            className={`nav-tab ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
            id="nav-stats"
          >
            <BarChart2 size={18} />
            <span>進度統計</span>
          </button>
        </nav>

        <div className="navbar-actions">
          <button
            className="btn btn-ai btn-sm"
            onClick={onOpenAiModal}
            title="AI 拍照/筆記快速辨識萃取單字"
            id="btn-ai-import"
          >
            <Sparkles size={16} />
            <span>AI 萃取單字</span>
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={onOpenAddModal}
            title="手動新增單字"
            id="btn-add-word"
          >
            <Plus size={16} />
            <span>新增</span>
          </button>

          <button
            className="btn-icon"
            onClick={onOpenSettings}
            title="設定 (API Key / 發音)"
            id="btn-settings"
          >
            <Settings size={18} />
          </button>

          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '8px', paddingLeft: '8px', borderLeft: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Hi, <strong>{user.username}</strong>
              </span>
              <button
                className="btn-icon"
                onClick={onLogout}
                title="登出"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
