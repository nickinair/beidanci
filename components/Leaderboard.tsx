
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { Trophy, Crown, Medal, Map, Building } from 'lucide-react';
import { dbService } from '../services/dbService';

interface LeaderboardProps {
  users: UserProfile[];
  currentUserName: string;
}

type Scope = 'school' | 'city' | 'province' | 'global';

const Leaderboard: React.FC<LeaderboardProps> = ({ users: initialUsers, currentUserName }) => {
  const [scope, setScope] = useState<Scope>('school');
  const [displayUsers, setDisplayUsers] = useState<UserProfile[]>(initialUsers);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | undefined>(initialUsers.find(u => u.name === currentUserName));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const all = await dbService.fetchAllUsers();
        const me = all.find(u => u.name === currentUserName);
        setCurrentUser(me);
        if (me) {
          const ranked = await dbService.fetchRankings(scope, me);
          setDisplayUsers(ranked);
        } else {
          setDisplayUsers([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [scope, currentUserName]);

  const myRank = displayUsers.findIndex(u => u.name === currentUserName) + 1;
  const myScore = currentUser?.totalPoints || 0;

  const getRankDisplay = (index: number) => {
    switch (index) {
      case 0: return <Crown className="text-amber-400 w-6 h-6" fill="currentColor" />;
      case 1: return <Medal className="text-gray-300 w-5 h-5" fill="currentColor" />;
      case 2: return <Medal className="text-orange-400 w-5 h-5" fill="currentColor" />;
      default: return <span className="text-sm font-semibold text-white/20 w-6 text-center">{index + 1}</span>;
    }
  };

  const tabs: { id: Scope; label: string; icon: any }[] = [
    { id: 'school', label: '同校', icon: Building },
    { id: 'city', label: '全市', icon: Map },
    { id: 'province', label: '全省', icon: Map },
    { id: 'global', label: '总榜', icon: Trophy },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white mb-3">排行榜</h2>
        <div className="flex p-1 glass-light rounded-xl gap-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = scope === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setScope(tab.id)}
                className={`flex-1 flex flex-col items-center py-2 rounded-lg text-[10px] font-semibold transition-all ${isActive ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/50'}`}
              >
                <Icon size={14} className="mb-0.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-2 pb-28 scrollbar-hide">
        {loading ? (
          <div className="text-center py-10 text-white/20 font-medium">加载中...</div>
        ) : displayUsers.length === 0 ? (
          <div className="text-center py-10 text-white/20 font-medium">暂无数据，快来占领榜首！</div>
        ) : (
          displayUsers.map((user, index) => {
            const isMe = user.name === currentUserName;
            return (
              <div key={user.name} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isMe ? 'glass-light border border-blue-400/20' : 'glass'}`}>
                <div className="w-6 flex justify-center">{getRankDisplay(index)}</div>
                <img src={user.avatar} className="w-9 h-9 rounded-full border border-white/10" alt={user.name} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold truncate ${isMe ? 'text-blue-400' : 'text-white/80'}`}>{user.name}</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-white/5 text-white/20 rounded truncate max-w-[60px]">
                      {user.schoolName || '未设置'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-sm font-bold text-amber-400">{user.totalPoints}</span>
                  <span className="text-[9px] text-white/20">积分</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* My Rank Footer */}
      {currentUser && (
        <div className="fixed bottom-20 left-0 right-0 z-40">
          <div className="max-w-md mx-auto px-5">
            <div className="glass rounded-xl p-3 border border-white/10 shadow-lg shadow-black/20">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${myRank > 0 ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-white/20'}`}>
                  {myRank > 0 ? myRank : '-'}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-sm font-semibold text-white/70">我的排名</span>
                    <span className="text-sm font-bold text-amber-400">{myScore} 分</span>
                  </div>
                  {myRank > 1 && (
                    <div className="text-[10px] text-blue-400/70">距上一名差 {displayUsers[myRank - 2].totalPoints - myScore} 分</div>
                  )}
                  {myRank === 1 && <div className="text-[10px] text-amber-400/70">👑 当前榜首！</div>}
                  {myRank === 0 && <div className="text-[10px] text-white/20">暂未上榜</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
