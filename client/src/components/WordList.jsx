import React, { useState } from 'react';
import { Search, Filter, Volume2, Edit3, Trash2, Plus, Sparkles, BookOpen } from 'lucide-react';
import { playSpanishPronunciation } from '../utils/speech';

export default function WordList({ cards, categories, onEdit, onDelete, onOpenAddModal, onOpenAiModal }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDele, setSelectedDele] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredCards = cards.filter((card) => {
    // Search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchWord = card.word.toLowerCase().includes(q);
      const matchTrans = card.translation.toLowerCase().includes(q);
      const matchNotes = (card.notes || '').toLowerCase().includes(q);
      if (!matchWord && !matchTrans && !matchNotes) return false;
    }

    // Category
    if (selectedCategory !== 'all' && card.category !== selectedCategory) {
      return false;
    }

    // DELE level
    if (selectedDele !== 'all' && card.dele_level !== selectedDele) {
      return false;
    }

    // Status
    if (selectedStatus === 'learned' && card.repetition === 0) return false;
    if (selectedStatus === 'new' && card.repetition > 0) return false;

    return true;
  });

  return (
    <div>
      {/* Top Filter Bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="搜尋單字、中文釋義、文法重點..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            id="wordlist-search-input"
          />
        </div>

        {/* Category filter */}
        <select
          className="select-custom"
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          id="wordlist-category-filter"
        >
          <option value="all">所有分類</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* DELE filter */}
        <select
          className="select-custom"
          value={selectedDele}
          onChange={e => setSelectedDele(e.target.value)}
        >
          <option value="all">所有 DELE 等級</option>
          <option value="A1">A1</option>
          <option value="A2">A2</option>
          <option value="B1">B1</option>
          <option value="B2">B2</option>
          <option value="C1">C1</option>
        </select>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
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

      {/* Counter summary */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
        <span>共找到 <strong>{filteredCards.length}</strong> 個西語單字</span>
        <span style={{ fontSize: '0.8rem' }}>點擊喇叭可聆聽原生發音</span>
      </div>

      {/* Cards Grid */}
      {filteredCards.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <BookOpen size={48} style={{ color: 'var(--text-muted)', marginBottom: '14px' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>未找到符合條件的單字</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
            您可以清除搜尋條件，或是使用 AI 快速拍照萃取課堂生詞！
          </p>
          <button className="btn btn-primary" onClick={onOpenAiModal}>
            <Sparkles size={16} />
            <span>開始 AI 快速匯入</span>
          </button>
        </div>
      ) : (
        <div className="cards-grid">
          {filteredCards.map((card) => (
            <div key={card.id} className="word-card-item">
              <div>
                {/* Header badges */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span className="badge-dele">{card.dele_level || 'A2'}</span>
                    <span className="badge-category">{card.category}</span>
                    {card.gender && card.gender !== 'none' && (
                      <span className={`badge-gender ${card.gender}`}>
                        {card.gender === 'masculino' ? '♂ 陽性' : '♀ 陰性'}
                      </span>
                    )}
                  </div>
                  <span className="badge-pos">{card.part_of_speech}</span>
                </div>

                {/* Word & Pronunciation */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    {card.article && (
                      <span style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 600 }}>{card.article}</span>
                    )}
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>
                      {card.word}
                    </span>
                  </div>
                  <button
                    className="btn-icon"
                    style={{ width: '32px', height: '32px' }}
                    onClick={() => playSpanishPronunciation(card.article ? `${card.article} ${card.word}` : card.word)}
                    title="播放西語發音"
                  >
                    <Volume2 size={16} />
                  </button>
                </div>

                {/* Translation */}
                <div style={{ color: '#38bdf8', fontWeight: 600, fontSize: '1.05rem', marginBottom: '10px' }}>
                  {card.translation}
                </div>

                {/* Example sentence */}
                {card.example_es && (
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '8px 10px', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '8px' }}>
                    <div style={{ color: '#e2e8f0', marginBottom: '2px' }}>{card.example_es}</div>
                    {card.example_zh && <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{card.example_zh}</div>}
                  </div>
                )}

                {/* Grammar Notes */}
                {card.notes && (
                  <div style={{ fontSize: '0.8rem', color: '#fde68a', background: 'rgba(245, 158, 11, 0.08)', padding: '6px 10px', borderRadius: '6px' }}>
                    💡 {card.notes}
                  </div>
                )}
              </div>

              {/* Card Footer: SRS status and edit/delete */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-color)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <span>熟練度: {card.repetition || 0} 次</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    className="btn-icon"
                    style={{ width: '28px', height: '28px' }}
                    onClick={() => onEdit(card)}
                    title="編輯單字"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    className="btn-icon"
                    style={{ width: '28px', height: '28px', color: '#f87171' }}
                    onClick={() => onDelete(card.id)}
                    title="刪除單字"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
