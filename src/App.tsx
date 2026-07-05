import { useEffect, useState } from 'react';
import { useQuizStore } from './store/quizStore';
import AuthScreen from './components/AuthScreen';
import DashboardScreen from './components/DashboardScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import AdminScreen from './components/AdminScreen';
import { Sparkles, Terminal, Sun, Moon, LogOut, Award, Trophy, Compass, Flame, ShieldAlert, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { THEME_COLORS } from './themeConfig';

type ScreenTab = 'dashboard' | 'leaderboard' | 'admin' | 'quiz' | 'results';

export default function App() {
  const {
    user,
    loading,
    theme,
    initTheme,
    setTheme,
    fetchMe,
    activeSession,
    clearQuizSession,
    logout
  } = useQuizStore();

  const [activeTab, setActiveTab] = useState<ScreenTab>('dashboard');
  const [sessionResult, setSessionResult] = useState<any | null>(null);

  // Initialize Auth & Theme
  useEffect(() => {
    initTheme();
    fetchMe();
  }, [initTheme, fetchMe]);

  // Lock tab state when quiz session begins
  useEffect(() => {
    if (activeSession) {
      setActiveTab('quiz');
      setSessionResult(null);
    }
  }, [activeSession]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4 font-mono text-xs text-slate-400">
        <div 
          className="w-12 h-12 border-4 border-t-transparent animate-spin"
          style={{ borderColor: THEME_COLORS.success }}
        ></div>
        <p className="animate-pulse tracking-widest font-bold uppercase" style={{ color: THEME_COLORS.success }}>
          QUIZVERSE SECURING SYSTEM...
        </p>
      </div>
    );
  }

  // If not authenticated, force Auth screen
  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <AuthScreen />
      </div>
    );
  }

  const handleQuizComplete = (results: any) => {
    setSessionResult(results);
    setActiveTab('results');
  };

  const handleResultReset = () => {
    setSessionResult(null);
    clearQuizSession();
    setActiveTab('dashboard');
  };

  const isQuizLocked = !!activeSession;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-between">

      {/* Main Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#111111] border-b-2 border-[#222222] shadow-md" id="main-app-header">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => !isQuizLocked && setActiveTab('dashboard')} id="header-logo">
            <div 
              className="w-10 h-10 flex items-center justify-center rotate-3 border-2 border-black font-black text-black text-2xl select-none"
              style={{ backgroundColor: THEME_COLORS.success }}
            >
              Q
            </div>
            <span className="font-black text-2xl tracking-tighter italic text-white uppercase">
              QuizVerse
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-2" id="header-nav-links">
            <button
              onClick={() => setActiveTab('dashboard')}
              disabled={isQuizLocked}
              style={{
                backgroundColor: (activeTab === 'dashboard' || activeTab === 'results') ? THEME_COLORS.success : 'transparent',
                color: (activeTab === 'dashboard' || activeTab === 'results') ? '#000000' : '#9ca3af',
                borderColor: (activeTab === 'dashboard' || activeTab === 'results') ? '#ffffff' : '#222222'
              }}
              className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider border transition-all cursor-pointer ${isQuizLocked ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <Compass className="w-4 h-4 inline mr-1.5 -mt-0.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('leaderboard')}
              disabled={isQuizLocked}
              style={{
                backgroundColor: activeTab === 'leaderboard' ? THEME_COLORS.info : 'transparent',
                color: activeTab === 'leaderboard' ? '#000000' : '#9ca3af',
                borderColor: activeTab === 'leaderboard' ? '#ffffff' : '#222222'
              }}
              className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider border transition-all cursor-pointer ${isQuizLocked ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <Trophy className="w-4 h-4 inline mr-1.5 -mt-0.5" />
              <span>Leaderboard</span>
            </button>

            {user.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                disabled={isQuizLocked}
                style={{
                  backgroundColor: activeTab === 'admin' ? THEME_COLORS.danger : 'transparent',
                  color: activeTab === 'admin' ? '#ffffff' : '#9ca3af',
                  borderColor: activeTab === 'admin' ? '#ffffff' : '#222222'
                }}
                className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider border transition-all cursor-pointer ${isQuizLocked ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                <Terminal className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                <span>Admin CMS</span>
              </button>
            )}
          </nav>

          {/* User Controls and Theme */}
          <div className="flex items-center gap-4" id="header-user-controls">

            {/* Streak Badges on Navbar */}
            <div className="hidden sm:flex flex-col items-end gap-0.5" id="navbar-streak-indicator">
              <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Daily Streak</span>
              <div className="flex items-center gap-2">
                <span className="font-bold font-mono text-xs" style={{ color: THEME_COLORS.success }}>{(user.streak || 1)} DAYS</span>
                <div className="flex gap-1">
                  <div className="w-1.5 h-3" style={{ backgroundColor: THEME_COLORS.success }}></div>
                  <div className="w-1.5 h-3" style={{ backgroundColor: THEME_COLORS.success }}></div>
                  <div className="w-1.5 h-3" style={{ backgroundColor: THEME_COLORS.success }}></div>
                  <div className="w-1.5 h-3" style={{ backgroundColor: THEME_COLORS.success }}></div>
                  <div className="w-1.5 h-3 bg-[#222222]"></div>
                </div>
              </div>
            </div>

            {/* Profile Dropdown Trigger */}
            <div className="flex items-center gap-2 bg-[#111111] p-1.5 pr-4 rounded-none border border-[#222222]" id="header-profile-box">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-8 h-8 rounded-none object-cover border-2"
                style={{ borderColor: THEME_COLORS.success }}
                referrerPolicy="no-referrer"
              />
              <span className="text-xs font-bold text-white hidden sm:inline max-w-[100px] truncate">
                {user.name}
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={() => !isQuizLocked && logout()}
              disabled={isQuizLocked}
              className={`p-2.5 bg-[#1a1a1a] border border-[#222222] text-slate-400 hover:text-red-500 hover:border-red-500 cursor-pointer transition-all ${
                isQuizLocked ? 'opacity-40 cursor-not-allowed' : ''
              }`}
              title="Logout session"
              id="logout-btn"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Proctoring Warning during Active Quiz */}
      {isQuizLocked && (
        <div 
          className="text-white font-mono text-[10px] text-center uppercase tracking-widest py-2 px-4 font-black z-30" 
          style={{ backgroundColor: THEME_COLORS.danger }}
          id="proctoring-warning-lock"
        >
          PROCTORING PROTOCOLS ENGAGED • DO NOT LEAVE QUIZ WINDOW • WARNING: REDIRECTS DISABLED
        </div>
      )}

      {/* Main Container Content */}
      <main className="flex-1" id="main-content-layout">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === 'dashboard' && <DashboardScreen />}
            {activeTab === 'leaderboard' && <LeaderboardScreen />}
            {activeTab === 'admin' && <AdminScreen />}
            {activeTab === 'quiz' && <QuizScreen onComplete={handleQuizComplete} />}
            {activeTab === 'results' && sessionResult && (
              <ResultsScreen results={sessionResult} onReset={handleResultReset} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Footer Navigation Bar for Mobile */}
      <nav className="md:hidden sticky bottom-0 z-40 bg-[#111111] border-t-2 border-[#222222] grid grid-cols-3 py-3.5 text-center" id="mobile-bottom-nav">
        <button
          onClick={() => setActiveTab('dashboard')}
          disabled={isQuizLocked}
          style={{
            color: (activeTab === 'dashboard' || activeTab === 'results') ? THEME_COLORS.success : '#94a3b8'
          }}
          className={`flex flex-col items-center gap-1 text-xs font-black uppercase cursor-pointer ${isQuizLocked ? 'opacity-40' : ''}`}
        >
          <Compass className="w-4 h-4 mx-auto" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('leaderboard')}
          disabled={isQuizLocked}
          style={{
            color: activeTab === 'leaderboard' ? THEME_COLORS.info : '#94a3b8'
          }}
          className={`flex flex-col items-center gap-1 text-xs font-black uppercase cursor-pointer ${isQuizLocked ? 'opacity-40' : ''}`}
        >
          <Trophy className="w-4 h-4 mx-auto" />
          <span>Leaderboard</span>
        </button>

        {user.role === 'admin' ? (
          <button
            onClick={() => setActiveTab('admin')}
            disabled={isQuizLocked}
            style={{
              color: activeTab === 'admin' ? THEME_COLORS.danger : '#94a3b8'
            }}
            className={`flex flex-col items-center gap-1 text-xs font-black uppercase cursor-pointer ${isQuizLocked ? 'opacity-40' : ''}`}
          >
            <Terminal className="w-4 h-4 mx-auto" />
            <span>Admin CMS</span>
          </button>
        ) : (
          <button
            onClick={() => {
              if (confirm('Bypass authorize as Admin to test CMS CRUD?')) {
                useQuizStore.getState().guestLogin('Root_Admin');
              }
            }}
            disabled={isQuizLocked}
            className="flex flex-col items-center gap-1 text-xs font-black uppercase text-slate-400 cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4 mx-auto" />
            <span>Elevate</span>
          </button>
        )}
      </nav>

      {/* Tiny clean footer */}
      <footer className="py-6 text-center text-[10px] font-mono text-slate-500 border-t border-[#161616] bg-[#050505]" id="main-app-footer">
        QUIZVERSE ASSESS CORE TERMINAL V1.0.0 • ACTIVE SESSION SECURED • © {new Date().getFullYear()}
      </footer>

    </div>
  );
}
