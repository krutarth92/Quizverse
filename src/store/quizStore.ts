import { create } from 'zustand';
import { User, Track, QuizSession, LeaderboardEntry, TrackSlug, SkillLevel } from '../types';

interface QuizState {
  user: User | null;
  loading: boolean;
  tracks: Track[];
  activeTrack: Track | null;
  activeLevel: SkillLevel | null;
  activeSession: QuizSession | null;
  currentQuestionIdx: number;
  selectedAnswers: Record<string, string[]>; // questionId -> list of option ids or typed text
  dashboardStats: any | null;
  leaderboard: LeaderboardEntry[];
  leaderboardTrack: string;
  leaderboardPeriod: 'weekly' | 'alltime';
  theme: 'dark' | 'light';
  authError: string | null;
  quizError: string | null;

  // Actions
  initTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => Promise<void>;
  fetchMe: () => Promise<boolean>;
  guestLogin: (username?: string) => Promise<void>;
  startGoogleOAuth: () => Promise<void>;
  logout: () => Promise<void>;
  fetchTracks: () => Promise<void>;
  setActiveTrackAndLevel: (track: Track, level: SkillLevel) => void;
  startQuiz: (trackId: TrackSlug, level: SkillLevel) => Promise<void>;
  selectAnswer: (questionId: string, optionId: string, isMulti: boolean) => void;
  setFillBlankAnswer: (questionId: string, text: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  submitQuiz: () => Promise<any>;
  clearQuizSession: () => void;
  fetchDashboardStats: () => Promise<void>;
  fetchLeaderboard: (track?: string, period?: 'weekly' | 'alltime') => Promise<void>;
  clearErrors: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  user: null,
  loading: true,
  tracks: [],
  activeTrack: null,
  activeLevel: null,
  activeSession: null,
  currentQuestionIdx: 0,
  selectedAnswers: {},
  dashboardStats: null,
  leaderboard: [],
  leaderboardTrack: 'all',
  leaderboardPeriod: 'alltime',
  theme: 'dark',
  authError: null,
  quizError: null,

  initTheme: () => {
    const localTheme = localStorage.getItem('quizverse_theme') as 'dark' | 'light' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const finalTheme = localTheme || (systemPrefersDark ? 'dark' : 'light');

    set({ theme: finalTheme });
    if (finalTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  setTheme: async (theme) => {
    set({ theme });
    localStorage.setItem('quizverse_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Sync to backend if authenticated
    if (get().user) {
      try {
        await fetch('/api/auth/preferences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ theme, notifications: get().user?.preferences.notifications })
        });
      } catch (err) {
        console.error('Failed to sync theme preference to server:', err);
      }
    }
  },

  fetchMe: async () => {
    set({ loading: true, authError: null });
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        set({ user: data.user, loading: false });
        if (data.user.preferences?.theme) {
          get().setTheme(data.user.preferences.theme);
        }
        return true;
      }

      // If unauthorized, check if we can refresh
      const refreshRes = await fetch('/api/auth/refresh', { method: 'POST' });
      if (refreshRes.ok) {
        const data = await refreshRes.json();
        set({ user: data.user, loading: false });
        if (data.user.preferences?.theme) {
          get().setTheme(data.user.preferences.theme);
        }
        return true;
      }
    } catch (err) {
      console.error('Error in fetchMe:', err);
    }
    set({ user: null, loading: false });
    return false;
  },

  guestLogin: async (username) => {
    set({ loading: true, authError: null });
    try {
      const res = await fetch('/api/auth/sandbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestName: username })
      });
      if (res.ok) {
        const data = await res.json();
        set({ user: data.user, loading: false });
        if (data.user.preferences?.theme) {
          get().setTheme(data.user.preferences.theme);
        }
      } else {
        const data = await res.json();
        set({ authError: data.error || 'Guest login failed', loading: false });
      }
    } catch (err) {
      set({ authError: 'Network error during login', loading: false });
    }
  },

  startGoogleOAuth: async () => {
    set({ loading: true, authError: null });
    try {
      const res = await fetch('/api/auth/google/url');
      if (!res.ok) throw new Error('Could not fetch Google auth url');

      const { url } = await res.json();

      // Open OAuth in centered popup window as per iframe skill constraints
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popup = window.open(
        url,
        'quizverse_google_oauth',
        `width=${width},height=${height},top=${top},left=${left}`
      );

      if (!popup) {
        set({ authError: 'Popup blocked. Please allow popups to sign in with Google.', loading: false });
        return;
      }

      // Block conversation / wait for postMessage as per skill directions
      const handleOauthMessage = async (event: MessageEvent) => {
        const origin = event.origin;
        if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
          return;
        }

        if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
          window.removeEventListener('message', handleOauthMessage);
          // Re-fetch current user
          await get().fetchMe();
        }
      };

