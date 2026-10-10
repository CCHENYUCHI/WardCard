import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

export default function WordModal({ isOpen, onClose, onSave, initialData, categories }) {
  const [formData, setFormData] = useState({
    word: '',
    article: '',
    gender: 'none',
    part_of_speech: 'sustantivo',
    translation: '',
    example_es: '',
    example_zh: '',
    notes: '',
    category: '日常生活',
    curriculum_unit: '',
    lifecycle_status: 'ready',
    is_starred: 0,
    dele_level: 'A2'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        curriculum_unit: initialData.curriculum_unit || initialData.category || '',
        lifecycle_status: initialData.lifecycle_status || 'active',
        is_starred: initialData.is_starred ? 1 : 0
      });
    } else {
      setFormData({
        word: '',
        article: '',
        gender: 'none',
        part_of_speech: 'sustantivo',
        translation: '',
        example_es: '',
        example_zh: '',
        notes: '',
        category: '日常生活',
        curriculum_unit: '',
        lifecycle_status: 'ready',
        is_starred: 0,
        dele_level: 'A2'
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.word.trim() || !formData.translation.trim()) return;
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {initialData ? '編輯西語單字' : '手動新增西語單字'}
          </h2>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Word, Article, Gender */}
          <div className="form-row">
            <div style={{ flex: 1 }}>
              <label className="form-label">冠詞 (可選)</label>
              <input
                type="text"
                className="form-input"
                placeholder="el / la / los / las"
                value={formData.article}
                onChange={e => setFormData({ ...formData, article: e.target.value })}
              />
            </div>
            <div style={{ flex: 2 }}>
              <label className="form-label">西語單字 *</label>
              <input
                type="text"
                className="form-input"
                placeholder="例如: costumbre, desarrollar"
                required
                value={formData.word}
                onChange={e => setFormData({ ...formData, word: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div>
              <label className="form-label">陰陽性標籤</label>
              <select
                className="form-input"
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="none">無陰陽性 (動詞/副詞)</option>
                <option value="masculino">♂ 陽性名詞 (el / un)</option>
                <option value="femenino">♀ 陰性名詞 (la / una)</option>
                <option value="invariable">陰陽同形 / 中性</option>
              </select>
            </div>
            <div>
              <label className="form-label">詞性 (Parte de la oración)</label>
              <select
                className="form-input"
                value={formData.part_of_speech}
                onChange={e => setFormData({ ...formData, part_of_speech: e.target.value })}
              >
                <option value="sustantivo">名詞 (sustantivo)</option>
                <option value="verbo">動詞 (verbo)</option>
                <option value="adjetivo">形容詞 (adjetivo)</option>
                <option value="adverbio">副詞 (adverbio)</option>
                <option value="frase">片語 / 短語 (frase)</option>
                <option value="preposición">介系詞 (preposición)</option>
              </select>
            </div>
          </div>

          {/* Translation */}
          <div className="form-group">
            <label className="form-label">繁體中文釋義 *</label>
            <input
              type="text"
              className="form-input"
              placeholder="例如: 習慣、習俗"
              required
              value={formData.translation}
              onChange={e => setFormData({ ...formData, translation: e.target.value })}
            />
          </div>

          {/* Category & DELE */}
          <div className="form-row">
            <div>
              <label className="form-label">分類標籤</label>
              <input
                type="text"
                className="form-input"
                list="category-suggestions"
                placeholder="例如: 考試必背 (DELE) 或 日常生活"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              />
              <datalist id="category-suggestions">
                {categories.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>
            <div>
              <label className="form-label">課本單元 / 章節 (可選)</label>
              <input
                type="text"
                className="form-input"
                placeholder="例如: Capítulo 1 或 課堂筆記"
                value={formData.curriculum_unit}
                onChange={e => setFormData({ ...formData, curriculum_unit: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">DELE 等級</label>
              <select
                className="form-input"
                value={formData.dele_level}
                onChange={e => setFormData({ ...formData, dele_level: e.target.value })}
              >
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
                <option value="C2">C2</option>
              </select>
            </div>
          </div>

          {/* Lifecycle Status & Star */}
          <div className="form-row" style={{ background: '#f8f9fa', border: '1px solid var(--border-color)', padding: '12px 14px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
            <div style={{ flex: 2 }}>
              <label className="form-label">排程狀態 (Status)</label>
              <select
                className="form-input"
                value={formData.lifecycle_status}
                onChange={e => setFormData({ ...formData, lifecycle_status: e.target.value })}
              >
                <option value="ready">🎯 待學核心 (Ready - 排隊等待推薦)</option>
                <option value="active">⚡ 立即激活 (Active - 加入今日排程)</option>
                <option value="inbox">📥 隨手暫存 (Inbox - 零壓力不排程)</option>
              </select>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', paddingTop: '22px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--google-yellow-dark)', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={Boolean(formData.is_starred)}
                  onChange={e => setFormData({ ...formData, is_starred: e.target.checked ? 1 : 0 })}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <span>⭐️ 標記為核心詞</span>
              </label>
            </div>
          </div>

          {/* Example Sentences */}
          <div className="form-group">
            <label className="form-label">西語道地例句</label>
            <input
              type="text"
              className="form-input"
              placeholder="例如: Es una costumbre típica en España cenar tarde."
              value={formData.example_es}
              onChange={e => setFormData({ ...formData, example_es: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">例句中文翻譯</label>
            <input
              type="text"
              className="form-input"
              placeholder="例如: 在西班牙晚吃晚餐是一種典型習俗。"
              value={formData.example_zh}
              onChange={e => setFormData({ ...formData, example_zh: e.target.value })}
            />
          </div>

          {/* Grammar & Usage Notes */}
          <div className="form-group">
            <label className="form-label">💡 文法筆記、動詞變化或搭配詞說明</label>
            <textarea
              className="form-textarea"
              placeholder="例如: -umbre 結尾皆為陰性名詞；固定搭配介系詞 a..."
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="btn btn-primary" id="btn-save-card">
              <Check size={18} />
              <span>儲存單字</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
