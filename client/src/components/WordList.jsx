import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Filter, Volume2, Edit3, Trash2, Plus, Sparkles, BookOpen, 
  Star, CheckCircle, ArrowRight, CheckSquare, Square, HelpCircle, 
  Layers, Folder, Check, MoreHorizontal, ChevronRight, ChevronDown, X, Play, Pause, Flame
} from 'lucide-react';
import { playSpanishPronunciation } from '../utils/speech';
import { fetchAPI } from '../utils/api';
import WordDetailModal from './WordDetailModal';
import MasteryGuideModal from './MasteryGuideModal';

export default function WordList({ 
  cards, 
  categories = [], 
  initialFilterPreset, 
  onEdit, 
  onDelete, 
  onOpenAddModal, 
  onOpenAiModal,
  onRefresh 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLifecycle, setSelectedLifecycle] = useState(initialFilterPreset || 'all');
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);
  
  // Selection state for batch operations
  const [selectedIds, setSelectedIds] = useState([]);
  const [isBatchOperating, setIsBatchOperating] = useState(false);

  // Modals state
  const [detailCard, setDetailCard] = useState(null);
  const [showGuideModal, setShowGuideModal] = useState(false);

  useEffect(() => {
    if (initialFilterPreset) {
      setSelectedLifecycle(initialFilterPreset);
    }
  }, [initialFilterPreset]);

  // Natural lesson sorting helper: 第0課 < 第1課 < 第2課 < ...
  const lessonSort = (a, b) => {
    const numA = (a.name.match(/第\s*(\d+)\s*課/) || [])[1];
    const numB = (b.name.match(/第\s*(\d+)\s*課/) || [])[1];
    if (numA !== undefined && numB !== undefined) {
      return parseInt(numA, 10) - parseInt(numB, 10);
    }
    if (numA !== undefined) return -1;
    if (numB !== undefined) return 1;
    return a.name.localeCompare(b.name, 'zh-Hant');
  };

  // Aggregate category stats and split into Active (主修練習中) vs Waiting (待學儲備庫)
  const { activeUnits, waitingUnits } = useMemo(() => {
    const map = new Map();
    // Default categories
    categories.forEach(c => {
      if (c && !map.has(c)) {
        map.set(c, { name: c, total: 0, active: 0, ready: 0, inbox: 0, mastered: 0, proficient: 0 });
      }
    });

    // Count cards in categories
    cards.forEach(card => {
      const cat = card.curriculum_unit || card.category || '未分類';
      if (!map.has(cat)) {
        map.set(cat, { name: cat, total: 0, active: 0, ready: 0, inbox: 0, mastered: 0, proficient: 0 });
      }
      const item = map.get(cat);
      item.total += 1;
      const st = card.lifecycle_status || 'active';
      if (st === 'active') item.active += 1;
      else if (st === 'ready') item.ready += 1;
      else if (st === 'inbox') item.inbox += 1;
      else if (st === 'mastered') item.mastered += 1;

      if ((Number(card.mastery_stage) >= 3) || st === 'mastered') {
        item.proficient += 1;
      }
    });

    const activeList = [];
    const waitingList = [];

    map.forEach(item => {
      item.proficiencyRate = item.total > 0 ? Math.round((item.proficient / item.total) * 100) : 0;
      if (item.active > 0) {
        activeList.push(item);
      } else {
        waitingList.push(item);
      }
    });

    activeList.sort(lessonSort);
    waitingList.sort(lessonSort);

    return { activeUnits: activeList, waitingUnits: waitingList };
  }, [cards, categories]);

  // Current selected category stats
  const currentCategoryStats = useMemo(() => {
    if (selectedCategory === 'all') return null;
    return (
      activeUnits.find(u => u.name === selectedCategory) ||
      waitingUnits.find(u => u.name === selectedCategory) ||
      null
    );
  }, [selectedCategory, activeUnits, waitingUnits]);

  // Filtered cards
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchWord = card.word.toLowerCase().includes(q);
        const matchTrans = card.translation.toLowerCase().includes(q);
        const matchNotes = (card.notes || '').toLowerCase().includes(q);
        if (!matchWord && !matchTrans && !matchNotes) return false;
      }

      // Category / Curriculum sidebar selection
      if (selectedCategory !== 'all') {
        const cat = card.curriculum_unit || card.category;
        if (cat !== selectedCategory && card.category !== selectedCategory) {
          return false;
        }
      }

      // Lifecycle status pill
      if (selectedLifecycle === 'starred') {
        if (!card.is_starred) return false;
      } else if (selectedLifecycle !== 'all') {
        const st = card.lifecycle_status || 'active';
        if (st !== selectedLifecycle) return false;
      }

      return true;
    });
  }, [cards, searchTerm, selectedCategory, selectedLifecycle]);

  // Clear selections when filter changes
  useEffect(() => {
    setSelectedIds([]);
  }, [selectedCategory, selectedLifecycle]);

  // Selection helpers
  const isAllSelected = filteredCards.length > 0 && selectedIds.length === filteredCards.length;
  
  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCards.map(c => c.id));
    }
  };

  const handleToggleSelectCard = (id, e) => {
    e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Toggle single star
  const handleToggleStar = async (card, e) => {
    if (e) e.stopPropagation();
    try {
      const nextStarred = card.is_starred ? 0 : 1;
      await fetchAPI(`/api/cards/${card.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_starred: nextStarred })
      });
      if (detailCard && detailCard.id === card.id) {
        setDetailCard({ ...detailCard, is_starred: nextStarred });
      }
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to toggle star:', err);
    }
  };

  // Single card quick status change
  const handleQuickStatusChange = async (card, nextStatus, e) => {
    if (e) e.stopPropagation();
    try {
      await fetchAPI(`/api/cards/${card.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lifecycle_status: nextStatus })
      });
      if (detailCard && detailCard.id === card.id) {
        setDetailCard({ ...detailCard, lifecycle_status: nextStatus });
      }
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to change status:', err);
    }
  };

  // Activate whole category into active study
  const handleActivateCategory = async (categoryName) => {
    setIsBatchOperating(true);
    try {
      // 1. Set active curriculum in settings
      await fetchAPI('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active_curriculum: categoryName })
      });
      // 2. Activate all ready/inbox cards of this unit
      await fetchAPI('/api/study/activate-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unit: categoryName, limit: 999 })
      });
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to activate category:', err);
      alert('啟動主修失敗，請重試');
    } finally {
      setIsBatchOperating(false);
    }
  };

  // Pause category (set active cards back to ready)
  const handlePauseCategory = async (categoryName) => {
    const targetCards = cards.filter(c => 
      (c.curriculum_unit === categoryName || c.category === categoryName) &&
      c.lifecycle_status === 'active'
    );
    if (targetCards.length === 0) return;
    if (!window.confirm(`確定要將【${categoryName}】的 ${targetCards.length} 個活躍單字暫停排程，轉回待學庫嗎？`)) return;

    setIsBatchOperating(true);
    try {
      await fetchAPI('/api/cards/batch-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          card_ids: targetCards.map(c => c.id),
          lifecycle_status: 'ready'
        })
      });
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to pause category:', err);
      alert('暫停主修失敗，請重試');
    } finally {
      setIsBatchOperating(false);
    }
  };

  // Batch status update
  const handleBatchStatus = async (targetStatus) => {
    if (selectedIds.length === 0) return;
    setIsBatchOperating(true);
    try {
      await fetchAPI('/api/cards/batch-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          card_ids: selectedIds,
          lifecycle_status: targetStatus
        })
      });
      setSelectedIds([]);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to batch update status:', err);
      alert('批次更新失敗，請重試');
    } finally {
      setIsBatchOperating(false);
    }
  };

  // Batch star update
  const handleBatchStar = async (isStarred) => {
    if (selectedIds.length === 0) return;
    setIsBatchOperating(true);
    try {
      await fetchAPI('/api/cards/batch-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          card_ids: selectedIds,
          is_starred: isStarred ? 1 : 0
        })
      });
      setSelectedIds([]);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to batch update star:', err);
      alert('批次標記星號失敗，請重試');
    } finally {
      setIsBatchOperating(false);
    }
  };

  // Batch delete
  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`確定要刪除所選取的 ${selectedIds.length} 個單字嗎？此動作無法復原。`)) return;
    setIsBatchOperating(true);
    try {
      await fetchAPI('/api/cards/batch-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          card_ids: selectedIds
        })
      });
      setSelectedIds([]);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to batch delete:', err);
      alert('批次刪除失敗，請重試');
    } finally {
      setIsBatchOperating(false);
    }
  };

  return (
    <div className="wordlist-main-layout">
      {/* 📁 Left Sidebar: Categories & Units navigation */}
      <aside className={`wordlist-sidebar ${isMobileCategoryOpen ? 'mobile-open' : ''}`}>
        <div 
          className="wordlist-sidebar-header"
          onClick={() => setIsMobileCategoryOpen(prev => !prev)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.95rem' }}>
            <Folder size={18} color="var(--google-blue)" />
            <span>單字分類與單元</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', background: '#e8f0fe', color: 'var(--google-blue)', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
              {selectedCategory === 'all' ? `全部 (${cards.length})` : selectedCategory}
            </span>
            <ChevronDown size={16} className={`sidebar-chevron-icon ${isMobileCategoryOpen ? 'rotate' : ''}`} />
          </div>
        </div>

        <nav className="wordlist-category-list">
          {/* All categories option */}
          <button
            className={`wordlist-category-item ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => { setSelectedCategory('all'); setIsMobileCategoryOpen(false); }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1rem' }}>🌟</span>
              <span className="cat-name">全部單字</span>
            </div>
            <span className="cat-count">{cards.length}</span>
          </button>

          {/* Group 1: 🚀 主修練習中 (Active Units) */}
          <div className="sidebar-group-label" style={{ marginTop: '12px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Flame size={13} color="var(--google-green)" />
              <span>主修練習中 ({activeUnits.length})</span>
            </span>
          </div>
          {activeUnits.length === 0 ? (
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', padding: '6px 12px' }}>
              尚未有正在活躍學習的單元
            </div>
          ) : (
            activeUnits.map(cat => {
              // Color based on proficiency rate
              let badgeBg = '#e8f0fe';
              let badgeColor = 'var(--google-blue)';
              if (cat.proficiencyRate >= 70) {
                badgeBg = '#e6f4ea';
                badgeColor = '#137333';
              } else if (cat.proficiencyRate < 30) {
                badgeBg = '#fce8e6';
                badgeColor = '#ea4335';
              }

              return (
                <button
                  key={cat.name}
                  className={`wordlist-category-item active-unit ${selectedCategory === cat.name ? 'active' : ''}`}
                  onClick={() => { setSelectedCategory(cat.name); setIsMobileCategoryOpen(false); }}
                  title={`${cat.name} · 掌握率 ${cat.proficiencyRate}%`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    <span className="unit-indicator-dot active" />
                    <span className="cat-name">{cat.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.72rem', background: badgeBg, color: badgeColor, padding: '1px 6px', borderRadius: '8px', fontWeight: 700 }}>
                      {cat.proficiencyRate}%
                    </span>
                    <span className="cat-count">{cat.total}</span>
                  </div>
                </button>
              );
            })
          )}

          {/* Group 2: ⏳ 待學儲備庫 (Waiting / Ready Units) */}
          <div className="sidebar-group-label" style={{ marginTop: '14px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Layers size={13} color="var(--text-muted)" />
              <span>待學儲備庫 ({waitingUnits.length})</span>
            </span>
          </div>
          {waitingUnits.length === 0 ? (
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', padding: '6px 12px' }}>
              所有單元皆已加入主修
            </div>
          ) : (
            waitingUnits.map(cat => (
              <button
                key={cat.name}
                className={`wordlist-category-item waiting-unit ${selectedCategory === cat.name ? 'active' : ''}`}
                onClick={() => { setSelectedCategory(cat.name); setIsMobileCategoryOpen(false); }}
                title={`${cat.name} · 待學儲備中`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                  <span className="unit-indicator-dot waiting" />
                  <span className="cat-name">{cat.name}</span>
                </div>
                <span className="cat-count">{cat.total}</span>
              </button>
            ))
          )}
        </nav>
      </aside>

      {/* 📋 Right Main Content Area */}
      <div className="wordlist-content">
        {/* Category Header Banner (when a specific category is selected) */}
        {currentCategoryStats && (
          <div className="category-active-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.25rem' }}>
                  {currentCategoryStats.active > 0 ? '🚀' : '⏳'}
                </span>
                <div>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', overflowWrap: 'anywhere' }}>
                    {currentCategoryStats.name}
                  </h2>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {currentCategoryStats.active > 0 ? (
                      <span style={{ color: 'var(--google-green)', fontWeight: 600 }}>
                        ⚡ 正在主修練習中 · 活躍 {currentCategoryStats.active} 字 / 總共 {currentCategoryStats.total} 字 (掌握率 {currentCategoryStats.proficiencyRate}%)
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-secondary)' }}>
                        ⏳ 待學儲備狀態 · 全數 {currentCategoryStats.total} 字未激活
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {currentCategoryStats.active > 0 ? (
                <button
                  className="btn btn-sm btn-secondary"
                  disabled={isBatchOperating}
                  onClick={() => handlePauseCategory(currentCategoryStats.name)}
                  title="將此單元的所有活躍單字暫停，轉回待學庫"
                >
                  <Pause size={14} />
                  <span>暫停排程 (轉回待學)</span>
                </button>
              ) : (
                <button
                  className="btn btn-sm btn-primary"
                  disabled={isBatchOperating}
                  onClick={() => handleActivateCategory(currentCategoryStats.name)}
                  title="將此單元設為主修，並將生詞加入每日活躍排程"
                >
                  <Play size={14} fill="currentColor" />
                  <span>設為主修並啟動練習</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Top Filter & Action Bar */}
        <div className="filter-bar" style={{ marginBottom: '14px' }}>
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="搜尋西語單字、中文釋義、例句..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              id="wordlist-search-input"
            />
          </div>

          {/* Action Buttons */}
          <div className="filter-bar-actions" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={() => setShowGuideModal(true)}
              title="查看熟練度、階級與生命週期說明"
            >
              <HelpCircle size={15} color="var(--google-blue)" />
              <span>熟練度說明</span>
            </button>
            <button className="btn btn-secondary btn-sm" onClick={onOpenAddModal}>
              <Plus size={16} />
              <span>新增單字</span>
            </button>
            <button className="btn btn-ai btn-sm" onClick={onOpenAiModal}>
              <Sparkles size={16} />
              <span>AI 萃取</span>
            </button>
          </div>
        </div>

        {/* Lifecycle Status Pill Tabs */}
        <div className="wordlist-status-tabs">
          {[
            { key: 'all', label: '全部', mobileLabel: '全部' },
            { key: 'active', label: '⚡ 活躍學習 (Active)', mobileLabel: '⚡ 活躍' },
            { key: 'ready', label: '🎯 待學核心 (Ready)', mobileLabel: '🎯 待學' },
            { key: 'inbox', label: '📥 隨手暫存 (Inbox)', mobileLabel: '📥 暫存' },
            { key: 'mastered', label: '🏆 已精通 (Mastered)', mobileLabel: '🏆 精通' },
            { key: 'starred', label: '⭐️ 核心星號', mobileLabel: '⭐️ 星號' }
          ].map(tab => {
            const isActive = selectedLifecycle === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setSelectedLifecycle(tab.key)}
                className={`status-pill-tab ${isActive ? 'active' : ''}`}
                title={tab.label}
              >
                <span className="tab-label-desktop">{tab.label}</span>
                <span className="tab-label-mobile">{tab.mobileLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Batch Operations Toolbar & Select All */}
        <div className="wordlist-batch-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleToggleSelectAll}
                style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--google-blue)' }}
              />
              <span>全選目前條件 ({filteredCards.length})</span>
            </label>
            {selectedIds.length > 0 && (
              <span style={{ 
                background: 'var(--google-blue-light)', 
                color: 'var(--google-blue)', 
                padding: '2px 10px', 
                borderRadius: '12px', 
                fontSize: '0.8rem', 
                fontWeight: 700 
              }}>
                已選取 {selectedIds.length} 個單字
              </span>
            )}
          </div>

          {selectedIds.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginRight: '2px' }}>整批設為：</span>
              <button
                className="btn btn-sm btn-secondary"
                disabled={isBatchOperating}
                onClick={() => handleBatchStatus('active')}
                title="整批加入每日複習隊列"
              >
                ⚡ 活躍 (Active)
              </button>
              <button
                className="btn btn-sm btn-secondary"
                disabled={isBatchOperating}
                onClick={() => handleBatchStatus('ready')}
                title="整批加入待學核心儲備庫"
              >
                🎯 待學 (Ready)
              </button>
              <button
                className="btn btn-sm btn-secondary"
                disabled={isBatchOperating}
                onClick={() => handleBatchStatus('inbox')}
                title="整批放入隨手暫存箱"
              >
                📥 暫存 (Inbox)
              </button>
              <button
                className="btn btn-sm btn-secondary"
                disabled={isBatchOperating}
                onClick={() => handleBatchStatus('mastered')}
                title="整批標記已精通"
              >
                🏆 精通 (Mastered)
              </button>
              <button
                className="btn btn-sm btn-secondary"
                disabled={isBatchOperating}
                onClick={() => handleBatchStar(true)}
                title="整批加入核心星號"
              >
                ⭐️ 加星號
              </button>
              <button
                className="btn btn-sm btn-secondary"
                disabled={isBatchOperating}
                onClick={() => handleBatchStar(false)}
                title="整批取消星號"
              >
                ☆ 取消星
              </button>
              <button
                className="btn btn-sm btn-secondary"
                disabled={isBatchOperating}
                onClick={handleBatchDelete}
                style={{ color: 'var(--google-red)' }}
                title="刪除所選單字"
              >
                <Trash2 size={14} />
              </button>
              <button
                className="btn-icon"
                style={{ width: '28px', height: '28px' }}
                onClick={() => setSelectedIds([])}
                title="取消選取"
              >
                <X size={15} />
              </button>
            </div>
          )}
        </div>

        {/* 📇 Compact Word Cards Grid */}
        {filteredCards.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: 'var(--radius-lg)' }}>
            <BookOpen size={48} style={{ color: 'var(--text-muted)', marginBottom: '14px' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--text-primary)' }}>未找到符合條件的單字</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
              可以嘗試切換左側分類、清除搜尋條件，或點擊上方「AI 萃取」快速匯入生詞！
            </p>
            <button className="btn btn-primary" onClick={onOpenAiModal}>
              <Sparkles size={16} />
              <span>開始 AI 快速匯入</span>
            </button>
          </div>
        ) : (
          <div className="compact-cards-grid">
            {filteredCards.map((card) => {
              const isSelected = selectedIds.includes(card.id);
              const st = card.lifecycle_status || 'active';
              const stage = Number(card.mastery_stage) || 1;

              // Top accent stripe & badge style
              // 待學習 / 暫存: 統一中性灰 (#dadce0)
              let accentColor = '#dadce0';
              let badgeBg = '#f1f3f4';
              let badgeBorder = '#dadce0';
              let badgeColor = '#5f6368';
              let badgeText = st === 'inbox' ? 'Inbox' : 'Ready';

              if (st === 'mastered') {
                accentColor = '#8430ce';
                badgeBg = '#f6e8ff';
                badgeBorder = '#d7aefb';
                badgeColor = '#8430ce';
                badgeText = '🏆 精通';
              } else if (st === 'active') {
                if (stage === 1) {
                  accentColor = '#ea4335';
                  badgeBg = '#fce8e6';
                  badgeBorder = '#f6aea9';
                  badgeColor = '#ea4335';
                  badgeText = 'S1 辨認';
                } else if (stage === 2) {
                  accentColor = '#1a73e8';
                  badgeBg = '#e8f0fe';
                  badgeBorder = '#aecbfa';
                  badgeColor = '#1a73e8';
                  badgeText = 'S2 回想';
                } else if (stage === 3) {
                  accentColor = '#34a853';
                  badgeBg = '#e6f4ea';
                  badgeBorder = '#a8dab5';
                  badgeColor = '#137333';
                  badgeText = 'S3 拼寫';
                } else if (stage >= 4) {
                  accentColor = '#137333';
                  badgeBg = '#ceead6';
                  badgeBorder = '#81c995';
                  badgeColor = '#0d652d';
                  badgeText = 'S4 語境';
                }
              }

              return (
                <div 
                  key={card.id} 
                  className={`word-card-compact ${isSelected ? 'selected' : ''}`}
                  style={{ '--card-accent': accentColor }}
                  onClick={() => setDetailCard(card)}
                >
                  {/* Left Controls: Checkbox & Star */}
                  <div className="card-compact-controls" onClick={e => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleToggleSelectCard(card.id, e)}
                      style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--google-blue)' }}
                    />
                    <button
                      onClick={(e) => handleToggleStar(card, e)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
                      title={card.is_starred ? "取消核心標記" : "標記為核心詞 (⭐️)"}
                    >
                      <Star 
                        size={16} 
                        fill={card.is_starred ? "var(--google-yellow)" : "none"} 
                        color={card.is_starred ? "var(--google-yellow)" : "#bdc1c6"} 
                      />
                    </button>
                  </div>

                  {/* Middle: Word & Translation */}
                  <div className="card-compact-body">
                    <div className="card-compact-word-row">
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', minWidth: 0 }}>
                        {card.article && (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem', fontWeight: 600 }}>
                            {card.article}
                          </span>
                        )}
                        <span className="card-compact-word">
                          {card.word}
                        </span>
                      </div>

                      {/* Small speaker button */}
                      <button
                        className="btn-icon"
                        style={{ width: '26px', height: '26px', padding: 0 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          playSpanishPronunciation(card.article ? `${card.article} ${card.word}` : card.word);
                        }}
                        title="發音"
                      >
                        <Volume2 size={14} />
                      </button>

                      {/* Badges */}
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        {card.gender && card.gender !== 'none' && (
                          <span className={`badge-gender ${card.gender}`} style={{ fontSize: '0.68rem', padding: '1px 5px' }}>
                            {card.gender === 'masculino' ? '♂' : '♀'}
                          </span>
                        )}
                        <span style={{
                          background: badgeBg,
                          border: `1px solid ${badgeBorder}`,
                          color: badgeColor,
                          padding: '1px 6px',
                          borderRadius: '8px',
                          fontSize: '0.68rem',
                          fontWeight: 700
                        }}>
                          {badgeText}
                        </span>
                      </div>
                    </div>

                    {/* Translation */}
                    <div className="card-compact-translation">
                      {card.translation}
                    </div>
                  </div>

                  {/* Right Actions: Edit & Delete */}
                  <div className="card-compact-actions" onClick={e => e.stopPropagation()}>
                    <button
                      className="btn-icon"
                      style={{ width: '28px', height: '28px' }}
                      onClick={() => onEdit(card)}
                      title="修改單字內容"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      className="btn-icon"
                      style={{ width: '28px', height: '28px', color: 'var(--google-red)' }}
                      onClick={() => onDelete(card.id)}
                      title="刪除"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 🔍 Word Detail Modal (Full view on click) */}
      <WordDetailModal
        card={detailCard}
        isOpen={Boolean(detailCard)}
        onClose={() => setDetailCard(null)}
        onEdit={(card) => {
          setDetailCard(null);
          onEdit(card);
        }}
        onDelete={(id) => {
          setDetailCard(null);
          onDelete(id);
        }}
        onToggleStar={handleToggleStar}
        onQuickStatusChange={handleQuickStatusChange}
      />

      {/* ℹ️ FSRS Mastery & Stages Guide Modal */}
      <MasteryGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
      />
    </div>
  );
}
