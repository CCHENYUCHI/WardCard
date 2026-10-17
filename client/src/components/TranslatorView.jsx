import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Languages, Search, Trash2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { fetchAPI } from '../utils/api';
import TranslationResult from './TranslationResult';

const MAX_LENGTH = 300;
const SPANISH_SPECIAL_KEYS = ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ', '¿', '¡'];

const readError = async (res, fallback) => {
  try {
    return (await res.json()).error || fallback;
  } catch (_) {
    return fallback;
  }
};

export default function TranslatorView() {
  const [input, setInput] = useState('');
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState('');
  const [current, setCurrent] = useState(null); // { record, cached }
  const inputRef = useRef(null);

  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [query, setQuery] = useState('');
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const loadHistory = useCallback(async (q, offset = 0) => {
    setHistoryLoading(true);
    setHistoryError('');
    try {
      const params = new URLSearchParams({ q, offset: String(offset) });
      const res = await fetchAPI(`/api/translations?${params}`);
      if (!res.ok) throw new Error(await readError(res, '無法載入翻譯紀錄'));
      const data = await res.json();
      setItems(prev => (offset === 0 ? data.items : [...prev, ...data.items]));
      setHasMore(data.hasMore);
    } catch (err) {
      setHistoryError(err.message);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  // Debounced search; the first load runs immediately
  const firstLoad = useRef(true);
  useEffect(() => {
    const delay = firstLoad.current ? 0 : 300;
    firstLoad.current = false;
    const timer = setTimeout(() => loadHistory(query.trim()), delay);
    return () => clearTimeout(timer);
  }, [query, loadHistory]);

  const handleTranslate = async () => {
    const text = input.trim();
    if (!text || translating) return;
    setTranslating(true);
    setError('');
    try {
      const res = await fetchAPI('/api/translations', {
        method: 'POST',
        body: JSON.stringify({ text })
      });
      if (!res.ok) throw new Error(await readError(res, 'AI 翻譯失敗，請稍後再試'));
      const data = await res.json();
      setCurrent(data);
      setInput('');
      if (!query.trim()) {
        setItems(prev => [data.record, ...prev.filter(r => r.id !== data.record.id)]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setTranslating(false);
    }
  };

  const handleKeyDown = (e) => {
    // Enter sends, Shift+Enter adds a line; ignore Enter while an IME is composing (Chinese input)
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleTranslate();
    }
  };

  const handleInsertChar = (char) => {
    const el = inputRef.current;
    const start = el?.selectionStart ?? input.length;
    const end = el?.selectionEnd ?? input.length;
    setInput((input.slice(0, start) + char + input.slice(end)).slice(0, MAX_LENGTH));
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(start + 1, start + 1);
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('確定要刪除這筆翻譯紀錄嗎？')) return;
    try {
      const res = await fetchAPI(`/api/translations/${id}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 404) throw new Error(await readError(res, '刪除失敗'));
      setItems(prev => prev.filter(r => r.id !== id));
      if (current?.record.id === id) setCurrent(null);
    } catch (err) {
      setHistoryError(err.message);
    }
  };

  return (
    <div className="translator-view">
      <div className="surface-card translator-input-card">
        <div className="translator-heading">
          <Languages size={20} />
          <span>句子翻譯</span>
        </div>
        <textarea
          ref={inputRef}
          className="translator-input"
          value={input}
          onChange={e => setInput(e.target.value.slice(0, MAX_LENGTH))}
          onKeyDown={handleKeyDown}
          placeholder="輸入一個西語句子（也可以輸入中文），例如：Me gustaría reservar una mesa para dos."
          rows={3}
          autoFocus
          autoCapitalize="sentences"
          spellCheck={false}
          enterKeyHint="send"
          disabled={translating}
        />
        <div className="spanish-keys translator-keys">
          {SPANISH_SPECIAL_KEYS.map(char => (
            <button key={char} type="button" className="spanish-key" onClick={() => handleInsertChar(char)}>
              {char}
            </button>
          ))}
        </div>
        <div className="translator-actions">
          <span className="translator-count">{input.length}/{MAX_LENGTH} · Enter 送出、Shift+Enter 換行</span>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleTranslate}
            disabled={!input.trim() || translating}
          >
            {translating ? <span className="spinner" style={{ width: 14, height: 14 }} /> : <Sparkles size={16} />}
            <span>{translating ? '翻譯中…' : 'AI 翻譯'}</span>
          </button>
        </div>
        {error && <div className="translator-error">{error}</div>}
      </div>

      {current && (
        <div className="surface-card translator-current">
          {current.cached && <div className="translator-cached">已有紀錄，沒有使用 AI 額度</div>}
          <TranslationResult record={current.record} />
        </div>
      )}

      <div className="translator-history">
        <div className="translator-history-head">
          <h3>翻譯紀錄</h3>
          <div className="translator-search">
            <Search size={16} />
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="搜尋原句或中文"
              enterKeyHint="search"
            />
          </div>
        </div>

        {historyError && <div className="translator-error">{historyError}</div>}

        {!historyLoading && items.length === 0 && !historyError && (
          <div className="translator-empty">
            {query.trim() ? '找不到符合的紀錄' : '還沒有翻譯紀錄。翻譯過的句子會存在這裡，之後可以搜尋與複習。'}
          </div>
        )}

        <ul className="translator-list">
          {items.map(item => {
            const open = expandedId === item.id;
            return (
              <li key={item.id} className={`translator-item ${open ? 'is-open' : ''}`}>
                <div className="translator-item-row">
                  <button
                    type="button"
                    className="translator-item-main"
                    onClick={() => setExpandedId(open ? null : item.id)}
                    aria-expanded={open}
                  >
                    <span className="translator-item-text">{item.input_text}</span>
                    <span className="translator-item-zh">{item.source_lang === 'zh' ? item.spanish : item.translation_zh}</span>
                    <span className="translator-item-date">{item.created_at?.slice(0, 16)}</span>
                  </button>
                  <button type="button" className="btn-icon" onClick={() => handleDelete(item.id)} title="刪除" aria-label="刪除">
                    <Trash2 size={16} />
                  </button>
                  {open ? <ChevronUp size={18} className="translator-chevron" /> : <ChevronDown size={18} className="translator-chevron" />}
                </div>
                {open && (
                  <div className="translator-item-detail">
                    <TranslationResult record={item} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {historyLoading && <div className="translator-empty"><span className="spinner" style={{ width: 20, height: 20 }} /></div>}
        {hasMore && !historyLoading && (
          <button type="button" className="btn btn-secondary btn-sm translator-more" onClick={() => loadHistory(query.trim(), items.length)}>
            載入更多
          </button>
        )}
      </div>
    </div>
  );
}
