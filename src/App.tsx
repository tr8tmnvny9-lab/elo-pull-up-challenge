import { useState, useEffect } from 'react';
import { INITIAL_PLAYERS } from './mockData';
import { Leaderboard } from './components/Leaderboard';
import type { Player, Gender } from './types';
import { Plus, Activity, BookOpen, Calculator, X, Save, UserPlus, Settings as SettingsIcon, Clock } from 'lucide-react';
import { ScoreChart } from './components/ScoreChart';
import { RulesPage } from './components/RulesPage';
import { ScoreCalculator } from './components/ScoreCalculator';
import { SettingsPage } from './components/SettingsPage';
import eloLogo from './assets/elo-logo.png';
import { calculateMultiplier } from './utils/scoring';

type View = 'dashboard' | 'rules' | 'calculator' | 'settings';

function App() {
  // Load from LocalStorage or fall back to Initial Mock Data
  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem('elo-players');
    return saved ? JSON.parse(saved) : INITIAL_PLAYERS;
  });

  const [challengeEndDate, setChallengeEndDate] = useState<string>(() => {
    return localStorage.getItem('elo-challenge-end') || '';
  });

  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);

  // Persistence Effect
  useEffect(() => {
    localStorage.setItem('elo-players', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('elo-challenge-end', challengeEndDate);
  }, [challengeEndDate]);

  const handleAddPlayer = (newPlayer: Player) => {
    setPlayers(prev => [...prev, newPlayer]);
    setIsAddPlayerModalOpen(false);
  };

  const handleLogScore = (playerId: string, reps: number) => {
    setPlayers(prev => prev.map(p => {
      if (p.id !== playerId) return p;

      const newLog = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        reps: reps
      };

      const updatedLogs = [...p.logs, newLog];
      const newCurrentReps = Math.max(p.currentReps, reps);

      return {
        ...p,
        logs: updatedLogs,
        currentReps: newCurrentReps
      };
    }));
    setIsLogModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur-md z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
            <img src={eloLogo} alt="Elo" className="h-10 w-auto object-contain" />
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            <div>
              <h1 className="font-bold text-slate-900 leading-none text-lg">Pull-Up Challenge</h1>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Mutual Pension Fund</span>
            </div>
          </div>

          <nav className="flex items-center gap-1 sm:gap-2">
            <NavButton
              active={currentView === 'dashboard'}
              onClick={() => setCurrentView('dashboard')}
              icon={<Activity className="w-4 h-4" />}
              label="Leaderboard"
            />
            <NavButton
              active={currentView === 'calculator'}
              onClick={() => setCurrentView('calculator')}
              icon={<Calculator className="w-4 h-4" />}
              label="Calculator"
            />
            <NavButton
              active={currentView === 'rules'}
              onClick={() => setCurrentView('rules')}
              icon={<BookOpen className="w-4 h-4" />}
              label="The Rules"
            />
            <NavButton
              active={currentView === 'settings'}
              onClick={() => setCurrentView('settings')}
              icon={<SettingsIcon className="w-4 h-4" />}
              label="Settings"
            />

            <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>

            <button
              onClick={() => setIsLogModalOpen(true)}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm active:scale-95 ml-2"
            >
              <Plus className="w-4 h-4" />
              Log Reps
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 min-h-[calc(100vh-5rem)]">

        {currentView === 'dashboard' && (
          <Dashboard
            players={players}
            endDate={challengeEndDate}
            onAddPlayer={() => setIsAddPlayerModalOpen(true)}
          />
        )}

        {currentView === 'rules' && (
          <div className="max-w-4xl mx-auto">
            <RulesPage />
          </div>
        )}

        {currentView === 'calculator' && (
          <div className="max-w-4xl mx-auto">
            <ScoreCalculator />
          </div>
        )}

        {currentView === 'settings' && (
          <SettingsPage
            endDate={challengeEndDate}
            onSave={(d) => {
              setChallengeEndDate(d);
              // Keep the state update but let user navigate back manually or via dashboard?
              // The user prompted they want it to work after setting. 
              // Maybe they want immediate feedback.
            }}
            onBack={() => setCurrentView('dashboard')}
          />
        )}

      </main>

      {/* Modals */}
      {isLogModalOpen && (
        <LogRepsModal
          players={players}
          onClose={() => setIsLogModalOpen(false)}
          onSubmit={handleLogScore}
        />
      )}

      {isAddPlayerModalOpen && (
        <AddPlayerModal
          onClose={() => setIsAddPlayerModalOpen(false)}
          onSubmit={handleAddPlayer}
        />
      )}

      {/* Mobile Log Button */}
      <div className="fixed bottom-6 right-6 sm:hidden">
        <button
          onClick={() => setIsLogModalOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-full text-sm font-semibold shadow-lg active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Log Reps
        </button>
      </div>

    </div>
  );
}

