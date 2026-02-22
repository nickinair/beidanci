
export interface Word {
  id: string;
  english: string;
  chinese: string;
  level: 'primary' | 'junior' | 'senior' | 'university';
  grade?: number;
}

export interface Question {
  word: Word;
  options: string[];
  correctAnswer: string;
}

export interface Attempt {
  english: string;
  chinese: string;
  userAnswer: string;
  isCorrect: boolean;
}

export interface PointRecord {
  amount: number;
  reason: string;
  timestamp: number;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  correctCount: number;
  timeSpent: number;
  pointsEarned: number;
  attempts: Attempt[];
  timestamp: number;
}

export interface School {
  id: string;
  name: string;
  type: 'primary' | 'junior' | 'senior';
  province: string;
  city: string;
  district: string;
}

export interface WrongQuestion {
  id: string;
  word: Word;
  userAnswer: string;
  timestamp: number;
}

export interface UserProfile {
  id?: string; // Supabase UUID
  name: string; // Nickname
  phone?: string; // Login phone number
  avatar: string;

  // Location & School Info
  province?: string;
  city?: string;
  district?: string;
  schoolId?: string;
  schoolName?: string;
  grade?: number; // 1-6 (primary), 7-9 (junior), 10-12 (senior)

  // Check-in
  lastCheckIn?: string;   // ISO date string 'YYYY-MM-DD'
  checkInStreak?: number; // Consecutive days

  totalPoints: number;
  highScore: number;
  history: QuizResult[];
  pointRecords: PointRecord[];
  wrongQuestions: WrongQuestion[];
}

export type AppState = 'login' | 'home' | 'quiz' | 'result' | 'history' | 'profile' | 'leaderboard' | 'rules' | 'profile-setup' | 'error-book' | 'rewards';
