import type { Player } from './types';
import { calculateMultiplier } from './utils/scoring';

const generateId = () => Math.random().toString(36).substr(2, 9);

// Helper to create initial players with correct multiplier
const createInitialPlayer = (
    name: string,
    age: number,
    gender: 'male' | 'female',
    startWeight: number,
    baselineReps: number,
    currentReps: number
): Player => {
    const multiplier = calculateMultiplier(startWeight, age, gender);
    // const multiplier = 1.0; // HARDCODED DEBUG

    // Create some mock logs
    const logs = [];
    // Day 1 log
    logs.push({
        id: generateId(),
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
        reps: baselineReps
    });

    if (currentReps > baselineReps) {
        logs.push({
            id: generateId(),
            date: new Date().toISOString(),
            reps: currentReps
        });
    }

    return {
        id: name.toLowerCase(),
        name,
        age,
        gender,
        startWeight,
        baselineReps: baselineReps === 0 ? 1 : baselineReps, // Enforce min baseline of 1 per rules
        currentReps: Math.max(baselineReps, currentReps),
        multiplier,
        logs
    };
};

export const INITIAL_PLAYERS: Player[] = [
    // 1. The "Gym Rat" (John)
    // Profile: 30yo Male, 80kg. Start: 20 reps. End: 25 reps.
    createInitialPlayer("John", 30, 'male', 80, 20, 25),

    // 2. The "Newbie" (Sarah)
    // Profile: 45yo Female, 65kg. Start: 0 reps. End: 3 reps.
    createInitialPlayer("Sarah", 45, 'female', 65, 0, 3),

    // 3. The "Heavyweight" (Mike)
    // Profile: 35yo Male, 110kg. Start: 2 reps. End: 6 reps.
    createInitialPlayer("Mike", 35, 'male', 110, 2, 6),

    // 4. "Dave from Accounting" (The Rival)
    // Just a generic mid-tier to fill the board
    createInitialPlayer("Dave", 28, 'male', 75, 10, 12),
];
