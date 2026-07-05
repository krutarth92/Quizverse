import React, { useState } from 'react';
import { useQuizStore } from '../store/quizStore';
import { Sparkles, Terminal, ShieldAlert, Cpu, Chrome } from 'lucide-react';
import { motion } from 'motion/react';
import { THEME_COLORS } from '../themeConfig';

export default function AuthScreen() {
  const { guestLogin, startGoogleOAuth, authError, clearErrors, loading } = useQuizStore();
  const [username, setUsername] = useState('');
  const [showConfig, setShowConfig] = useState(false);

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      guestLogin(username.trim());
    } else {
      guestLogin(); // fallback random
    }
  };

  const selectPredefinedAvatar = (name: string) => {
    guestLogin(name);
  };

  const devCallbackUrl = `https://ais-dev-5m37uviogljntxyjr5mekl-776570354912.asia-southeast1.run.app/auth/callback`;
  const sharedCallbackUrl = `https://ais-pre-5m37uviogljntxyjr5mekl-776570354912.asia-southeast1.run.app/auth/callback`;

  // Dynamic hover styles using JS/TS configuration
  const [googleHover, setGoogleHover] = useState(false);
  const [guestSubmitHover, setGuestSubmitHover] = useState(false);
  const [userRoleHover, setUserRoleHover] = useState(false);
  const [adminRoleHover, setAdminRoleHover] = useState(false);
  const [showConfigHover, setShowConfigHover] = useState(false);

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-8" id="auth-screen-container">
      <div className="w-full max-w-lg" id="auth-inner-box">
        {/* Header Branding */}
        <div className="text-center mb-8" id="auth-branding-header">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-16 h-16 border-2 border-black rotate-3 shadow-lg mb-4"
            style={{ backgroundColor: THEME_COLORS.success }}
          >
            <span className="text-black font-black text-4xl select-none">Q</span>
          </motion.div>

          <h1 className="text-4xl font-black tracking-tighter italic uppercase text-white">
            QuizVerse
          </h1>
          <p className="mt-2 text-xs font-mono uppercase tracking-widest text-slate-400 font-medium">
            The Gamified Tech Exploration Platform
          </p>
        </div>

        {/* Auth Panel Card */}
        <div className="bg-[#111111] border-2 border-[#222222] p-6 sm:p-8 relative overflow-hidden shadow-2xl" id="auth-panel-card">
          {/* Neon decorative top border highlight */}
          <div 
            className="absolute top-0 left-0 right-0 h-1" 
            style={{ background: `linear-gradient(to right, ${THEME_COLORS.success}, ${THEME_COLORS.info}, ${THEME_COLORS.danger})` }}
          ></div>

          {authError && (
            <div className="mb-6 p-4 bg-red-950/40 border-2 rounded-none flex items-start gap-3" style={{ borderColor: THEME_COLORS.danger }} id="auth-error-banner">
              <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: THEME_COLORS.danger }} />
              <div className="text-xs text-rose-300 flex-1 font-mono">
                <p className="font-bold uppercase tracking-wider">Access Denied</p>
                <p className="mt-1">{authError}</p>
                <button
                  onClick={clearErrors}
                  className="mt-2 font-mono text-[10px] underline hover:no-underline cursor-pointer uppercase font-bold"
                  style={{ color: THEME_COLORS.danger }}
                >
                  Dismiss error
                </button>
              </div>
            </div>
          )}

          {/* Real Google OAuth Login Option */}
          <div className="mb-6" id="google-auth-section">
            <button
              onClick={() => startGoogleOAuth()}
              disabled={loading}
              onMouseEnter={() => setGoogleHover(true)}
              onMouseLeave={() => setGoogleHover(false)}
              className="w-full h-12 flex items-center justify-center gap-3 px-4 text-black font-black uppercase text-sm transition-all duration-200 cursor-pointer border-2 shadow-md disabled:opacity-50"
              style={{ 
                backgroundColor: googleHover ? THEME_COLORS.success : '#ffffff',
                borderColor: googleHover ? '#000000' : '#ffffff'
              }}
              id="google-signin-btn"
            >
              <Chrome className="w-5 h-5 text-black" />
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="relative my-6 flex items-center justify-center" id="auth-divider">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#222222]"></div>
            </div>
            <span className="relative px-4 text-[10px] font-mono uppercase bg-[#111111] text-slate-500 font-bold">
              or bypass credentials
            </span>
          </div>

          {/* Sandbox/Guest fast-track bypass option */}
          <form onSubmit={handleGuestSubmit} className="space-y-4" id="guest-auth-form">
            <div>
              <label htmlFor="guest-username" className="block text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-2">
                Sandbox Guest Identity
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                  <Terminal className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  id="guest-username"
                  placeholder="Enter custom username or leave blank..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={18}
                  disabled={loading}
                  className="w-full h-12 pl-11 pr-4 bg-[#050505] border-2 border-[#222222] text-sm font-mono tracking-wide transition-all outline-hidden text-white"
                  style={{ borderColor: guestSubmitHover ? THEME_COLORS.success : '#222222' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              onMouseEnter={() => setGuestSubmitHover(true)}
              onMouseLeave={() => setGuestSubmitHover(false)}
              className="w-full h-12 flex items-center justify-center gap-2 text-black font-black uppercase text-sm transition-all duration-200 cursor-pointer border-2 shadow-md disabled:opacity-50"
              style={{
                backgroundColor: guestSubmitHover ? '#ffffff' : THEME_COLORS.success,
                borderColor: guestSubmitHover ? '#ffffff' : THEME_COLORS.success
              }}
              id="guest-submit-btn"
            >
              <Cpu className="w-4 h-4" />
              <span>{loading ? 'INTERFACING...' : 'Give a Try'}</span>
            </button>
          </form>

          {/* Quick Sandbox Roles Pickers */}
          <div className="mt-6" id="sandbox-roles-box">
            <p className="text-[9px] uppercase font-mono font-bold tracking-widest text-slate-500 mb-3 text-center">
              Quick Select Sandbox Roles
            </p>
            <div className="grid grid-cols-2 gap-3" id="roles-grid">
              <button
                onClick={() => selectPredefinedAvatar('Nexus_Explorer')}
                onMouseEnter={() => setUserRoleHover(true)}
                onMouseLeave={() => setUserRoleHover(false)}
                className="p-3 bg-[#050505] border-2 text-left cursor-pointer transition-all group"
                style={{ borderColor: userRoleHover ? THEME_COLORS.info : '#222222' }}
                id="select-user-role-btn"
              >
                <div 
                  className="font-black uppercase text-xs tracking-wider transition-colors"
                  style={{ color: userRoleHover ? THEME_COLORS.info : '#ffffff' }}
                >
                  Standard User
                </div>
                <div className="text-[9px] font-mono text-slate-500 mt-0.5">
                  Play & track stats
                </div>
              </button>
              <button
                onClick={() => selectPredefinedAvatar('Root_Admin')}
                onMouseEnter={() => setAdminRoleHover(true)}
                onMouseLeave={() => setAdminRoleHover(false)}
                className="p-3 bg-[#050505] border-2 text-left cursor-pointer transition-all group"
                style={{ borderColor: adminRoleHover ? THEME_COLORS.success : '#222222' }}
                id="select-admin-role-btn"
              >
                <div 
                  className="font-black uppercase text-xs tracking-wider transition-colors"
                  style={{ color: adminRoleHover ? THEME_COLORS.success : '#ffffff' }}
                >
                  System Admin
                </div>
                <div className="text-[9px] font-mono text-slate-500 mt-0.5">
                  Access CRUD editor
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Developer configuration details */}
        <div className="mt-6 text-center" id="dev-config-expand-trigger">
          <button
            onClick={() => setShowConfig(!showConfig)}
            onMouseEnter={() => setShowConfigHover(true)}
            onMouseLeave={() => setShowConfigHover(false)}
            className="text-xs font-mono uppercase tracking-widest text-indigo-400 hover:underline cursor-pointer font-bold transition-colors"
            style={{ color: showConfigHover ? THEME_COLORS.success : '#818cf8' }}
          >
            {showConfig ? 'Hide Credentials Setup' : 'Show Google OAuth Setup Guide'}
          </button>

          {showConfig && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-4 p-5 text-left bg-[#111111] border-2 border-[#222222] shadow-lg space-y-4"
              id="oauth-config-details"
            >
              <h3 className="font-black text-xs text-white uppercase tracking-wider font-mono">
                Google Cloud Platform OAuth Settings
              </h3>
              <p className="text-xs text-slate-400">
                To activate real Google Sign-In, register this application in your Google Cloud Console Credentials screen and add these parameters:
              </p>

              <div className="space-y-3 font-mono text-[10px]">
                <div className="bg-[#050505] p-2.5 border border-[#222222] relative">
                  <p className="text-slate-500 uppercase text-[9px] font-bold">Authorized Redirect URIs (Dev):</p>
                  <p className="text-slate-300 break-all select-all">{devCallbackUrl}</p>
                </div>

                <div className="bg-[#050505] p-2.5 border border-[#222222] relative">
                  <p className="text-slate-500 uppercase text-[9px] font-bold">Authorized Redirect URIs (Production/Shared):</p>
                  <p className="text-slate-300 break-all select-all">{sharedCallbackUrl}</p>
                </div>
              </div>

              <div className="p-3 bg-red-950/20 border flex gap-2.5" style={{ borderColor: `${THEME_COLORS.danger}30` }}>
                <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: THEME_COLORS.danger }} />
                <p className="text-[10px] text-rose-300">
                  <strong>Environment Variables:</strong> Once registered, configure <code>OAUTH_CLIENT_ID</code> and <code>OAUTH_CLIENT_SECRET</code> keys via the Google AI Studio settings sidebar.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
