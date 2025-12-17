import { User, AnalysisResult, HistoryItem } from '../types';

const USERS_KEY = 'truthlens_users';
const CURRENT_USER_KEY = 'truthlens_current_user';
const HISTORY_KEY_PREFIX = 'truthlens_history_';

// Mock database in localStorage
const getUsers = (): Record<string, any> => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : {};
};

export const authService = {
  login: (email: string, password: string): User => {
    const users = getUsers();
    const user = users[email];
    
    // In a real app, we would hash passwords. For this demo, simple comparison.
    if (user && user.password === password) {
      const userData = { name: user.name, email: user.email };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
      return userData;
    }
    throw new Error('Invalid email or password');
  },

  signup: (name: string, email: string, password: string): User => {
    const users = getUsers();
    if (users[email]) {
      throw new Error('User already exists');
    }

    const newUser = { name, email, password };
    users[email] = newUser;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    const userData = { name, email };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
    return userData;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  saveAnalysis: (email: string, url: string, result: AnalysisResult) => {
    const key = `${HISTORY_KEY_PREFIX}${email}`;
    const historyJson = localStorage.getItem(key);
    const history: HistoryItem[] = historyJson ? JSON.parse(historyJson) : [];

    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      url,
      result
    };

    // Add to beginning, limit to last 50
    const updatedHistory = [newItem, ...history].slice(0, 50);
    localStorage.setItem(key, JSON.stringify(updatedHistory));
  },

  getHistory: (email: string): HistoryItem[] => {
    const key = `${HISTORY_KEY_PREFIX}${email}`;
    const historyJson = localStorage.getItem(key);
    return historyJson ? JSON.parse(historyJson) : [];
  }
};