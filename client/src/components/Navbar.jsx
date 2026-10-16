import React from 'react';
import { Layers, Keyboard, BookOpen, BarChart2, Sparkles, Settings, Plus, LogOut, Search } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, dueCount, onOpenAiModal, onOpenAddModal, onOpenSettings, user, onLogout }) {
  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          <div className="brand" onClick={() => setActiveTab('agenda')}>
            <div className="brand-icon">🇪🇸</div>
            <div className="brand-text-wrapper">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="brand-title">PalabraCard</span>
                <span className="brand-badge">FSRS</span>
              </div>
            </div>
          </div>

          {/* Desktop Nav Links (Hidden on Mobile) */}
          <nav className="nav-links desktop-nav-links">
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

            <button
              className={`nav-tab ${activeTab === 'dictionary' ? 'active' : ''}`}
              onClick={() => setActiveTab('dictionary')}
              id="nav-dictionary"
            >
              <Search size={18} />
              <span>查詞</span>
            </button>
          </nav>

          {/* Top Actions */}
          <div className="navbar-actions">
            {/* Mobile only: the bottom bar is already full */}
            <button
              className={`btn-icon navbar-btn-dictionary ${activeTab === 'dictionary' ? 'active' : ''}`}
              onClick={() => setActiveTab('dictionary')}
              title="查詞"
              id="btn-dictionary-mobile"
            >
              <Search size={18} />
            </button>

            <button
              className="btn btn-ai btn-sm navbar-btn-ai"
              onClick={onOpenAiModal}
              title="AI 拍照/筆記快速辨識萃取單字"
              id="btn-ai-import"
            >
              <Sparkles size={16} />
              <span className="btn-text-desktop">AI 萃取</span>
            </button>

            <button
              className="btn btn-secondary btn-sm navbar-btn-add"
              onClick={onOpenAddModal}
              title="手動新增單字"
              id="btn-add-word"
            >
              <Plus size={16} />
              <span className="btn-text-desktop">新增</span>
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
              <div className="navbar-user-box">
                <span className="navbar-username">
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

      {/* Mobile Bottom Navigation Bar (Visible on Mobile Only) */}
      <nav className="mobile-bottom-nav">
        <button
          className={`mobile-nav-item ${activeTab === 'agenda' ? 'active' : ''}`}
          onClick={() => setActiveTab('agenda')}
          id="mobile-nav-agenda"
        >
          <div className="mobile-nav-icon-wrap">
            <Sparkles size={20} />
            {dueCount > 0 && <span className="mobile-nav-badge">{dueCount > 99 ? '99+' : dueCount}</span>}
          </div>
          <span className="mobile-nav-label">今日學習</span>
        </button>

        <button
          className={`mobile-nav-item ${activeTab === 'review' ? 'active' : ''}`}
          onClick={() => setActiveTab('review')}
          id="mobile-nav-review"
        >
          <div className="mobile-nav-icon-wrap">
            <Layers size={20} />
          </div>
          <span className="mobile-nav-label">自由翻卡</span>
        </button>

        <button
          className={`mobile-nav-item ${activeTab === 'spelling' ? 'active' : ''}`}
          onClick={() => setActiveTab('spelling')}
          id="mobile-nav-spelling"
        >
          <div className="mobile-nav-icon-wrap">
            <Keyboard size={20} />
          </div>
          <span className="mobile-nav-label">拼字測驗</span>
        </button>

        <button
          className={`mobile-nav-item ${activeTab === 'words' ? 'active' : ''}`}
          onClick={() => setActiveTab('words')}
          id="mobile-nav-words"
        >
          <div className="mobile-nav-icon-wrap">
            <BookOpen size={20} />
          </div>
          <span className="mobile-nav-label">單字庫</span>
        </button>

        <button
          className={`mobile-nav-item ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
          id="mobile-nav-stats"
        >
          <div className="mobile-nav-icon-wrap">
            <BarChart2 size={20} />
          </div>
          <span className="mobile-nav-label">進度統計</span>
        </button>
      </nav>
    </>
  );
}
