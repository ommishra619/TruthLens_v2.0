import React from 'react';
import { ShieldCheck, Menu, Moon, Sun, User as UserIcon, LogOut, History } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  onHowItWorksClick: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  user: User | null;
  currentView: string;
  onNavigate: (view: 'home' | 'auth' | 'history') => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  onHowItWorksClick, 
  isDarkMode, 
  toggleTheme, 
  user,
  currentView,
  onNavigate,
  onLogout
}) => {
  return (
    <nav className="w-full py-4 px-6 md:px-12 flex justify-between items-center border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
      <div 
        className="flex items-center gap-2 text-red-600 dark:text-cyan-400 transition-colors duration-300 cursor-pointer"
        onClick={() => onNavigate('home')}
      >
        <ShieldCheck size={32} strokeWidth={2.5} />
        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">TruthLens</span>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
          
          <button onClick={onHowItWorksClick} className="hover:text-red-600 dark:hover:text-cyan-400 transition-colors">
            Methodology
          </button>

          {user ? (
            <>
              <button 
                onClick={() => onNavigate('history')}
                className={`flex items-center gap-1.5 transition-colors ${currentView === 'history' ? 'text-red-600 dark:text-cyan-400 font-bold' : 'hover:text-red-600 dark:hover:text-cyan-400'}`}
              >
                <History size={16} /> History
              </button>
              <div className="h-4 w-px bg-slate-300 dark:bg-slate-700"></div>
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-200">
                <UserIcon size={16} /> {user.name}
              </div>
              <button 
                onClick={onLogout}
                className="text-red-500 hover:text-red-700 ml-2"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
             <button 
               onClick={() => onNavigate('auth')}
               className={`px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold hover:opacity-90 transition-all ${currentView === 'auth' ? 'opacity-90' : ''}`}
             >
               Login
             </button>
          )}
        </div>

        {/* Theme Slider */}
        <button 
          onClick={toggleTheme}
          className="relative w-16 h-8 rounded-full bg-slate-200 dark:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-cyan-500"
          aria-label="Toggle Dark Mode"
        >
          <div className="absolute inset-0 flex justify-between items-center px-2">
            <Sun size={14} className="text-orange-500 opacity-0 dark:opacity-100 transition-opacity" />
            <Moon size={14} className="text-slate-600 opacity-100 dark:opacity-0 transition-opacity" />
          </div>
          <div 
            className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center ${
              isDarkMode ? 'translate-x-8' : 'translate-x-0'
            }`}
          >
            {isDarkMode ? (
              <Moon size={14} className="text-slate-800" />
            ) : (
              <Sun size={14} className="text-orange-500" />
            )}
          </div>
        </button>
        
        <button className="md:hidden text-slate-600 dark:text-slate-300">
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;