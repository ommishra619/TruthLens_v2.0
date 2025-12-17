import React, { useEffect, useState } from 'react';
import { HistoryItem, User } from '../types';
import { authService } from '../services/authService';
import { Calendar, Search, ArrowRight, Trash2 } from 'lucide-react';

interface HistoryPageProps {
  user: User;
  onViewResult: (item: HistoryItem) => void;
}

const HistoryPage: React.FC<HistoryPageProps> = ({ user, onViewResult }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (user) {
      setHistory(authService.getHistory(user.email));
    }
  }, [user]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const getScoreColor = (score: number) => {
    if (score <= 30) return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800';
    if (score <= 60) return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200 dark:border-orange-800';
    return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800';
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-400">
          <Search size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No History Found</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-8">
          You haven't analyzed any products yet. Go to the dashboard to start your first analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-8 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 px-4">
        <Calendar className="text-red-600 dark:text-cyan-400" /> Analysis History
      </h2>

      <div className="grid gap-4 px-4">
        {history.map((item) => (
          <div 
            key={item.id}
            className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getScoreColor(item.result.overallScore)}`}>
                  Score: {item.result.overallScore}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  {formatDate(item.timestamp)}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white truncate pr-4">
                {item.result.productName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-1">
                {item.url}
              </p>
            </div>

            <button 
              onClick={() => onViewResult(item)}
              className="flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg font-medium text-sm transition-colors group-hover:bg-red-50 dark:group-hover:bg-cyan-900/20 group-hover:text-red-600 dark:group-hover:text-cyan-400"
            >
              View Report <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;