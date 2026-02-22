
import React, { useState, useEffect, useCallback } from 'react';
import { Question, Attempt, UserProfile } from '../types';
import { TIME_LIMIT } from '../constants';
import { Timer, Zap, X, AlertCircle, Volume2, Loader2, Lightbulb } from 'lucide-react';
import { speakWord } from '../services/ttsService';
import { dbService } from '../services/dbService';
import { getPhonetic, prefetchPhonetics } from '../services/phoneticsService';

interface QuizProps {
  questions: Question[];
  onComplete: (correctCount: number, timeSpent: number, attempts: Attempt[]) => void;
  onCancel: () => void;
  userPoints?: number;
  onDeductPoints?: (amount: number, reason: string) => void;
}

const HINT_COSTS = [10, 20, 30]; // Cost for 1st, 2nd, 3rd hint

const Quiz: React.FC<QuizProps> = ({ questions, onComplete, onCancel, userPoints = 0, onDeductPoints }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [showExitModal, setShowExitModal] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [phonetic, setPhonetic] = useState('');

  // Hint system
  const [hintsUsedThisQuiz, setHintsUsedThisQuiz] = useState(0); // 0-3 total hints used across entire quiz
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]); // Eliminated options for current question

  // Prefetch phonetics for all quiz words on mount
  useEffect(() => {
    prefetchPhonetics(questions.map(q => q.word.english));
  }, [questions]);

  const totalQuestions = questions.length;

  const finishQuiz = useCallback((finalAttempts: Attempt[], finalCorrectCount: number) => {
    onComplete(finalCorrectCount, TIME_LIMIT - timeLeft, finalAttempts);
  }, [timeLeft, onComplete]);

  useEffect(() => {
    if (timeLeft <= 0) { finishQuiz(attempts, correctCount); return; }
    if (showExitModal) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, attempts, correctCount, finishQuiz, showExitModal]);

  useEffect(() => {
    if (questions[currentIndex]) {
      handleSpeak(questions[currentIndex].word.english);
      // Fetch phonetic for current word
      setPhonetic('');
      getPhonetic(questions[currentIndex].word.english).then(p => setPhonetic(p));
      // Reset eliminated options for new question
      setEliminatedOptions([]);
    }
  }, [currentIndex, questions]);

  const handleSpeak = async (word: string) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    await speakWord(word);
    setIsSpeaking(false);
  };

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  useEffect(() => {
    const loadUser = async () => {
      const user = await dbService.loginOrRegister(localStorage.getItem('wordChallenge_currentUser') || '');
      setCurrentUser(user);
    };
    loadUser();
  }, []);

  const handleAnswer = async (answer: string) => {
    if (currentIndex >= totalQuestions) return;
    const isCorrect = answer === questions[currentIndex].correctAnswer;
    if (!isCorrect && currentUser && currentUser.id) {
      await dbService.saveWrongQuestion(currentUser.id, questions[currentIndex], answer);
    }
    const newAttempt: Attempt = { english: questions[currentIndex].word.english, chinese: questions[currentIndex].word.chinese, userAnswer: answer, isCorrect };
    const nextAttempts = [...attempts, newAttempt];
    const nextCorrectCount = isCorrect ? correctCount + 1 : correctCount;
    if (!isCorrect && 'vibrate' in navigator) navigator.vibrate(200);
    if (currentIndex < totalQuestions - 1) {
      setAttempts(nextAttempts); setCorrectCount(nextCorrectCount); setCurrentIndex(prev => prev + 1);
    } else { finishQuiz(nextAttempts, nextCorrectCount); }
  };

  // Hint handler: eliminate one wrong option
  const handleHint = () => {
    if (hintsUsedThisQuiz >= 3) return;
    const cost = HINT_COSTS[hintsUsedThisQuiz];
    if (userPoints < cost) {
      alert(`积分不足！使用提示需要 ${cost} 积分，当前积分 ${userPoints}`);
      return;
    }
    // Find a wrong option that hasn't been eliminated yet
    const currentQ = questions[currentIndex];
    const wrongOptions = currentQ.options.filter(
      o => o !== currentQ.correctAnswer && !eliminatedOptions.includes(o)
    );
    if (wrongOptions.length === 0) return;

    const toEliminate = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
    setEliminatedOptions(prev => [...prev, toEliminate]);
    setHintsUsedThisQuiz(prev => prev + 1);
    onDeductPoints?.(cost, `答题提示 (第${hintsUsedThisQuiz + 1}次)`);
  };

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) {
    return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-400 border-t-transparent" /></div>;
  }

  const progress = ((currentIndex + 1) / totalQuestions) * 100;
  const isUrgent = timeLeft < 30;
  const canHint = hintsUsedThisQuiz < 3;
  const nextHintCost = canHint ? HINT_COSTS[hintsUsedThisQuiz] : 0;
  const canAffordHint = canHint && userPoints >= nextHintCost;
  // Check if there are still wrong options to eliminate for current question
  const wrongOptionsLeft = currentQuestion.options.filter(
    o => o !== currentQuestion.correctAnswer && !eliminatedOptions.includes(o)
  ).length;
  const hintAvailable = canHint && wrongOptionsLeft > 0;

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center justify-between">
          <button onClick={() => setShowExitModal(true)} className="p-2 rounded-xl glass-light text-white/40 hover:text-white/70 hover:bg-white/10 transition-all">
            <X size={20} strokeWidth={2} />
          </button>
          <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-semibold ${isUrgent ? 'bg-red-500/20 text-red-400' : 'glass-light text-white/70'}`}>
            <Timer size={16} className={isUrgent ? 'animate-pulse-soft' : ''} />
            <span className="tabular-nums">{timeLeft}s</span>
          </div>
          <div className="flex items-center gap-1.5 glass-light px-3.5 py-1.5 rounded-xl text-sm font-semibold text-amber-400">
            <Zap size={16} fill="currentColor" />
            <span className="tabular-nums">{currentIndex + 1}/{totalQuestions}</span>
          </div>
        </div>

        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 rounded-full" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question Card */}
      <div className="flex-1 flex flex-col items-center justify-center mb-4">
        <div className="glass-light w-full rounded-2xl p-6 text-center relative overflow-hidden">
          <p className="text-white/25 mb-1 font-medium tracking-wider text-xs uppercase">请听音并选择正确含义</p>
          <h2 className="text-3xl font-bold text-white min-h-[1.5em] flex items-center justify-center">
            {currentQuestion.word.english}
          </h2>
          {phonetic && (
            <p className="text-sm text-white/25 font-normal mb-4 tracking-wide">{phonetic}</p>
          )}
          {!phonetic && <div className="mb-4" />}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => handleSpeak(currentQuestion.word.english)}
              disabled={isSpeaking}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${isSpeaking ? 'bg-white/5 text-white/20' : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/20'}`}
            >
              {isSpeaking ? <Loader2 className="animate-spin" size={16} /> : <Volume2 size={16} />}
              朗读单词
            </button>
            {/* Hint Button */}
            <button
              onClick={handleHint}
              disabled={!hintAvailable}
              title={!canHint ? '提示次数已用完' : !canAffordHint ? `需要${nextHintCost}积分` : `使用提示 (-${nextHintCost}积分)`}
              className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${!hintAvailable
                  ? 'bg-white/5 text-white/15 cursor-not-allowed'
                  : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/20'
                }`}
            >
              <Lightbulb size={14} />
              <span className="text-xs">{canHint ? `-${nextHintCost}` : `${hintsUsedThisQuiz}/3`}</span>
            </button>
          </div>
          {/* Hint usage indicator */}
          {hintsUsedThisQuiz > 0 && (
            <div className="flex items-center justify-center gap-1.5 mt-3">
              {[0, 1, 2].map(i => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < hintsUsedThisQuiz ? 'bg-amber-400' : 'bg-white/10'}`} />
              ))}
              <span className="text-[10px] text-white/15 ml-1">提示 {hintsUsedThisQuiz}/3</span>
            </div>
          )}
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-2.5 mb-4">
        {currentQuestion.options.map((option, idx) => {
          const isEliminated = eliminatedOptions.includes(option);
          return (
            <button
              key={idx}
              onClick={() => !isEliminated && handleAnswer(option)}
              disabled={isEliminated}
              className={`w-full py-3.5 rounded-xl text-base font-semibold transition-all text-center px-4 ${isEliminated
                  ? 'glass-light opacity-20 line-through cursor-not-allowed text-white/20'
                  : 'glass-light hover:bg-white/12 hover:border-blue-400/30 text-white/80 active:scale-[0.98]'
                }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* Exit Modal */}
      {showExitModal && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 rounded-3xl">
          <div className="glass-light rounded-2xl p-6 text-center w-full max-w-xs border border-white/10">
            <div className="bg-red-500/15 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} className="text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">确定要退出吗？</h3>
            <p className="text-sm text-white/40 leading-relaxed mb-6">
              现在退出将<span className="text-red-400">无法获得积分奖励</span>
            </p>
            <div className="space-y-2.5">
              <button onClick={() => setShowExitModal(false)} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 rounded-xl transition-all hover:scale-[1.02] glow-blue">
                继续挑战
              </button>
              <button onClick={onCancel} className="w-full glass-light text-white/30 font-medium py-2.5 rounded-xl hover:text-white/50 transition-all text-sm">
                退出
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
