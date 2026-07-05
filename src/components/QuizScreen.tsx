import { useEffect, useState, useRef } from 'react';
import { useQuizStore } from '../store/quizStore';
import { HelpCircle, Clock, AlertTriangle, ChevronRight, ChevronLeft, Send, CheckSquare, Square, RefreshCw, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import GIFReaction from './GIFReaction';

interface QuizScreenProps {
  onComplete: (results: any) => void;
}

export default function QuizScreen({ onComplete }: QuizScreenProps) {
  const {
    user,
    activeSession,
    currentQuestionIdx,
    selectedAnswers,
    selectAnswer,
    setFillBlankAnswer,
    nextQuestion,
    prevQuestion,
    submitQuiz,
    clearQuizSession,
    quizError
  } = useQuizStore();

  const [timeLeft, setTimeLeft] = useState(0);
  const [warnings, setWarnings] = useState(0);
  const [showWarningAlert, setShowWarningAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [typedFillBlank, setTypedFillBlank] = useState('');

  const totalQuestions = activeSession?.questions?.length || 0;
  const currentQuestion = activeSession?.questions?.[currentQuestionIdx];
  const totalDurationRef = useRef(totalQuestions * 90); // 1.5 min per question

  // Sync client-side countdown timer with server deadline
  useEffect(() => {
    if (!activeSession) return;

    const calculateTimeLeft = () => {
      const expires = new Date(activeSession.expiresAt).getTime();
      const now = Date.now();
      const diff = Math.max(0, Math.floor((expires - now) / 1000));
      setTimeLeft(diff);

      if (diff <= 0) {
        clearInterval(timer);
        handleSubmit(true); // auto-submit on timeout
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [activeSession]);

  // Tab switch / blur cheating detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && activeSession) {
        setWarnings(prev => {
          const next = prev + 1;
          setShowWarningAlert(true);
          return next;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [activeSession]);

  // Full Keyboard Navigation accessibility compliance
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentQuestion) return;

      // Only listen to alphanumeric choices if NOT typing in the fill-blank input field
      const isInputActive = document.activeElement?.tagName === 'INPUT';

      if (!isInputActive) {
        // Selection bindings (1, 2, 3, 4 ... mapped to options)
        if (['1', '2', '3', '4'].includes(e.key) && currentQuestion.options) {
          const optionIdx = parseInt(e.key) - 1;
          const option = currentQuestion.options[optionIdx];
          if (option) {
            selectAnswer(currentQuestion._id, option.id, currentQuestion.type === 'multi');
          }
        }
        // Selection keys (a, b, c, d)
        if (['a', 'b', 'c', 'd'].includes(e.key.toLowerCase()) && currentQuestion.options) {
          const alphabet = ['a', 'b', 'c', 'd'];
          const optionIdx = alphabet.indexOf(e.key.toLowerCase());
          const option = currentQuestion.options[optionIdx];
          if (option) {
            selectAnswer(currentQuestion._id, option.id, currentQuestion.type === 'multi');
          }
        }

        // Navigation bindings (ArrowLeft, ArrowRight)
        if (e.key === 'ArrowLeft') {
          prevQuestion();
        }
        if (e.key === 'ArrowRight') {
          nextQuestion();
        }

        // Space/Enter submit (if on last question)
        if (e.key === 'Enter' && currentQuestionIdx === totalQuestions - 1) {
          handleSubmit();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, currentQuestionIdx, totalQuestions]);

  // Pre-load current question's fill blank value if any
  useEffect(() => {
    if (currentQuestion && currentQuestion.type === 'fill-blank') {
      const saved = selectedAnswers[currentQuestion._id]?.[0] || '';
      setTypedFillBlank(saved);
    }
  }, [currentQuestion, selectedAnswers]);

  if (!activeSession || !currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3" id="quiz-unloaded">
        <Clock className="w-10 h-10 text-rose-400 animate-pulse" />
        <p className="text-sm font-mono text-slate-400">Locking secure session...</p>
      </div>
    );
  }

  const handleFillBlankChange = (val: string) => {
    setTypedFillBlank(val);
    setFillBlankAnswer(currentQuestion._id, val);
  };

  const handleSubmit = async (autoSubmit = false) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const results = await submitQuiz();
      if (results) {
        onComplete(results);
      }
    } catch (err) {
      console.error('Quiz submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine timer warning threshold (15% left)
  const isTimeUrgent = timeLeft < totalDurationRef.current * 0.15;

  const currentSelection = selectedAnswers[currentQuestion._id] || [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 relative" id="active-quiz-frame">

      {/* Security Watermark Deterrent */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] select-none flex flex-col justify-around rotate-12 overflow-hidden z-0" aria-hidden="true" id="anti-cheat-watermark">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="text-[11px] font-mono tracking-widest text-white whitespace-nowrap text-center">
            {user?.email} • SECURE INTERFACES • WARNING: TAMPER_FLAGGED_VISIBILITY_CHANGES • {new Date().toLocaleDateString()}
          </div>
        ))}
      </div>

      {/* Main Column Wrapper */}
      <div className="relative z-10 space-y-6" id="quiz-wrapper">

        {/* Top Quiz Bar */}
        <div className="flex items-center justify-between bg-[#111111] border-2 border-[#222222] p-4 rounded-none shadow-xs" id="quiz-top-bar">
          <div className="flex items-center gap-2">
            <span className="text-xl">
              {activeSession.trackId === 'python' ? '🐍' : activeSession.trackId === 'ai-ml' ? '🤖' : '☁️'}
            </span>
            <div>
              <span className="text-xs font-black text-[#FFE600] uppercase font-mono tracking-widest">
                {activeSession.trackId}
              </span>
              <span className="mx-2 text-slate-700 font-mono">|</span>
              <span className="text-xs font-black text-slate-300 uppercase font-mono tracking-widest">
                {activeSession.level}
              </span>
            </div>
          </div>

          {/* Secure Countdown Timer */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-none border-2 font-mono text-sm font-black transition-all ${
              isTimeUrgent
                ? 'bg-[#FF0055]/10 text-[#FF0055] border-[#FF0055] animate-pulse'
                : 'bg-[#050505] text-white border-[#222222]'
            }`}
            id="quiz-countdown-clock"
          >
            <Clock className={`w-4 h-4 ${isTimeUrgent ? 'text-[#FF0055]' : 'text-slate-400'}`} />
            <span>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Security / Cheating Warnings Bar */}
        {warnings > 0 && (
          <div className="p-3 bg-[#FF0055]/10 border-2 border-[#FF0055] rounded-none flex items-center justify-between text-xs text-[#FF0055] font-mono uppercase tracking-wider animate-bounce" id="cheating-warning-bar">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#FF0055]" />
              <span>
                <strong>Warning:</strong> Tab focus loss detected {warnings} time(s). Keep focus on the quiz screen to avoid scoring discrepancies.
              </span>
            </div>
          </div>
        )}

        {/* Looping Reaction Urgency Alarm */}
        {isTimeUrgent && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-4 bg-[#FF0055]/10 border-2 border-[#FF0055] rounded-none flex gap-4 items-center"
            id="time-urgent-alarm"
          >
            <div className="w-16 h-16 rounded-none overflow-hidden flex-shrink-0 border border-[#FF0055]/40">
              <GIFReaction type="time_warning" className="w-full h-full border-0 rounded-none shadow-none" />
            </div>
            <div>
              <p className="font-black text-xs text-[#FF0055] uppercase tracking-widest font-mono">System Warning</p>
              <p className="text-xs text-slate-300 mt-0.5 font-mono uppercase tracking-wide">
                Session timer is winding down! Unsubmitted responses will auto-compile when time expires.
              </p>
            </div>
          </motion.div>
        )}

        {/* Quiz Progress Stepper */}
        <div className="flex items-center gap-1.5" id="quiz-stepper">
          {Array.from({ length: totalQuestions }).map((_, idx) => {
            const isCompleted = (selectedAnswers[activeSession.questionIds[idx]] || []).length > 0;
            const isActive = idx === currentQuestionIdx;

            return (
              <button
                key={idx}
                onClick={() => useQuizStore.setState({ currentQuestionIdx: idx })}
                className={`h-3 flex-1 border transition-all cursor-pointer rounded-none ${
                  isActive
                    ? 'bg-[#00F0FF] border-white'
                    : isCompleted
                    ? 'bg-[#FFE600] border-[#111111]'
                    : 'bg-[#111111] border-[#222222]'
                }`}
                aria-label={`Go to question ${idx + 1}`}
                id={`stepper-dot-${idx}`}
              />
            );
          })}
        </div>

        {/* Question Panel Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIdx}
            initial={{ x: 15, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -15, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-[#111111] border-2 border-[#222222] p-6 sm:p-8 rounded-none shadow-md relative overflow-hidden"
            id={`question-panel-${currentQuestionIdx}`}
          >
            {/* Header info */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="px-2.5 py-1 bg-[#FFE600] text-black text-[10px] font-black font-mono uppercase tracking-widest">
                Question {currentQuestionIdx + 1} of {totalQuestions}
              </span>
              <span className="text-[10px] font-black font-mono text-slate-500 uppercase tracking-widest">
                Difficulty: {Array.from({ length: currentQuestion.difficulty }).map(() => '★').join('')}
              </span>
            </div>

            {/* Prompt */}
            <h3 className="text-lg font-black text-white mb-6 leading-relaxed break-words whitespace-pre-wrap uppercase tracking-wide">
              {currentQuestion.prompt}
            </h3>

            {/* Answer inputs based on type */}
            <div className="space-y-3" id="options-box">
              {currentQuestion.type === 'fill-blank' ? (
                // Fill in the blank input
                <div className="pt-2" id="fill-blank-input-wrapper">
                  <input
                    type="text"
                    placeholder="Type your exact response..."
                    value={typedFillBlank}
                    onChange={(e) => handleFillBlankChange(e.target.value)}
                    className="w-full h-12 px-4 bg-[#050505] border-2 border-[#222222] focus:border-[#FFE600] outline-hidden text-sm font-mono tracking-wide text-white rounded-none"
                    id={`fill-blank-input-${currentQuestion._id}`}
                  />
                  <p className="text-[10px] text-slate-500 font-mono mt-2 uppercase tracking-widest">
                    Enter single or multiple words precisely. Case-insensitive.
                  </p>
                </div>
              ) : currentQuestion.options ? (
                // MCQ or Multi-select list
                currentQuestion.options.map((option, idx) => {
                  const isSelected = currentSelection.includes(option.id);
                  const alphabet = ['A', 'B', 'C', 'D'];

                  return (
                    <button
                      key={option.id}
                      onClick={() => selectAnswer(currentQuestion._id, option.id, currentQuestion.type === 'multi')}
                      className={`w-full text-left p-4 rounded-none border-2 transition-all flex items-center gap-4 cursor-pointer relative group ${
                        isSelected
                          ? 'bg-[#00F0FF]/10 border-[#00F0FF] text-white font-bold'
                          : 'bg-[#050505] hover:bg-[#111111]/50 border-[#222222] hover:border-[#FFE600] text-slate-300'
                      }`}
                      id={`option-${option.id}`}
                    >
                      {/* Keyboard Shortcut Indicator */}
                      <span className="text-[10px] uppercase font-bold font-mono px-2 py-1 rounded-none bg-[#111111] border border-[#222222] text-[#FFE600] group-hover:scale-105 transition-transform">
                        {alphabet[idx] || option.id}
                      </span>

                      <span className="text-sm font-bold flex-1 leading-relaxed uppercase tracking-wide">{option.text}</span>

                      {/* Select check box / radio icon */}
                      <div className="flex-shrink-0">
                        {currentQuestion.type === 'multi' ? (
                          isSelected ? (
                            <CheckSquare className="w-5 h-5 text-[#00F0FF]" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-700" />
                          )
                        ) : isSelected ? (
                          <div className="w-5 h-5 rounded-none border-4 border-[#00F0FF] bg-black"></div>
                        ) : (
                          <div className="w-5 h-5 rounded-none border-2 border-slate-700"></div>
                        )}
                      </div>
                    </button>
                  );
                })
              ) : null}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation / Submit bar */}
        <div className="flex justify-between items-center bg-[#111111] border-2 border-[#222222] p-4 rounded-none shadow-xs" id="quiz-navigation-bar">
          <button
            onClick={prevQuestion}
            disabled={currentQuestionIdx === 0}
            className="flex items-center gap-1 px-4 py-2.5 text-xs font-black uppercase tracking-wider rounded-none bg-[#050505] border-2 border-[#222222] text-slate-400 hover:text-white hover:border-white cursor-pointer disabled:opacity-40"
            id="prev-question-btn"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>

          <span className="text-xs font-mono text-slate-500 font-black tracking-widest uppercase">
            {currentQuestionIdx + 1} of {totalQuestions}
          </span>

          {currentQuestionIdx < totalQuestions - 1 ? (
            <button
              onClick={nextQuestion}
              className="flex items-center gap-1 px-4 py-2.5 text-xs font-black uppercase tracking-wider rounded-none bg-[#00F0FF] text-black border-2 border-black hover:bg-white hover:border-white cursor-pointer"
              id="next-question-btn"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => handleSubmit()}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-none bg-[#FFE600] text-black border-2 border-black hover:bg-white hover:border-white transition-all cursor-pointer disabled:opacity-50"
              id="submit-quiz-btn"
            >
              {isSubmitting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>{isSubmitting ? 'Evaluating...' : 'Compile Session'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Focus / Switch tab Alert Popup */}
      {showWarningAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs" id="cheating-modal">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm bg-[#111111] border-2 border-[#FF0055] rounded-none p-6 shadow-2xl relative text-center"
          >
            <div className="w-12 h-12 bg-[#FF0055]/10 text-[#FF0055] flex items-center justify-center mx-auto mb-4 border border-[#FF0055]">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <h4 className="text-lg font-black uppercase tracking-wider text-white">
              Focus Loss Flagged
            </h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed font-mono uppercase tracking-wide">
              Our automated proctor flagged a screen/tab switch event on your client. QuizVerse quizzes require full, unbroken focus to maintain high score leaderboard integrity.
            </p>

            <button
              onClick={() => setShowWarningAlert(false)}
              className="w-full h-11 bg-[#FF0055] hover:bg-white text-white hover:text-black font-black uppercase tracking-wider rounded-none text-xs mt-6 transition-colors cursor-pointer border-2 border-black"
              id="dismiss-cheat-alert-btn"
            >
              Resume Challenge
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
