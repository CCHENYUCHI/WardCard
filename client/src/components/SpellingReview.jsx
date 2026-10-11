import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Check, X, ArrowRight, RotateCw, Filter, Eye, Shuffle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSpanishPronunciation } from '../utils/speech';
import { shuffleArray } from '../utils/shuffle';
import { stripArticle, normalizeAnswer, getAcceptableAnswers } from '../utils/spanish';

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
      const passDue = showOnlyDue ? (!c.due_date || c.due_date <= nowStr) : true;
      return passCategory && passDue;
    });
    
    // Randomize quiz cards order
    setQuizCards(shuffleArray(newQuizCards));
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

  const handleCheck = async (e) => {
    e?.preventDefault();
    if (!currentCard || !userInput.trim()) return;

    if (status === 'correct' || status === 'incorrect') {
      handleSkipOrNext();
      return;
    }

    const rawInput = userInput.trim().toLowerCase();
    const inputStripped = normalizeAnswer(stripArticle(rawInput));
    
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
      <div className="review-toolbar">
        <div className="review-toolbar-controls">
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
          <button
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', fontSize: '0.82rem' }}
            onClick={() => {
              setQuizCards(prev => shuffleArray(prev));
              setCurrentIndex(0);
              setUserInput('');
              setStatus('typing');
              setShowAnswer(false);
            }}
            title="重新隨機打亂題目順序"
          >
            <Shuffle size={13} />
            <span className="btn-text-desktop">隨機打亂</span>
          </button>
        </div>

        <div className="review-progress-text">
          進度: <strong>{currentIndex + 1}</strong> / {quizCards.length}
        </div>
      </div>

      <div className="glass-card spelling-box">
        {/* Badges */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
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
            請輸入對應的西班牙語單字：
          </div>
          <div className="spelling-prompt" style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
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

          {/* Action buttons */}
          <div className="spelling-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '16px' }}>
            <button type="submit" className="btn btn-primary" id="btn-spelling-submit">
              <Check size={18} />
              <span>送出檢查<span className="kbd-hint"> (Enter)</span></span>
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
          <div style={{ marginTop: '16px', padding: '14px', background: 'var(--google-green-light)', border: '1px solid #a8dab5', borderRadius: 'var(--radius-md)' }}>
            <div style={{ color: 'var(--google-green)', fontWeight: 700, fontSize: '1.2rem', marginBottom: '6px' }}>
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
          <div style={{ marginTop: '16px', padding: '14px', background: 'var(--google-red-light)', border: '1px solid #f6aea9', borderRadius: 'var(--radius-md)' }}>
            <div style={{ color: 'var(--google-red)', fontWeight: 700, marginBottom: '6px' }}>
              拼法不太對喔，再試試看！
            </div>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              正確拼法是：<strong style={{ color: 'var(--google-blue)', fontSize: '1.2rem' }}>{currentCard.word}</strong>
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
          <div style={{ marginTop: '16px', padding: '12px', background: 'var(--google-blue-light)', border: '1px solid #aecbfa', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)' }}>
            答案是：<strong style={{ color: 'var(--google-blue)', fontSize: '1.2rem' }}>{currentCard.article ? `${currentCard.article} ` : ''}{currentCard.word}</strong>
          </div>
        )}
      </div>
    </div>
  );
}
