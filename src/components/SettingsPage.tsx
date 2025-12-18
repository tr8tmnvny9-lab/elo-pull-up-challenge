import React from 'react';
import { Calendar, Save, ArrowLeft, Activity } from 'lucide-react';

interface SettingsPageProps {
    endDate: string;
    grindWeight: number;
    onSave: (date: string, grindWeight: number) => void;
    onBack: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ endDate, grindWeight, onSave, onBack }) => {
    const [date, setDate] = React.useState(endDate);
    const [weight, setWeight] = React.useState(grindWeight);
    const [isSaved, setIsSaved] = React.useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(date, weight);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-8 group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
            </button>

            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="bg-slate-900 p-8 text-white">
                    <h2 className="text-2xl font-bold mb-2">Challenge Settings</h2>
                    <p className="text-slate-400 text-sm">Configure the timeline and global parameters for the Elo Pull-Up Challenge.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-10">
                    {/* Date Setting */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <Calendar className="w-5 h-5 text-blue-600" />
                            </div>
                            <label className="font-bold text-slate-800">Challenge End Date</label>
                        </div>

                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-900 font-medium"
                        />
                    </div>

                    {/* Balance Setting */}
                    <div className="space-y-6 pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <Activity className="w-5 h-5 text-purple-600" />
                            </div>
                            <label className="font-bold text-slate-800">Scoring Balance</label>
                        </div>

                        <p className="text-sm text-slate-500 leading-relaxed mb-4">
                            Adjust how much the final score emphasizes raw strength (Power) versus improvement over time (Grind).
                        </p>

                        <div className="px-2">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-4">
                                <span className={weight < 0.5 ? "text-blue-600" : "text-slate-400"}>Strength-Focused</span>
                                <span className={weight > 0.5 ? "text-emerald-600" : "text-slate-400"}>Effort-Focused</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={weight}
                                onChange={(e) => setWeight(parseFloat(e.target.value))}
                                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-mono uppercase">
                                <span>{Math.round((1 - weight) * 100)}% Power</span>
                                <span>{Math.round(weight * 100)}% Grind</span>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-600 leading-relaxed italic border border-slate-100">
                            {weight === 0.5 ?
                                "Balanced: Progress and baseline capability are equally weighted." :
                                weight < 0.5 ?
                                    "Power-Based: Rewards those who start strong and maintain high performance." :
                                    "Grind-Based: Highly rewards athletes who show the most improvement relative to Day 1."
                            }
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            {isSaved ? (
                                <>
                                    <Activity className="w-5 h-5 animate-pulse" />
                                    Configuration Saved!
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Save Configuration
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="bg-slate-50 p-6 border-t border-slate-100">
                    <div className="flex items-start gap-4">
                        <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                        <p className="text-xs text-slate-500 leading-normal">
                            Note: These settings are stored locally in your browser and affect live scoring and charts for all participants.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
