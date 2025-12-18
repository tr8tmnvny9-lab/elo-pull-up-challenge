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
            Power: Math.round(score.powerScore / 2),
            Grind: Math.round(score.grindScore / 2),
            Total: Math.round(score.totalScore),
        };
    }).sort((a, b) => b.Total - a.Total);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Score Distribution</h3>
            </div>

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
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis
                            tick={{ fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                            label={{ value: 'Points', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#94a3b8', fontWeight: 600 } }}
                        />
                        <Tooltip
                            cursor={{ fill: '#F1F5F9' }}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend verticalAlign="top" height={36} />
                        <Bar dataKey="Power" stackId="a" fill="#3B82F6" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="Grind" stackId="a" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
