import React from 'react';
import { X, Shield, Search, Cpu, PenTool, Database } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="text-red-600 dark:text-cyan-400" /> AI Fraud Intelligence
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <p className="text-slate-600 dark:text-slate-300 mb-6 font-medium">
            TruthLens utilizes a multi-layered Neural Synthesis engine to detect sophisticated e-commerce manipulation that standard tools miss.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
             {/* Content Analysis */}
             <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50">
               <h3 className="text-red-600 dark:text-cyan-400 font-semibold mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                 <Cpu size={16} /> Neural Processing
               </h3>
               <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                 <li className="flex gap-2"><span className="text-slate-400 dark:text-slate-600">•</span> <span><strong>LLM Profiling:</strong> Detects patterns unique to AI generators.</span></li>
                 <li className="flex gap-2"><span className="text-slate-400 dark:text-slate-600">•</span> <span><strong>Syntax Entropy:</strong> Identifies unnaturally consistent phrasing.</span></li>
                 <li className="flex gap-2"><span className="text-slate-400 dark:text-slate-600">•</span> <span><strong>Sentiment Synthesis:</strong> Flags forced emotional peaks.</span></li>
               </ul>
             </div>

             {/* Semantic & Logic */}
             <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50">
               <h3 className="text-red-600 dark:text-cyan-400 font-semibold mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                 <PenTool size={16} /> Linguistic Vectors
               </h3>
               <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                 <li className="flex gap-2"><span className="text-slate-400 dark:text-slate-600">•</span> <span><strong>Tone Verification:</strong> Checks for incentivized review speech.</span></li>
                 <li className="flex gap-2"><span className="text-slate-400 dark:text-slate-600">•</span> <span><strong>Feature Over-Optimization:</strong> Flags unnatural keyword stuffing.</span></li>
                 <li className="flex gap-2"><span className="text-slate-400 dark:text-slate-600">•</span> <span><strong>Context Discrepancy:</strong> Detects if review text matches the product.</span></li>
               </ul>
             </div>
             
             {/* Metadata */}
             <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 md:col-span-2">
               <h3 className="text-red-600 dark:text-cyan-400 font-semibold mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                 <Database size={16} /> Pattern Recognition
               </h3>
               <div className="grid sm:grid-cols-3 gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex gap-2"><span className="text-slate-400 dark:text-slate-600">•</span> <span><strong>Velocity Defense:</strong> Detects sudden spikes in reviews.</span></div>
                  <div className="flex gap-2"><span className="text-slate-400 dark:text-slate-600">•</span> <span><strong>Cross-Platform Linking:</strong> Finds duplicate text across the web.</span></div>
                  <div className="flex gap-2"><span className="text-slate-400 dark:text-slate-600">•</span> <span><strong>Bot Profiling:</strong> Identifies known malicious reviewer IDs.</span></div>
               </div>
             </div>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <h4 className="text-slate-900 dark:text-white font-semibold mb-3 text-sm">Integrity Index</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="bg-green-500/10 border border-green-500/20 p-2 rounded text-center">
                <div className="text-green-600 dark:text-green-500 font-bold text-lg">0-25</div>
                <div className="text-green-600/80 dark:text-green-500/80 text-xs font-bold">AUTHENTIC</div>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 p-2 rounded text-center">
                <div className="text-yellow-600 dark:text-yellow-500 font-bold text-lg">25-50</div>
                <div className="text-yellow-600/80 dark:text-yellow-500/80 text-xs font-bold">SUSPECT</div>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/20 p-2 rounded text-center">
                <div className="text-orange-600 dark:text-orange-500 font-bold text-lg">50-75</div>
                <div className="text-orange-600/80 dark:text-orange-500/80 text-xs font-bold">FRAUD RISK</div>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 p-2 rounded text-center">
                <div className="text-red-600 dark:text-red-500 font-bold text-lg">75-100</div>
                <div className="text-red-600/80 dark:text-red-500/80 text-xs font-bold">CONFIRMED FRAUD</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-white hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white px-6 py-2 rounded-lg font-medium transition-colors border border-slate-200 dark:border-transparent shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksModal;