import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Player } from '../types';
import { calculateScore } from '../utils/scoring';

interface ScoreChartProps {
    players: Player[];
}

export const ScoreChart: React.FC<ScoreChartProps> = ({ players }) => {
    const data = players.map(p => {
        const score = calculateScore(p);
        return {
            name: p.name,
            Power: Math.round(score.powerScore),
            Grind: Math.round(score.grindScore),
            Total: Math.round(score.totalScore),
        };
    }).sort((a, b) => b.Total - a.Total);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Score Composition</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip
                            cursor={{ fill: '#F1F5F9' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar dataKey="Power" stackId="a" fill="#3B82F6" radius={[0, 0, 4, 4]} />
                        <Bar dataKey="Grind" stackId="a" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
