export type TrackSlug = 'python' | 'ai-ml' | 'cloud';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'basic' | 'api' | 'django';

export interface UserPreferences {
  theme: 'dark' | 'light';
  notifications: boolean;
}

export interface User {
  _id: string;
  googleId?: string;
  email: string;
  name: string;
  avatarUrl: string;
  createdAt: string;
  lastLoginAt: string;
  preferences: UserPreferences;
  refreshTokenHash?: string;
  role?: 'admin' | 'user';
  streak?: number;
  lastActiveDate?: string;
}

export interface Track {
  _id: string;
  name: string;
  slug: TrackSlug;
  description: string;
  levels: SkillLevel[];
}

export type QuestionType = 'mcq' | 'multi' | 'code-output' | 'fill-blank';

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  _id: string;
  trackId: TrackSlug;
  level: SkillLevel;
  topicTags: string[];
  type: QuestionType;
  prompt: string;
  options?: QuestionOption[]; // Optional for fill-blank
  correctOptionIds: string[];  // For fill-blank, contains the correct answer strings (lowercased/trimmed)
  difficulty: number; // 1 to 5
  explanation: string;
  version: number;
  active: boolean;
  createdBy: string;
  createdAt: string;
}

export type QuizSessionStatus = 'in-progress' | 'completed' | 'timed-out';

export interface QuizSessionAnswer {
  questionId: string;
  selectedOptionIds: string[]; // For fill-blank, contains user's text answer in the first element
  isCorrect: boolean;
}

export interface QuizSession {
  _id: string;
  userId: string;
  trackId: TrackSlug;
  level: SkillLevel;
  questionIds: string[];
  questions?: Omit<Question, 'correctOptionIds' | 'explanation'>[]; // Returned to client without answers
  startedAt: string;
  expiresAt: string;
  submittedAt?: string;
  timeTakenSec?: number;
  answers: QuizSessionAnswer[];
  score?: number;
  maxScore?: number;
  status: QuizSessionStatus;
  recommendation?: string;
}

export interface Progress {
  _id: string;
  userId: string;
  trackId: TrackSlug;
  level: SkillLevel;
  attempts: number;
  bestScore: number;
  lastScore: number;
  completionPct: number;
  weakTopics: string[];
  strongTopics: string[];
  updatedAt: string;
}

export interface Badge {
  _id: string;
  code: string;
  name: string;
  description: string;
  iconUrl: string;
  criteria: string;
}

export interface UserBadge {
  _id: string;
  userId: string;
  badgeId: string;
  earnedAt: string;
  badge?: Badge; // populated for client
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  userAvatar: string;
  trackId?: TrackSlug | 'all';
  period: 'weekly' | 'alltime';
  score: number;
  rank?: number;
  updatedAt: string;
}
