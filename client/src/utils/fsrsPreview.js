/**
 * FSRS Dynamic Interval Preview Utility
 * Calculates estimated intervals for rating buttons (1: Again, 2: Hard, 3: Good, 4: Easy)
 */

export function getFsrsButtonIntervals(card) {
  if (!card) {
    return {
      again: '1天',
      hard: '1天',
      good: '3天',
      easy: '16天'
    };
  }

  const stability = Number(card.fsrs_stability) || 0;
  const reps = Number(card.fsrs_reps) || Number(card.repetition) || 0;

  // New or uninitialized card
  if (stability <= 0 || reps === 0) {
    return {
      again: '1天',
      hard: '1天',
      good: '3天',
      easy: '16天'
    };
  }

  // Cards with established stability
  // FSRS v4.5 approximations based on target retention 0.9:
  const hardDays = Math.max(1, Math.round(stability * 0.85));
  const goodDays = Math.max(2, Math.round(stability * 2.2));
  const easyDays = Math.max(4, Math.round(stability * 3.8));

  const formatDays = (days) => {
    if (days >= 30) {
      const months = Math.round(days / 30);
      return `${months}個月`;
    }
    return `${days}天`;
  };

  return {
    again: '1天',
    hard: formatDays(hardDays),
    good: formatDays(goodDays),
    easy: formatDays(easyDays)
  };
}
