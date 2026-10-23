import React, { useCallback, useState } from 'react';
import { Search } from 'lucide-react';
import WordLookupPanel from './WordLookupPanel';
import LookupHistory from './LookupHistory';
import { forgetLookup } from '../utils/dictionary';

export default function DictionaryView() {
  const [input, setInput] = useState('');
  const [search, setSearch] = useState(null); // { q, n }: n remounts the panel when the same word is searched again
  const [historyVersion, setHistoryVersion] = useState(0);

  const runSearch = (q) => {
    forgetLookup(q);
    setSearch(prev => ({ q, n: (prev?.n || 0) + 1 }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = input.trim();
    if (q) runSearch(q);
  };

  const handleSelectFromHistory = (word) => {
    setInput(word);
    runSearch(word);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const refreshHistory = useCallback(() => setHistoryVersion(v => v + 1), []);

  return (
    <div className="dictionary-view">
      <form className="dictionary-search" onSubmit={handleSubmit}>
        <Search size={20} className="search-icon" />
        <input
          type="search"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="查西語單字或變化形（fui、hablamos），也可以輸入中文"
          autoFocus
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="search"
        />
        <button type="submit" className="btn btn-primary btn-sm" disabled={!input.trim()}>查詞</button>
      </form>

      {search ? (
        <div className="surface-card dictionary-result">
          <WordLookupPanel key={`${search.q}|${search.n}`} word={search.q} origin="dictionary" onUpdate={refreshHistory} />
        </div>
      ) : (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', padding: '24px 12px', lineHeight: 1.7 }}>
          先查你的單字庫與離線字典，不花 AI 額度。<br />
          找不到中文時，再按「用 AI 查中文」，查過的字會快取起來。<br />
          複習時也可以直接點例句裡的單字查詢。
        </div>
      )}

      <LookupHistory version={historyVersion} onSelect={handleSelectFromHistory} />
    </div>
  );
}
