import fs from 'fs';
import path from 'path';
import { User, Question, QuizSession, Progress, Badge, UserBadge, LeaderboardEntry, Track, UserPreferences } from '../types';

const DATA_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Default Tracks
export const DEFAULT_TRACKS: Track[] = [
  {
    _id: '1',
    name: 'Python Development',
    slug: 'python',
    description: 'Master Python from syntax fundamentals to advanced core internals, REST APIs, and Django web frameworks.',
    levels: ['beginner', 'intermediate', 'advanced', 'api', 'django']
  },
  {
    _id: '2',
    name: 'AI & Machine Learning',
    slug: 'ai-ml',
    description: 'Explore neural networks, Deep Learning, transformers, prompt engineering, and LLM orchestration.',
    levels: ['beginner', 'intermediate', 'advanced']
  },
  {
    _id: '3',
    name: 'Cloud Computing',
    slug: 'cloud',
    description: 'Design and deploy scalable web architectures across Amazon Web Services (AWS), Azure, and Google Cloud Platform (GCP).',
    levels: ['beginner', 'intermediate', 'advanced']
  }
];

// Initial Badges Seed
export const DEFAULT_BADGES: Badge[] = [
  {
    _id: 'badge_first_quiz',
    code: 'FIRST_QUIZ',
    name: 'First Frontier',
    description: 'Completed your very first QuizVerse challenge!',
    iconUrl: '🚀',
    criteria: 'Complete any quiz track.'
  },
  {
    _id: 'badge_perfect',
    code: 'PERFECT_SCORE',
    name: 'Absolute Mastery',
    description: 'Scored 100% on a quiz!',
    iconUrl: '👑',
    criteria: 'Score 100% on any quiz.'
  },
  {
    _id: 'badge_python_guru',
    code: 'PYTHON_GURU',
    name: 'Pythonista Guru',
    description: 'Completed an advanced Python quiz with >80% score.',
    iconUrl: '🐍',
    criteria: 'Score >80% on advanced/api/django Python quiz.'
  },
  {
    _id: 'badge_ai_sage',
    code: 'AI_SAGE',
    name: 'AI Sage',
    description: 'Completed an advanced AI & Machine Learning quiz with >80% score.',
    iconUrl: '🤖',
    criteria: 'Score >80% on advanced AI quiz.'
  },
  {
    _id: 'badge_cloud_architect',
    code: 'CLOUD_ARCHITECT',
    name: 'Nimbus Architect',
    description: 'Completed an advanced Cloud Computing quiz with >80% score.',
    iconUrl: '☁️',
    criteria: 'Score >80% on advanced Cloud quiz.'
  },
  {
    _id: 'badge_streak_3',
    code: 'STREAK_3',
    name: 'Triple Threat',
    description: 'Achieved a quiz streak of 3 consecutive sessions.',
    iconUrl: '🔥',
    criteria: 'Accumulate a streak of 3.'
  },
  {
    _id: 'badge_streak_7',
    code: 'STREAK_7',
    name: 'Unstoppable Force',
    description: 'Achieved a quiz streak of 7 consecutive sessions.',
    iconUrl: '⚡',
    criteria: 'Accumulate a streak of 7.'
  }
];

// Seed Questions (Comprehensive)
import { SEED_QUESTIONS } from './seedQuestions';
import { generateDynamicQuestions } from './dynamicGenerator';

interface LocalDatabase {
  users: Record<string, User>;
  questions: Record<string, Question>;
  sessions: Record<string, QuizSession>;
  progress: Record<string, Progress>;
  userBadges: Record<string, UserBadge[]>;
  leaderboard: LeaderboardEntry[];
}

class FileDB {
  public memoryDB: LocalDatabase = {
    users: {},
    questions: {},
    sessions: {},
    progress: {},
    userBadges: {},
    leaderboard: []
  };

  constructor() {
    this.init();
  }

