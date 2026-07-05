import { useEffect, useState } from 'react';
import { useQuizStore } from '../store/quizStore';
import { Award, Zap, CheckCircle2, AlertTriangle, TrendingUp, Compass, Calendar, BookOpen, Play } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { motion } from 'motion/react';
import { fireMilestoneConfetti } from './Confetti';
import { THEME_COLORS } from '../themeConfig';

const LEVEL_DETAILS: Record<string, Record<string, { title: string; subtitle: string; tags: string[]; desc: string }>> = {
  python: {
    beginner: {
      title: "Beginner Fundamentals",
      subtitle: "Tier 1",
      tags: ["Syntax", "Variables", "Loops", "Lists"],
      desc: "Perfect for starting out. Tests core variables, type assertions, list indexing, and basic loops."
    },
    intermediate: {
      title: "Intermediate Mastery",
      subtitle: "Tier 2",
      tags: ["Comprehensions", "Lambdas", "Decorators", "Contexts"],
      desc: "Dives deeper. Covers list comprehensions, decorators, generators, error handlers, and contexts."
    },
    advanced: {
      title: "Advanced Core & Internals",
      subtitle: "Tier 3",
      tags: ["Metaclasses", "GIL", "Garbage Collection", "Dunder"],
      desc: "For pros. Tests CPython memory management, dunder protocols, GIL, metaclass, and async routines."
    },
    api: {
      title: "API Engineering (FastAPI)",
      subtitle: "Tier 4",
      tags: ["FastAPI", "Pydantic", "REST", "JWT", "CORS"],
      desc: "Web services track. Tests HTTP verbs, FastAPI dependency injection, Pydantic validation, and JWT."
    },
    django: {
      title: "Django Web Architect",
      subtitle: "Tier 5",
      tags: ["Django ORM", "Middleware", "Signals", "CSRF"],
      desc: "Enterprise frameworks. Covers ORM joins, middleware hooks, models lifecycle, signals, and security."
    }
  },
  'ai-ml': {
    beginner: {
      title: "ML Foundations",
      subtitle: "Tier 1",
      tags: ["Supervised", "Regression", "Overfitting", "Metrics"],
      desc: "Start your AI journey. Tests train/test splits, bias-variance trade-offs, accuracy, and clustering."
    },
    intermediate: {
      title: "Neural Networks & Deep Learning",
      subtitle: "Tier 2",
      tags: ["CNNs", "RNNs", "Activations", "Optimizers", "Dropout"],
      desc: "Deeper neural layers. Covers activation functions, convolutional/recurrent layers, and backprop."
    },
    advanced: {
      title: "Transformers, LLMs & Generative AI",
      subtitle: "Tier 3",
      tags: ["Transformers", "Self-Attention", "PEFT/LoRA", "RAG", "RLHF"],
      desc: "State-of-the-art. Tests attention matrices, retrieval-augmentation, RLHF, and parameter efficiency."
    }
  },
  cloud: {
    beginner: {
      title: "Cloud Foundations",
      subtitle: "Tier 1",
      tags: ["IaaS/PaaS/SaaS", "VPCs", "S3 Storage", "IAM"],
      desc: "Intro to cloud. Covers service categories, virtual networks, block/object storage, and billing models."
    },
    intermediate: {
      title: "Scalable Systems & Ops",
      subtitle: "Tier 2",
      tags: ["Load Balancing", "Auto-Scaling", "Docker", "NACLs/SGs"],
      desc: "Infrastructure scaling. Covers firewalls, load balancing, CDNs, high availability, and NAT gateways."
    },
    advanced: {
      title: "Solutions Architect & K8s",
      subtitle: "Tier 3",
      tags: ["Kubernetes", "Terraform", "Service Mesh", "Multi-Region"],
      desc: "Enterprise cloud. Tests Terraform scripting, Kubernetes pods/kube-schedulers, and disaster recovery."
    }
  }
};

