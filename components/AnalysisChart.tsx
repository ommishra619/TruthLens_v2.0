import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface AnalysisChartProps {
  score: number;
  isDarkMode: boolean;
}

const AnalysisChart: React.FC<AnalysisChartProps> = ({ score, isDarkMode }) => {
  // Scale: 
  // 0-25: Legitimate (Green)
  // 25-50: Cautious (Yellow)
  // 50-75: Suspicious (Orange)
  // 75-100: Highly Suspicious (Red)
  
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];

  const getColor = (s: number) => {
    if (s <= 25) return '#22c55e'; // Green-500
    if (s <= 50) return '#eab308'; // Yellow-500
    if (s <= 75) return '#f97316'; // Orange-500
    return '#ef4444'; // Red-500
  };

  const activeColor = getColor(score);
  // Dark mode: Slate-700 (#334155), Light mode: Slate-200 (#e2e8f0)
  const emptyColor = isDarkMode ? '#334155' : '#e2e8f0';

  return (
    <div className="relative h-64 w-full flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="70%"
            startAngle={180}
            endAngle={0}
            innerRadius={80}
            outerRadius={100}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell key="cell-score" fill={activeColor} />
            <Cell key="cell-remaining" fill={emptyColor} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="text-5xl font-bold text-slate-900 dark:text-white mb-1 transition-colors">{score}</div>
        <div className="text-sm font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Fake Score
        </div>
      </div>
    </div>
  );
};

export default AnalysisChart;