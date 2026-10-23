import React, { useCallback, useEffect, useRef, useState } from 'react';
import { History, Search, Trash2, Plus } from 'lucide-react';
import { fetchLookupHistory, deleteLookup, clearLookupHistory, STATUS_LABELS } from '../utils/dictionary';
import { normalizeAnswer, stripAccents } from '../utils/spanish';

const sameWord = (a, b) => stripAccents(normalizeAnswer(a)) === stripAccents(normalizeAnswer(b));
const SOURCE_LABELS = { dictionary: '查詞', tap: '點字' };
const SORTS = [['recent', '最近'], ['count', '最常查']];
const HOT_COUNT = 3; // looked up this many times: probably worth learning

/**
 * The user's lookup history on the dictionary page, one row per word.
 *
 * @param {number} version - Bumped by the parent after a lookup, so the list reloads
 * @param {(word: string) => void} onSelect - Look the word up again (also how "加入" works)
 */
export default function LookupHistory({ version, onSelect }) {
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [sort, setSort] = useState('recent');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const requestId = useRef(0);

  const load = useCallback(async (offset = 0) => {
    const id = ++requestId.current;
    setLoading(true);
    setError('');
    try {
      const data = await fetchLookupHistory({ q: debouncedQuery, sort, offset });
      if (id !== requestId.current) return; // a newer search or sort won
      setItems(prev => (offset === 0 ? data.items : [...prev, ...data.items]));
      setHasMore(data.hasMore);
      setTotal(data.total);
    } catch (err) {
      if (id === requestId.current) setError(err.message);
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, [debouncedQuery, sort]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => { load(0); }, [load, version]);

  const handleDelete = async (id) => {
    try {
      await deleteLookup(id);
      setItems(prev => prev.filter(r => r.id !== id));
      setTotal(t => Math.max(0, t - 1));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleClear = async () => {
    if (!window.confirm('確定要清除全部查詢紀錄嗎？')) return;
    try {
      await clearLookupHistory();
      setItems([]);
      setHasMore(false);
      setTotal(0);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="lookup-history">
      <div className="lookup-history-head">
        <h3><History size={18} /> 查詢紀錄{total > 0 && <span className="lookup-history-total">{total} 個字</span>}</h3>
        <div className="lookup-history-controls">
          <div className="translator-search lookup-history-search">
            <Search size={16} />
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="搜尋單字或中文"
              enterKeyHint="search"
            />
          </div>
          <div className="lookup-history-sort" role="group" aria-label="排序">
            {SORTS.map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={`status-pill-tab ${sort === key ? 'active' : ''}`}
                onClick={() => setSort(key)}
                aria-pressed={sort === key}
              >
                {label}
              </button>
            ))}
          </div>
          {items.length > 0 && !debouncedQuery && (
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleClear}>清除全部</button>
          )}
        </div>
      </div>

      {error && <div className="translator-error">{error}</div>}

      {!loading && items.length === 0 && !error && (
        <div className="translator-empty">
          {debouncedQuery
            ? '找不到符合的紀錄'
            : '還沒有查詢紀錄。在這裡查的字、複習或翻譯時點例句查的字都會記下來，切到「最常查」就能看出哪些字一直記不住。'}
        </div>
      )}

      <ul className="lookup-history-list">
        {items.map(item => {
          const showLemma = item.lemma && !sameWord(item.lemma, item.query);
          return (
            <li key={item.id} className="lookup-history-item">
              <button type="button" className="lookup-history-main" onClick={() => onSelect(item.query)} title="再查一次">
                <span className="lookup-history-word">
                  {item.query}
                  {showLemma && <span className="lookup-history-lemma">→ {item.lemma}</span>}
                </span>
                {item.translation && <span className="lookup-history-zh">{item.translation}</span>}
                <span className="lookup-history-meta">
                  {item.last_at?.slice(0, 16)} · {SOURCE_LABELS[item.last_source] || item.last_source}
                </span>
              </button>
              <span
                className={`lookup-history-count ${item.lookup_count >= HOT_COUNT ? 'is-hot' : ''}`}
                title={`查過 ${item.lookup_count} 次，第一次：${item.first_at?.slice(0, 16)}`}
              >
                ×{item.lookup_count}
              </span>
              {item.lifecycle_status ? (
                <span className="badge-subtle lookup-history-status">{STATUS_LABELS[item.lifecycle_status] || item.lifecycle_status}</span>
              ) : (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm lookup-history-add"
                  onClick={() => onSelect(item.query)}
                  title="打開查詢結果，再按「加入單字庫」"
                >
                  <Plus size={14} /> 加入
                </button>
              )}
              <button type="button" className="btn-icon" onClick={() => handleDelete(item.id)} title="刪除" aria-label="刪除">
                <Trash2 size={16} />
              </button>
            </li>
          );
        })}
      </ul>

      {loading && items.length === 0 && <div className="translator-empty"><span className="spinner" style={{ width: 20, height: 20 }} /></div>}
      {hasMore && (
        <button type="button" className="btn btn-secondary btn-sm translator-more" onClick={() => load(items.length)} disabled={loading}>
          {loading ? '載入中…' : '載入更多'}
        </button>
      )}
    </section>
  );
}
