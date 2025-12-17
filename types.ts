
export interface ReviewAnalysis {
  id: string;
  reviewerName: string;
  rating: number;
  text: string;
  date: string; // ISO Date string
  fakeScore: number; // 0-100
  flags: string[]; // e.g., "Repetitive Phrasing", "Bot-like Syntax"
  sentiment: 'Positive' | 'Negative' | 'Neutral';
}

export interface AnalysisSource {
  uri: string;
  title: string;
}

export interface AnalysisResult {
  productName: string;
  overallScore: number; // 0 (Legit) - 100 (Fake)
  verdict: string; // e.g., "Highly Suspicious", "Likely Legitimate"
  summary: string;
  keyInsights: string[];
  reviews: ReviewAnalysis[];
  ratingDistribution: { star: number; count: number }[];
  sources?: AnalysisSource[];
}

export enum AnalysisState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface User {
  name: string;
  email: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  result: AnalysisResult;
  url: string;
}
