import React, { useState, useRef, useEffect } from 'react';
import Navbar from './components/Navbar';
import ResultsDashboard from './components/ResultsDashboard';
import HowItWorksModal from './components/HowItWorksModal';
import AuthPage from './components/AuthPage';
import HistoryPage from './components/HistoryPage';
import { AnalysisState, AnalysisResult, User, HistoryItem } from './types';
import { analyzeUrl } from './services/analysisService';
import { authService } from './services/authService';
import { Scan, AlertCircle, Loader2, ArrowRight, ShieldCheck, ChevronDown, Save, Cpu } from 'lucide-react';

const App: React.FC = () => {
  // State: Core
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'auth' | 'history'>('home');
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // State: Analysis
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<AnalysisState>(AnalysisState.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const resultsRef = useRef<HTMLDivElement>(null);

  // Initialize
  useEffect(() => {
    // Check local storage for user
    const savedUser = authService.getCurrentUser();
    if (savedUser) setUser(savedUser);

    // Dark mode init
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Auth Handlers
  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentView('home');
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setCurrentView('home');
  };

  // Analysis Handler
  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setStatus(AnalysisState.ANALYZING);
    setErrorMsg(null);
    setResult(null); 
    // If on history view, switch back to home to see results
    if (currentView !== 'home') setCurrentView('home');

    try {
      const data = await analyzeUrl(url);
      setResult(data);
      setStatus(AnalysisState.COMPLETE);

      // Auto-save if logged in
      if (user) {
        authService.saveAnalysis(user.email, url, data);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred.");
      setStatus(AnalysisState.ERROR);
    }
  };

  // Scroll to results
  useEffect(() => {
    if (status === AnalysisState.COMPLETE && resultsRef.current && currentView === 'home') {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [status, currentView]);

  const handleReset = () => {
    setUrl('');
    setResult(null);
    setStatus(AnalysisState.IDLE);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setResult(item.result);
    setUrl(item.url);
    setStatus(AnalysisState.COMPLETE);
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col font-sans transition-colors duration-300">
      <Navbar 
        onHowItWorksClick={() => setIsModalOpen(true)} 
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        user={user}
        currentView={currentView}
        onNavigate={setCurrentView}
        onLogout={handleLogout}
      />
      
      <HowItWorksModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <main className="flex-grow flex flex-col items-center w-full">
        
        {/* VIEW: AUTH PAGE */}
        {currentView === 'auth' && (
          <div className="w-full flex-grow flex items-center justify-center">
            <AuthPage onLogin={handleLogin} />
          </div>
        )}

        {/* VIEW: HISTORY PAGE */}
        {currentView === 'history' && user && (
           <HistoryPage user={user} onViewResult={loadHistoryItem} />
        )}

        {/* VIEW: HOME (ANALYZER) */}
        {currentView === 'home' && (
          <>
            {/* Hero / Input Section */}
            <section className="w-full bg-white dark:bg-slate-900 pt-16 pb-12 px-4 md:px-8 flex flex-col items-center border-b border-slate-200 dark:border-slate-800/50 shadow-sm dark:shadow-2xl z-10 transition-colors duration-300">
              <div className="max-w-4xl w-full text-center animate-in fade-in slide-in-from-top-4 duration-700">
                
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 dark:bg-cyan-500/10 dark:border-cyan-500/20 text-red-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-6 transition-colors duration-300">
                  <span className="w-2 h-2 rounded-full bg-red-600 dark:bg-cyan-500 animate-pulse"></span>
                  Neural Fraud Defense Active
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
                  Expose Sophisticated <br className="hidden md:block"/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500 dark:from-cyan-400 dark:to-blue-500">AI-Powered Fraud</span>
                </h1>
                
                <p className="text-slate-600 dark:text-slate-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                  Deep-learning synthesis across multiple data vectors. We unmask linguistic anomalies, bot farm fingerprints, and sentiment manipulation in real-time.
                </p>

                <form onSubmit={handleAnalyze} className="relative max-w-xl mx-auto group mb-12">
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-orange-400 dark:from-cyan-500 dark:to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative flex items-center bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden transition-colors duration-300">
                    <Scan className="ml-4 text-slate-400 dark:text-slate-500 shrink-0" size={20} />
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="Paste suspicious product or review URL..."
                      className="w-full bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 px-4 py-4 focus:ring-0 outline-none"
                      required
                    />
                    <button
                      type="submit"
                      disabled={status === AnalysisState.ANALYZING}
                      className="bg-red-600 hover:bg-red-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:text-slate-500 dark:disabled:text-slate-400 text-white dark:text-slate-900 font-bold px-6 py-4 transition-all flex items-center gap-2 shrink-0"
                    >
                      {status === AnalysisState.ANALYZING ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <>
                          Synthesize <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {!user && (
                   <p className="text-sm text-slate-500 dark:text-slate-400 animate-in fade-in duration-1000 delay-300">
                     Want to track global fraud trends? <span className="text-red-600 dark:text-cyan-400 font-bold cursor-pointer hover:underline" onClick={() => setCurrentView('auth')}>Join the TruthLens Network</span>.
                   </p>
                )}

                {/* Features Grid */}
                {status === AnalysisState.IDLE && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto mt-12">
                    {[
                      { title: 'Neural Synthesis', desc: 'Cross-references review data against global LLM-generated patterns.' },
                      { title: 'Fraud Vectoring', desc: 'Identifies unnatural emotional peaks and sentiment bias.' },
                      { title: 'Bot Fingerprinting', desc: 'Flags technical metadata and suspicious review velocity.' },
                    ].map((item, i) => (
                      <div key={i} className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800/60 shadow-sm dark:shadow-none transition-all duration-300">
                        <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-slate-700/80 flex items-center justify-center text-red-600 dark:text-cyan-400 mb-3">
                          <Cpu size={16} />
                        </div>
                        <h3 className="text-slate-900 dark:text-white font-medium mb-1">{item.title}</h3>
                        <p className="text-sm text-slate-500 leading-snug">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Content Section (Loading / Results / Error) */}
            <div ref={resultsRef} className="w-full max-w-5xl px-4 md:px-8">
              
              {/* Loading State */}
              {status === AnalysisState.ANALYZING && (
                <div className="py-24 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="relative mb-8">
                    <div className="w-20 h-20 border-4 border-slate-200 dark:border-slate-800 border-t-red-600 dark:border-t-cyan-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-3 bg-red-600 dark:bg-cyan-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Analyzing Fraud Vectors...</h2>
                  <div className="flex flex-col items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                    <p>Fetching multi-source intelligence...</p>
                    <p>Synthesizing linguistic fingerprints...</p>
                    <p>Executing neural fraud detection protocols...</p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {status === AnalysisState.ERROR && (
                <div className="py-20 flex justify-center animate-in zoom-in-95 duration-300">
                  <div className="max-w-lg w-full bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-500/20 p-8 rounded-2xl text-center backdrop-blur-sm">
                    <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Defense Protocol Failed</h3>
                    <p className="text-red-600/80 dark:text-red-200/80 mb-6">{errorMsg}</p>
                    <button
                      onClick={() => setStatus(AnalysisState.IDLE)}
                      className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-6 py-2.5 rounded-lg transition-colors text-sm font-medium border border-slate-200 dark:border-slate-700 shadow-sm"
                    >
                      Clear & Try Again
                    </button>
                  </div>
                </div>
              )}

              {/* Results State */}
              {status === AnalysisState.COMPLETE && result && (
                <div className="py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-2 text-red-400 dark:text-cyan-400/50 text-sm uppercase tracking-widest font-bold">
                      <ChevronDown className="animate-bounce" /> Fraud Report Finalized {user && <span className="text-slate-500 dark:text-slate-500 normal-case tracking-normal ml-2 font-normal flex items-center gap-1">(<Save size={12}/> Locked to history)</span>}
                    </div>
                  </div>
                  <ResultsDashboard result={result} onReset={handleReset} isDarkMode={isDarkMode} />
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <footer className="py-8 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 text-center text-slate-500 dark:text-slate-600 text-sm transition-colors duration-300">
        <p>&copy; {new Date().getFullYear()} TruthLens Intelligence. AI-Driven Integrity Monitoring.</p>
      </footer>
    </div>
  );
};

export default App;