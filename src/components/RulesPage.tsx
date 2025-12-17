import { BookOpen, Scale, Dumbbell, Zap } from 'lucide-react';

export function RulesPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                    The Logic of the Challenge
                </h2>

                <div className="prose prose-slate max-w-none">
                    <p className="text-lg text-slate-600 leading-relaxed">
                        The <strong>Elo Pull-Up Challenge</strong> isn't just about who can do the most reps.
                        It's about <strong>who is the most impressive athlete relative to their biology</strong>.
                        We use the <em>Allometric Progress Index (API)</em> to level the playing field between lightweights, heavyweights, men, and women.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                    <Card
                        icon={<Scale className="w-6 h-6 text-purple-600" />}
                        title="1. The Fairness Multiplier"
                        description="We calculate a multiplier based on your STARTING weight, age, and gender. Heavier people get a higher multiplier because pull-ups are exponentially harder with mass."
                    />
                    <Card
                        icon={<Zap className="w-6 h-6 text-blue-600" />}
                        title="2. Power Score (50%)"
                        description="Pure strength. Your current reps multiplied by your fairness multiplier. This rewards being strong right now."
                    />
                    <Card
                        icon={<Dumbbell className="w-6 h-6 text-emerald-600" />}
                        title="3. Grind Score (50%)"
                        description="Pure improvement. You get massive points for every rep you add above your baseline. This rewards hard work."
                    />
                </div>
            </div>

            <div className="bg-slate-900 text-slate-300 rounded-2xl p-8 font-mono text-sm overflow-x-auto">
                <h3 className="text-white font-bold text-lg mb-4 mb-6">The Math</h3>

                <div className="space-y-6">
                    <div>
                        <div className="text-emerald-400 mb-2">// 1. The Multiplier (M)</div>
                        <div>M = (Weight ^ 0.67) × GenderCoef × AgeFactor</div>
                    </div>

                    <div>
                        <div className="text-blue-400 mb-2">// 2. The Total Score</div>
                        <div>Score = (Power + Grind) / 2</div>
                    </div>

                    <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                        <div className="text-yellow-400 mb-2 font-bold">The "Health Bounty" Rule 🍎</div>
                        <p>
                            Your multiplier is locked at your <strong>Starting Weight</strong>.
                            If you lose weight during the challenge, pull-ups become easier,
                            but you keep your heavy-weight multiplier!
                            This is the "Health Bounty" — getting fit is the ultimate cheat code.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Card({ icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
            <div className="mb-3 bg-white w-10 h-10 rounded-lg flex items-center justify-center shadow-sm border border-slate-100">
                {icon}
            </div>
            <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
        </div>
    );
}
