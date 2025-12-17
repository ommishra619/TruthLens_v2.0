import React from 'react';
import { AnalysisResult } from '../types';
import AnalysisChart from './AnalysisChart';
import ReviewList from './ReviewList';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertCircle, CheckCircle2, Search, AlertTriangle, AlertOctagon, TrendingUp, ExternalLink, Link2 } from 'lucide-react';

interface ResultsDashboardProps {
  result: AnalysisResult | null;
  onReset: () => void;
  isDarkMode: boolean;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result, onReset, isDarkMode }) => {
  if (!result) return null;

  const getVerdictConfig = (score: number) => {
    if (score <= 30) return { text: 'LEGITIMATE', desc: 'Authentic patterns.', color: 'text-green-600 dark:text-green-500', borderColor: 'border-green-200 dark:border-green-500/20', bg: 'bg-green-50 dark:bg-green-500/10', icon: CheckCircle2 };
    if (score <= 60) return { text: 'SUSPICIOUS', desc: 'Anomalies detected.', color: 'text-orange-600 dark:text-orange-500', borderColor: 'border-orange-200 dark:border-orange-500/20', bg: 'bg-orange-50 dark:bg-orange-500/10', icon: AlertTriangle };
    return { text: 'HIGH RISK', desc: 'Likely manipulated.', color: 'text-red-600 dark:text-red-500', borderColor: 'border-red-200 dark:border-red-500/20', bg: 'bg-red-50 dark:bg-red-500/10', icon: AlertOctagon };
  };

  const config = getVerdictConfig(result.overallScore);
  const VerdictIcon = config.icon;

  return (
    <div className="animate-fade-in w-full max-w-6xl mx-auto pb-20">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">Analysis Report</h2>
        <button onClick={onReset} className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors font-medium">
          <Search size={16} /> Analyze Another
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
        
        {/* Trust Score Card */}
        <div className="md:col-span-4 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xl transition-colors relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-1 ${config.bg.split(' ')[0]}`}></div>
          <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-4 text-center">Trust Score</h3>
          <div className="mb-4">
            <AnalysisChart score={result.overallScore} isDarkMode={isDarkMode} />
          </div>
          <div className={`p-4 rounded-xl border ${config.borderColor} ${config.bg} flex flex-col items-center text-center`}>
            <div className="flex items-center gap-2 mb-1">
              <VerdictIcon className={config.color} size={20} />
              <span className={`text-lg font-bold ${config.color}`}>{config.text}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">{config.desc}</p>
          </div>
        </div>

        {/* Insights & Results */}
        <div className="md:col-span-8 flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{result.productName}</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">{result.summary}</p>
            <div className="grid sm:grid-cols-3 gap-3">
              {result.keyInsights.map((insight, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/50 text-xs font-medium text-slate-700 dark:text-slate-300">
                  {insight}
                </div>
              ))}
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors flex flex-col">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <TrendingUp size={14} /> Rating Distribution
            </h3>
            <div className="flex-1 min-h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={result.ratingDistribution}>
                  <XAxis dataKey="star" tick={{fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 12}} tickFormatter={(val) => `${val}★`} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{fill: isDarkMode ? '#334155' : '#f1f5f9'}}
                    contentStyle={{borderRadius: '8px', border: 'none', backgroundColor: isDarkMode ? '#1e293b' : '#fff', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {result.ratingDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.star === 1 || entry.star === 5 ? (isDarkMode ? '#ef4444' : '#dc2626') : (isDarkMode ? '#3b82f6' : '#2563eb')} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Sources / Evidence Section */}
      {result.sources && result.sources.length > 0 && (
        <div className="mb-8 bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Link2 size={16} /> Verification Evidence
          </h3>
          <div className="flex flex-wrap gap-3">
            {result.sources.map((source, idx) => (
              <a 
                key={idx} 
                href={source.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 transition-all hover:scale-105"
              >
                <span className="truncate max-w-[200px]">{source.title}</span>
                <ExternalLink size={12} className="shrink-0 text-slate-400" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Review Breakdown */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 lg:p-8 transition-colors">
        <ReviewList reviews={result.reviews} />
      </div>
    </div>
  );
};

export default ResultsDashboard;