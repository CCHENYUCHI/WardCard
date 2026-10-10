import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Volume2, RotateCw, CheckCircle2, ChevronRight, HelpCircle, Sparkles, Filter, Shuffle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSpanishPronunciation } from '../utils/speech';
import { shuffleArray } from '../utils/shuffle';

export default function FlashcardReview({ allCards, dueCards, onReview, categories, onRefresh }) {
  const [quizCards, setQuizCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showOnlyDue, setShowOnlyDue] = useState(true);
  const [frontMode, setFrontMode] = useState('es'); // 'es', 'zh', 'en'
  const [isCompleted, setIsCompleted] = useState(false);

  const cardContainerRef = useRef(null);
  const pointerInteractionRef = useRef({
    startX: 0,
    startY: 0,
    startTime: 0,
    isDragOrSelection: false,
  });

  useEffect(() => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newQuizCards = allCards.filter(c => {
      const passCategory = selectedCategory === 'all' || c.category === selectedCategory;
      const passDue = showOnlyDue ? (c.repetition === 0 || c.due_date <= nowStr) : true;
      return passCategory && passDue;
    });
    
    // Randomize card order
    setQuizCards(shuffleArray(newQuizCards));
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsCompleted(false);
  }, [selectedCategory, showOnlyDue, allCards.length]);

  const currentCard = quizCards[currentIndex];

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
    if (!isFlipped && currentCard) {
      playSpanishPronunciation(currentCard.article ? `${currentCard.article} ${currentCard.word}` : currentCard.word);
    }
  }, [isFlipped, currentCard]);

  const handlePointerDown = (e) => {
    // Only track primary mouse button (left-click) or touch
    if (e.button !== 0) return;

    pointerInteractionRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startTime: Date.now(),
      isDragOrSelection: false,
    };
  };

  const handlePointerUp = (e) => {
    const { startX, startY, startTime } = pointerInteractionRef.current;
    const duration = Date.now() - startTime;
    const dist = Math.hypot(e.clientX - startX, e.clientY - startY);

    const selection = window.getSelection();
    const hasSelection = Boolean(selection && selection.toString().trim().length > 0);

    // If mouse moved (drag-selection), held down for a selection gesture (> 250ms with movement), or text is selected:
    // Mark as a drag/selection interaction to avoid triggering card flip on click
    if (hasSelection || dist > 6 || (duration > 250 && dist > 2)) {
      pointerInteractionRef.current.isDragOrSelection = true;
    }
  };

  const handleCardClick = (e) => {
    // 1. If text is currently selected inside the card, do not flip to preserve selection & allow copying
    const selection = window.getSelection();
    const hasTextSelected = Boolean(selection && selection.toString().trim().length > 0);
    const container = cardContainerRef.current;
    const isSelectionInCard =
      hasTextSelected &&
      container &&
      (container.contains(selection.anchorNode) || container.contains(selection.focusNode));

    if (isSelectionInCard) {
      return;
    }

    // 2. If the pointer gesture was a drag or long-press selection, do not flip
    if (pointerInteractionRef.current.isDragOrSelection) {
      pointerInteractionRef.current.isDragOrSelection = false;
      return;
    }

    // Otherwise, perform the normal card flip
    handleFlip();
  };

  const handleRate = useCallback(async (rating) => {
    if (!currentCard) return;

    // We don't await onReview here because we don't want it to block the UI transition
    // and since quizCards is frozen, background updates won't shift the array
    onReview(currentCard.id, rating, 'flashcard').catch(console.error);

    if (currentIndex + 1 < quizCards.length) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [currentCard, currentIndex, quizCards.length, onReview]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is in an input field
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (isFlipped) {
        if (e.key === '1') handleRate(1);
        if (e.key === '2') handleRate(2);
        if (e.key === '3') handleRate(3);
        if (e.key === '4') handleRate(4);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, handleRate, isFlipped]);

  if (quizCards.length === 0 || isCompleted) {
    return (
      <div className="glass-card" style={{ maxWidth: '640px', margin: '40px auto', textAlign: 'center', padding: '50px 30px' }}>
        <div style={{ fontSize: '50px', marginBottom: '16px' }}>🎉</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '10px' }}>
          {quizCards.length === 0 ? '目前沒有待複習的單字！' : '太棒了！今日複習已完成！'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          {quizCards.length === 0
            ? '你可以切換分類標籤，或是使用「AI 快速萃取」匯入新的西語單字！'
            : '你的記憶曲線已更新。持續每日複習，西語進步看得見！'}
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {selectedCategory !== 'all' && (
            <button className="btn btn-secondary" onClick={() => setSelectedCategory('all')}>
              查看所有分類
            </button>
          )}
          <button className="btn btn-primary" onClick={onRefresh}>
            <RotateCw size={16} />
            <span>重新載入單字</span>
          </button>
        </div>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex) / quizCards.length) * 100);

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      {/* Top Filter and Progress Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={18} style={{ color: 'var(--text-muted)' }} />
            <select
              className="select-custom"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              id="review-category-filter"
            >
              <option value="all">所有分類</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>正面顯示:</span>
            <select
              className="select-custom"
              value={frontMode}
              onChange={(e) => setFrontMode(e.target.value)}
              style={{ padding: '6px 10px', fontSize: '0.85rem' }}
            >
              <option value="es">西文 (預設)</option>
              <option value="zh">中文</option>
              <option value="en">英文</option>
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
              setIsFlipped(false);
            }}
            title="重新隨機打亂題目順序"
          >
            <Shuffle size={13} />
            <span>隨機打亂</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
          <span>進度: <strong>{currentIndex + 1}</strong> / {quizCards.length}</span>
          <span style={{ color: 'var(--text-muted)' }}>|</span>
          <span style={{ fontSize: '0.78rem' }}>按 [空白鍵] 翻面，[1~4] 評分</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ height: '6px', background: '#e0e0e0', borderRadius: '10px', marginBottom: '24px', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${progressPercent}%`,
            background: 'var(--google-blue)',
            transition: 'width 0.3s ease'
          }}
        />
      </div>

      {/* 3D Flashcard */}
      <div
        ref={cardContainerRef}
        className="flashcard-container"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onClick={handleCardClick}
      >
        <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
          {/* Card Front */}
          <div className="card-face card-front">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span className="badge-category">{currentCard.category}</span>
                {currentCard.gender && currentCard.gender !== 'none' && (
                  <span className={`badge-gender ${currentCard.gender}`}>
                    {currentCard.gender === 'masculino' ? '♂ 陽性' : '♀ 陰性'}
                  </span>
                )}
              </div>
              <span className="badge-pos">{currentCard.part_of_speech}</span>
            </div>

            <div style={{ textAlign: 'center', margin: 'auto 0' }}>
              <div className="word-display">
                {frontMode === 'es' ? (
                  <>
                    {currentCard.article && <span className="article-prefix">{currentCard.article}</span>}
                    <span className="main-word">{currentCard.word}</span>
                  </>
                ) : frontMode === 'zh' ? (
                  <span className="main-word" style={{ fontSize: '2.5rem' }}>{currentCard.translation}</span>
                ) : (
                  <span className="main-word" style={{ fontSize: '2.5rem' }}>{currentCard.english_translation || currentCard.translation}</span>
                )}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>
                點擊或按空白鍵翻面查看解答
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                className="btn-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  playSpanishPronunciation(currentCard.article ? `${currentCard.article} ${currentCard.word}` : currentCard.word);
                }}
                title="發音朗讀"
              >
                <Volume2 size={18} />
              </button>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                複習次數: {currentCard.repetition || 0}
              </span>
            </div>
          </div>

          {/* Card Back */}
          <div className="card-face card-back">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {currentCard.gender && currentCard.gender !== 'none' && (
                  <span className={`badge-gender ${currentCard.gender}`}>
                    {currentCard.gender === 'masculino' ? '♂ 陽性 (el)' : '♀ 陰性 (la)'}
                  </span>
                )}
              </div>
              <button
                className="btn-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  playSpanishPronunciation(currentCard.article ? `${currentCard.article} ${currentCard.word}` : currentCard.word);
                }}
                title="發音朗讀"
              >
                <Volume2 size={18} />
              </button>
            </div>

            <div style={{ margin: 'auto 0' }}>
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {currentCard.article ? `${currentCard.article} ` : ''}{currentCard.word}
                </div>
                <div className="main-translation">{currentCard.translation}</div>
              </div>

              {currentCard.example_es && (
                <div className="example-box">
                  <div className="example-es">{currentCard.example_es}</div>
                  {currentCard.example_zh && <div className="example-zh">{currentCard.example_zh}</div>}
                </div>
              )}

              {currentCard.notes && (
                <div className="notes-box">
                  <strong>💡 文法/用法解析：</strong>
                  <span>{currentCard.notes}</span>
                </div>
              )}
            </div>

            <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              請依據剛剛的回想難易度進行評分
            </div>
          </div>
        </div>
      </div>

      {/* SM-2 Spaced Repetition Rating Buttons */}
      {isFlipped && (
        <div className="rating-actions">
          <button className="btn-rate again" onClick={() => handleRate(1)} id="btn-rate-again">
            <span className="rate-title">忘記 [1]</span>
            <span className="rate-sub">重置週期 (1天內)</span>
          </button>
          <button className="btn-rate hard" onClick={() => handleRate(2)} id="btn-rate-hard">
            <span className="rate-title">困難 [2]</span>
            <span className="rate-sub">稍難記憶 (1~2天)</span>
          </button>
          <button className="btn-rate good" onClick={() => handleRate(3)} id="btn-rate-good">
            <span className="rate-title">良好 [3]</span>
            <span className="rate-sub">正常複習 (3~6天)</span>
          </button>
          <button className="btn-rate easy" onClick={() => handleRate(4)} id="btn-rate-easy">
            <span className="rate-title">容易 [4]</span>
            <span className="rate-sub">完全熟記 (週期拉長)</span>
          </button>
        </div>
      )}
    </div>
  );
}
