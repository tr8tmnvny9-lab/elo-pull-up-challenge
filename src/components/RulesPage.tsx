import React from 'react';
import { BookOpen, Scale, Dumbbell, Zap, Clock, Info } from 'lucide-react';
import { Calendar } from 'lucide-react';

interface RulesPageProps {
    grindWeight?: number;
    endDate?: string;
}

export function RulesPage({ grindWeight = 0.5, endDate }: RulesPageProps) {
    const powerPct = Math.round((1 - grindWeight) * 100);
    const grindPct = Math.round(grindWeight * 100);

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "TBD";
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Header Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                    How It Works
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">
                    The <strong>Elo Pull-Up Challenge</strong> is a scientifically weighted competition designed to find the most impressive relative strength in the group. By combining raw performance with personal progress, we ensure that both elite athletes and dedicated beginners have a fair shot at the podium.
                </p>
            </div>

            {/* The Core Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card
                    icon={<Scale className="w-6 h-6 text-purple-600" />}
                    title="1. Fairness Multiplier"
                    description="Every athlete gets a personal multiplier based on their starting weight, age, and gender. This levels the physical playing field."
                />
                <Card
                    icon={<Zap className="w-6 h-6 text-blue-600" />}
                    title={`2. Power Score (${powerPct}%)`}
                    description={`Measures your raw strength. Your best reps multiplied by your fairness factor. Currently set to ${powerPct}% of your total.`}
                />
                <Card
                    icon={<Dumbbell className="w-6 h-6 text-emerald-600" />}
                    title={`3. Grind Score (${grindPct}%)`}
                    description={`Measures your dedication. Points awarded for every rep you add above your personal Day 1 baseline. Currently set to ${grindPct}% of your total.`}
                />
            </div>

            {/* Detailed Explanation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-xl text-slate-900 mb-6 flex items-center gap-2">
                        <Info className="w-5 h-5 text-blue-500" />
                        The Rules of Engagement
                    </h3>
                    <ul className="space-y-4 text-slate-600 text-sm">
                        <li className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">1</span>
                            <span><strong>Zero-Sum Baseline:</strong> You must exceed your Day 1 max reps to start earning "Grind" points. Every rep above baseline is a victory.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">2</span>
                            <span><strong>Health Bounty:</strong> Your multiplier is locked at your <em>starting weight</em>. If you lose weight and get leaner during the challenge, you keep the higher multiplier from your heavier self!</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">3</span>
                            <span><strong>Strict Form:</strong> Only full dead-stop pull-ups count. No kipping, no half-reps. The leaderboard is built on integrity.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">4</span>
                            <span><strong>Live Logging:</strong> Log your sets as you do them. The leaderboard resets rankings in real-time.</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Clock className="w-32 h-32" />
                    </div>
                    <h3 className="font-bold text-xl mb-6 flex items-center gap-2 relative z-10">
                        <Calendar className="w-5 h-5 text-blue-400" />
                        Timeline
                    </h3>
                    <div className="space-y-4 relative z-10">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <div className="text-xs text-slate-400 uppercase font-black tracking-widest mb-1">Challenge Concludes</div>
                            <div className="text-xl font-bold font-mono text-blue-400">
                                {formatDate(endDate)}
                            </div>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">
                            Scores are final at midnight on the end date. The leaderboard will be locked, and the athlete with the highest <strong>Allometric Progress Index</strong> will be crowned the champion.
                        </p>
                    </div>
                </div>
            </div>

            {/* The Physics & Math */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 font-mono text-sm overflow-x-auto">
                <h3 className="text-slate-900 font-bold text-lg mb-6 flex items-center gap-2">
                    <Scale className="w-5 h-5" />
                    The Math
                </h3>

                <div className="space-y-6 text-slate-600">
                    <div>
                        <div className="text-blue-600 mb-2 font-bold">// 1. The Multiplier (M)</div>
                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                            M = (Weight ^ 0.67) × GenderCoef × AgeFactor
                        </div>
                        <div className="text-[10px] mt-2 italic">Uses allometric scaling found in biological organisms to level weight classes.</div>
                    </div>

                    <div>
                        <div className="text-purple-600 mb-2 font-bold">// 2. Weighted Score Calculation</div>
                        <div className="bg-white p-3 rounded-lg border border-slate-200 text-slate-900 font-bold">
                            Total = (Power × {1 - grindWeight}) + (Grind × {grindWeight})
                        </div>
                        <div className="text-[10px] mt-2 italic">Calculated as a weighted average based on the competition settings.</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Card({ icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-4 bg-slate-50 w-12 h-12 rounded-xl flex items-center justify-center border border-slate-100">
                {icon}
            </div>
            <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
        </div>
    );
}
