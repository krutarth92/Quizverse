import React, { useEffect, useState } from 'react';
import { useQuizStore } from '../store/quizStore';
import { Award, RefreshCw, LogOut, CheckCircle2, XCircle, ArrowRight, BookOpen, Clock, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { fireConfettiBlast, fireMilestoneConfetti } from './Confetti';
import GIFReaction from './GIFReaction';
import { THEME_COLORS } from '../themeConfig';

interface ResultsScreenProps {
  results: {
    sessionId: string;
    score: number;
    maxScore: number;
    percentage: number;
    status: string;
    timeTakenSec: number;
    recommendation: string;
    answers: { questionId: string; selectedOptionIds: string[]; isCorrect: boolean }[];
    questions: {
      _id: string;
      prompt: string;
      options?: { id: string; text: string }[];
      type: string;
      correctOptionIds: string[];
      explanation: string;
      difficulty: number;
      topicTags: string[];
    }[];
    newBadges: any[];
  };
  onReset: () => void;
}

export default function ResultsScreen({ results, onReset }: ResultsScreenProps) {
  const { user, fetchDashboardStats } = useQuizStore();
  const [activeBadgeIdx, setActiveBadgeIdx] = useState<number>(0);
  const [showBadgeModal, setShowBadgeModal] = useState<boolean>(false);

  useEffect(() => {
    // 1. Fire Confetti immediately on completion
    fireConfettiBlast();

    // 2. Fetch updated stats in background
    fetchDashboardStats();

    // 3. Trigger achievement popup if new badges were earned
    if (results.newBadges && results.newBadges.length > 0) {
      setTimeout(() => {
        setShowBadgeModal(true);
        fireMilestoneConfetti();
      }, 1500);
    }
  }, [results, fetchDashboardStats]);

  const currentBadge = results.newBadges?.[activeBadgeIdx];

  const handleNextBadge = () => {
    if (results.newBadges && activeBadgeIdx < results.newBadges.length - 1) {
      setActiveBadgeIdx(prev => prev + 1);
      fireMilestoneConfetti();
    } else {
      setShowBadgeModal(false);
    }
  };

  const isPerfect = results.percentage === 100;
  const isPassing = results.percentage >= 60;
  const isFailing = results.percentage < 60;

  // Determine GIF Reaction category
  const reactionType = isPerfect ? 'perfect' : isPassing ? 'success' : 'fail';

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8" id="results-report-screen">

      {/* Hero Summary Card */}
      <div className="bg-[#111111] border-2 border-[#222222] rounded-none p-6 sm:p-8 shadow-2xl relative overflow-hidden" id="results-hero-panel">
        <div className="absolute top-0 left-1/3 w-1/3 h-1 rounded-none" style={{ backgroundColor: THEME_COLORS.info }}></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center" id="hero-layout">
          {/* Text Metrics */}
          <div className="space-y-4 text-center md:text-left" id="results-metrics">
            <span 
              className="px-3 py-1 text-xs font-black font-mono tracking-widest uppercase border border-white rounded-none inline-block"
              style={{ 
                backgroundColor: isPassing ? THEME_COLORS.success : THEME_COLORS.danger,
                color: isPassing ? '#000000' : '#ffffff'
              }}
            >
              {isPassing ? 'QUIZ CLEARED' : 'QUIZ NOT CLEARED'}
            </span>

            <h2 className="text-3xl font-black text-white tracking-tight uppercase">
              {isPerfect ? 'Absolute Perfection!' : isPassing ? 'Sensational Work!' : 'Round Not Cleared'}
            </h2>

            {/* Score Ring Display */}
            <div className="flex items-baseline justify-center md:justify-start gap-1">
              <span className="text-6xl font-black tracking-tight" style={{ color: THEME_COLORS.success }}>
                {results.percentage}%
              </span>
              <span className="text-xs font-black text-slate-400 uppercase font-mono tracking-wider ml-1">Accuracy</span>
            </div>

            <div className="grid grid-cols-3 gap-3 bg-[#050505] p-3.5 rounded-none border border-[#222222] text-center font-mono text-xs">
              <div>
                <span className="text-slate-500 uppercase text-[9px] font-black block">Scored Points</span>
                <span className="text-sm font-bold text-white font-mono">
                  {results.score}/{results.maxScore}
                </span>
              </div>
              <div className="border-x border-[#222222]">
                <span className="text-slate-500 uppercase text-[9px] font-black block">Elapsed Time</span>
                <span className="text-sm font-bold text-white font-mono">
                  {results.timeTakenSec}s
                </span>
              </div>
              <div>
                <span className="text-slate-500 uppercase text-[9px] font-black block">Integrity Flags</span>
                <span className="text-sm font-bold font-mono" style={{ color: THEME_COLORS.success }}>0</span>
              </div>
            </div>
          </div>

          {/* Dynamic GIF Reaction Player */}
          <div className="w-full h-48 md:h-52" id="results-gif-reaction-box">
            <GIFReaction type={reactionType} className="w-full h-full border-2 border-[#222222] rounded-none" />
          </div>
        </div>
      </div>

      {/* Adaptive Training Recommendations Panel */}
      <div 
        className="border-2 p-6 rounded-none" 
        style={{ 
          backgroundColor: `${THEME_COLORS.info}10`,
          borderColor: THEME_COLORS.info
        }}
        id="results-recommendation-card"
      >
        <h3 className="font-black text-xs uppercase tracking-widest font-mono mb-2" style={{ color: THEME_COLORS.info }}>
          Adaptive Training Directive
        </h3>
        <p
          className="text-slate-300 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: results.recommendation }}
        ></p>
      </div>

      {/* Detailed Response Auditing logs */}
      <div className="space-y-4" id="results-review-section">
        <div className="flex items-center gap-2 mb-6" id="auditing-logs-title">
          <BookOpen className="w-5 h-5" style={{ color: THEME_COLORS.success }} />
          <h3 className="font-black text-lg text-white uppercase tracking-tight">Review Board</h3>
        </div>

        {results.questions.map((question, idx) => {
          const answerRecord = results.answers.find(a => a.questionId === question._id);
          const isCorrect = answerRecord?.isCorrect || false;
          const userSelection = answerRecord?.selectedOptionIds || [];

          return (
            <div
              key={question._id}
              className="bg-[#111111] border-2 border-[#222222] rounded-none p-6 shadow-xs space-y-4"
              id={`review-item-${idx}`}
            >
              {/* Review card header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span 
                    className="w-6 h-6 rounded-none flex items-center justify-center text-xs font-black border border-white"
                    style={{
                      backgroundColor: isCorrect ? THEME_COLORS.success : THEME_COLORS.danger,
                      color: isCorrect ? '#000000' : '#ffffff'
                    }}
                  >
                    {idx + 1}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {question.topicTags.map(tag => (
                      <span 
                        key={tag} 
                        className="px-2 py-0.5 rounded-none bg-[#050505] border border-[#222222] text-[9px] font-bold uppercase tracking-wider font-mono"
                        style={{ color: THEME_COLORS.success }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  {isCorrect ? (
                    <div className="flex items-center gap-1 font-black uppercase tracking-wider font-mono" style={{ color: THEME_COLORS.success }}>
                      <span>Correct (+{question.difficulty} pts)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 font-black uppercase tracking-wider font-mono" style={{ color: THEME_COLORS.danger }}>
                      <span>Incorrect</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Prompt */}
              <h4 className="text-sm font-black text-white whitespace-pre-wrap uppercase tracking-wide">
                {question.prompt}
              </h4>

              {/* Review Option listing */}
              <div className="space-y-2" id="review-answers-box">
                {question.type === 'fill-blank' ? (
                  // Fill in blank layout
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="blank-auditing">
                    <div className="p-3.5 rounded-none bg-[#050505] border border-[#222222]">
                      <span className="text-[9px] uppercase tracking-widest font-black text-slate-500 block mb-0.5 font-mono">Your Response</span>
                      <span 
                        className="text-xs font-black uppercase font-mono"
                        style={{ color: isCorrect ? THEME_COLORS.success : THEME_COLORS.danger }}
                      >
                        {userSelection[0] || '(Blank)'}
                      </span>
                    </div>
                    <div className="p-3.5 rounded-none bg-[#050505] border border-[#222222]">
                      <span className="text-[9px] uppercase tracking-widest font-black text-slate-500 block mb-0.5 font-mono">Acceptable Solution(s)</span>
                      <span className="text-xs font-black uppercase font-mono" style={{ color: THEME_COLORS.success }}>
                        {question.correctOptionIds.join(' or ')}
                      </span>
                    </div>
                  </div>
                ) : question.options ? (
                  // Multi Choice options layout
                  <div className="grid grid-cols-1 gap-2" id="options-auditing">
                    {question.options.map(option => {
                      const isUserSelected = userSelection.includes(option.id);
                      const isCorrectOption = question.correctOptionIds.includes(option.id);

                      let styleObj: React.CSSProperties = {
                        borderColor: '#222222',
                        backgroundColor: '#050505',
                      };
                      let textStyle = 'text-slate-400';

                      if (isCorrectOption) {
                        styleObj = {
                          borderColor: THEME_COLORS.success,
                          backgroundColor: `${THEME_COLORS.success}10`
                        };
                        textStyle = 'text-white font-bold';
                      } else if (isUserSelected && !isCorrectOption) {
                        styleObj = {
                          borderColor: THEME_COLORS.danger,
                          backgroundColor: `${THEME_COLORS.danger}10`
                        };
                        textStyle = 'text-white font-bold';
                      }

                      return (
                        <div
                          key={option.id}
                          style={styleObj}
                          className={`p-3 rounded-none border-2 flex items-center justify-between text-xs uppercase tracking-wide ${textStyle}`}
                        >
                          <span className="leading-relaxed font-bold">{option.text}</span>
                          <span className="text-[9px] uppercase font-mono font-black tracking-widest">
                            {isCorrectOption ? 'Correct Solution' : isUserSelected ? 'Your Selection' : ''}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>

              {/* Explanatory Popover box */}
              <div className="p-4 bg-[#050505] border border-[#222222] rounded-none" id="explanation-board-card">
                <span className="text-[9px] uppercase tracking-widest font-black text-slate-500 block mb-1 font-mono">Conceptual Solution Guide</span>
                <p className="text-xs text-slate-300 leading-relaxed break-words font-mono uppercase tracking-wide">
                  {question.explanation}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Control Buttons */}
      <div className="flex flex-col sm:flex-row gap-4" id="results-control-bar">
        <button
          onClick={onReset}
          className="flex-1 h-12 flex items-center justify-center gap-2 rounded-none text-black font-black uppercase tracking-wider text-sm border-2 border-black transition-all cursor-pointer hover:bg-white"
          style={{ backgroundColor: THEME_COLORS.success }}
          id="retake-quiz-btn"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Spawn Next Challenge</span>
        </button>

        <button
          onClick={onReset}
          className="px-6 h-12 flex items-center justify-center gap-2 rounded-none border-2 border-[#222222] bg-[#050505] hover:border-white hover:text-white text-slate-300 font-black uppercase tracking-wider text-sm cursor-pointer transition-all"
          id="exit-results-btn"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Report</span>
        </button>
      </div>

      {/* New Badge Unlock Modal */}
      {showBadgeModal && currentBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md" id="achievement-unlocked-modal">
          <motion.div
            initial={{ scale: 0.8, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            className="w-full max-w-sm bg-[#111111] border-2 rounded-none p-6 text-center text-white relative shadow-2xl"
            style={{ borderColor: THEME_COLORS.success }}
          >
            <span 
              className="px-3 py-1 border border-white text-black text-[10px] font-black tracking-widest uppercase rounded-none"
              style={{ backgroundColor: THEME_COLORS.success }}
            >
              Achievement Unlocked
            </span>

            {/* Huge Badges icon */}
            <motion.div
              initial={{ scale: 0.5, rotate: -20 }}
              animate={{ scale: [0.5, 1.2, 1], rotate: [0, 10, 0] }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-7xl my-6 filter drop-shadow-lg"
            >
              {currentBadge.badge?.iconUrl || '🏆'}
            </motion.div>

            <h4 className="text-2xl font-black leading-tight uppercase tracking-tight" style={{ color: THEME_COLORS.success }}>
              {currentBadge.badge?.name}
            </h4>

            <p className="text-xs italic mt-1 font-mono uppercase tracking-widest" style={{ color: THEME_COLORS.info }}>
              {currentBadge.badge?.criteria}
            </p>

            <p className="text-sm text-slate-300 my-4 px-2 uppercase font-mono tracking-wide text-xs">
              "{currentBadge.badge?.description}"
            </p>

            {/* Modal action button */}
            <button
              onClick={handleNextBadge}
              className="w-full h-11 flex items-center justify-center gap-2 rounded-none text-black font-black uppercase tracking-wider text-xs border-2 border-black cursor-pointer transition-transform hover:bg-white"
              style={{ backgroundColor: THEME_COLORS.success }}
              id="claim-badge-modal-btn"
            >
              <span>{results.newBadges.length > activeBadgeIdx + 1 ? 'Unlock Next Badge' : 'Secure Achievement'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      )}

    </div>
  );
}
