import type { Player } from './types';

// Hardcoded minimal player to test import
export const INITIAL_PLAYERS: Player[] = [
    {
        id: "test",
        name: "Test Player",
        age: 30,
        gender: 'male',
        startWeight: 80,
        baselineReps: 10,
        currentReps: 12,
        multiplier: 1.0,
        logs: []
    }
];