      window.addEventListener('message', handleOauthMessage);
    } catch (err) {
      set({ authError: 'Google login failed to launch', loading: false });
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Network failure on logout', err);
    }
    set({ user: null, activeSession: null, dashboardStats: null, loading: false });
  },

  fetchTracks: async () => {
    try {
      const res = await fetch('/api/tracks');
      if (res.ok) {
        const data = await res.json();
        set({ tracks: data.tracks });
      }
    } catch (err) {
      console.error('Failed to pull tracks', err);
    }
  },

  setActiveTrackAndLevel: (track, level) => {
    set({ activeTrack: track, activeLevel: level });
  },

  startQuiz: async (trackId, level) => {
    set({ loading: true, quizError: null, selectedAnswers: {}, currentQuestionIdx: 0 });
    try {
      const res = await fetch('/api/quiz/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackId, level })
      });

      if (res.ok) {
        const data = await res.json();
        set({ activeSession: data.session, loading: false });
      } else {
        const data = await res.json();
        set({ quizError: data.error || 'Could not start quiz', loading: false });
      }
    } catch (err) {
      set({ quizError: 'Network failure. Could not connect to quiz engine.', loading: false });
    }
  },

  selectAnswer: (questionId, optionId, isMulti) => {
    set((state) => {
      const current = state.selectedAnswers[questionId] || [];
      let next: string[];

      if (isMulti) {
        if (current.includes(optionId)) {
          next = current.filter((id) => id !== optionId);
        } else {
          next = [...current, optionId];
        }
      } else {
        next = [optionId];
      }

      return {
        selectedAnswers: {
          ...state.selectedAnswers,
          [questionId]: next
        }
      };
    });
  },

  setFillBlankAnswer: (questionId, text) => {
    set((state) => ({
      selectedAnswers: {
        ...state.selectedAnswers,
        [questionId]: [text]
      }
    }));
  },

  nextQuestion: () => {
    const { activeSession, currentQuestionIdx } = get();
    if (activeSession && activeSession.questions && currentQuestionIdx < activeSession.questions.length - 1) {
      set({ currentQuestionIdx: currentQuestionIdx + 1 });
    }
  },

  prevQuestion: () => {
    const { currentQuestionIdx } = get();
    if (currentQuestionIdx > 0) {
      set({ currentQuestionIdx: currentQuestionIdx - 1 });
    }
  },

  submitQuiz: async () => {
    const { activeSession, selectedAnswers } = get();
    if (!activeSession) return null;

    set({ loading: true, quizError: null });

    // Format answers list
    const formattedAnswers = activeSession.questionIds.map((qId) => ({
      questionId: qId,
      selectedOptionIds: selectedAnswers[qId] || []
    }));

    try {
      const res = await fetch(`/api/quiz/${activeSession._id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: formattedAnswers })
      });

      if (res.ok) {
        const data = await res.json();
        set({ activeSession: null, loading: false });
        return data.results;
      } else {
        const data = await res.json();
        set({ quizError: data.error || 'Submission failed', loading: false });
        return null;
      }
    } catch (err) {
      set({ quizError: 'Network failure during quiz submission', loading: false });
      return null;
    }
  },

  clearQuizSession: () => {
    set({ activeSession: null, selectedAnswers: {}, currentQuestionIdx: 0, quizError: null });
  },

  fetchDashboardStats: async () => {
    try {
      const res = await fetch('/api/dashboard/me');
      if (res.ok) {
        const data = await res.json();
        set({ dashboardStats: data.stats });
      }
    } catch (err) {
      console.error('Failed to pull user dashboard stats:', err);
    }
  },

  fetchLeaderboard: async (track, period) => {
    const finalTrack = track || get().leaderboardTrack;
    const finalPeriod = period || get().leaderboardPeriod;

    try {
      const res = await fetch(`/api/leaderboard?track=${finalTrack}&period=${finalPeriod}`);
      if (res.ok) {
        const data = await res.json();
        set({
          leaderboard: data.leaderboard,
          leaderboardTrack: finalTrack,
          leaderboardPeriod: finalPeriod
        });
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard rankings:', err);
    }
  },

  clearErrors: () => {
    set({ authError: null, quizError: null });
  }
}));
