import React, { useMemo } from 'react';
import type { Player } from '../types';
import { calculateScore, getNextPointTarget } from '../utils/scoring';
import clsx from 'clsx';
import { Trophy, Dumbbell } from 'lucide-react';

interface LeaderboardProps {
    players: Player[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ players }) => {
    const sortedPlayers = useMemo(() => {
        return [...players]
            .map(p => {
                const score = calculateScore(p);
                return { ...p, ...score };
            })
            .sort((a, b) => b.totalScore - a.totalScore);
    }, [players]);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Live Leaderboard
                </h2>
                <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase">
                    Locked Profile System
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-xs font-semibold text-slate-500 bg-slate-50/50 uppercase tracking-wider border-b border-slate-100">
                            <th className="px-6 py-3 w-16 text-center">Rank</th>
                            <th className="px-6 py-3">Athlete</th>
                            <th className="px-6 py-3 text-right">Total Score</th>
                            <th className="px-6 py-3">The Breakdown</th>
                            <th className="px-6 py-3 hidden md:table-cell">Next Milestone</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {sortedPlayers.map((player, index) => {
                            const rank = index + 1;
                            const nextPoint = getNextPointTarget(player, players);

                            return (
                                <tr
                                    key={player.id}
                                    className={clsx(
                                        "group transition-colors",
                                        rank === 1 ? "bg-yellow-50/30 hover:bg-yellow-50/60" : "hover:bg-slate-50"
                                    )}
                                >
                                    <td className="px-6 py-4 text-center">
                                        <div className={clsx(
                                            "w-8 h-8 rounded-full flex items-center justify-center font-bold mx-auto border",
                                            rank === 1 ? "bg-yellow-100 text-yellow-700 border-yellow-200" :
                                                rank === 2 ? "bg-slate-100 text-slate-700 border-slate-200" :
                                                    rank === 3 ? "bg-orange-50 text-orange-700 border-orange-200" :
                                                        "bg-white text-slate-500 border-transparent"
                                        )}>
                                            {rank}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                {player.name}
                                            </div>
                                            <div className="text-xs text-slate-500 flex items-center gap-2">
                                                <span>{player.gender === 'male' ? 'M' : 'F'}, {player.age}y</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                <span>Start: {player.startWeight}kg</span>
                                                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[10px]">
                                                    M: {player.multiplier.toFixed(1)}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <div className="text-2xl font-bold text-slate-900 tracking-tight">
                                            {Math.round(player.totalScore).toLocaleString()}
                                        </div>
                                        <div className="text-xs text-slate-400 font-medium">POINTS</div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1.5 max-w-[240px]">
                                            {/* Current Reps Badge */}
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                                                    <Dumbbell className="w-3.5 h-3.5 text-blue-500" />
                                                    {player.currentReps} Reps
                                                </div>
                                                <span className="text-xs text-slate-400">
                                                    (Start: {player.baselineReps})
                                                </span>
                                            </div>

                                            {/* Scores Micro-Bar */}
                                            <div className="flex items-center gap-1 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-500 rounded-full"
                                                    style={{ width: `${(player.powerScore / (player.powerScore + player.grindScore)) * 100}%` }}
                                                />
                                                <div
                                                    className="h-full bg-emerald-500 rounded-full"
                                                    style={{ width: `${(player.grindScore / (player.powerScore + player.grindScore)) * 100}%` }}
                                                />
                                            </div>

                                            <div className="flex justify-between text-[10px] uppercase font-semibold text-slate-400">
                                                <span className="text-blue-600">Power</span>
                                                <span className="text-emerald-600">Grind</span>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 hidden md:table-cell">
                                        {nextPoint ? (
                                            <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                                                <div className="text-xs text-slate-500 mb-1">
                                                    {rank <= 5 && rank > 1 ? "To Overtake #1:" : "Next Rank:"}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={clsx(
                                                        "font-bold text-sm",
                                                        nextPoint.repsNeeded <= 1 ? "text-emerald-600" : "text-slate-700"
                                                    )}>
                                                        +{nextPoint.repsNeeded} Reps
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 leading-tight">
                                                        to {nextPoint.targetLabel}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-xs text-yellow-600 font-medium flex items-center gap-1.5">
                                                <Trophy className="w-3 h-3" />
                                                Leader
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