  private init() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      try {
        const fileContent = fs.readFileSync(DB_FILE, 'utf8');
        this.memoryDB = JSON.parse(fileContent);
      } catch (err) {
        console.error('Error parsing quizverse fallback DB file, initializing clean database:', err);
        this.save();
      }
    } else {
      // Seed default questions on first run
      for (const question of SEED_QUESTIONS) {
        this.memoryDB.questions[question._id] = question;
      }
      this.save();
    }

    // Ensure 1000+ questions per track/level combination in memory
    const tracks = ['python', 'ai-ml', 'cloud'] as const;

    for (const trackId of tracks) {
      const levels = trackId === 'python'
        ? ['beginner', 'intermediate', 'advanced', 'api', 'django'] as const
        : ['beginner', 'intermediate', 'advanced'] as const;

      for (const level of levels) {
        const dynamicList = generateDynamicQuestions(trackId, level);
        for (const q of dynamicList) {
          if (!this.memoryDB.questions[q._id]) {
            this.memoryDB.questions[q._id] = q;
          }
        }
      }
    }
  }

  private save() {
    try {
      // Keep the DB file small by filtering out generated questions
      const dbCopy = { ...this.memoryDB };
      const filteredQuestions: Record<string, Question> = {};
      for (const [id, q] of Object.entries(this.memoryDB.questions)) {
        if (!id.startsWith('gen_')) {
          filteredQuestions[id] = q;
        }
      }
      dbCopy.questions = filteredQuestions;
      fs.writeFileSync(DB_FILE, JSON.stringify(dbCopy, null, 2), 'utf8');
    } catch (err) {
      console.error('Failed to write to QuizVerse fallback DB:', err);
    }
  }

  // --- Users ---
  public getUser(id: string): User | null {
    return this.memoryDB.users[id] || null;
  }

  public getUserByEmail(email: string): User | null {
    return Object.values(this.memoryDB.users).find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  public getUserByGoogleId(googleId: string): User | null {
    return Object.values(this.memoryDB.users).find(u => u.googleId === googleId) || null;
  }

  public createUser(user: Omit<User, '_id' | 'createdAt' | 'lastLoginAt' | 'preferences'> & { preferences?: UserPreferences }): User {
    const id = 'usr_' + Math.random().toString(36).substr(2, 9);
    const now = new Date().toISOString();
    const newUser: User = {
      _id: id,
      ...user,
      createdAt: now,
      lastLoginAt: now,
      preferences: user.preferences || { theme: 'dark', notifications: true },
      streak: 1,
      lastActiveDate: new Date().toISOString().split('T')[0]
    };
    this.memoryDB.users[id] = newUser;
    this.save();
    return newUser;
  }

  public updateUser(id: string, updates: Partial<User>): User | null {
    const user = this.memoryDB.users[id];
    if (!user) return null;
    const updatedUser = { ...user, ...updates };
    this.memoryDB.users[id] = updatedUser;
    this.save();
    return updatedUser;
  }

  // --- Questions ---
  public getQuestions(): Question[] {
    return Object.values(this.memoryDB.questions).filter(q => q.active);
  }

  public getQuestion(id: string): Question | null {
    return this.memoryDB.questions[id] || null;
  }

  public getQuestionsForQuiz(trackId: string, level: string): Question[] {
    return Object.values(this.memoryDB.questions).filter(
      q => q.active && q.trackId === trackId && q.level === level
    );
  }

  public createQuestion(question: Omit<Question, '_id' | 'createdAt' | 'version'>): Question {
    const id = 'q_' + Math.random().toString(36).substr(2, 9);
    const newQuestion: Question = {
      _id: id,
      ...question,
      version: 1,
      createdAt: new Date().toISOString()
    };
    this.memoryDB.questions[id] = newQuestion;
    this.save();
    return newQuestion;
  }

  public updateQuestion(id: string, updates: Partial<Question>): Question | null {
    const question = this.memoryDB.questions[id];
    if (!question) return null;
    const updated = { ...question, ...updates, version: question.version + 1 };
    this.memoryDB.questions[id] = updated;
    this.save();
    return updated;
  }

  public deleteQuestion(id: string): boolean {
    if (this.memoryDB.questions[id]) {
      this.memoryDB.questions[id].active = false; // soft delete to preserve historical sessions
      this.save();
      return true;
    }
    return false;
  }

  // --- Quiz Sessions ---
  public getSession(id: string): QuizSession | null {
    return this.memoryDB.sessions[id] || null;
  }

  public createSession(session: Omit<QuizSession, '_id'>): QuizSession {
    const id = 'sess_' + Math.random().toString(36).substr(2, 9);
    const newSession: QuizSession = {
      _id: id,
      ...session
    };
    this.memoryDB.sessions[id] = newSession;
    this.save();
    return newSession;
  }

  public updateSession(id: string, updates: Partial<QuizSession>): QuizSession | null {
    const session = this.memoryDB.sessions[id];
    if (!session) return null;
    const updated = { ...session, ...updates } as QuizSession;
    this.memoryDB.sessions[id] = updated;
    this.save();
    return updated;
  }

  // --- Progress / Stats ---
  public getProgress(userId: string, trackId: string, level: string): Progress | null {
    const key = `${userId}_${trackId}_${level}`;
    return this.memoryDB.progress[key] || null;
  }

  public saveProgress(progress: Omit<Progress, '_id'>): Progress {
    const key = `${progress.userId}_${progress.trackId}_${progress.level}`;
    const id = 'prog_' + Math.random().toString(36).substr(2, 9);
    const existing = this.memoryDB.progress[key];

    const finalProgress: Progress = {
      _id: existing?._id || id,
      ...progress,
      updatedAt: new Date().toISOString()
    };

    this.memoryDB.progress[key] = finalProgress;
    this.save();
    return finalProgress;
  }

  public getProgressForUser(userId: string): Progress[] {
    return Object.values(this.memoryDB.progress).filter(p => p.userId === userId);
  }

  // --- Badges ---
  public getUserBadges(userId: string): UserBadge[] {
    const badges = this.memoryDB.userBadges[userId] || [];
    // Populate the Badge info
    return badges.map(ub => ({
      ...ub,
      badge: DEFAULT_BADGES.find(b => b._id === ub.badgeId)
    }));
  }

  public awardBadge(userId: string, badgeCode: string): UserBadge | null {
    const badge = DEFAULT_BADGES.find(b => b.code === badgeCode);
    if (!badge) return null;

    const userBadges = this.memoryDB.userBadges[userId] || [];
    const alreadyEarned = userBadges.some(ub => ub.badgeId === badge._id);
    if (alreadyEarned) return null; // already earned

    const id = 'ubadge_' + Math.random().toString(36).substr(2, 9);
    const newUserBadge: UserBadge = {
      _id: id,
      userId,
      badgeId: badge._id,
      earnedAt: new Date().toISOString()
    };

    if (!this.memoryDB.userBadges[userId]) {
      this.memoryDB.userBadges[userId] = [];
    }
    this.memoryDB.userBadges[userId].push(newUserBadge);
    this.save();

    return {
      ...newUserBadge,
      badge
    };
  }

  // --- Leaderboard / Redis Simulator ---
  public addLeaderboardScore(userId: string, trackId: string, period: 'weekly' | 'alltime', additionalScore: number) {
    const user = this.getUser(userId);
    if (!user) return;

    // We can filter our leaderboard array
    const entryIdx = this.memoryDB.leaderboard.findIndex(
      e => e.userId === userId && e.trackId === trackId && e.period === period
    );

    if (entryIdx >= 0) {
      this.memoryDB.leaderboard[entryIdx].score += additionalScore;
      this.memoryDB.leaderboard[entryIdx].updatedAt = new Date().toISOString();
    } else {
      this.memoryDB.leaderboard.push({
        userId,
        userName: user.name,
        userAvatar: user.avatarUrl,
        trackId: trackId as any,
        period,
        score: additionalScore,
        updatedAt: new Date().toISOString()
      });
    }

    // Sort the leaderboard descending by score
    this.memoryDB.leaderboard.sort((a, b) => b.score - a.score);
    this.save();
  }

  public getLeaderboard(trackId: string, period: 'weekly' | 'alltime'): LeaderboardEntry[] {
    let filtered = this.memoryDB.leaderboard.filter(e => e.period === period);
    if (trackId && trackId !== 'all') {
      filtered = filtered.filter(e => e.trackId === trackId);
    } else {
      // For global (all), let's aggregate scores per user if there are duplicates, or just return the "all" tracks
      const aggregated: Record<string, LeaderboardEntry> = {};
      for (const entry of filtered) {
        const key = entry.userId;
        if (!aggregated[key]) {
          aggregated[key] = { ...entry, trackId: 'all' as any };
        } else {
          aggregated[key].score += entry.score;
          if (new Date(entry.updatedAt) > new Date(aggregated[key].updatedAt)) {
            aggregated[key].updatedAt = entry.updatedAt;
          }
        }
      }
      filtered = Object.values(aggregated);
    }

    // Sort descending and apply ranks
    filtered.sort((a, b) => b.score - a.score);
    return filtered.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));
  }

  // --- Rate limiting simulator ---
  private rateLimitStore: Record<string, { count: number; expiresAt: number }> = {};

  public isRateLimited(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const record = this.rateLimitStore[key];

    if (!record || now > record.expiresAt) {
      this.rateLimitStore[key] = {
        count: 1,
        expiresAt: now + windowMs
      };
      return false;
    }

    record.count++;
    if (record.count > limit) {
      return true;
    }
    return false;
  }

  // --- CMS / Admin management operations ---
  public getAllUsers(): User[] {
    return Object.values(this.memoryDB.users);
  }

  public updateUserRole(userId: string, role: 'admin' | 'user'): User | null {
    const user = this.memoryDB.users[userId];
    if (!user) return null;
    user.role = role;
    this.save();
    return user;
  }

  public deleteUser(userId: string): boolean {
    if (!this.memoryDB.users[userId]) return false;
    delete this.memoryDB.users[userId];
    
    // Cleanup related user data
    for (const key of Object.keys(this.memoryDB.progress)) {
      if (this.memoryDB.progress[key].userId === userId) {
        delete this.memoryDB.progress[key];
      }
    }
    delete this.memoryDB.userBadges[userId];
    
    for (const key of Object.keys(this.memoryDB.sessions)) {
      if (this.memoryDB.sessions[key].userId === userId) {
        delete this.memoryDB.sessions[key];
      }
    }
    
    this.memoryDB.leaderboard = this.memoryDB.leaderboard.filter(e => e.userId !== userId);
    
    this.save();
    return true;
  }

  public getAllSessions(): QuizSession[] {
    return Object.values(this.memoryDB.sessions);
  }

  public getDatabaseStats() {
    return {
      usersCount: Object.keys(this.memoryDB.users).length,
      questionsCount: Object.keys(this.memoryDB.questions).length,
      sessionsCount: Object.keys(this.memoryDB.sessions).length,
      progressCount: Object.keys(this.memoryDB.progress).length,
      badgesEarnedCount: Object.values(this.memoryDB.userBadges).reduce((acc, current) => acc + current.length, 0),
      leaderboardEntries: this.memoryDB.leaderboard.length
    };
  }

  public resetDatabase(): void {
    // Clear dynamic states
    this.memoryDB.sessions = {};
    this.memoryDB.progress = {};
    this.memoryDB.userBadges = {};
    this.memoryDB.leaderboard = [];
    
    // Re-seed original default admin questions
    this.memoryDB.questions = {};
    for (const question of SEED_QUESTIONS) {
      this.memoryDB.questions[question._id] = question;
    }
    
    // Keep some default sandbox roles if needed (otherwise they register as guest on first try)
    this.memoryDB.users = {};
    
    // Ensure 1000+ questions per track/level combination in memory
    const tracks = ['python', 'ai-ml', 'cloud'] as const;
    for (const trackId of tracks) {
      const levels = trackId === 'python'
        ? ['beginner', 'intermediate', 'advanced', 'api', 'django'] as const
        : ['beginner', 'intermediate', 'advanced'] as const;

      for (const level of levels) {
        const dynamicList = generateDynamicQuestions(trackId, level);
        for (const q of dynamicList) {
          if (!this.memoryDB.questions[q._id]) {
            this.memoryDB.questions[q._id] = q;
          }
        }
      }
    }
    
    this.save();
  }
}

export const dbFallback = new FileDB();
