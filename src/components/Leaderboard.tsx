import React, { useMemo, useState, useRef } from 'react';
import type { Player } from '../types';
import { calculateScore, getNextPointTarget } from '../utils/scoring';
import clsx from 'clsx';
import { Trophy, Dumbbell, Trash2 } from 'lucide-react';

interface LeaderboardProps {
    players: Player[];
    onDelete?: (player: Player) => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ players, onDelete }) => {
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
                    Swipe to Edit
                </span>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-[640px]">
                    <div className="text-xs font-semibold text-slate-500 bg-slate-50/50 uppercase tracking-wider border-b border-slate-100 flex">
                        <div className="px-6 py-3 w-16 text-center">Rank</div>
                        <div className="px-6 py-3 flex-1">Athlete</div>
                        <div className="px-6 py-3 w-32 text-right">Total Score</div>
                        <div className="px-6 py-3 w-60">The Breakdown</div>
                        <div className="px-6 py-3 w-48 hidden md:block">Next Milestone</div>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {sortedPlayers.map((player, index) => (
                            <SwipeableRow
                                key={player.id}
                                player={player as any}
                                rank={index + 1}
                                allPlayers={players}
                                onDelete={onDelete}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

interface SwipeableRowProps {
    player: Player & { totalScore: number; powerScore: number; grindScore: number };
    rank: number;
    allPlayers: Player[];
    onDelete?: (player: Player) => void;
}

const SwipeableRow: React.FC<SwipeableRowProps> = ({ player, rank, allPlayers, onDelete }) => {
    const [startX, setStartX] = useState<number | null>(null);
    const [translateX, setTranslateX] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const rowRef = useRef<HTMLDivElement>(null);

    const nextPoint = useMemo(() => getNextPointTarget(player, allPlayers), [player, allPlayers]);

    const handleTouchStart = (e: React.TouchEvent) => {
        setStartX(e.touches[0].clientX);
        setIsSwiping(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (startX === null) return;
        const currentX = e.touches[0].clientX;
        const diff = currentX - startX;

        // Only allow swiping left
        if (diff < 0) {
            setTranslateX(Math.max(diff, -80));
        } else if (isMenuOpen && diff > 0) {
            setTranslateX(Math.min(-80 + diff, 0));
        }
    };

    const handleTouchEnd = () => {
        setIsSwiping(false);
        if (translateX < -40) {
            setTranslateX(-80);
            setIsMenuOpen(true);
        } else {
            setTranslateX(0);
            setIsMenuOpen(false);
        }
        setStartX(null);
    };

    const resetSwipe = () => {
        setTranslateX(0);
        setIsMenuOpen(false);
    };

    return (
        <div className="relative group overflow-hidden bg-white">
            {/* Delete Action Layer */}
            <div
                className="absolute inset-y-0 right-0 w-20 bg-red-500 flex items-center justify-center cursor-pointer"
                onClick={() => {
                    onDelete?.(player);
                    resetSwipe();
                }}
            >
                <Trash2 className="w-6 h-6 text-white" />
            </div>

            {/* Row Content */}
            <div
                ref={rowRef}
                style={{
                    transform: `translateX(${translateX}px)`,
                    transition: isSwiping ? 'none' : 'transform 0.3s ease-out'
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className={clsx(
                    "relative flex items-center bg-white border-b border-transparent transition-colors z-10",
                    rank === 1 ? "bg-yellow-50/30 hover:bg-yellow-50/60" : "hover:bg-slate-50"
                )}
            >
                <div className="px-6 py-4 w-16 text-center">
                    <div className={clsx(
                        "w-8 h-8 rounded-full flex items-center justify-center font-bold mx-auto border",
                        rank === 1 ? "bg-yellow-100 text-yellow-700 border-yellow-200" :
                            rank === 2 ? "bg-slate-100 text-slate-700 border-slate-200" :
                                rank === 3 ? "bg-orange-50 text-orange-700 border-orange-200" :
                                    "bg-white text-slate-500 border-transparent"
                    )}>
                        {rank}
                    </div>
                </div>

                <div className="px-6 py-4 flex-1 min-w-0">
                    <div>
                        <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                            {player.name}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-2 whitespace-nowrap overflow-hidden">
                            <span>{player.gender === 'male' ? 'M' : 'F'}, {player.age}y</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span>{player.startWeight}kg</span>
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[10px]">
                                M:{player.multiplier.toFixed(1)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 w-32 text-right shrink-0">
                    <div className="text-2xl font-bold text-slate-900 tracking-tight">
                        {Math.round(player.totalScore).toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">POINTS</div>
                </div>

                <div className="px-6 py-4 w-60 shrink-0">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1.5 text-slate-700 font-medium whitespace-nowrap">
                                <Dumbbell className="w-3.5 h-3.5 text-blue-500" />
                                {player.currentReps} Reps
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium">
                                (S:{player.baselineReps})
                            </span>
                        </div>
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
                    </div>
                </div>

                <div className="px-6 py-4 w-48 shrink-0 hidden md:block">
                    {nextPoint ? (
                        <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                            <div className="text-[10px] text-slate-500 mb-0.5">
                                {rank <= 5 && rank > 1 ? "To Overtake #1:" : "Next Rank:"}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={clsx(
                                    "font-bold text-sm",
                                    nextPoint.repsNeeded <= 1 ? "text-emerald-600" : "text-slate-700"
                                )}>
                                    +{nextPoint.repsNeeded} Reps
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-xs text-yellow-600 font-medium flex items-center gap-1.5">
                            <Trophy className="w-3 h-3" />
                            Leader
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
