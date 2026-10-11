/**
 * FSRS (Free Spaced Repetition Scheduler) v4.5 Lightweight Engine
 * Pure JavaScript, Zero-dependency, ultra-fast & memory-friendly (<1MB)
 */

// Default FSRS v4.5 weights
const DEFAULT_WEIGHTS = [
  0.40255, 1.18385, 3.173, 15.69105, // Initial Stability S0 for ratings 1, 2, 3, 4
  7.1949, 0.5345,                    // Initial Difficulty D0 parameters
  1.4604, 0.0046,                    // Difficulty update parameters
  1.5457, 0.1192, 1.0192,            // Stability update for recall success
  1.9395, 0.11, 0.29605, 0.22698,    // Stability update for recall lapse (failure)
  0.2315, 2.9898,                    // Hard & Easy bonuses
  0.51655, 0.6621                    // Short-term parameters
];

const { formatLocalDateTime } = require('./time');

const FACTOR = 19.0 / 81.0; // Decay factor ensuring R(S, S) = 0.9 (90% target retention)
const DECAY_POWER = 0.5;

/**
 * Calculate Retrievability (probability of recall)
 * @param {number} elapsedDays - Days since last review
 * @param {number} stability - Current stability S in days
 * @returns {number} R between 0 and 1
 */
function calculateRetrievability(elapsedDays, stability) {
  if (stability <= 0) return 0;
  if (elapsedDays <= 0) return 1.0;
  return Math.pow(1 + FACTOR * (elapsedDays / stability), -DECAY_POWER);
}

/**
 * Clamp a number between min and max
 */
function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

/**
 * Initial difficulty D0
 * @param {number} grade - Rating 1 (Again), 2 (Hard), 3 (Good), 4 (Easy)
 */
function initialDifficulty(grade, w = DEFAULT_WEIGHTS) {
  const d0 = w[4] - Math.exp(w[5] * (grade - 1)) + 1;
  return clamp(d0, 1.0, 10.0);
}

/**
 * Initial stability S0
 */
function initialStability(grade, w = DEFAULT_WEIGHTS) {
  const idx = Math.max(1, Math.min(4, Math.round(grade))) - 1;
  return Math.max(0.1, w[idx]);
}

/**
 * Update Difficulty
 */
function nextDifficulty(currD, grade, w = DEFAULT_WEIGHTS) {
  const deltaD = -w[6] * (grade - 3);
  const nextD = w[7] * initialDifficulty(4, w) + (1 - w[7]) * (currD + deltaD);
  return clamp(nextD, 1.0, 10.0);
}

/**
 * Update Stability on successful recall (Grade 2, 3, 4)
 */
function nextRecallStability(currD, currS, r, grade, w = DEFAULT_WEIGHTS) {
  const hardPenalty = grade === 2 ? w[15] : 1.0;
  const easyBonus = grade === 4 ? w[16] : 1.0;
  const factor = 1 + Math.exp(w[8]) * (11 - currD) * Math.pow(currS, -w[9]) * (Math.exp(w[10] * (1 - r)) - 1) * hardPenalty * easyBonus;
  return Math.max(0.1, currS * factor);
}

/**
 * Update Stability on lapse (Grade 1 / Again)
 */
function nextForgetStability(currD, currS, r, w = DEFAULT_WEIGHTS) {
  const factor = w[11] * Math.pow(currD, -w[12]) * (Math.pow(currS + 1, w[13]) - 1) * Math.exp(w[14] * (1 - r));
  return clamp(factor, 0.1, currS);
}

/**
 * Calculate recommended interval in days for a target retention (default 0.9)
 */
function calculateInterval(stability, targetRetention = 0.9) {
  if (stability <= 0) return 1;
  const interval = (stability / FACTOR) * (Math.pow(targetRetention, -1 / DECAY_POWER) - 1);
  return Math.max(1, Math.round(interval));
}

