import React, { useState } from 'react';
import { ReviewAnalysis } from '../types';
import { AlertTriangle, CheckCircle, User, MessageSquare, Calendar, Filter } from 'lucide-react';

interface ReviewListProps {
  reviews: ReviewAnalysis[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  const [filter, setFilter] = useState<'all' | 'suspicious' | 'safe'>('all');

  const filteredReviews = reviews.filter(r => {
    if (filter === 'suspicious') return r.fakeScore > 50;
    if (filter === 'safe') return r.fakeScore <= 50;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-200 flex items-center gap-2 transition-colors">
          <MessageSquare size={20} className="text-red-600 dark:text-cyan-400" />
          Individual Review Analysis
        </h3>
        
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          <button 
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filter === 'all' ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            All ({reviews.length})
          </button>
          <button 
            onClick={() => setFilter('suspicious')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filter === 'suspicious' ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Suspicious ({reviews.filter(r => r.fakeScore > 50).length})
          </button>
          <button 
            onClick={() => setFilter('safe')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filter === 'safe' ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Legit ({reviews.filter(r => r.fakeScore <= 50).length})
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400 italic">
            No reviews match this filter.
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div 
              key={review.id} 
              className={`bg-white dark:bg-slate-800/50 rounded-lg p-5 border transition-all shadow-sm ${
                review.fakeScore > 70 
                  ? 'border-red-200 dark:border-red-900/50 hover:border-red-300 dark:hover:border-red-800' 
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
                    <User size={20} />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-slate-200 flex items-center gap-2">
                      {review.reviewerName}
                      <span className="text-[10px] font-normal text-slate-400 flex items-center gap-1">
                        <Calendar size={10} /> {review.date}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
                      <span className="text-slate-300">{'★'.repeat(5 - review.rating)}</span>
                    </div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  review.fakeScore > 50 
                    ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400' 
                    : 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400'
                }`}>
                  {review.fakeScore > 50 ? 'FAKE' : 'REAL'} ({review.fakeScore}%)
                </div>
              </div>
              
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4 italic relative pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                "{review.text}"
              </p>
              
              {review.flags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {review.flags.map((flag, idx) => (
                    <span key={idx} className="flex items-center gap-1 text-xs text-yellow-700 dark:text-yellow-500 bg-yellow-100 dark:bg-yellow-500/10 px-2 py-1 rounded border border-yellow-200 dark:border-transparent font-medium">
                      <AlertTriangle size={10} />
                      {flag}
                    </span>
                  ))}
                </div>
              )}
               {review.flags.length === 0 && (
                 <div className="flex gap-2">
                   <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-700/50 px-2 py-1 rounded border border-slate-200 dark:border-transparent">
                     <CheckCircle size={10} />
                     No Anomalies Detected
                   </span>
                 </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewList;