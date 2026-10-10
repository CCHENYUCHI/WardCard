import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Volume2, RotateCw, CheckCircle2, ArrowRight, Lightbulb, 
  HelpCircle, Sparkles, Check, X, ArrowLeft, Trophy, Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSpanishPronunciation } from '../utils/speech';

const SPANISH_SPECIAL_KEYS = ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ', '¿', '¡'];

const stripArticle = (str) => {
  if (!str) return '';
  const articles = ['el ', 'la ', 'los ', 'las ', 'un ', 'una ', 'unos ', 'unas '];
  for (let article of articles) {
    if (str.toLowerCase().startsWith(article)) {
      return str.substring(article.length).trim();
    }
  }
  return str.trim();
};

export default function AdaptiveStudySession({ 
  sessionPlan, 
  onReviewCard, 
  onExitSession 
}) {
  // Flatten session queue: urgent first, then regular due, then new cards
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [spellingStatus, setSpellingStatus] = useState('typing'); // 'typing', 'correct', 'incorrect'
  const [completedCount, setCompletedCount] = useState(0);
  const [stagePromotions, setStagePromotions] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    const list = [
      ...(sessionPlan.urgent || []).map(c => ({ ...c, _sessionType: 'urgent' })),
      ...(sessionPlan.regular || []).map(c => ({ ...c, _sessionType: 'regular' })),
      ...(sessionPlan.newCards || []).map(c => ({ ...c, _sessionType: 'new' }))
    ];
    setQueue(list);
    setCurrentIndex(0);
    setIsFinished(list.length === 0);
  }, [sessionPlan]);

  const currentCard = queue[currentIndex];
  const stage = currentCard ? (Number(currentCard.mastery_stage) || 1) : 1;

  // Auto-focus input when in Stage 3 or 4
  useEffect(() => {
    setIsFlipped(false);
    setShowHint(false);
    setUserInput('');
    setSpellingStatus('typing');

    if (currentCard && (stage === 1 || stage === 2)) {
      // Auto play audio in Stage 1 only after flip
    }

    if (stage === 3 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, stage]);

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => {
      const next = !prev;
      if (next && currentCard) {
        const textToSpeak = currentCard.article ? `${currentCard.article} ${currentCard.word}` : currentCard.word;
        playSpanishPronunciation(textToSpeak);
      }
      return next;
    });
  }, [currentCard]);

  const handleRate = useCallback(async (rating) => {
    if (!currentCard) return;

    try {
      const res = await onReviewCard(currentCard.id, rating, 'adaptive', stage);
      if (res && res.fsrs) {
        if (res.fsrs.stage > currentCard.mastery_stage) {
          setStagePromotions(p => p + 1);
        }
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
    }

    setCompletedCount(c => c + 1);

    if (currentIndex + 1 < queue.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [currentCard, currentIndex, queue.length, onReviewCard, stage]);

  // Handle spelling submission for Stage 3
  const handleCheckSpelling = () => {
    if (!currentCard) return;
    const cleanUser = userInput.trim().toLowerCase();
    const cleanWord = currentCard.word.trim().toLowerCase();
    const cleanNoArt = stripArticle(cleanWord).toLowerCase();

    const isMatch = cleanUser === cleanWord || cleanUser === cleanNoArt;

    if (isMatch) {
      setSpellingStatus('correct');
      playSpanishPronunciation(currentCard.article ? `${currentCard.article} ${currentCard.word}` : currentCard.word);
      setTimeout(() => {
        handleRate(3); // Grade Good
      }, 700);
    } else {
      setSpellingStatus('incorrect');
      setIsFlipped(true); // Reveal answer
      playSpanishPronunciation(currentCard.article ? `${currentCard.article} ${currentCard.word}` : currentCard.word);
    }
  };

  const handleInsertChar = (char) => {
    if (!inputRef.current) return;
    const start = inputRef.current.selectionStart || userInput.length;
    const nextVal = userInput.slice(0, start) + char + userInput.slice(start);
    setUserInput(nextVal);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(start + 1, start + 1);
      }
    }, 10);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isFinished) return;

      // When typing in input field, don't trigger space / 1-4 shortcuts
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        if (e.key === 'Enter' && stage === 3 && spellingStatus === 'typing') {
          e.preventDefault();
          handleCheckSpelling();
        }
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (isFlipped || spellingStatus === 'incorrect') {
        if (e.key === '1') handleRate(1);
        if (e.key === '2') handleRate(2);
        if (e.key === '3') handleRate(3);
        if (e.key === '4') handleRate(4);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, spellingStatus, isFinished, stage, handleFlip, handleRate]);

  if (isFinished) {
    return (
      <div style={{ maxWidth: '640px', margin: '40px auto', textAlign: 'center', padding: '32px' }}>
        <div style={{
          background: 'var(--surface-color)',
          border: '1px solid var(--border-color)',
          borderRadius: '24px',
          padding: '40px 24px',
          backdropFilter: 'blur(16px)'
        }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🏆</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 12px 0' }}>
            今日學習任務達成！
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', margin: '0 0 28px 0' }}>
            恭喜！你完成了今日所有的自適應記憶排程，神經突觸已完成強化。
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', padding: '16px', borderRadius: '16px' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399' }}>{completedCount}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>完成單字數</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', padding: '16px', borderRadius: '16px' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#60a5fa' }}>{stagePromotions}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>晉級高階詞彙</div>
            </div>
          </div>

          <button 
            className="btn btn-primary"
            onClick={onExitSession}
            style={{ padding: '14px 36px', fontSize: '1.05rem' }}
          >
            返回學習駕駛艙
          </button>
        </div>
      </div>
    );
  }

  if (!currentCard) return null;

  // Mask example sentence for Stage 2 & 4
  const maskWord = (sentence, word) => {
    if (!sentence || !word) return sentence;
    const clean = stripArticle(word).trim();
    const regex = new RegExp(`\\b${clean}\\w*`, 'gi');
    return sentence.replace(regex, '【 ______ 】');
  };

  const getStageHeader = () => {
    switch (stage) {
      case 1:
        return { label: 'Stage 1: 被動辨認', desc: '看西語，在腦海中回想中文意義與發音', color: '#f59e0b' };
      case 2:
        return { label: 'Stage 2: 提示回想', desc: '看中文與例句，主動回想出對應的西語單字', color: '#3b82f6' };
      case 3:
        return { label: 'Stage 3: 正字拼寫', desc: '盲測輸入正確拼寫與重音符號', color: '#8b5cf6' };
      case 4:
      case 5:
        return { label: 'Stage 4: 語境克漏字', desc: '掌握完整句型語意與詞形變位', color: '#ec4899' };
      default:
        return { label: '自適應練習', desc: '', color: '#3b82f6' };
    }
  };

  const stageMeta = getStageHeader();

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '16px' }}>
      {/* Top Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <button 
          onClick={onExitSession}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <ArrowLeft size={16} />
          <span>退出</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ 
            background: `${stageMeta.color}22`, 
            color: stageMeta.color, 
            padding: '3px 10px', 
            borderRadius: '12px',
            fontSize: '0.8rem',
            fontWeight: 700 
          }}>
            {stageMeta.label}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {currentIndex + 1} / {queue.length}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden', marginBottom: '20px' }}>
        <div style={{ 
          width: `${((currentIndex) / queue.length) * 100}%`, 
          height: '100%', 
          background: 'var(--primary-color)',
          transition: 'width 0.3s ease'
        }} />
      </div>

      {/* Main Flashcard Container */}
      <div style={{
        background: 'var(--surface-color)',
        border: '1px solid var(--border-color)',
        borderRadius: '24px',
        padding: '36px 28px',
        minHeight: '340px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(20px)'
      }}>

        {/* --- STAGE 1: Recognition (西語 -> 中文) --- */}
        {stage === 1 && (
          <div>
            <div style={{ textAlign: 'center', margin: '20px 0 30px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                {currentCard.article && (
                  <span style={{ fontSize: '1.4rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    {currentCard.article}
                  </span>
                )}
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
                  {currentCard.word}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playSpanishPronunciation(currentCard.article ? `${currentCard.article} ${currentCard.word}` : currentCard.word);
                  }}
                  className="btn-icon"
                  style={{ marginLeft: '6px' }}
                >
                  <Volume2 size={22} color="var(--primary-color)" />
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                <span className="badge badge-subtle">{currentCard.part_of_speech}</span>
                <span className="badge badge-subtle">{currentCard.dele_level}</span>
                {currentCard.curriculum_unit && (
                  <span className="badge badge-subtle">{currentCard.curriculum_unit}</span>
                )}
              </div>
            </div>

            {/* Flipped Content */}
            {isFlipped ? (
              <div style={{ 
                borderTop: '1px solid rgba(255,255,255,0.08)', 
                paddingTop: '20px', 
                textAlign: 'center',
                animation: 'fadeIn 0.25s ease'
              }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#38bdf8', marginBottom: '12px' }}>
                  {currentCard.translation}
                </div>
                {currentCard.example_es && (
                  <div style={{ 
                    background: 'rgba(0,0,0,0.25)', 
                    padding: '12px 16px', 
                    borderRadius: '12px', 
                    fontSize: '0.95rem',
                    color: 'var(--text-primary)',
                    fontStyle: 'italic',
                    marginBottom: '6px'
                  }}>
                    "{currentCard.example_es}"
                  </div>
                )}
                {currentCard.example_zh && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {currentCard.example_zh}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '20px' }}>
                點擊卡片或按 <kbd className="shortcut-key">Space</kbd> 翻轉查看釋義
              </div>
            )}
          </div>
        )}

        {/* --- STAGE 2: Cued Recall (中文 -> 主動回想西語) --- */}
        {stage === 2 && (
          <div>
            <div style={{ textAlign: 'center', margin: '16px 0 24px 0' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8', marginBottom: '10px' }}>
                {currentCard.translation}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                <span className="badge badge-subtle">{currentCard.part_of_speech}</span>
                <span className="badge badge-subtle">{currentCard.dele_level}</span>
              </div>
            </div>

            {/* Example with cloze mask */}
            {currentCard.example_es && (
              <div style={{
                background: 'rgba(0,0,0,0.25)',
                padding: '16px',
                borderRadius: '14px',
                marginBottom: '16px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontStyle: 'italic', marginBottom: '6px' }}>
                  "{isFlipped ? currentCard.example_es : maskWord(currentCard.example_es, currentCard.word)}"
                </div>
                {currentCard.example_zh && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {currentCard.example_zh}
                  </div>
                )}
              </div>
            )}

            {/* Hint Trigger */}
            {!isFlipped && (
              <div style={{ textAlign: 'center', margin: '12px 0' }}>
                {showHint ? (
                  <span style={{ 
                    background: 'rgba(234, 179, 8, 0.15)', 
                    color: '#facc15', 
                    padding: '6px 14px', 
                    borderRadius: '12px',
                    fontSize: '0.9rem',
                    fontWeight: 600
                  }}>
                    💡 字首提示：{stripArticle(currentCard.word).substring(0, 2)}...
                  </span>
                ) : (
                  <button
                    onClick={() => setShowHint(true)}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Lightbulb size={14} color="#facc15" />
                    <span>查看字首線索</span>
                  </button>
                )}
              </div>
            )}

            {/* Revealed Answer */}
            {isFlipped && (
              <div style={{ 
                borderTop: '1px solid rgba(255,255,255,0.08)', 
                paddingTop: '16px', 
                textAlign: 'center',
                animation: 'fadeIn 0.25s ease'
              }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {currentCard.article ? `${currentCard.article} ` : ''}{currentCard.word}
                </div>
                {currentCard.notes && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                    📝 {currentCard.notes}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* --- STAGE 3: Spelling (盲測精確拼寫) --- */}
        {stage === 3 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8', marginBottom: '8px' }}>
                {currentCard.translation}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                請完整拼出西語單字（注意重音符號）
              </div>
            </div>

            {/* Input Box */}
            <div style={{ maxWidth: '440px', margin: '0 auto 16px auto' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="輸入西語單字..."
                  disabled={spellingStatus !== 'typing'}
                  style={{
                    flex: 1,
                    background: 'rgba(0,0,0,0.3)',
                    border: spellingStatus === 'correct' 
                      ? '2px solid #34d399' 
                      : spellingStatus === 'incorrect' 
                      ? '2px solid #ef4444' 
                      : '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    color: '#fff',
                    fontSize: '1.2rem',
                    textAlign: 'center',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                />
                {spellingStatus === 'typing' && (
                  <button
                    onClick={handleCheckSpelling}
                    className="btn btn-primary"
                    style={{ padding: '0 20px' }}
                  >
                    送出
                  </button>
                )}
              </div>

              {/* Special Characters Keyboard */}
              {spellingStatus === 'typing' && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                  {SPANISH_SPECIAL_KEYS.map(char => (
                    <button
                      key={char}
                      onClick={() => handleInsertChar(char)}
                      type="button"
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: 'var(--text-primary)',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        fontSize: '0.95rem',
                        cursor: 'pointer'
                      }}
                    >
                      {char}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Incorrect Feedback */}
            {spellingStatus === 'incorrect' && (
              <div style={{ 
                background: 'rgba(239, 68, 68, 0.1)', 
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: '14px',
                padding: '14px',
                textAlign: 'center',
                margin: '12px auto',
                maxWidth: '440px'
              }}>
                <div style={{ color: '#f87171', fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>
                  拼寫失誤，正確答案是：
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
                  {currentCard.article ? `${currentCard.article} ` : ''}{currentCard.word}
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- STAGE 4: Contextual Cloze (語境克漏字) --- */}
        {stage >= 4 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <span className="badge badge-subtle">{currentCard.dele_level}</span>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#38bdf8', marginTop: '8px' }}>
                {currentCard.translation}
              </div>
            </div>

            <div style={{
              background: 'rgba(0,0,0,0.3)',
              padding: '20px',
              borderRadius: '16px',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '1.15rem', color: '#fff', fontStyle: 'italic', lineHeight: 1.6 }}>
                "{isFlipped ? currentCard.example_es : maskWord(currentCard.example_es, currentCard.word)}"
              </div>
              {currentCard.example_zh && (
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                  {currentCard.example_zh}
                </div>
              )}
            </div>

            {isFlipped ? (
              <div style={{ textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {currentCard.article ? `${currentCard.article} ` : ''}{currentCard.word}
                </div>
                {currentCard.notes && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                    💡 {currentCard.notes}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={handleFlip}
                  className="btn btn-secondary"
                  style={{ padding: '10px 24px' }}
                >
                  查看克漏字答案
                </button>
              </div>
            )}
          </div>
        )}

        {/* Bottom Rating Bar (Triggered when flipped or incorrect in Stage 3) */}
        {(isFlipped || spellingStatus === 'incorrect' || (stage === 1 && isFlipped)) ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px',
            marginTop: '24px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '20px'
          }}>
            <button
              onClick={() => handleRate(1)}
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#f87171',
                padding: '12px 6px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 700,
                textAlign: 'center'
              }}
              className="hover-scale"
            >
              <div style={{ fontSize: '0.95rem' }}>1. 忘記</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Again</div>
            </button>

            <button
              onClick={() => handleRate(2)}
              style={{
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                color: '#fbbf24',
                padding: '12px 6px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 700,
                textAlign: 'center'
              }}
              className="hover-scale"
            >
              <div style={{ fontSize: '0.95rem' }}>2. 吃力</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Hard</div>
            </button>

            <button
              onClick={() => handleRate(3)}
              style={{
                background: 'rgba(59, 130, 246, 0.15)',
                border: '1px solid rgba(59, 130, 246, 0.35)',
                color: '#60a5fa',
                padding: '12px 6px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 700,
                textAlign: 'center'
              }}
              className="hover-scale"
            >
              <div style={{ fontSize: '0.95rem' }}>3. 記得</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Good</div>
            </button>

            <button
              onClick={() => handleRate(4)}
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                color: '#34d399',
                padding: '12px 6px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 700,
                textAlign: 'center'
              }}
              className="hover-scale"
            >
              <div style={{ fontSize: '0.95rem' }}>4. 熟練</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Easy</div>
            </button>
          </div>
        ) : (
          /* When not flipped, show flip action button for Stage 1 & 2 */
          (stage === 1 || stage === 2) && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                onClick={handleFlip}
                className="btn btn-secondary"
                style={{ padding: '12px 32px', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <RotateCw size={18} />
                <span>翻轉卡片</span>
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
