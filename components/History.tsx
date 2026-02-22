
import React from 'react';
import { QuizResult } from '../types';
import { ChevronLeft, Calendar, Clock, Award } from 'lucide-react';

interface HistoryProps {
  history: QuizResult[];
  onBack: () => void;
}

const History: React.FC<HistoryProps> = ({ history, onBack }) => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 sticky top-0 z-10 -mx-5 -mt-5 px-5 pt-5 pb-3" style={{ background: 'linear-gradient(to bottom, rgba(15,23,42,0.95) 60%, transparent)' }}>
        <button onClick={onBack} className="p-2 glass-light rounded-xl hover:bg-white/10 transition-colors">
          <ChevronLeft size={20} className="text-white/60" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock size={18} className="text-blue-400" /> 答题历史
          </h2>
          <p className="text-[10px] text-white/25">共 {history.length} 条记录</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2.5 pb-10 scrollbar-hide">
        {history.length === 0 ? (
          <div className="text-center py-20 text-white/15">
            <Award size={48} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium text-sm">还没有战绩，快去挑战吧！</p>
          </div>
        ) : (
          history.slice().reverse().map((record, idx) => (
            <div key={idx} className="glass p-3.5 rounded-xl">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-1.5 text-white/25 text-xs">
                  <Calendar size={12} />
                  {new Date(record.timestamp).toLocaleDateString()}
                </div>
                <div className="bg-amber-500/15 text-amber-400 px-2.5 py-0.5 rounded-lg text-[10px] font-semibold">
                  +{record.pointsEarned} 积分
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold text-white">
                  {record.score}<span className="text-xs font-normal text-white/20 ml-0.5">分</span>
                </div>
                <div className="flex items-center gap-3 text-white/30 text-xs font-medium">
                  <span className="flex items-center gap-1"><Clock size={12} /> {record.timeSpent}s</span>
                  <span className="text-emerald-400/70">正确: {record.correctCount}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
