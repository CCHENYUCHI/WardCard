import React, { useState } from 'react';
import { fetchAPI } from '../utils/api';
import { Sparkles, Upload, FileText, Image as ImageIcon, Check, AlertCircle, X, Trash2, Edit3, ArrowRight } from 'lucide-react';

export default function AiImporter({ isOpen, onClose, onImportSuccess, categories }) {
  const [activeTab, setActiveTab] = useState('text'); // 'text' | 'image'
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [targetCategory, setTargetCategory] = useState('課堂筆記');
  const [targetDele, setTargetDele] = useState('A2');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [extractedCards, setExtractedCards] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState(new Set());

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleStartExtraction = async () => {
    setErrorMsg('');
    if (activeTab === 'text' && !inputText.trim()) {
      setErrorMsg('請先貼上課堂筆記、文章段落或生詞清單！');
      return;
    }
    if (activeTab === 'image' && !selectedFile) {
      setErrorMsg('請先選擇上傳上課講義或白板照片！');
      return;
    }

    setIsLoading(true);

    try {
      const apiKey = localStorage.getItem('gemini_api_key') || '';
      const formData = new FormData();
      formData.append('text', inputText);
      formData.append('apiKey', apiKey);
      if (activeTab === 'image' && selectedFile) {
        formData.append('image', selectedFile);
      }

      const res = await fetchAPI('/api/ai/extract', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'AI 萃取失敗，請確認 API Key 或文字內容');
      }

      const cardsWithDefaults = data.cards.map((c, idx) => ({
        ...c,
        id_temp: idx,
        category: targetCategory || c.category || '課堂筆記',
        dele_level: c.dele_level || targetDele || 'A2'
      }));

      setExtractedCards(cardsWithDefaults);
      setSelectedIndices(new Set(cardsWithDefaults.map((_, i) => i)));
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelectCard = (index) => {
    setSelectedIndices(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleFieldChange = (index, field, value) => {
    setExtractedCards(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSaveToDatabase = async () => {
    const cardsToSave = extractedCards.filter((_, idx) => selectedIndices.has(idx));
    if (cardsToSave.length === 0) {
      setErrorMsg('請至少勾選一個要匯入的單字卡！');
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetchAPI('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cardsToSave)
      });

      if (!res.ok) throw new Error('儲存至單字庫失敗');

      onImportSuccess(cardsToSave.length);
      onClose();
      // Reset state
      setExtractedCards([]);
      setInputText('');
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '850px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--google-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={20} color="#fff" />
            </div>
            <div>
              <h2 className="modal-title">AI 快速西語萃取與建卡</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                貼上課堂筆記、文章或拍照白板，AI 自動分析陰陽性、冠詞、例句與文法說明！
              </p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        {errorMsg && (
          <div style={{ padding: '12px 16px', background: 'var(--google-red-light)', border: '1px solid #f6aea9', borderRadius: 'var(--radius-md)', color: 'var(--google-red)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} />
            <span style={{ fontSize: '0.88rem' }}>{errorMsg}</span>
          </div>
        )}

        {/* Step 1: Input Mode (Only if no extracted cards yet) */}
        {extractedCards.length === 0 ? (
          <div>
            {/* Input Type Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <button
                className={`btn ${activeTab === 'text' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                onClick={() => setActiveTab('text')}
                type="button"
              >
                <FileText size={16} />
                <span>貼上筆記 / 文章段落</span>
              </button>
              <button
                className={`btn ${activeTab === 'image' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                onClick={() => setActiveTab('image')}
                type="button"
              >
                <ImageIcon size={16} />
                <span>上傳課本 / 白板照片</span>
              </button>
            </div>

            {/* Target Category & DELE level defaults */}
            <div className="form-row" style={{ marginBottom: '16px' }}>
              <div>
                <label className="form-label">預設匯入分類</label>
                <select
                  className="form-input"
                  value={targetCategory}
                  onChange={e => setTargetCategory(e.target.value)}
                >
                  <option value="課堂筆記">課堂筆記</option>
                  <option value="考試必背 (DELE)">考試必背 (DELE)</option>
                  <option value="日常生活">日常生活</option>
                  <option value="旅遊會話">旅遊會話</option>
                  {categories.filter(c => !['課堂筆記', '考試必背 (DELE)', '日常生活', '旅遊會話'].includes(c)).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">預設 DELE 等級</label>
                <select
                  className="form-input"
                  value={targetDele}
                  onChange={e => setTargetDele(e.target.value)}
                >
                  <option value="A1">A1 (入門)</option>
                  <option value="A2">A2 (初級)</option>
                  <option value="B1">B1 (中級)</option>
                  <option value="B2">B2 (中高級)</option>
                  <option value="C1">C1 (高級)</option>
                </select>
              </div>
            </div>

            {/* Text Input Tab */}
            {activeTab === 'text' && (
              <div className="form-group">
                <label className="form-label">請在此貼上西語課堂筆記、文章或生詞清單：</label>
                <textarea
                  className="form-textarea"
                  style={{ minHeight: '160px' }}
                  placeholder="例如：
Hoy en clase aprendimos:
- la costumbre: 習俗
- el problema: 常考陽性名詞
- acostumbrarse a: 習慣於
或者是整段西語閱讀短文，AI 都會自動抓出核心單字並補齊例句與陰陽性！"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  id="ai-import-textarea"
                />
              </div>
            )}

            {/* Image Upload Tab */}
            {activeTab === 'image' && (
              <div className="form-group">
                <label className="dropzone">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  {previewUrl ? (
                    <div>
                      <img src={previewUrl} alt="Preview" style={{ maxHeight: '180px', borderRadius: '8px', objectFit: 'contain' }} />
                      <p style={{ marginTop: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        點擊更換照片 ({selectedFile?.name})
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Upload size={36} style={{ color: 'var(--accent-primary)', marginBottom: '8px' }} />
                      <p style={{ fontWeight: 600 }}>點擊或拖曳上傳教材照片</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>支援 JPG, PNG, WebP (白板筆記、講義皆可)</p>
                    </div>
                  )}
                </label>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                className="btn btn-ai"
                onClick={handleStartExtraction}
                disabled={isLoading}
                id="btn-trigger-ai"
              >
                {isLoading ? (
                  <>
                    <span className="spinner" />
                    <span>AI 正在深入分析西語生詞中...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>開始 AI 結構化萃取</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Step 2: Extracted Cards Review & Edit */
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                AI 為您成功解析出 <strong>{extractedCards.length}</strong> 個西語單字，已勾選 <strong>{selectedIndices.size}</strong> 個：
              </span>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setExtractedCards([])}
              >
                重新輸入
              </button>
            </div>

            <div style={{ maxHeight: '420px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px' }}>
              {extractedCards.map((card, idx) => {
                const isSelected = selectedIndices.has(idx);
                return (
                  <div
                    key={idx}
                    style={{
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'var(--google-blue-light)' : '#ffffff',
                      border: `1px solid ${isSelected ? '#aecbfa' : 'var(--border-color)'}`,
                      opacity: isSelected ? 1 : 0.7,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectCard(idx)}
                        style={{ marginTop: '5px', width: '18px', height: '18px', cursor: 'pointer' }}
                      />

                      <div style={{ flex: 1 }}>
                        {/* Word + Article + Gender Row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
                          {card.article && (
                            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{card.article}</span>
                          )}
                          <strong style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>{card.word}</strong>

                          {card.gender && card.gender !== 'none' && (
                            <span className={`badge-gender ${card.gender}`}>
                              {card.gender === 'masculino' ? '♂ 陽性 (el)' : '♀ 陰性 (la)'}
                            </span>
                          )}

                          <span className="badge-pos">{card.part_of_speech}</span>
                          <span className="badge-dele">{card.dele_level || 'A2'}</span>
                        </div>

                        {/* Translation input */}
                        <div style={{ marginBottom: '8px' }}>
                          <input
                            type="text"
                            className="form-input"
                            style={{ padding: '6px 10px', fontSize: '0.9rem' }}
                            value={card.translation}
                            onChange={(e) => handleFieldChange(idx, 'translation', e.target.value)}
                            placeholder="中文釋義"
                          />
                        </div>

                        {/* Example sentence */}
                        {card.example_es && (
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '4px', fontWeight: 500 }}>
                            🇪🇸 {card.example_es}
                          </div>
                        )}
                        {card.example_zh && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                            🇹🇼 {card.example_zh}
                          </div>
                        )}

                        {/* Grammar notes */}
                        {card.notes && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--google-yellow-dark)', background: 'var(--google-yellow-light)', border: '1px solid #fce8b2', padding: '6px 10px', borderRadius: '6px' }}>
                            💡 {card.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                將自動套用 FSRS 記憶曲線與待學推薦
              </span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-secondary" onClick={() => setExtractedCards([])}>
                  取消重新萃取
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSaveToDatabase}
                  disabled={isLoading || selectedIndices.size === 0}
                  id="btn-confirm-import"
                >
                  {isLoading ? (
                    <>
                      <span className="spinner" />
                      <span>正在批次存入資料庫...</span>
                    </>
                  ) : (
                    <>
                      <Check size={18} />
                      <span>確認匯入 {selectedIndices.size} 個單字</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