/**
 * Determine the updated Mastery Stage (1 ~ 5)
 * Stage 1: Recognition (西語 -> 中文)
 * Stage 2: Cued Recall (中文 -> 西語提示回想)
 * Stage 3: Orthographic Production (精確拼寫與特殊符號)
 * Stage 4: Contextual Cloze (語境例句填空與搭配詞)
 * Stage 5: Mastered (自動化精通)
 */
function determineMasteryStage(currStage, grade, stability, reps, lapseCount) {
  let stage = currStage || 1;

  if (grade === 1) {
    // Lapse: drop stage back by 1 if above Stage 1
    stage = Math.max(1, stage - 1);
    return stage;
  }

  // Promotion criteria based on Stability and Repetitions
  if (stage === 1 && stability >= 2.5 && reps >= 2 && grade >= 3) {
    stage = 2;
  } else if (stage === 2 && stability >= 6.0 && reps >= 3 && grade >= 3) {
    stage = 3;
  } else if (stage === 3 && stability >= 16.0 && reps >= 5 && grade >= 3) {
    stage = 4;
  } else if (stage === 4 && stability >= 45.0 && reps >= 7 && grade >= 3) {
    stage = 5;
  }

  return stage;
}

/**
 * Core FSRS review scheduler
 * @param {Object} card - Existing card record
 * @param {number} grade - Rating 1 (Again), 2 (Hard), 3 (Good), 4 (Easy)
 * @param {Object} options - { targetRetention: 0.9, now: Date }
 */
function reviewCardFSRS(card, grade, options = {}) {
  const targetRetention = options.targetRetention || 0.9;
  const now = options.now || new Date();

  const prevStability = Number(card.fsrs_stability) || 0;
  const prevDifficulty = Number(card.fsrs_difficulty) || 5.0;
  const reps = Number(card.fsrs_reps) || 0;
  const lapseCount = Number(card.lapse_count) || 0;
  const currStage = Number(card.mastery_stage) || 1;

  // Calculate elapsed days since last review
  let elapsedDays = 0;
  if (card.last_reviewed) {
    const lastDate = new Date(card.last_reviewed);
    const diffMs = now.getTime() - lastDate.getTime();
    elapsedDays = Math.max(0, diffMs / (1000 * 60 * 60 * 24));
  }

  const retrievability = prevStability > 0 ? calculateRetrievability(elapsedDays, prevStability) : 1.0;

  let newStability;
  let newDifficulty;
  let newReps = reps;
  let newLapseCount = lapseCount;

  if (prevStability <= 0 || reps === 0) {
    // First time review
    newStability = initialStability(grade);
    newDifficulty = initialDifficulty(grade);
    if (grade >= 2) {
      newReps = 1;
    } else {
      newLapseCount += 1;
    }
  } else {
    // Subsequent review
    newDifficulty = nextDifficulty(prevDifficulty, grade);

    if (grade === 1) {
      // Failed / Again
      newStability = nextForgetStability(newDifficulty, prevStability, retrievability);
      newReps = 0;
      newLapseCount += 1;
    } else {
      // Success (Hard, Good, Easy)
      newStability = nextRecallStability(newDifficulty, prevStability, retrievability, grade);
      newReps += 1;
    }
  }

  const intervalDays = calculateInterval(newStability, targetRetention);
  const newStage = determineMasteryStage(currStage, grade, newStability, newReps, newLapseCount);

  // Calculate new due date
  const dueDate = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);
  // Store in local time like every other timestamp (toISOString() would be UTC)
  const dueDateStr = formatLocalDateTime(dueDate);

  return {
    stability: Math.round(newStability * 100) / 100,
    difficulty: Math.round(newDifficulty * 100) / 100,
    intervalDays,
    reps: newReps,
    lapseCount: newLapseCount,
    stage: newStage,
    dueDate: dueDateStr,
    retrievability: Math.round(retrievability * 100) / 100,
    isMastered: newStage >= 5
  };
}

module.exports = {
  calculateRetrievability,
  calculateInterval,
  initialDifficulty,
  initialStability,
  nextDifficulty,
  nextRecallStability,
  nextForgetStability,
  determineMasteryStage,
  reviewCardFSRS
};