// Sub-component for Dashboard to keep App clean
function Dashboard({ players, endDate, onAddPlayer }: { players: Player[], endDate: string, onAddPlayer: () => void }) {
  const daysLeft = () => {
    if (!endDate) return "Not Set";

    // Parse components explicitly to avoid timezone ambiguity
    const parts = endDate.split('-');
    if (parts.length !== 3) return "Error";
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]);
    const day = parseInt(parts[2]);

    const end = new Date(year, month - 1, day, 0, 0, 0, 0);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (isNaN(end.getTime())) return "Error";

    const diffTime = end.getTime() - now.getTime();
    const msInDay = 1000 * 60 * 60 * 24;

    // Result is the number of calendar days from today
    const diffDays = Math.round(diffTime / msInDay);

    return diffDays >= 0 ? diffDays : 0;
  };

  const daysLabel = () => {
    if (!endDate) return "Configure in Settings";
    const left = daysLeft();
    if (typeof left === 'string') return left;
    return left === 1 ? "Day Remaining" : "Days Remaining";
  };

  const leftValue = daysLeft();

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      {/* Hero / Stat overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Days Left"
          value={leftValue.toString()}
          subValue={daysLabel()}
          color="blue"
          icon={<Clock className="w-4 h-4" />}
        />
        <StatCard
          label="Current Leader"
          value={players.length > 0
            ? [...players].sort((a, b) => b.currentReps - a.currentReps)[0].name
            : "-"}
          color="emerald"
          subValue="Most Reps"
          icon={<Activity className="w-4 h-4" />}
        />
        <button
          onClick={onAddPlayer}
          className="group relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all cursor-pointer"
        >
          <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <UserPlus className="w-5 h-5 text-slate-600" />
          </div>
          <span className="font-semibold text-slate-700">Add New Player</span>
          <span className="text-xs text-slate-400">Join the challenge</span>
        </button>
      </div>

      {/* Leaderboard and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Leaderboard players={players} />
        </div>
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-transparent">
            <ScoreChart players={players} />
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Activity className="w-24 h-24" />
            </div>
            <h3 className="font-bold text-lg mb-2 relative z-10">The Grind Matters</h3>
            <p className="text-indigo-100 text-sm mb-4 relative z-10">
              50% of your score comes from beating your past self.
              Every rep above your baseline is worth massive points!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`
                flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                ${active
          ? 'bg-blue-50 text-blue-700'
          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
        }
            `}
    >
      {icon}
      <span className="hidden md:inline">{label}</span>
    </button>
  )
}

function StatCard({ label, value, color, subValue, icon }: { label: string, value: string, color: 'blue' | 'emerald' | 'purple', subValue?: string, icon?: any }) {
  const colors = {
    blue: 'bg-blue-50 border-blue-100 text-blue-600 text-blue-900',
    emerald: 'bg-emerald-50 border-emerald-100 text-emerald-600 text-emerald-900',
    purple: 'bg-purple-50 border-purple-100 text-purple-600 text-purple-900',
  };

  const bgClass = colors[color].split(' ')[0];
  const borderClass = colors[color].split(' ')[1];
  const labelClass = colors[color].split(' ')[2];
  const valueClass = colors[color].split(' ')[3];

  return (
    <div className={`${bgClass} p-6 rounded-2xl border ${borderClass} relative overflow-hidden`}>
      <div className="flex justify-between items-start mb-1">
        <div className={`${labelClass} font-semibold text-xs uppercase tracking-wider`}>{label}</div>
        {icon && <div className={`${labelClass} opacity-50`}>{icon}</div>}
      </div>
      <div className={`text-3xl font-black ${valueClass}`}>
        {value}
      </div>
      {subValue && <div className="text-xs opacity-60 mt-1 font-medium">{subValue}</div>}
    </div>
  )
}

// --- MODALS ---

function LogRepsModal({ players, onClose, onSubmit }: {
  players: Player[],
  onClose: () => void,
  onSubmit: (id: string, reps: number) => void
}) {
  const [selectedPlayer, setSelectedPlayer] = useState<string>(players[0]?.id || '');
  const [reps, setReps] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPlayer && reps) {
      onSubmit(selectedPlayer, parseInt(reps));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">Log New Set</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Athlete</label>
            <select
              value={selectedPlayer}
              onChange={(e) => setSelectedPlayer(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-slate-50"
            >
              <option value="" disabled>Select Athlete</option>
              {players.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Result (Reps)</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 pl-12 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-lg font-mono"
                autoFocus
                required
              />
              <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
          >
            <Save className="w-5 h-5" />
            Save Result
          </button>
        </form>
      </div>
    </div>
  );
}


function AddPlayerModal({ onClose, onSubmit }: {
  onClose: () => void,
  onSubmit: (player: Player) => void
}) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'male' as Gender,
    startWeight: '',
    baselineReps: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const age = parseInt(formData.age);
    const startWeight = parseFloat(formData.startWeight);
    const baselineReps = parseInt(formData.baselineReps);

    // Verify inputs
    if (!formData.name || isNaN(age) || isNaN(startWeight) || isNaN(baselineReps)) return;

    const multiplier = calculateMultiplier(startWeight, age, formData.gender);

    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name: formData.name,
      age,
      gender: formData.gender,
      startWeight,
      baselineReps,
      multiplier,
      currentReps: 0,
      logs: []
    };

    onSubmit(newPlayer);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">New Challenger</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              placeholder="Full Name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                placeholder="Years"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value as Gender })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={formData.startWeight}
                onChange={e => setFormData({ ...formData, startWeight: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                placeholder="kg"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Max Reps (Day 1)</label>
              <input
                type="number"
                value={formData.baselineReps}
                onChange={e => setFormData({ ...formData, baselineReps: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                placeholder="Reps"
                required
              />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl text-xs text-blue-800 leading-relaxed">
            <span className="font-bold">Note:</span> Your Multiplier will be calculated based on these stats and <strong>locked forever</strong>. Make sure they are accurate!
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all mt-4"
          >
            Create Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