export default function DashboardScreen() {
  const { user, dashboardStats, fetchDashboardStats, tracks, fetchTracks, setActiveTrackAndLevel, startQuiz } = useQuizStore();
  const [selectedBadge, setSelectedBadge] = useState<any | null>(null);
  const [activeLaunchpadTrack, setActiveLaunchpadTrack] = useState<string>('python');

  useEffect(() => {
    fetchDashboardStats();
    fetchTracks();
  }, [fetchDashboardStats, fetchTracks]);

  if (!dashboardStats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3" id="dashboard-loading">
        <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-mono text-slate-400">Compiling statistics...</p>
      </div>
    );
  }

  const { totalQuizzesTaken, streak, trackCompletion, weakTopics, strongTopics, scoreTrend, badges } = dashboardStats;

  const handleQuickPlay = (trackSlug: string) => {
    const track = tracks.find(t => t.slug === trackSlug);
    if (track && track.levels.length > 0) {
      setActiveTrackAndLevel(track, track.levels[0]);
      startQuiz(track.slug, track.levels[0]);
    }
  };

  const handleLaunchQuiz = (trackSlug: string, levelSlug: string) => {
    const track = tracks.find(t => t.slug === trackSlug);
    if (track) {
      setActiveTrackAndLevel(track, levelSlug as any);
      startQuiz(track.slug as any, levelSlug as any);
    }
  };

  const hasTrend = scoreTrend && scoreTrend.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8" id="dashboard-container">
      {/* Welcome Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dashboard-hero-grid">
        <div className="lg:col-span-2 bg-[#111111] border-2 border-[#222222] p-6 sm:p-8 text-white relative overflow-hidden flex flex-col justify-between" id="dashboard-hero-card">
          {/* Subtle neo-brutalist background mesh accent lines */}
          <div className="absolute right-0 bottom-0 top-0 w-[1px] bg-dashed border-r border-[#222222]"></div>

          <div>
            <div className="flex items-center gap-2 px-3 py-1 bg-[#FF0055]/10 border border-[#FF0055] text-xs font-mono font-bold text-[#FF0055] uppercase tracking-widest w-fit">
              <Compass className="w-3.5 h-3.5" />
              <span>Current Status: Active Explorer</span>
            </div>
            <h2 className="text-3xl font-black mt-6 tracking-tight uppercase">
              Welcome back, <span className="text-[#FFE600]">{user?.name}</span>!
            </h2>
            <p className="mt-3 text-slate-400 font-medium text-sm max-w-lg leading-relaxed">
              Test your proficiency in Python, AI, and Cloud environments. Complete quizzes, unlock historic achievement badges, and climb the leaderboard standings.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mt-8" id="hero-quick-tracks">
            {tracks.map(t => {
              const completion = trackCompletion[t.slug] || 0;
              return (
                <button
                  key={t._id}
                  onClick={() => handleQuickPlay(t.slug)}
                  className="flex items-center gap-3 bg-[#050505] hover:bg-[#111111] border-2 border-[#222222] hover:border-[#FFE600] p-3 text-left transition-all cursor-pointer group rounded-none"
                >
                  <span className="text-xl">
                    {t.slug === 'python' ? '🐍' : t.slug === 'ai-ml' ? '🤖' : '☁️'}
                  </span>
                  <div>
                    <div className="text-xs font-black uppercase tracking-wider text-white group-hover:text-[#FFE600] transition-colors">{t.name}</div>
                    <div className="text-[10px] font-mono text-slate-500 mt-0.5">{completion}% Mastery</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Streak Card */}
        <div className="bg-[#111111] border-2 border-[#222222] p-6 flex flex-col justify-between transition-all rounded-none hover:border-[#FFE600]" id="dashboard-streak-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-[#FFE600] uppercase tracking-widest font-mono">
                Consistency Track
              </p>
              <h3 className="text-2xl font-black uppercase tracking-tight mt-1 text-white">Daily Streak</h3>
            </div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="p-3 bg-[#FFE600] text-black border-2 border-black"
            >
              <Zap className="w-6 h-6 fill-black" />
            </motion.div>
          </div>

          <div className="my-6">
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black tracking-tight text-[#FFE600] font-mono">{streak}</span>
              <span className="text-xs uppercase font-mono tracking-wider font-bold text-slate-400">days active</span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-2 leading-relaxed">
              Keep solving at least one quiz each day to keep your streak burning and claim exclusive badges!
            </p>
          </div>

          <div className="bg-[#050505] p-3 border border-[#222222] flex items-center justify-between font-mono">
            <span className="text-xs uppercase text-slate-500 font-bold">Total Solved Quizzes</span>
            <span className="font-bold text-sm text-white">{totalQuizzesTaken}</span>
          </div>
        </div>
      </div>

      {/* 🏁 DEDICATED QUIZ ARENA LAUNCHPAD */}
      <div className="bg-[#111111] border-2 border-[#222222] p-6 sm:p-8 rounded-none relative" id="interactive-quiz-arena">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#00F0FF] uppercase tracking-widest">
              <Zap className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>Syllabus-Aligned Testing Centers</span>
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight text-white mt-1">Quiz Challenge Arena</h3>
            <p className="text-xs text-slate-400 font-medium max-w-xl mt-1">
              Select an educational focus track below and launch a specialized 20-question, 30-minute timed challenge to test your limits.
            </p>
          </div>
          <div className="px-3 py-1.5 bg-[#050505] border border-[#222222] rounded-none font-mono text-[10px] uppercase text-slate-500 tracking-widest h-fit">
            Assessment Status: <span className="text-[#FFE600] font-bold">SECURE ONLINE</span>
          </div>
        </div>

        {/* Track Selection Tabs */}
        <div className="flex flex-col sm:flex-row gap-3 border-b-2 border-[#222222] pb-6 mb-6" id="arena-track-tabs">
          {tracks.map(t => {
            const isActive = activeLaunchpadTrack === t.slug;
            const emoji = t.slug === 'python' ? '🐍' : t.slug === 'ai-ml' ? '🤖' : '☁️';
            const themeColor = t.slug === 'python' ? THEME_COLORS.python : t.slug === 'ai-ml' ? THEME_COLORS.aiMl : THEME_COLORS.cloud;

            return (
              <button
                key={t._id}
                onClick={() => setActiveLaunchpadTrack(t.slug)}
                className={`flex-1 flex items-center justify-center gap-3 py-3.5 px-4 text-xs font-black uppercase tracking-widest border transition-all cursor-pointer rounded-none relative ${
                  isActive
                    ? 'bg-[#050505] text-white border-white border-b-transparent z-10 font-black font-mono'
                    : 'bg-[#111111] text-slate-400 border-[#222222] hover:border-gray-500 hover:text-white'
                }`}
                style={isActive ? { borderTop: `3px solid ${themeColor}` } : {}}
              >
                <span className="text-lg">{emoji}</span>
                <span>{t.name}</span>
                {isActive && (
                  <div className="absolute -bottom-[2px] left-0 right-0 h-[2px] bg-[#050505]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Track Levels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="arena-levels-grid">
          {(() => {
            const activeTrack = tracks.find(t => t.slug === activeLaunchpadTrack);
            if (!activeTrack) return null;

            return activeTrack.levels.map((levelSlug) => {
              const details = LEVEL_DETAILS[activeLaunchpadTrack]?.[levelSlug] || {
                title: `${levelSlug.toUpperCase()} LEVEL`,
                subtitle: "Specialized Tier",
                tags: ["Core Concepts"],
                desc: "Challenge your familiarity with high-level developer configurations and techniques."
              };

              const levelProgress = (dashboardStats as any).progressList?.find(
                (p: any) => p.trackId === activeLaunchpadTrack && p.level === levelSlug
              );

              const hasAttempted = !!levelProgress && levelProgress.attempts > 0;
              const accentColor = activeLaunchpadTrack === 'python' ? THEME_COLORS.python : activeLaunchpadTrack === 'ai-ml' ? THEME_COLORS.aiMl : THEME_COLORS.cloud;

              return (
                <div
                  key={levelSlug}
                  className="bg-[#050505] border-2 border-[#222222] p-5 flex flex-col justify-between rounded-none hover:border-gray-400 transition-all group relative"
                  id={`arena-level-card-${levelSlug}`}
                >
                  <div>
                    {/* Header line */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-mono uppercase tracking-widest font-black text-slate-500">
                        {details.subtitle}
                      </span>
                      {hasAttempted ? (
                        levelProgress.completionPct >= 60 ? (
                          <span className="px-2 py-0.5 bg-[#FFE600]/10 border border-[#FFE600] text-[#FFE600] text-[9px] font-mono font-black uppercase tracking-widest">
                            CLEARED • {levelProgress.completionPct}%
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-[#FF0055]/10 border border-[#FF0055] text-[#FF0055] text-[9px] font-mono font-black uppercase tracking-widest">
                            NOT CLEARED • {levelProgress.completionPct}%
                          </span>
                        )
                      ) : (
                        <span className="px-2 py-0.5 bg-[#00F0FF]/10 border border-[#00F0FF] text-[#00F0FF] text-[9px] font-mono font-black uppercase tracking-widest">
                          Unattempted
                        </span>
                      )}
                    </div>

                    {/* Level Title */}
                    <h4 className="text-md font-black uppercase tracking-wide text-white group-hover:text-[#FFE600] transition-colors">
                      {details.title}
                    </h4>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-2.5 mb-4">
                      {details.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-[#111111] text-[9px] font-mono text-slate-400 uppercase tracking-wide border border-[#222222]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6">
                      {details.desc}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Structure Details Info */}
                    <div className="border-t border-[#1a1a1a] pt-4 grid grid-cols-2 gap-2 text-[10px] font-mono uppercase text-slate-500 tracking-wider">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-slate-600" />
                        <span>20 Questions</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-600" />
                        <span>30 Minutes</span>
                      </div>
                    </div>

                    {/* Action Launch Button */}
                    <button
                      onClick={() => handleLaunchQuiz(activeLaunchpadTrack, levelSlug)}
                      className="w-full py-3 px-4 text-xs font-black uppercase tracking-widest cursor-pointer transition-all flex items-center justify-center gap-2 border-2 text-black bg-white border-black hover:bg-[#FFE600] hover:border-black active:translate-x-0.5 active:translate-y-0.5"
                      style={{
                        boxShadow: `4px 4px 0px ${accentColor}`
                      }}
                    >
                      <Play className="w-3.5 h-3.5 fill-black" />
                      <span>Engage Assessment</span>
                    </button>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>

      {/* Track Mastery Progress */}
      <div className="bg-[#111111] border-2 border-[#222222] p-6 sm:p-8 rounded-none" id="dashboard-track-mastery">
        <h3 className="text-xl font-black uppercase tracking-wider text-white mb-6">Subject Track Mastery</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tracks.map(t => {
            const completion = trackCompletion[t.slug] || 0;
            const emoji = t.slug === 'python' ? '🐍' : t.slug === 'ai-ml' ? '🤖' : '☁️';
            const accentColor = t.slug === 'python' ? THEME_COLORS.python : t.slug === 'ai-ml' ? THEME_COLORS.aiMl : THEME_COLORS.cloud;
            const textColor = t.slug === 'python' ? 'text-black' : 'text-black';

            return (
              <div key={t._id} className="p-5 bg-[#050505] border-2 border-[#222222] hover:border-white transition-all flex flex-col justify-between rounded-none" id={`track-mastery-card-${t.slug}`}>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{emoji}</span>
                    <span className="text-[10px] font-black px-2.5 py-1 text-black font-mono uppercase tracking-wider" style={{ backgroundColor: accentColor }}>
                      {completion}% Mastery
                    </span>
                  </div>
                  <h4 className="font-black uppercase tracking-wider text-base text-white">{t.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{t.description}</p>
                </div>

                <div className="mt-6 space-y-2">
                  <div className="w-full h-3 bg-[#111111] border border-[#222222] rounded-none overflow-hidden">
                    <div
                      className="h-full rounded-none transition-all duration-1000"
                      style={{ width: `${completion}%`, backgroundColor: accentColor }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[9px] font-mono uppercase tracking-widest font-black text-slate-500">
                    <span>Beginner</span>
                    <span>Advanced</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Analytics: Recharts Trends & Strong/Weak Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dashboard-analytics-grid">
        {/* Score Trends Graph */}
        <div className="lg:col-span-2 bg-[#111111] border-2 border-[#222222] p-6 sm:p-8 flex flex-col rounded-none" id="dashboard-trend-graph">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-black uppercase tracking-wider text-white">Performance Index</h3>
              <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">Your historical score accuracy percentages</p>
            </div>
            <div className="p-2.5 bg-[#00F0FF]/10 border flex items-center justify-center" style={{ borderColor: THEME_COLORS.aiMl, color: THEME_COLORS.aiMl }}>
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="flex-1 min-h-[240px]" id="recharts-container font-mono">
            {hasTrend ? (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={scoreTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPct" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={THEME_COLORS.aiMl} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={THEME_COLORS.aiMl} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222222" />
                  <XAxis dataKey="name" stroke="#555555" fontSize={10} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#555555" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111111',
                      border: '2px solid #222222',
                      borderRadius: '0px',
                      color: '#fff',
                      fontFamily: 'monospace',
                      fontSize: '11px'
                    }}
                    labelStyle={{ fontWeight: 'bold', color: THEME_COLORS.aiMl }}
                  />
                  <Area type="monotone" dataKey="pct" stroke={THEME_COLORS.aiMl} strokeWidth={3} fillOpacity={1} fill="url(#colorPct)" name="Accuracy (%)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-[#050505] rounded-none border-2 border-dashed border-[#222222]" id="empty-trend-view">
                <Calendar className="w-10 h-10 text-slate-600 mb-2" />
                <h4 className="font-bold text-sm text-slate-400 font-mono uppercase tracking-widest">No data points logged</h4>
                <p className="text-xs text-slate-500 max-w-xs mt-1 font-mono uppercase tracking-wider">
                  Complete your first quiz session to start generating the accuracy performance chart!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Weak vs Strong Breakdown */}
        <div className="bg-[#111111] border-2 border-[#222222] p-6 flex flex-col rounded-none" id="dashboard-topics-breakdown">
          <h3 className="text-lg font-black uppercase tracking-wider text-white mb-6">Topic Proficiency</h3>

          <div className="space-y-6 flex-1 flex flex-col justify-around">
            {/* Strong Topics */}
            <div id="strong-topics-box">
              <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest mb-3 font-mono" style={{ color: THEME_COLORS.success }}>
                <CheckCircle2 className="w-4 h-4" />
                <span>Strong Areas (&ge; 80%)</span>
              </div>
              <div className="flex flex-wrap gap-2" id="strong-topics-list">
                {strongTopics.length > 0 ? (
                  strongTopics.map(tag => (
                    <span key={tag} className="px-2.5 py-1.5 text-xs font-black uppercase tracking-wider border border-black text-black select-none font-mono" style={{ backgroundColor: THEME_COLORS.success }}>
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 font-mono uppercase">No tags mastered yet. Play some quizzes!</span>
                )}
              </div>
            </div>

            {/* Weak Topics */}
            <div id="weak-topics-box">
              <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest mb-3 font-mono" style={{ color: THEME_COLORS.danger }}>
                <AlertTriangle className="w-4 h-4" />
                <span>Focus Areas (&lt; 50%)</span>
              </div>
              <div className="flex flex-wrap gap-2" id="weak-topics-list">
                {weakTopics.length > 0 ? (
                  weakTopics.map(tag => (
                    <span key={tag} className="px-2.5 py-1.5 text-xs font-black uppercase tracking-wider border border-black text-white select-none font-mono" style={{ backgroundColor: THEME_COLORS.danger }}>
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 font-mono uppercase">No struggling areas. Outstanding progress!</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Cabinet Cabinet */}
      <div className="bg-[#111111] border-2 border-[#222222] p-6 sm:p-8 rounded-none" id="dashboard-badges-cabinet">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-black uppercase tracking-wider text-white">Achievements Cabinet</h3>
            <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">Milestone badges earned through quiz accuracy</p>
          </div>
          <div className="p-2.5 bg-[#FF0055]/10 border text-[#FF0055] flex items-center justify-center" style={{ borderColor: THEME_COLORS.danger }}>
            <Award className="w-4 h-4" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4" id="badges-grid-cabinet">
          {badges.map((badge: any) => (
            <button
              key={badge._id}
              onClick={() => {
                setSelectedBadge(badge);
                if (badge.earned) {
                  fireMilestoneConfetti();
                }
              }}
              className={`p-4 border flex flex-col items-center justify-center text-center transition-all cursor-pointer relative group rounded-none ${
                badge.earned
                  ? 'bg-[#050505] border-[#222222] hover:border-[#FFE600] hover:scale-105'
                  : 'bg-[#050505] border-[#161616] opacity-30 hover:opacity-50'
              }`}
              id={`badge-cabinet-${badge.code}`}
            >
              <div className="text-3xl mb-2 filter drop-shadow-sm group-hover:scale-110 transition-transform">
                {badge.earned ? badge.iconUrl : '🔒'}
              </div>
              <div className="text-[10px] font-black uppercase text-white tracking-widest font-mono truncate w-full">
                {badge.name}
              </div>
              {badge.earned && (
                <div className="absolute top-1 right-1 w-2.5 h-2.5 border border-black" style={{ backgroundColor: THEME_COLORS.success }}></div>
              )}
            </button>
          ))}
        </div>

        {/* Modal/Detail Card for Selected Badge */}
        {selectedBadge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs" id="badge-modal">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-sm bg-[#111111] border-2 border-[#222222] rounded-none p-6 shadow-2xl relative text-center"
            >
              <button
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 right-4 w-7 h-7 bg-[#050505] border border-[#222222] hover:border-[#FF0055] hover:text-[#FF0055] flex items-center justify-center text-slate-400 cursor-pointer text-xs font-mono font-bold"
              >
                ✕
              </button>

              <div className="text-6xl my-4 animate-bounce">
                {selectedBadge.earned ? selectedBadge.iconUrl : '🔒'}
              </div>
              <h4 className="text-xl font-black uppercase tracking-wider text-white">
                {selectedBadge.name}
              </h4>
              <p className="text-xs font-mono uppercase tracking-widest font-bold mt-1" style={{ color: THEME_COLORS.success }}>
                {selectedBadge.earned ? 'Earned Achievement' : 'Locked Milestone'}
              </p>

              <p className="text-sm text-slate-300 my-4 px-2 leading-relaxed">
                "{selectedBadge.description}"
              </p>

              <div className="bg-[#050505] p-3 border border-[#222222] text-left rounded-none">
                <span className="text-[9px] uppercase tracking-widest font-bold text-slate-500 font-mono block mb-1">
                  Criteria to Unlock
                </span>
                <span className="text-xs font-bold text-slate-300 font-mono uppercase">
                  {selectedBadge.criteria}
                </span>
              </div>

              {selectedBadge.earned && selectedBadge.earnedAt && (
                <p className="text-[10px] font-mono text-slate-500 mt-4 uppercase">
                  Unlocked on {new Date(selectedBadge.earnedAt).toLocaleDateString()}
                </p>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
