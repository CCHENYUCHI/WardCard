import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Check, X, ArrowRight, RotateCw, Filter, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSpanishPronunciation } from '../utils/speech';

const SPANISH_SPECIAL_KEYS = ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ', '¿', '¡'];

const stripArticle = (str) => {
  const articles = ['el ', 'la ', 'los ', 'las ', 'un ', 'una ', 'unos ', 'unas '];
  for (let article of articles) {
    if (str.startsWith(article)) {
      return str.substring(article.length).trim();
    }
  }
  return str;
};

// Handle cases like "bonito/a", "profesor/a", "niño(a)", and "el profesor / la profesora"
const getAcceptableAnswers = (word) => {
  const lowercaseWord = word.toLowerCase().trim();
  const answers = [lowercaseWord, stripArticle(lowercaseWord)];

  // Case 1: Split by "/" if it looks like two full words e.g., "el profesor / la profesora" or "chico/chica"
  // but NOT if it's just "bonito/a".
  const slashParts = lowercaseWord.split('/');
  if (slashParts.length > 1) {
    if (slashParts[1].trim() === 'a') {
      // It's the "bonito/a" or "trabajador/a" shorthand case
      const base = stripArticle(slashParts[0].trim());
      answers.push(base);
      if (base.endsWith('o')) {
        answers.push(base.slice(0, -1) + 'a'); // bonito -> bonita
      } else {
        answers.push(base + 'a'); // trabajador -> trabajadora
      }
    } else {
      // It's the "el profesor / la profesora" case
      for (let part of slashParts) {
        const p = part.trim();
        answers.push(p);
        answers.push(stripArticle(p));
      }
    }
  }

  // Case 2: Parentheses e.g. "niño(a)" or "profesor(a)"
  const parenMatch = lowercaseWord.match(/^(.*?)\(a\)$/);
  if (parenMatch) {
    const base = stripArticle(parenMatch[1].trim());
    answers.push(base);
    if (base.endsWith('o')) {
      answers.push(base.slice(0, -1) + 'a');
    } else {
      answers.push(base + 'a');
    }
  }

  return answers;
};

