import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { 
  Volume2, RotateCw, CheckCircle2, ArrowRight, Lightbulb, 
  HelpCircle, Sparkles, Check, X, ArrowLeft, Trophy, Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSpanishPronunciation } from '../utils/speech';
import { shuffleArray } from '../utils/shuffle';
import ProgressRing from './ProgressRing';
import TappableSentence from './TappableSentence';
import { CardStory } from './StoryCard';
import {
  stripArticle, normalizeAnswer, getAcceptableAnswers,
  findInflectedForms, maskSentence, displayWord, pickDistractors
} from '../utils/spanish';

const SPANISH_SPECIAL_KEYS = ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ', '¿', '¡'];
// Stage 5 multiple choice: a correct answer within this time counts as Easy
const FAST_ANSWER_MS = 3000;

export default function AdaptiveStudySession({ 
  sessionPlan, 
  onReviewCard, 
  onExitSession,
  cardPool = []
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
  const [todayProgress, setTodayProgress] = useState(null); // latest /review response `today`
  const isPractice = sessionPlan.mode === 'practice';

  const inputRef = useRef(null);
  const questionStartRef = useRef(Date.now());
  // Read through a ref so refetching the library after each rating doesn't reshuffle the options
  const cardPoolRef = useRef(cardPool);
  cardPoolRef.current = cardPool;
  const [chosenIndex, setChosenIndex] = useState(null);

  useEffect(() => {
    const list = [
      ...(sessionPlan.urgent || []).map(c => ({ ...c, _sessionType: 'urgent' })),
      ...(sessionPlan.regular || []).map(c => ({ ...c, _sessionType: 'regular' })),
      ...(sessionPlan.newCards || []).map(c => ({ ...c, _sessionType: 'new' })),
      ...(sessionPlan.extra || []).map(c => ({ ...c, _sessionType: 'extra' }))
    ];
    // Randomize question sequence so user doesn't memorize order
    const shuffledList = shuffleArray(list);
    setQueue(shuffledList);
    setCurrentIndex(0);
    setIsFinished(shuffledList.length === 0);
  }, [sessionPlan]);

  const currentCard = queue[currentIndex];
  const stage = currentCard ? (Number(currentCard.mastery_stage) || 1) : 1;

  // Forms of the word found in the example sentence; empty means Stage 4 has nothing to blank out
  const clozeForms = useMemo(
    () => (currentCard ? findInflectedForms(currentCard.example_es, currentCard) : []),
    [currentCard]
  );

  // Stage 5 options: the card plus 3 distractors from the user's own library (no AI needed)
  const choiceOptions = useMemo(() => {
    if (!currentCard || stage < 5) return null;
    const distractors = pickDistractors(currentCard, cardPoolRef.current, 3);
    if (distractors.length < 3) return null;
    const options = [currentCard, ...distractors].map(c => ({ id: c.id, label: displayWord(c), correct: c.id === currentCard.id }));
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return options;
  }, [currentCard, stage]);

  // What the current card actually shows, with fallbacks when the data for a stage is missing
  const mode = stage === 1 ? 'recognition'
    : stage === 2 ? 'cued'
    : stage === 3 ? 'spelling'
    : stage === 4 ? (clozeForms.length > 0 ? 'cloze' : 'spelling')
    : (choiceOptions ? 'choice' : 'fluent');
  const isTypingMode = mode === 'spelling' || mode === 'cloze';

  // Auto-focus input when typing an answer
  useEffect(() => {
    setIsFlipped(false);
    setShowHint(false);
    setUserInput('');
    setSpellingStatus('typing');
    setChosenIndex(null);
    questionStartRef.current = Date.now();
  }, [currentIndex]);

  // Focus once the input is enabled again: during the card switch it is still disabled from the last answer
  useEffect(() => {
    if (isTypingMode && spellingStatus === 'typing' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, isTypingMode, spellingStatus]);

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
      if (res && res.today) setTodayProgress(res.today);
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

  // Handle spelling / cloze submission for Stage 3 & 4
  const handleCheckSpelling = useCallback(() => {
    if (!currentCard) return;
    const typed = normalizeAnswer(userInput);
    if (!typed) return;

    const accepted = new Set(getAcceptableAnswers(currentCard.word));
    // In the cloze, the form used in the sentence (e.g. "hablamos") is also correct
    if (mode === 'cloze') clozeForms.forEach(f => accepted.add(normalizeAnswer(f)));
    const isMatch = accepted.has(typed) || accepted.has(normalizeAnswer(stripArticle(typed)));

    playSpanishPronunciation(displayWord(currentCard));
    if (isMatch) {
      setSpellingStatus('correct');
      setTimeout(() => {
        handleRate(3); // Grade Good
      }, 700);
    } else {
      setSpellingStatus('incorrect');
      setIsFlipped(true); // Reveal answer
    }
  }, [currentCard, userInput, mode, clozeForms, handleRate]);

  // Stage 5 multiple choice: fast correct = Easy, slow correct = Good, wrong = reveal and self-rate
  const handleChoose = useCallback((index) => {
    if (!choiceOptions || spellingStatus !== 'typing' || !choiceOptions[index]) return;
    setChosenIndex(index);
    playSpanishPronunciation(displayWord(currentCard));
    if (choiceOptions[index].correct) {
      const elapsed = Date.now() - questionStartRef.current;
      setSpellingStatus('correct');
      setIsFlipped(true);
      setTimeout(() => {
        handleRate(elapsed <= FAST_ANSWER_MS ? 4 : 3);
      }, 900);
    } else {
      setSpellingStatus('incorrect');
      setIsFlipped(true);
    }
  }, [choiceOptions, spellingStatus, currentCard, handleRate]);

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
        if (e.key === 'Enter' && isTypingMode && spellingStatus === 'typing') {
          e.preventDefault();
          handleCheckSpelling();
        }
        return;
      }

      // Stage 5: before answering, 1-4 pick an option and Space must not reveal the answer
      if (mode === 'choice' && spellingStatus === 'typing') {
        if (['1', '2', '3', '4'].includes(e.key)) handleChoose(Number(e.key) - 1);
        if (e.code === 'Space') e.preventDefault();
        return;
      }
      // A correct choice rates itself automatically
      if (mode === 'choice' && spellingStatus === 'correct') return;

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
  }, [isFlipped, spellingStatus, isFinished, mode, isTypingMode, handleFlip, handleRate, handleCheckSpelling, handleChoose]);

  if (isFinished) {
    const t = todayProgress;
    const goalReached = t && t.completed;
    const title = isPractice ? '加練完成！💪' : goalReached ? '今日目標達成！' : '這一輪完成！';
    const message = isPractice
      ? '額外練習不佔今日任務，但每一次回想都讓記憶更牢固。'
      : goalReached
        ? '今天排程的單字全部完成，明天再來保持連續紀錄！'
        : t && t.remaining > 0
          ? `今日任務還剩 ${t.remaining} 個單字，休息一下再繼續吧。`
          : '做得好！回到今日任務查看進度。';

    return (
      <div style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center', padding: '24px' }}>
        <div style={{
          background: '#ffffff',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '36px 28px',
          boxShadow: 'var(--shadow-card)'
        }}>
          {t ? (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <ProgressRing done={t.done} goal={t.goal} size={120}>
                {goalReached ? (
                  <Trophy size={40} color="var(--google-green)" />
                ) : (
                  <>
                    <div className="ring-value">{t.done}<span>/{t.goal}</span></div>
                    <div className="ring-label">今日任務</div>
                  </>
                )}
              </ProgressRing>
            </div>
          ) : (
            <div style={{ fontSize: '3.2rem', marginBottom: '16px' }}>🏆</div>
          )}
          <h2 style={{ fontSize: '1.7rem', fontWeight: 700, margin: '0 0 10px 0', color: 'var(--text-primary)' }}>
            {title}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: '0 0 20px 0' }}>
            {message}
          </p>

          {t && t.streak && t.streak.current > 0 && (
            <div className="streak-pill is-lit" style={{ margin: '0 auto 24px', width: 'fit-content' }}>
              <span className="streak-flame">🔥</span>
              <span><strong>{t.streak.current}</strong> 天連續學習</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
            <div style={{ background: 'var(--google-green-light)', border: '1px solid #a8dab5', padding: '16px', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--google-green)' }}>{completedCount}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>這一輪完成單字</div>
            </div>
            <div style={{ background: 'var(--google-blue-light)', border: '1px solid #aecbfa', padding: '16px', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--google-blue)' }}>{stagePromotions}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>晉級高階詞彙</div>
            </div>
          </div>

          <button 
            className="btn btn-primary"
            onClick={onExitSession}
            style={{ padding: '12px 32px', fontSize: '1rem' }}
          >
            返回今日任務
          </button>
        </div>
      </div>
    );
  }

  if (!currentCard) return null;

  const getStageHeader = () => {
    switch (Math.min(stage, 5)) {
      case 1:
        return { label: 'Stage 1: 被動辨認', desc: '看西語，在腦海中回想中文意義與發音', color: '#f59e0b' };
      case 2:
        return { label: 'Stage 2: 提示回想', desc: '看中文與例句，主動回想出對應的西語單字', color: '#3b82f6' };
      case 3:
        return { label: 'Stage 3: 正字拼寫', desc: '盲測輸入正確拼寫與重音符號', color: '#8b5cf6' };
      case 4:
        return { label: 'Stage 4: 語境克漏字', desc: '掌握完整句型語意與詞形變位', color: '#137333' };
      case 5:
        return { label: mode === 'choice' ? 'Stage 5: 語境四選一' : 'Stage 5: 長效精通', desc: '直覺極速反應，鞏固長期神經記憶', color: '#8430ce' };
      default:
        return { label: '自適應練習', desc: '', color: '#3b82f6' };
    }
  };

  const stageMeta = getStageHeader();

  return (
    <div className="study-session">
      {/* Top Header Bar */}
      <div className="study-session-header">
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
          {isPractice ? (
            <span className="session-today-pill is-practice">💪 加練</span>
          ) : todayProgress && (
            <span className={`session-today-pill ${todayProgress.completed ? 'is-done' : ''}`}>
              今日 {todayProgress.done}/{todayProgress.goal}
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ width: '100%', height: '6px', background: '#e8eaed', borderRadius: '4px', overflow: 'hidden', marginBottom: '20px' }}>
        <div style={{ 
          width: `${((currentIndex) / queue.length) * 100}%`, 
          height: '100%', 
          background: 'var(--google-blue)',
          transition: 'width 0.3s ease'
        }} />
      </div>

      {/* Main Flashcard Container (Google Clean White Study Card) */}
      <div className="study-card">

        {/* --- STAGE 1: Recognition (西語 -> 中文) --- */}
        {mode === 'recognition' && (
          <div>
            <div style={{ textAlign: 'center', margin: '20px 0 30px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                {currentCard.article && (
                  <span style={{ fontSize: '1.4rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {currentCard.article}
                  </span>
                )}
                <span className="study-word" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
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
                  <Volume2 size={22} color="var(--google-blue)" />
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span className="badge-subtle">{currentCard.part_of_speech}</span>
                {currentCard.curriculum_unit && (
                  <span className="badge-category">{currentCard.curriculum_unit}</span>
                )}
              </div>
            </div>

            {/* Flipped Content */}
            {isFlipped ? (
              <div style={{ 
                borderTop: '1px solid var(--border-color)', 
                paddingTop: '20px', 
                textAlign: 'center',
                animation: 'fadeIn 0.2s ease'
              }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--google-blue)', marginBottom: '12px' }}>
                  {currentCard.translation}
                </div>
                {currentCard.example_es && (
                  <div style={{ 
                    background: '#f8f9fa', 
                    border: '1px solid var(--border-color)',
                    padding: '12px 16px', 
                    borderRadius: 'var(--radius-md)', 
                    fontSize: '0.95rem',
                    color: 'var(--text-primary)',
                    fontStyle: 'italic',
                    marginBottom: '6px'
                  }}>
                    "<TappableSentence sentence={currentCard.example_es} fullSentence={currentCard.example_es} exampleZh={currentCard.example_zh} />"
                  </div>
                )}
                {currentCard.example_zh && (
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    {currentCard.example_zh}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '20px' }}>
                <span className="kbd-hint">按 <kbd className="shortcut-key">Space</kbd> 或</span>點擊下方按鈕翻轉查看釋義
              </div>
            )}
          </div>
        )}

        {/* --- STAGE 2: Cued Recall (中文 -> 主動回想西語) --- */}
        {mode === 'cued' && (
          <div>
            <div style={{ textAlign: 'center', margin: '16px 0 24px 0' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--google-blue)', marginBottom: '10px' }}>
                {currentCard.translation}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                <span className="badge-subtle">{currentCard.part_of_speech}</span>
              </div>
            </div>

            {/* Example with cloze mask */}
            {currentCard.example_es && (
              <div style={{
                background: '#f8f9fa',
                border: '1px solid var(--border-color)',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '16px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontStyle: 'italic', marginBottom: '6px' }}>
                  "<TappableSentence sentence={isFlipped ? currentCard.example_es : maskSentence(currentCard.example_es, currentCard)} fullSentence={currentCard.example_es} exampleZh={currentCard.example_zh} />"
                </div>
                {currentCard.example_zh && (
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
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
                    background: 'var(--google-yellow-light)', 
                    color: 'var(--google-yellow-dark)', 
                    border: '1px solid #fce8b2',
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
                    <Lightbulb size={14} color="var(--google-yellow-dark)" />
                    <span>查看字首線索</span>
                  </button>
                )}
              </div>
            )}

            {/* Revealed Answer */}
            {isFlipped && (
              <div style={{ 
                borderTop: '1px solid var(--border-color)', 
                paddingTop: '16px', 
                textAlign: 'center',
                animation: 'fadeIn 0.2s ease'
              }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {currentCard.article ? `${currentCard.article} ` : ''}{currentCard.word}
                </div>
                {currentCard.notes && (
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                    📝 {currentCard.notes}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* --- STAGE 3: Spelling (盲測精確拼寫) --- */}
        {mode === 'spelling' && (
          <div>
            {stage === 4 && (
              <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                此卡沒有可用的例句，改為拼字練習
              </div>
            )}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--google-blue)', marginBottom: '8px' }}>
                {currentCard.translation}
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                請完整拼出西語單字（注意重音符號）
              </div>
            </div>

            {/* Input Box */}
            <div style={{ maxWidth: '440px', margin: '0 auto 16px auto' }}>
              <div className="study-input-row">
                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="輸入西語單字..."
                  disabled={spellingStatus !== 'typing'}
                  style={{
                    background: '#ffffff',
                    border: spellingStatus === 'correct' 
                      ? '2px solid var(--google-green)' 
                      : spellingStatus === 'incorrect' 
                      ? '2px solid var(--google-red)' 
                      : '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 16px',
                    color: 'var(--text-primary)',
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
                  >
                    送出
                  </button>
                )}
              </div>

              {/* Special Characters Keyboard */}
              {spellingStatus === 'typing' && (
                <div className="spanish-keys">
                  {SPANISH_SPECIAL_KEYS.map(char => (
                    <button
                      key={char}
                      onClick={() => handleInsertChar(char)}
                      type="button"
                      className="spanish-key"
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
                background: 'var(--google-red-light)', 
                border: '1px solid #f6aea9',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                textAlign: 'center',
                margin: '12px auto',
                maxWidth: '440px'
              }}>
                <div style={{ color: 'var(--google-red)', fontWeight: 600, fontSize: '0.88rem', marginBottom: '4px' }}>
                  拼寫失誤，正確答案是：
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {currentCard.article ? `${currentCard.article} ` : ''}{currentCard.word}
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- STAGE 4: Contextual Cloze (語境克漏字填空) --- */}
        {mode === 'cloze' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--google-blue)', marginTop: '8px' }}>
                {currentCard.translation}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                請根據語境例句，在下方輸入框填入挖空處單字：
              </div>
            </div>

            {/* Context sentence with masked blank */}
            <div style={{
              background: '#f8f9fa',
              border: spellingStatus === 'correct' 
                ? '2px solid var(--google-green)' 
                : spellingStatus === 'incorrect' 
                ? '2px solid var(--google-red)' 
                : '1px solid var(--border-color)',
              padding: '20px 24px',
              borderRadius: 'var(--radius-lg)',
              textAlign: 'center',
              marginBottom: '20px',
              transition: 'all 0.2s ease'
            }}>
              <div style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: 1.6 }}>
                "<TappableSentence
                  sentence={spellingStatus === 'correct' || isFlipped
                    ? currentCard.example_es
                    : maskSentence(currentCard.example_es, currentCard)}
                  fullSentence={currentCard.example_es}
                  exampleZh={currentCard.example_zh}
                />"
              </div>
              {currentCard.example_zh && (
                <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '10px' }}>
                  {currentCard.example_zh}
                </div>
              )}
            </div>

            {/* Interactive Fill-in-the-Blank Input */}
            {spellingStatus === 'typing' && (
              <div style={{ maxWidth: '440px', margin: '0 auto 16px auto' }}>
                <div className="study-input-row">
                  <input
                    ref={inputRef}
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="請在此輸入挖空處單字..."
                    style={{
                      background: '#ffffff',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '12px 16px',
                      color: 'var(--text-primary)',
                      fontSize: '1.15rem',
                      textAlign: 'center',
                      fontWeight: 600,
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={handleCheckSpelling}
                    className="btn btn-primary"
                  >
                    送出填空
                  </button>
                </div>

                {/* Special Characters Keyboard */}
                <div className="spanish-keys">
                  {SPANISH_SPECIAL_KEYS.map(char => (
                    <button
                      key={char}
                      onClick={() => handleInsertChar(char)}
                      type="button"
                      className="spanish-key"
                    >
                      {char}
                    </button>
                  ))}
                </div>

                {/* "I don't know, show answer" skip button */}
                <div style={{ textAlign: 'center', marginTop: '14px' }}>
                  <button
                    onClick={() => {
                      setSpellingStatus('incorrect');
                      setIsFlipped(true);
                      playSpanishPronunciation(currentCard.article ? `${currentCard.article} ${currentCard.word}` : currentCard.word);
                    }}
                    className="btn btn-link"
                    style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}
                  >
                    💡 想不出來？直接查看解答
                  </button>
                </div>
              </div>
            )}

            {/* Correct Feedback Banner */}
            {spellingStatus === 'correct' && (
              <div style={{ 
                background: 'var(--google-green-light)', 
                border: '1px solid #a8dab5',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                textAlign: 'center',
                margin: '12px auto',
                maxWidth: '440px',
                animation: 'fadeIn 0.2s ease'
              }}>
                <div style={{ color: 'var(--google-green)', fontWeight: 700, fontSize: '0.95rem' }}>
                  🎉 填空完全正確！
                </div>
              </div>
            )}

            {/* Incorrect / Revealed Feedback */}
            {spellingStatus === 'incorrect' && (
              <div style={{ 
                background: 'var(--google-red-light)', 
                border: '1px solid #f6aea9',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                textAlign: 'center',
                margin: '12px auto',
                maxWidth: '440px',
                animation: 'fadeIn 0.2s ease'
              }}>
                <div style={{ color: 'var(--google-red)', fontWeight: 600, fontSize: '0.88rem', marginBottom: '4px' }}>
                  填空失誤，正確單字是：
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {currentCard.article ? `${currentCard.article} ` : ''}{currentCard.word}
                </div>
                {currentCard.notes && (
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    💡 {currentCard.notes}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* --- STAGE 5: Contextual multiple choice (語境四選一, distractors from the user's own library) --- */}
        {mode === 'choice' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: '#f6e8ff', color: '#8430ce', border: '1px solid #d7aefb',
                padding: '4px 14px', borderRadius: '16px', fontSize: '0.82rem', fontWeight: 700
              }}>
                <Trophy size={14} />
                <span>Stage 5 · 語境四選一</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                {clozeForms.length > 0 ? '⚡ 選出填入空格的單字（可按 1–4）' : '⚡ 選出符合中文意思的西語單字（可按 1–4）'}
              </div>
            </div>

            {clozeForms.length > 0 ? (
              <div style={{
                background: '#f8f9fa', border: '1px solid var(--border-color)', padding: '18px 22px',
                borderRadius: 'var(--radius-lg)', textAlign: 'center', marginBottom: '18px'
              }}>
                <div style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: 1.6 }}>
                  "<TappableSentence sentence={spellingStatus === 'typing' ? maskSentence(currentCard.example_es, currentCard) : currentCard.example_es} fullSentence={currentCard.example_es} exampleZh={currentCard.example_zh} />"
                </div>
                {currentCard.example_zh && (
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                    {currentCard.example_zh}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', fontSize: '1.6rem', fontWeight: 700, color: 'var(--google-blue)', margin: '8px 0 20px' }}>
                {currentCard.translation}
              </div>
            )}

            <div className="study-choice-grid">
              {choiceOptions.map((option, idx) => {
                const answered = spellingStatus !== 'typing';
                const state = !answered ? 'idle'
                  : option.correct ? 'correct'
                  : idx === chosenIndex ? 'wrong'
                  : 'muted';
                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`study-choice is-${state}`}
                    onClick={() => handleChoose(idx)}
                    disabled={answered}
                  >
                    <span className="study-choice-key">{idx + 1}</span>
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>

            {spellingStatus !== 'typing' && (
              <div style={{ textAlign: 'center', marginTop: '16px', animation: 'fadeIn 0.2s ease' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: spellingStatus === 'correct' ? 'var(--google-green)' : 'var(--google-red)' }}>
                  {spellingStatus === 'correct' ? '🎉 答對了！' : '答錯了，正確答案已標示為綠色'}
                </div>
                <div style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginTop: '6px' }}>
                  {displayWord(currentCard)} · <span style={{ color: 'var(--google-blue)', fontWeight: 600 }}>{currentCard.translation}</span>
                </div>
                {spellingStatus === 'incorrect' && currentCard.notes && (
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '6px', whiteSpace: 'pre-line' }}>
                    💡 {currentCard.notes}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* --- STAGE 5 fallback: Fluent Mastery self-check (used when the library is too small for options) --- */}
        {mode === 'fluent' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '6px', 
                background: '#f6e8ff', 
                color: '#8430ce', 
                border: '1px solid #d7aefb', 
                padding: '4px 14px', 
                borderRadius: '16px',
                fontSize: '0.82rem',
                fontWeight: 700
              }}>
                <Trophy size={14} />
                <span>Stage 5 · 長效精通極速驗證</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                ⚡ 此詞彙已固化於長期記憶區，請在 2 秒內直覺反應西語語意：
              </div>
            </div>

            <div style={{ textAlign: 'center', margin: '16px 0 20px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span className="study-word" style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                  {currentCard.article ? `${currentCard.article} ` : ''}{currentCard.word}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playSpanishPronunciation(currentCard.article ? `${currentCard.article} ${currentCard.word}` : currentCard.word);
                  }}
                  className="btn-icon"
                  style={{ marginLeft: '4px' }}
                >
                  <Volume2 size={22} color="var(--google-blue)" />
                </button>
              </div>
            </div>

            {currentCard.example_es && (
              <div style={{
                background: '#f8f9fa',
                border: '1px solid var(--border-color)',
                padding: '14px 18px',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
                marginBottom: '16px',
                fontSize: '0.98rem',
                fontStyle: 'italic',
                color: 'var(--text-primary)'
              }}>
                "<TappableSentence sentence={currentCard.example_es} fullSentence={currentCard.example_es} exampleZh={currentCard.example_zh} />"
              </div>
            )}

            {isFlipped ? (
              <div style={{ textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px', animation: 'fadeIn 0.2s ease' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--google-blue)', marginBottom: '6px' }}>
                  {currentCard.translation}
                </div>
                {currentCard.example_zh && (
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    {currentCard.example_zh}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <button
                  onClick={handleFlip}
                  className="btn btn-secondary"
                  style={{ padding: '8px 24px' }}
                >
                  翻開驗證中文釋義
                </button>
              </div>
            )}
          </div>
        )}

        {/* Word story from the lexicon, only once the answer is shown (never before answering) */}
        {(isFlipped || spellingStatus !== 'typing') && (
          <div className="study-story"><CardStory word={currentCard.word} /></div>
        )}

        {/* Bottom Rating Bar (Triggered when flipped or incorrect in Stage 3) */}
        {(isFlipped || spellingStatus === 'incorrect') && !(mode === 'choice' && spellingStatus === 'correct') ? (
          <div className="study-rating-grid">
            <button
              onClick={() => handleRate(1)}
              style={{
                background: 'var(--google-red-light)',
                border: '1px solid #f6aea9',
                color: 'var(--google-red)'
              }}
            >
              <div style={{ fontSize: '0.95rem' }}>1. 忘記</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>Again</div>
            </button>

            <button
              onClick={() => handleRate(2)}
              style={{
                background: 'var(--google-yellow-light)',
                border: '1px solid #fce8b2',
                color: 'var(--google-yellow-dark)'
              }}
            >
              <div style={{ fontSize: '0.95rem' }}>2. 吃力</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>Hard</div>
            </button>

            <button
              onClick={() => handleRate(3)}
              style={{
                background: 'var(--google-blue-light)',
                border: '1px solid #aecbfa',
                color: 'var(--google-blue)'
              }}
            >
              <div style={{ fontSize: '0.95rem' }}>3. 記得</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>Good</div>
            </button>

            <button
              onClick={() => handleRate(4)}
              style={{
                background: 'var(--google-green-light)',
                border: '1px solid #a8dab5',
                color: 'var(--google-green)'
              }}
            >
              <div style={{ fontSize: '0.95rem' }}>4. 熟練</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>Easy</div>
            </button>
          </div>
        ) : (
          (mode === 'recognition' || mode === 'cued') && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                onClick={handleFlip}
                className="btn btn-secondary"
                style={{ padding: '10px 28px', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <RotateCw size={16} />
                <span>翻轉卡片</span>
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
