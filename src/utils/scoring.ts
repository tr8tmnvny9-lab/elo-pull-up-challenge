import type { Gender, Player, ScoreBreakdown } from '../types';

const MALE_BASE = 1.0;
const FEMALE_BASE = 2.4;
const AGE_THRESHOLD = 30;
const AGE_DECAY_RATE = 0.015;

/**
 * Calculates the Fairness Multiplier (M).
 * This is calculated ONCE at registration and locked.
 */
export const calculateMultiplier = (
    startWeight: number,
    age: number,
    gender: Gender
): number => {
    // 1. Allometric Weight Factor (W_f): StartWeight ^ 0.667
    const weightFactor = Math.pow(startWeight, 0.667);

    // 2. Gender Coefficient (G_c)
    const genderCoefficient = gender === 'female' ? FEMALE_BASE : MALE_BASE;

    // 3. Age Decay Factor (A_f)
    let ageFactor = 1.0;
    if (age > AGE_THRESHOLD) {
        ageFactor = 1 + (age - AGE_THRESHOLD) * AGE_DECAY_RATE;
    }

    // M = W_f * G_c * A_f
    return weightFactor * genderCoefficient * ageFactor;
};

/**
 * Calculates the full score breakdown for a player.
 */
export const calculateScore = (player: Player): ScoreBreakdown => {
    // Use the locked multiplier
    const M = player.multiplier;

    // Part 1: Power Score (S_p) = CurrentReps * M
    const powerScore = player.currentReps * M;

    // Part 2: Grind Score (S_i)
    // Logic: max(0, (Current - Baseline)) * M * log10(Baseline + 2)
    const repIncrease = Math.max(0, player.currentReps - player.baselineReps);
    const difficultyModifier = Math.log10(player.baselineReps + 2);
    const grindScore = repIncrease * M * difficultyModifier;

    // Part 3: Total Score = (S_p + S_i) / 2
    const totalScore = (powerScore + grindScore) / 2;

    return {
        powerScore,
        grindScore,
        totalScore,
        multiplier: M,
    };
};

/**
 * Helper to get the max reps from a list of logs
 */
export const getMaxReps = (logs: { reps: number }[], baseline: number): number => {
    if (logs.length === 0) return baseline;
    const loggedMax = Math.max(...logs.map(l => l.reps));
    return Math.max(baseline, loggedMax);
};

/**
 * Calculates how many MORE reps are needed to beat a target score.
 * This is an approximation/iterative search because the score function is linear with reps,
 * but it's cleaner to solve algebraically:
 *
 * Target = (S_p_new + S_i_new) / 2
 * Logic for the "Next Point" estimation with Milestone Mode.
 * Returns the target player (or concept), the target score, and reps needed.
 */
export const getNextPointTarget = (
    player: Player,
    allPlayers: Player[]
): { targetLabel: string; targetScore: number; repsNeeded: number } | null => {
    // Sort players by score descending
    const sortedPlayers = [...allPlayers]
        .map(p => ({ ...p, score: calculateScore(p).totalScore }))
        .sort((a, b) => b.score - a.score);

    const myRankIndex = sortedPlayers.findIndex(p => p.id === player.id);
    if (myRankIndex === -1) return null; // Should not happen

    const myRank = myRankIndex + 1;
    let targetScore = 0;
    let targetLabel = '';

    // Milestone Mode Logic
    if (myRank === 1) {
        // Dynasty Buffer: 10% lead over Rank #2
        if (sortedPlayers.length < 2) return { targetLabel: 'Dynasty', targetScore: 0, repsNeeded: 0 }; // Solo player
        const rank2Score = sortedPlayers[1].score;
        targetScore = rank2Score * 1.10;
        targetLabel = 'maintain 10% lead';
    } else if (myRank <= 5) {
        // Eye on the Prize: Target Rank #1
        const rank1 = sortedPlayers[0];
        targetScore = rank1.score + 1; // +1 Victory Buffer
        targetLabel = `overtake ${rank1.name} (#1)`;
    } else {
        // Immediate Gratification: Target Rank above
        const rankAbove = sortedPlayers[myRankIndex - 1];
        targetScore = rankAbove.score + 1; // +1 Victory Buffer
        targetLabel = `overtake ${rankAbove.name} (#${myRank - 1})`;
    }

    // Calculate Reps Requirement
    // Formula: R_new = ((2 * T_score / M) + (R_start * L)) / (1 + L)
    const M = player.multiplier;
    const R_base = player.baselineReps;
    const L = Math.log10(R_base + 2);

    const numerator = (2 * targetScore / M) + (R_base * L);
    const denominator = 1 + L;

    const calculatedReps = numerator / denominator;

    // Round UP to nearest whole number
    let requiredReps = Math.ceil(calculatedReps);

    // The "One More" Rule: If calc <= current, force current + 1
    // This ensures they physically do something to get the points
    if (requiredReps <= player.currentReps) {
        requiredReps = player.currentReps + 1;
    }

    const repsNeeded = requiredReps - player.currentReps;

    return {
        targetLabel,
        targetScore,
        repsNeeded
    };
};
