
import React, { useEffect, useRef } from 'react';
import { QuizResult } from '../types';
import { Trophy, RefreshCcw, LayoutDashboard, CheckCircle2, XCircle, Award, Sparkles } from 'lucide-react';
import { calculatePoints } from '../services/quizService';
import { playCelebration } from '../services/ttsService';

interface ResultProps {
  result: QuizResult;
  onRestart: () => void;
  onGoHome: () => void;
}

const Result: React.FC<ResultProps> = ({ result, onRestart, onGoHome }) => {
  const isPassed = result.score >= 60;
  const isHighPerformance = result.score >= 90;
  const points = calculatePoints(result.score);
  const accuracy = Math.round((result.correctCount / result.totalQuestions) * 100);
  const hasCelebrated = useRef(false);

  useEffect(() => {
    if (isHighPerformance && !hasCelebrated.current) { playCelebration(); hasCelebrated.current = true; }
  }, [isHighPerformance]);

  const scoreColor = accuracy === 100 ? 'text-emerald-400' : isHighPerformance ? 'text-amber-400' : isPassed ? 'text-blue-400' : 'text-white/30';

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-6 scrollbar-hide">
      {/* Score Header */}
      <div className="text-center mb-6 pt-4 relative">
        {isHighPerformance && (
          <Sparkles className="absolute top-2 left-1/2 -translate-x-1/2 text-amber-400/20 w-32 h-32 animate-pulse-soft" />
        )}
        <div className="relative inline-block mb-3">
          <div className={`w-28 h-28 rounded-full flex items-center justify-center border-2 transition-all ${accuracy === 100 ? 'border-emerald-400/40 bg-emerald-400/5' :
              isHighPerformance ? 'border-amber-400/40 bg-amber-400/5' :
                isPassed ? 'border-blue-400/40 bg-blue-400/5' : 'border-white/10 bg-white/5'
            }`}>
            <span className={`text-5xl font-bold ${scoreColor}`}>{result.score}</span>
          </div>
          {isPassed && (
            <div className={`absolute -top-1 -right-1 p-1.5 rounded-full ${isHighPerformance ? 'bg-amber-500' : 'bg-blue-500'}`}>
              <Trophy size={14} fill="white" className="text-white" />
            </div>
          )}
        </div>

        <h2 className={`text-2xl font-bold mb-1 ${isHighPerformance ? 'gradient-text-gold' : 'text-white'}`}>
          {accuracy === 100 ? '满分神话！' : isHighPerformance ? '优秀！你是单词达人' : isPassed ? '挑战成功' : '再接再厉'}
        </h2>
        <div className="flex items-center justify-center gap-3 text-white/30 text-sm font-medium">
          <span>用时 {result.timeSpent}s</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span className={accuracy === 100 ? 'text-emerald-400' : ''}>正确率 {accuracy}%</span>
        </div>
      </div>

      {/* Rewards */}
      <div className={`rounded-2xl p-5 mb-6 text-center border ${accuracy === 100 ? 'bg-emerald-500/10 border-emerald-500/20' :
          isHighPerformance ? 'bg-amber-500/10 border-amber-500/20' :
            isPassed ? 'bg-blue-500/10 border-blue-500/20' : 'bg-white/5 border-white/5'
        }`}>
        {isPassed ? (
          <div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <Award size={16} className={isHighPerformance ? 'text-amber-400' : 'text-blue-400'} />
              <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">成就奖励</p>
            </div>
            <p className={`text-3xl font-bold ${isHighPerformance ? 'gradient-text-gold' : 'text-blue-400'}`}>+{points} 积分</p>
            <div className="mt-2 text-[10px] text-white/20 font-medium flex flex-wrap justify-center gap-2">
              <span className={result.score >= 60 && result.score < 70 ? 'text-amber-400' : ''}>60+:5</span>
              <span className={result.score >= 70 && result.score < 80 ? 'text-amber-400' : ''}>70+:10</span>
              <span className={result.score >= 80 && result.score < 90 ? 'text-amber-400' : ''}>80+:20</span>
              <span className={result.score >= 90 ? 'text-amber-400 font-bold' : ''}>90+:50</span>
            </div>
          </div>
        ) : (
          <p className="text-white/30 font-medium text-sm">差一点就拿奖了！满60分即有积分奖励</p>
        )}
      </div>

      {/* Detail Breakdown */}
      <div className="mb-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
          <LayoutDashboard size={16} className="text-blue-400" />
          答题详情 ({result.correctCount}/{result.totalQuestions})
        </h3>
        <div className="space-y-2">
          {result.attempts.map((item, idx) => (
            <div key={idx} className={`p-3 rounded-xl flex items-center justify-between border ${item.isCorrect ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-red-500/5 border-red-500/10'}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium text-white/20">#{idx + 1}</span>
                  <p className="font-semibold text-white text-sm">{item.english}</p>
                </div>
                <p className="text-xs text-white/30">正确: <span className="text-emerald-400">{item.chinese}</span></p>
              </div>
              <div className="flex flex-col items-end gap-0.5 ml-2">
                {item.isCorrect ? (
                  <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold"><CheckCircle2 size={14} /> 正确</div>
                ) : (
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 text-red-400 text-xs font-semibold"><XCircle size={14} /> 选错</div>
                    <span className="text-[10px] text-red-400/60">你选: {item.userAnswer}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="sticky bottom-0 pt-3 grid grid-cols-2 gap-3 mt-auto" style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.95) 60%, transparent)' }}>
        <button onClick={onRestart} className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3.5 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-95 glow-blue text-sm">
          <RefreshCcw size={16} /> 再战一轮
        </button>
        <button onClick={onGoHome} className="flex items-center justify-center gap-2 glass-light text-white/60 py-3.5 rounded-xl font-semibold transition-all hover:bg-white/8 text-sm">
          <LayoutDashboard size={16} /> 返回主页
        </button>
      </div>
    </div>
  );
};

export default Result;
