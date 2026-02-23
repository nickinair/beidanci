
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Trophy, Play, History, Info, ChevronLeft, Briefcase, Sparkles, CalendarCheck, Lock, Gift, ChevronRight } from 'lucide-react';

interface HomeProps {
  user: UserProfile;
  onStart: (level: 'primary' | 'junior' | 'senior' | 'university', grade?: number) => void;
  onViewRewards: () => void;
  onViewRules: () => void;
  onViewErrorBook: () => void;
  onCheckIn: () => void;
  onViewProfile?: () => void;
}

type LevelType = 'primary' | 'junior' | 'senior' | 'university' | null;

const Home: React.FC<HomeProps> = ({ user, onStart, onViewRewards, onViewRules, onViewErrorBook, onCheckIn, onViewProfile }) => {
  const [selectedLevel, setSelectedLevel] = useState<LevelType>(null);

  // Check-in state
  const today = new Date().toISOString().slice(0, 10);
  const hasCheckedInToday = user.lastCheckIn === today;

  // Grade restriction helpers
  const getUserLevel = (): 'primary' | 'junior' | 'senior' | 'university' | null => {
    if (!user.grade) return null;
    if (user.grade <= 6) return 'primary';
    if (user.grade <= 9) return 'junior';
    if (user.grade <= 12) return 'senior';
    return 'university';
  };

  const getLevelMinGrade = (level: 'primary' | 'junior' | 'senior' | 'university'): number => {
    switch (level) {
      case 'primary': return 1;
      case 'junior': return 7;
      case 'senior': return 10;
      case 'university': return 13;
    }
  };

  const isLevelLocked = (level: 'primary' | 'junior' | 'senior' | 'university'): boolean => {
    const userLevel = getUserLevel();
    if (!userLevel || !user.grade) return false; // No grade set = no restriction
    const levelOrder = { 'primary': 0, 'junior': 1, 'senior': 2, 'university': 3 };
    return levelOrder[level] < levelOrder[userLevel];
  };

  const isGradeLocked = (grade: number): boolean => {
    if (!user.grade) return false;
    return grade < user.grade;
  };

  const getGrades = (level: LevelType) => {
    switch (level) {
      case 'primary': return [1, 2, 3, 4, 5, 6];
      case 'junior': return [7, 8, 9];
      case 'senior': return [10, 11, 12];
      default: return [];
    }
  };

  const getLevelName = (level: LevelType) => {
    switch (level) {
      case 'primary': return '小学';
      case 'junior': return '初中';
      case 'senior': return '高中';
      case 'university': return '大学';
      default: return '';
    }
  };

  const getGradeName = (grade: number) => {
    if (grade <= 6) return `${grade}年级`;
    if (grade <= 9) return `初${grade - 6}`;
    if (grade <= 12) return `高${grade - 9}`;
    return `大${grade - 12}`;
  };

  const getLockedText = () => {
    if (!user.grade) return '';
    return `你当前是${getGradeName(user.grade)}，不能挑战更低年级`;
  };

  const levelConfig = [
    { id: 'primary' as const, label: '小学组', gradient: 'from-blue-500 to-cyan-500', glow: 'glow-blue' },
    { id: 'junior' as const, label: '初中组', gradient: 'from-amber-500 to-orange-500', glow: '' },
    { id: 'senior' as const, label: '高中组', gradient: 'from-purple-500 to-pink-500', glow: 'glow-purple' },
    { id: 'university' as const, label: '大学组', gradient: 'from-rose-500 to-red-600', glow: '' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* User Info Bar - clickable to go to profile */}
      <div className="flex items-center justify-between glass-light rounded-2xl p-3 mb-6 w-full text-left transition-all relative overflow-hidden">
        {/* Profile section (left) */}
        <div
          onClick={onViewProfile}
          className="flex items-center gap-3 flex-1 hover:opacity-80 transition-opacity text-left cursor-pointer"
        >
          <img src={user.avatar} alt="" className="w-10 h-10 rounded-full border-2 border-white/10 object-cover" />
          <div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-1">
              {user.name}
              <ChevronRight size={14} className="text-white/30" />
            </h2>
            <div className="flex items-center gap-2 mt-0.5" onClick={(e) => e.stopPropagation() /* Prevent clicking points from opening profile */}>
              <div className="flex items-center gap-1 text-amber-400 text-xs font-medium">
                <Trophy size={12} fill="currentColor" />
                <span>{user.totalPoints} 积分</span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!hasCheckedInToday) onCheckIn();
                }}
                disabled={hasCheckedInToday}
                className={`flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md border transition-all ${hasCheckedInToday
                  ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 opacity-80'
                  : 'text-amber-400 border-amber-500/50 bg-amber-500/20 active:bg-amber-500/30 active:scale-95'
                  }`}
              >
                <CalendarCheck size={10} />
                {hasCheckedInToday ? '已签到' : '每日签到+20'}
              </button>
            </div>
          </div>
        </div>

        {/* We removed the large check-in banner, saving vertical space */}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
        <div className="mb-1">
          <Sparkles className="text-blue-400/60 mx-auto mb-2" size={24} />
          <h1 className="text-3xl font-bold gradient-text mb-1">单词挑战</h1>
          <p className="text-white/30 text-sm font-medium">挑战自我，赢取丰厚积分奖励</p>
        </div>

        <div className="space-y-3 w-full mt-8">
          {!selectedLevel ? (
            <>
              {user.grade && getUserLevel() && (
                <>
                  <button
                    onClick={() => {
                      const level = getUserLevel();
                      if (level) onStart(level, level === 'university' ? undefined : user.grade);
                    }}
                    className="w-full text-white font-bold py-4 rounded-2xl text-xl transition-all flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:scale-[1.02] active:scale-[0.98] glow-green border border-emerald-400/30"
                  >
                    <Play size={24} fill="currentColor" />
                    立即挑战
                    <span className="text-sm font-medium bg-black/15 px-2 py-0.5 rounded-md ml-1">
                      {getGradeName(user.grade)}
                    </span>
                  </button>

                  <div className="flex items-center gap-4 py-1 opacity-60">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/20"></div>
                    <span className="text-xs font-medium text-white/50">其他级别</span>
                    <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/20"></div>
                  </div>
                </>
              )}
              {levelConfig.map(lc => {
                const locked = isLevelLocked(lc.id);
                return (
                  <button
                    key={lc.id}
                    onClick={() => {
                      if (locked) return;
                      if (lc.id === 'university') {
                        onStart('university');
                      } else {
                        setSelectedLevel(lc.id);
                      }
                    }}
                    disabled={locked}
                    className={`w-full text-white font-semibold py-4 rounded-2xl text-lg transition-all flex items-center justify-center gap-3 ${locked
                      ? 'bg-white/5 opacity-40 cursor-not-allowed'
                      : `bg-gradient-to-r ${lc.gradient} hover:scale-[1.02] active:scale-[0.98] ${lc.glow}`
                      }`}
                  >
                    {locked ? <Lock size={18} /> : <Play size={22} fill="currentColor" />}
                    {lc.label}
                    {locked && <span className="text-xs font-normal ml-1 opacity-60">(锁定)</span>}
                  </button>
                );
              })}
              {user.grade && isLevelLocked('primary') && (
                <p className="text-white/15 text-[10px] text-center mt-1">{getLockedText()}</p>
              )}
            </>
          ) : (
            <div className="w-full">
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setSelectedLevel(null)} className="p-2 rounded-xl glass-light hover:bg-white/10 transition-colors">
                  <ChevronLeft size={20} className="text-white/60" />
                </button>
                <h2 className="text-lg font-semibold text-white">{getLevelName(selectedLevel)} - 选择年级</h2>
                <div className="w-9" />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {getGrades(selectedLevel).map((grade) => {
                  const locked = isGradeLocked(grade);
                  return (
                    <button
                      key={grade}
                      onClick={() => locked ? null : onStart(selectedLevel, grade)}
                      disabled={locked}
                      className={`py-3.5 rounded-xl text-base font-semibold transition-all ${locked
                        ? 'glass-light opacity-30 cursor-not-allowed text-white/30 flex items-center justify-center gap-1'
                        : 'glass-light hover:bg-white/12 text-white active:scale-95'
                        }`}
                    >
                      {locked && <Lock size={12} />}
                      {getGradeName(grade)}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => onStart(selectedLevel)}
                className="mt-3 w-full bg-white/5 hover:bg-white/8 text-white/50 font-medium py-3 rounded-xl text-sm transition-colors border border-white/5"
              >
                全部{getLevelName(selectedLevel)}单词
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button onClick={onViewRewards} className="flex items-center justify-center gap-2 glass-light py-3 rounded-xl text-white/60 text-sm font-medium hover:bg-white/8 transition-colors">
          <Gift size={16} className="text-amber-400" />
          福利社
        </button>
        <button onClick={onViewErrorBook} className="flex items-center justify-center gap-2 glass-light py-3 rounded-xl text-white/60 text-sm font-medium hover:bg-white/8 transition-colors">
          <Briefcase size={16} />
          我的错题本
        </button>
      </div>

      <button onClick={onViewRules} className="mt-3 mb-2 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/20 py-3 rounded-xl text-amber-400 text-sm font-medium hover:from-amber-500/30 hover:to-orange-500/30 transition-all">
        <Info size={16} />
        规则与福利：冲分赢好礼！
      </button>
    </div>
  );
};

export default Home;
