export type Gender = 'male' | 'female';

export interface Log {
    id: string;
    date: string; // ISO string
    reps: number;
}

export interface Player {
    id: string;
    name: string;
    age: number;
    gender: Gender;
    startWeight: number; // kg - LOCKED on Day 1
    baselineReps: number; // Day 1 Max - LOCKED
    multiplier: number; // Calculated once at registration
    currentReps: number; // The highest reps achieved so far (max of all logs)
    logs: Log[];
}

export interface ScoreBreakdown {
    powerScore: number;
    grindScore: number;
    totalScore: number;
    multiplier: number;
}
