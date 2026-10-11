import React, { useState } from 'react';
import { fetchAPI } from '../utils/api';
import { Sparkles, Upload, FileText, Image as ImageIcon, Check, AlertCircle, X, Trash2, Edit3, ArrowRight } from 'lucide-react';

// Shrink photos before upload: phone pictures are often 5MB+, Gemini only needs ~1600px
const MAX_IMAGE_EDGE = 1600;
function compressImage(file) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => resolve(blob || file), 'image/jpeg', 0.85);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };
    img.src = url;
  });
}

const NEW_CATEGORY = '__new__';
const PRESET_CATEGORIES = ['課堂筆記', '日常生活', '旅遊會話'];
const POS_OPTIONS = [
  ['sustantivo', '名詞'], ['verbo', '動詞'], ['adjetivo', '形容詞'], ['adverbio', '副詞'], ['frase', '片語'],
  ['conjunción', '連接詞'], ['preposición', '介系詞'], ['pronombre', '代名詞'], ['interjección', '感嘆詞']
];
const GENDERED_POS = ['sustantivo', 'adjetivo'];

// First token of a verb entry ("acostumbrarse a" -> "acostumbrarse") should be an infinitive
const looksLikeInfinitive = (word) => /(ar|er|ir|ír)(se)?$/i.test((word || '').trim().split(/\s+/)[0] || '');