export default function SpellingReview({ allCards, dueCards, onReview, categories, onRefresh }) {
  const [quizCards, setQuizCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [status, setStatus] = useState('typing'); // 'typing', 'correct', 'incorrect'
  const [showAnswer, setShowAnswer] = useState(false);
  const [showOnlyDue, setShowOnlyDue] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newQuizCards = allCards.filter(c => {
      const passCategory = selectedCategory === 'all' || c.category === selectedCategory;
      const passDue = showOnlyDue ? (c.repetition === 0 || c.due_date <= nowStr) : true;
      return passCategory && passDue;
    });
    
    setQuizCards(newQuizCards);
    setCurrentIndex(0);
    setUserInput('');
    setStatus('typing');
    setShowAnswer(false);
    setIsCompleted(false);
  }, [selectedCategory, showOnlyDue, allCards.length]);

  const currentCard = quizCards[currentIndex];

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, status]);

  const targetWord = currentCard ? currentCard.word.trim().toLowerCase() : '';

  const handleInsertChar = (char) => {
    if (!inputRef.current) return;
    const start = inputRef.current.selectionStart || userInput.length;
    const end = inputRef.current.selectionEnd || userInput.length;
    const nextVal = userInput.substring(0, start) + char + userInput.substring(end);
    setUserInput(nextVal);

    setTimeout(() => {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(start + 1, start + 1);
    }, 10);
  };

  const handleCheck = async (e) => {
    e?.preventDefault();
    if (!currentCard || !userInput.trim()) return;

    if (status === 'correct' || status === 'incorrect') {
      handleSkipOrNext();
      return;
    }

    const rawInput = userInput.trim().toLowerCase();
    const inputStripped = stripArticle(rawInput);
    
    // Get all valid variations for the target word
    const validAnswers = getAcceptableAnswers(targetWord);
    
    // It's a match if the stripped input is in the valid answers, 
    // OR if they typed the exact raw string (like "la manzana" or "bonito/a")
    const isMatch = validAnswers.includes(inputStripped) || rawInput === targetWord;

    if (isMatch) {
      setStatus('correct');
      playSpanishPronunciation(currentCard.word);
      onReview(currentCard.id, 4, 'spelling').catch(console.error);
    } else {
      setStatus('incorrect');
      onReview(currentCard.id, 1, 'spelling').catch(console.error);
    }
  };

  const handleSkipOrNext = () => {
    if (currentIndex + 1 < quizCards.length) {
      setCurrentIndex(prev => prev + 1);
      setUserInput('');
      setStatus('typing');
      setShowAnswer(false);
    } else {
      setIsCompleted(true);
    }
  };

  if (quizCards.length === 0 || isCompleted) {
    return (
      <div className="glass-card" style={{ maxWidth: '640px', margin: '40px auto', textAlign: 'center', padding: '50px 30px' }}>
        <div style={{ fontSize: '50px', marginBottom: '16px' }}>🏆</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '10px' }}>
          {quizCards.length === 0 ? '目前沒有待複習的單字！' : '太棒了！拼字測驗全部通關！'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          透過打字加深拼字記憶，尤其是西語重音符號（Tilde）掌握得很好！
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={onRefresh}>
            <RotateCw size={16} />
            <span>重新測驗一輪</span>
          </button>
        </div>
      </div>
    );
  }

  // Example with masked word
  const maskedExample = currentCard.example_es
    ? currentCard.example_es.replace(new RegExp(currentCard.word, 'gi'), '_______')
    : null;

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      {/* Filter and stats */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={18} style={{ color: 'var(--text-muted)' }} />
            <select
              className="select-custom"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              id="spelling-category-filter"
            >
              <option value="all">所有分類</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={showOnlyDue} 
              onChange={e => setShowOnlyDue(e.target.checked)} 
              style={{ accentColor: 'var(--accent-primary)' }}
            />
            只顯示待複習
          </label>
        </div>

        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          進度: <strong>{currentIndex + 1}</strong> / {quizCards.length}
        </div>
      </div>

      <div className="glass-card spelling-box">
        {/* Badges */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
          <span className="badge-dele">{currentCard.dele_level || 'A2'}</span>
          <span className="badge-category">{currentCard.category}</span>
          {currentCard.gender && currentCard.gender !== 'none' && (
            <span className={`badge-gender ${currentCard.gender}`}>
              {currentCard.gender === 'masculino' ? '♂ 陽性 (el)' : '♀ 陰性 (la)'}
            </span>
          )}
          <span className="badge-pos">{currentCard.part_of_speech}</span>
        </div>

        {/* Translation Question Prompt */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
            請輸入對應的西班牙語單字（注意重音）：
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 800, color: '#f8fafc' }}>
            {currentCard.translation}
          </div>
        </div>

        {/* Masked Example Hint */}
        {maskedExample && (
          <div className="example-box" style={{ marginBottom: '22px', textAlign: 'left' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>例句提示：</div>
            <div className="example-es">{maskedExample}</div>
            {currentCard.example_zh && <div className="example-zh">{currentCard.example_zh}</div>}
          </div>
        )}

        {/* Audio helper button */}
        <div style={{ marginBottom: '16px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => playSpanishPronunciation(currentCard.word)}
            type="button"
            title="聽真人發音提示"
          >
            <Volume2 size={16} />
            <span>聽發音提示</span>
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleCheck} style={{ marginBottom: '14px' }}>
          <input
            ref={inputRef}
            type="text"
            className={`spelling-input ${status === 'correct' ? 'correct' : status === 'incorrect' ? 'incorrect' : ''}`}
            placeholder="在此輸入西語單字..."
            value={userInput}
            onChange={(e) => {
              setUserInput(e.target.value);
              if (status !== 'typing') setStatus('typing');
            }}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck="false"
            id="spelling-text-input"
          />

          {/* Spanish Special Characters Keyboard */}
          <div className="accents-toolbar">
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginRight: '4px' }}>西語重音點擊輸入:</span>
            {SPANISH_SPECIAL_KEYS.map((char) => (
              <button
                key={char}
                type="button"
                className="accent-key"
                onClick={() => handleInsertChar(char)}
              >
                {char}
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '16px' }}>
            <button type="submit" className="btn btn-primary" id="btn-spelling-submit">
              <Check size={18} />
              <span>送出檢查 (Enter)</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowAnswer(prev => !prev)}
            >
              <Eye size={16} />
              <span>{showAnswer ? '隱藏答案' : '看答案'}</span>
            </button>
          </div>
        </form>

        {/* Feedback Area */}
        {status === 'correct' && (
          <div style={{ marginTop: '16px', padding: '14px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ color: 'var(--success)', fontWeight: 700, fontSize: '1.2rem', marginBottom: '6px' }}>
              ✓ 答對了！¡Excelente!
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleSkipOrNext}
              style={{ marginTop: '10px' }}
            >
              下一題 (Enter) <ArrowRight size={14} />
            </button>
          </div>
        )}

        {status === 'incorrect' && (
          <div style={{ marginTop: '16px', padding: '14px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ color: 'var(--danger)', fontWeight: 700, marginBottom: '6px' }}>
              拼法不太對喔，再試試看！
            </div>
            <div style={{ fontSize: '0.95rem' }}>
              正確拼法是：<strong style={{ color: '#38bdf8', fontSize: '1.2rem' }}>{currentCard.word}</strong>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleSkipOrNext}
              style={{ marginTop: '10px' }}
            >
              下一題 (Enter) <ArrowRight size={14} />
            </button>
          </div>
        )}

        {showAnswer && status !== 'incorrect' && (
          <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(59, 130, 246, 0.12)', borderRadius: 'var(--radius-md)' }}>
            答案是：<strong style={{ color: '#38bdf8', fontSize: '1.2rem' }}>{currentCard.article ? `${currentCard.article} ` : ''}{currentCard.word}</strong>
          </div>
        )}
      </div>
    </div>
  );
}
