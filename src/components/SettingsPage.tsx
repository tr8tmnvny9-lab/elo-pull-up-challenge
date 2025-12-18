import React from 'react';
import { Calendar, Save, ArrowLeft, Activity } from 'lucide-react';

interface SettingsPageProps {
    endDate: string;
    onSave: (date: string) => void;
    onBack: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ endDate, onSave, onBack }) => {
    const [date, setDate] = React.useState(endDate);
    const [isSaved, setIsSaved] = React.useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(date);
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

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <Calendar className="w-5 h-5 text-blue-600" />
                            </div>
                            <label className="font-bold text-slate-800">Challenge End Date</label>
                        </div>

                        <p className="text-sm text-slate-500 leading-relaxed">
                            Setting an end date will activate the countdown on the dashboard.
                            The challenge will automatically "conclude" at the end of this day.
                        </p>

                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-900 font-medium"
                        />
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
                            Note: These settings are stored locally in your browser. If you clear your site data, you may need to re-configure the end date.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