export default function AiImporter({ isOpen, onClose, onImportSuccess, categories }) {
  const [activeTab, setActiveTab] = useState('text'); // 'text' | 'image'
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [targetCategory, setTargetCategory] = useState('課堂筆記');
  const [newCategory, setNewCategory] = useState('');
  const [targetDele, setTargetDele] = useState('auto');

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

  const isNewCategory = targetCategory === NEW_CATEGORY;
  const effectiveCategory = isNewCategory ? newCategory.trim() : targetCategory;

  const switchTab = (tab) => {
    setActiveTab(tab);
    // A photo is usually a new lesson, so default to creating a new category for it
    if (tab === 'image') setTargetCategory(NEW_CATEGORY);
    else if (targetCategory === NEW_CATEGORY && !newCategory.trim()) setTargetCategory('課堂筆記');
  };

  const handleStartExtraction = async () => {
    setErrorMsg('');
    if (isNewCategory && !newCategory.trim()) {
      setErrorMsg('請輸入新分類的名稱！');
      return;
    }
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
      const formData = new FormData();
      formData.append('text', inputText);
      if (activeTab === 'image' && selectedFile) {
        formData.append('image', await compressImage(selectedFile), 'photo.jpg');
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
        category: effectiveCategory || c.category || '課堂筆記',
        dele_level: targetDele === 'auto' ? (c.dele_level || 'A1') : (targetDele || c.dele_level || 'A1')
      }));

      setExtractedCards(cardsWithDefaults);
      // Words already in the library start unchecked so they aren't overwritten by accident
      setSelectedIndices(new Set(cardsWithDefaults.flatMap((c, i) => (c.exists ? [] : [i]))));
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

  const handlePosChange = (index, pos) => {
    setExtractedCards(prev => {
      const updated = [...prev];
      const card = { ...updated[index], part_of_speech: pos };
      if (!GENDERED_POS.includes(pos)) {
        card.gender = 'none';
        card.article = '';
      } else if (pos === 'sustantivo' && !card.article && card.gender !== 'none') {
        card.article = card.gender === 'masculino' ? 'el' : 'la';
      } else if (pos !== 'sustantivo') {
        card.article = '';
      }
      updated[index] = card;
      return updated;
    });
  };

  // Switch a noun/adjective between masculine and feminine, using the AI's forms when available
  const handleGenderChange = (index, gender) => {
    setExtractedCards(prev => {
      const updated = [...prev];
      const card = { ...updated[index], gender };
      const targetForm = gender === 'masculino' ? card.forms?.masc_sg : gender === 'femenino' ? card.forms?.fem_sg : '';
      if (targetForm) card.word = targetForm;
      if (card.part_of_speech === 'sustantivo' && gender !== 'none') {
        // Only touch el/la; keep plural or special articles the user may have set
        if (!card.article || card.article === 'el' || card.article === 'la') {
          card.article = gender === 'masculino' ? 'el' : 'la';
        }
      }
      updated[index] = card;
      return updated;
    });
  };

  const handleSaveToDatabase = async () => {
    const cardsToSave = extractedCards
      .filter((_, idx) => selectedIndices.has(idx))
      .map(({ exists, id_temp, forms, ...card }) => card);
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
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <button
                className={`btn ${activeTab === 'text' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                onClick={() => switchTab('text')}
                type="button"
              >
                <FileText size={16} />
                <span>貼上筆記 / 文章段落</span>
              </button>
              <button
                className={`btn ${activeTab === 'image' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                onClick={() => switchTab('image')}
                type="button"
              >
                <ImageIcon size={16} />
                <span>上傳課本 / 白板照片</span>
              </button>
            </div>

            {/* Target Category defaults */}
            <div style={{ marginBottom: '16px' }}>
              <div>
                <label className="form-label">預設匯入分類</label>
                <select
                  className="form-input"
                  value={targetCategory}
                  onChange={e => setTargetCategory(e.target.value)}
                >
                  <option value={NEW_CATEGORY}>＋ 新增分類…</option>
                  {PRESET_CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  {categories.filter(c => !PRESET_CATEGORIES.includes(c) && c !== '考試必背 (DELE)').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {isNewCategory && (
                  <input
                    type="text"
                    className="form-input"
                    style={{ marginTop: '8px' }}
                    placeholder="新分類名稱，例如：第 5 課 - 家庭成員"
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    autoFocus
                    id="ai-import-new-category"
                  />
                )}
                {isNewCategory && categories.includes(newCategory.trim()) && (
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    此分類已存在，單字會加入到既有的「{newCategory.trim()}」。
                  </p>
                )}
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                AI 為您成功解析出 <strong>{extractedCards.length}</strong> 個西語單字，已勾選 <strong>{selectedIndices.size}</strong> 個，將匯入分類「<strong>{extractedCards[0]?.category}</strong>」：
              </span>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setExtractedCards([])}
              >
                重新輸入
              </button>
            </div>

            <div style={{ maxHeight: 'min(420px, 50dvh)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px' }}>
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                          {card.part_of_speech === 'sustantivo' && (
                            <select
                              className="form-input"
                              style={{ width: 'auto', padding: '4px 6px', fontSize: '0.9rem' }}
                              value={card.article}
                              onChange={e => handleFieldChange(idx, 'article', e.target.value)}
                              aria-label="冠詞"
                            >
                              <option value="">—</option>
                              <option value="el">el</option>
                              <option value="la">la</option>
                              <option value="los">los</option>
                              <option value="las">las</option>
                            </select>
                          )}
                          <input
                            type="text"
                            className="form-input"
                            style={{ width: 'auto', minWidth: 0, flex: '1 1 140px', padding: '4px 8px', fontSize: '1.1rem', fontWeight: 700 }}
                            value={card.word}
                            onChange={e => handleFieldChange(idx, 'word', e.target.value)}
                            aria-label="單字"
                          />
                          <select
                            className="form-input"
                            style={{ width: 'auto', padding: '4px 6px', fontSize: '0.85rem' }}
                            value={card.part_of_speech}
                            onChange={e => handlePosChange(idx, e.target.value)}
                            aria-label="詞性"
                          >
                            {POS_OPTIONS.map(([value, label]) => (
                              <option key={value} value={value}>{label}</option>
                            ))}
                          </select>

                          {card.exists && (
                            <span
                              title="勾選匯入會以這次的內容覆蓋原本的單字卡"
                              style={{ fontSize: '0.75rem', fontWeight: 600, padding: '2px 8px', borderRadius: '10px', background: '#fef7e0', color: '#b06000', border: '1px solid #fdd663' }}
                            >
                              已在單字庫
                            </span>
                          )}
                        </div>

                        {/* Gender picker for nouns / adjectives */}
                        {GENDERED_POS.includes(card.part_of_speech) && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                            {[
                              ['masculino', '♂ 陽性'],
                              ['femenino', '♀ 陰性'],
                              ...(card.part_of_speech === 'adjetivo' ? [['none', '⚥ 陰陽同形']] : [])
                            ].map(([value, label]) => {
                              const active = card.gender === value;
                              return (
                                <button
                                  key={value}
                                  type="button"
                                  onClick={() => handleGenderChange(idx, value)}
                                  className={active ? `badge-gender ${value}` : 'badge-gender'}
                                  style={{
                                    cursor: 'pointer',
                                    border: active ? undefined : '1px dashed var(--border-color)',
                                    background: active ? undefined : 'transparent',
                                    color: active ? undefined : 'var(--text-muted)',
                                    fontSize: '0.8rem',
                                    padding: '3px 10px'
                                  }}
                                >
                                  {label}
                                </button>
                              );
                            })}
                            {card.gender === 'none' && card.part_of_speech === 'sustantivo' && (
                              <span style={{ fontSize: '0.78rem', color: '#b06000' }}>⚠ 請選擇陰陽性</span>
                            )}
                          </div>
                        )}

                        {card.part_of_speech === 'verbo' && !looksLikeInfinitive(card.word) && (
                          <div style={{ fontSize: '0.78rem', color: '#b06000', marginBottom: '8px' }}>
                            ⚠ 看起來不是原形動詞（-ar / -er / -ir），請直接修改上方的單字
                          </div>
                        )}

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
                            <span style={{ whiteSpace: 'pre-line' }}>💡 {card.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Actions */}
            <div className="modal-footer modal-footer-split" style={{ justifyContent: 'space-between', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
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
