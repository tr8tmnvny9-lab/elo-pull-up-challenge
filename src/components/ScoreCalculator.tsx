import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { calculateMultiplier, calculateScore } from '../utils/scoring';
import type { Gender, Player } from '../types';

export function ScoreCalculator({ grindWeight = 0.5 }: { grindWeight?: number }) {
    const [weight, setWeight] = useState<number>(80);
    const [age, setAge] = useState<number>(30);
    const [gender, setGender] = useState<Gender>('male');
    const [baseline, setBaseline] = useState<number>(10);
    const [current, setCurrent] = useState<number>(12);

    // Real-time calculation
    const multiplier = calculateMultiplier(weight, age, gender);

    const mockPlayer: Player = {
        id: 'test',
        name: 'Test',
        age,
        gender,
        startWeight: weight,
        baselineReps: baseline,
        currentReps: current,
        multiplier,
        logs: []
    };

    const score = calculateScore(mockPlayer, grindWeight);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Calculator className="w-24 h-24 text-blue-600" />
            </div>

            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-600" />
                Fairness Calculator
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* INPUTS */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                            Body Weight (kg)
                        </label>
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-slate-700"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                Age
                            </label>
                            <input
                                type="number"
                                value={age}
                                onChange={(e) => setAge(Number(e.target.value))}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-slate-700"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                Gender
                            </label>
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value as Gender)}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-slate-700 bg-white"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 text-blue-600">
                                Baseline Reps
                            </label>
                            <input
                                type="number"
                                value={baseline}
                                onChange={(e) => setBaseline(Number(e.target.value))}
                                className="w-full px-3 py-2 border border-blue-100 bg-blue-50/50 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-blue-900"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 text-emerald-600">
                                Current Reps
                            </label>
                            <input
                                type="number"
                                value={current}
                                onChange={(e) => setCurrent(Number(e.target.value))}
                                className="w-full px-3 py-2 border border-emerald-100 bg-emerald-50/50 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-mono text-emerald-900"
                            />
                        </div>
                    </div>
                </div>

                {/* RESULTS */}
                <div className="bg-slate-50 rounded-xl p-6 flex flex-col justify-center space-y-6">
                    <div className="text-center">
                        <div className="text-sm text-slate-500 mb-1">Fairness Multiplier</div>
                        <div className="text-4xl font-bold text-slate-800 tracking-tight">
                            {multiplier.toFixed(2)}x
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                            Based on {weight}kg, {gender}, {age}yo
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                            <div className="text-xs text-blue-600 font-semibold mb-1">POWER</div>
                            <div className="text-xl font-bold text-slate-700">{Math.round(score.powerScore * (1 - grindWeight))}</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                            <div className="text-xs text-emerald-600 font-semibold mb-1">GRIND</div>
                            <div className="text-xl font-bold text-slate-700">{Math.round(score.grindScore * grindWeight)}</div>
                        </div>
                    </div>

                    <div className="text-center border-t border-slate-200 pt-4">
                        <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Total API Score</div>
                        <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                            {score.totalScore.toFixed(0)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
