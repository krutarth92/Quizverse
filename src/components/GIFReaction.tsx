import { motion } from 'motion/react';
import { Sparkles, Trophy, CheckCircle2, RotateCcw, Flame, AlertTriangle } from 'lucide-react';

type ReactionType = 'perfect' | 'success' | 'practice' | 'fail' | 'time_warning';

interface GIFReactionProps {
  type: ReactionType;
  className?: string;
}

// Custom emoji lists for floating background particles
const EMOJIS: Record<ReactionType, string[]> = {
  perfect: ['👑', '🎉', '⭐', '🚀', '🏆', '✨', '🥳', '🔥'],
  success: ['👍', '🌟', '🎯', '🙌', '📈', '✅', '✨', '😎'],
  practice: ['📚', '✍️', '🧠', '📈', '🎯', '💡', '🌀', '🌱'],
  fail: ['🩹', '💡', '🎯', '🔄', '🧠', '💪', '🛠️', '⚡'],
  time_warning: ['⚡', '⏰', '⌛', '🔥', '💨', '🚨', '😱', '🥵']
};

// Layout configurations
const CONFIGS: Record<
  ReactionType,
  {
    themeColor: string;
    bgColor: string;
    title: string;
    subtitle: string;
    centerEmoji: string;
    icon: any;
  }
> = {
  perfect: {
    themeColor: '#FFE600',
    bgColor: 'from-yellow-950/40 to-black',
    title: 'PERFECT SCORE',
    subtitle: 'GODLIKE PROTOCOL ACTIVE',
    centerEmoji: '🥳',
    icon: Trophy
  },
  success: {
    themeColor: '#00F0FF',
    bgColor: 'from-cyan-950/40 to-black',
    title: 'PASSING LEVEL',
    subtitle: 'COGNITIVE CORE STABLE',
    centerEmoji: '😎',
    icon: CheckCircle2
  },
  practice: {
    themeColor: '#FFE600',
    bgColor: 'from-slate-950 to-black',
    title: 'PRACTICE RUN',
    subtitle: 'RECALIBRATING KNOWLEDGE',
    centerEmoji: '🤔',
    icon: Sparkles
  },
  fail: {
    themeColor: '#FF0055',
    bgColor: 'from-rose-950/40 to-black',
    title: 'ATTEMPT COMPLETE',
    subtitle: 'SYNAPSE RECOVERY ACTIVE',
    centerEmoji: '🫠',
    icon: RotateCcw
  },
  time_warning: {
    themeColor: '#FF0055',
    bgColor: 'from-red-950/40 to-black',
    title: 'CRITICAL WARNING',
    subtitle: 'SYSTEM OVERCLOCK IN PROGRESS',
    centerEmoji: '😱',
    icon: Flame
  }
};

export default function GIFReaction({ type, className = '' }: GIFReactionProps) {
  const config = CONFIGS[type];
  const list = EMOJIS[type];
  const IconComponent = config.icon;

  // Generate deterministic-looking pseudo-random float coordinates for 8 floating emojis
  const particles = Array.from({ length: 8 }).map((_, i) => {
    const angle = (i * Math.PI * 2) / 8;
    const distance = 50 + (i % 3) * 15;
    const xDest = Math.cos(angle) * distance;
    const yDest = Math.sin(angle) * distance;
    const delay = i * 0.25;
    const duration = 2.5 + (i % 2) * 1.5;

    return {
      emoji: list[i % list.length],
      x: xDest,
      y: yDest,
      delay,
      duration,
      scale: 0.8 + (i % 3) * 0.2
    };
  });

  return (
    <div
      className={`relative overflow-hidden border-2 border-[#222222] bg-gradient-to-b ${config.bgColor} flex flex-col items-center justify-center p-4 min-h-[160px] h-full select-none rounded-none`}
      style={{ boxShadow: `inset 0 0 20px rgba(0,0,0,0.8)` }}
      id={`local-reaction-${type}`}
    >
      {/* Dynamic scanlines for CRT terminal effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10 bg-linear-to-b from-transparent via-white/5 to-transparent bg-[size:100%_4px]"
        style={{ zIndex: 5 }}
      />

      {/* Flashing/Pulsing glow ring in background */}
      <motion.div
        animate={{
          scale: [0.95, 1.05, 0.95],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute w-28 h-28 rounded-full filter blur-xl pointer-events-none"
        style={{
          backgroundColor: `${config.themeColor}20`,
          border: `2px solid ${config.themeColor}30`
        }}
      />

      {/* Floating Sparkle Particles */}
      <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
        {particles.map((p, idx) => (
          <motion.div
            key={idx}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{
              x: [0, p.x, p.x * 1.1, p.x * 0.9, 0],
              y: [0, p.y, p.y * 1.1, p.y * 0.9, 0],
              opacity: [0, 0.9, 0.9, 0.8, 0],
              scale: [0, p.scale, p.scale * 1.1, p.scale, 0],
              rotate: [0, idx * 45, idx * 90, idx * 135, 360]
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute text-lg pointer-events-none select-none"
            id={`particle-${type}-${idx}`}
          >
            {p.emoji}
          </motion.div>
        ))}
      </div>

      {/* Main Center Animated Stage */}
      <div className="relative flex flex-col items-center justify-center z-10">
        {/* Animated Main Hero Emoji */}
        <motion.div
          animate={
            type === 'perfect'
              ? {
                  y: [0, -14, 0],
                  scale: [1, 1.15, 0.95, 1],
                  rotate: [0, 8, -8, 0]
                }
              : type === 'time_warning'
              ? {
                  x: [-3, 3, -3, 3, 0],
                  y: [-2, 2, -2, 2, 0],
                  scale: [1, 1.08, 0.96, 1]
                }
              : type === 'fail'
              ? {
                  scaleY: [1, 0.8, 1.1, 1],
                  scaleX: [1, 1.15, 0.9, 1],
                  y: [0, 4, -2, 0]
                }
              : {
                  y: [0, -8, 0],
                  scale: [1, 1.06, 1]
                }
          }
          transition={{
            duration: type === 'time_warning' ? 0.35 : 1.8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-5xl sm:text-6xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] select-none cursor-default"
          id={`center-hero-emoji-${type}`}
        >
          {config.centerEmoji}
        </motion.div>

        {/* Reaction Status Badges */}
        <div className="mt-4 flex flex-col items-center">
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#050505] border border-[#222222] rounded-none">
            <IconComponent 
              className="w-3.5 h-3.5" 
              style={{ color: config.themeColor }} 
              id={`reaction-status-icon-${type}`}
            />
            <span 
              className="text-[9px] font-mono font-bold uppercase tracking-widest text-white"
            >
              {config.title}
            </span>
          </div>

          <span className="text-[7px] font-mono text-slate-500 uppercase tracking-widest mt-1">
            {config.subtitle}
          </span>
        </div>
      </div>

      {/* Local Engine Telemetry Badge */}
      <div 
        className="absolute bottom-1 right-2 font-mono text-[6px] tracking-wider uppercase text-slate-600 font-bold"
        style={{ zIndex: 10 }}
      >
        EMOJI ENGINE v2.0
      </div>
    </div>
  );
}
