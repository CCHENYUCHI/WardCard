import React, { useState } from 'react';
import { Search } from 'lucide-react';
import WordLookupPanel from './WordLookupPanel';

export default function DictionaryView() {
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = input.trim();
    if (q) setQuery(q);
  };

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

      {query ? (
        <div className="surface-card dictionary-result">
          <WordLookupPanel key={query} word={query} />
        </div>
      ) : (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', padding: '24px 12px', lineHeight: 1.7 }}>
          先查你的單字庫與離線字典，不花 AI 額度。<br />
          找不到中文時，再按「用 AI 查中文」，查過的字會快取起來。<br />
          複習時也可以直接點例句裡的單字查詢。
        </div>
      )}
    </div>
  );
}
