
import React from 'react';
import { UserProfile, PointRecord } from '../types';
import { ChevronLeft, Trophy, Coins, History, ArrowUpRight, LogOut, Edit2, MapPin, School, GraduationCap, ChevronRight, ChevronDown, BookX, Gift, Receipt } from 'lucide-react';
import ProfileSetup from './ProfileSetup';
import { REGIONS } from '../data/regions';

interface ProfileProps {
  user: UserProfile;
  onLogout: () => void;
  onUpdate?: () => void;
  onViewHistory?: () => void;
  onViewErrorBook?: () => void;
  onViewRewards?: () => void;
  onViewRedemptionHistory?: () => void;
}

// Simple nav button for 兑换记录 — navigates to full page
const RedemptionSection: React.FC<{ records: PointRecord[]; onNavigate?: () => void }> = ({ records, onNavigate }) => {
  const count = records.filter(r => String(r.reason).startsWith('兑换商品')).length;
  return (
    <button
      onClick={onNavigate}
      className="w-full flex items-center justify-between glass p-3 rounded-xl hover:bg-white/8 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="bg-purple-500/10 p-2 rounded-lg"><Receipt size={16} className="text-purple-400" /></div>
        <span className="font-semibold text-white/70 text-sm">兑换记录</span>
        {count > 0 && (
          <span className="text-[10px] bg-white/8 px-1.5 py-0.5 rounded-full text-white/30">{count}</span>
        )}
      </div>
      <ChevronRight size={16} className="text-white/20" />
    </button>
  );
};

// Collapsible point records section (earned points only, excludes redemptions)
const HistorySection: React.FC<{ records: PointRecord[] }> = ({ records }) => {
  const [expanded, setExpanded] = React.useState(false);
  // Only show earned/positive records here; redemptions go to RedemptionSection
  const earned = [...records].filter(r => !String(r.reason).startsWith('兑换商品')).reverse();
  const visible = expanded ? earned : earned.slice(0, 3);

  return (
    <section>
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between mb-3 group"
      >
        <h4 className="text-sm font-bold text-white/60 flex items-center gap-2">
          <History size={14} className="text-blue-400" /> 历史战绩
          {earned.length > 0 && (
            <span className="text-[10px] bg-white/8 px-1.5 py-0.5 rounded-full text-white/30">{earned.length}</span>
          )}
        </h4>
        {earned.length > 3 && (
          <div className="flex items-center gap-1 text-[10px] text-white/25 group-hover:text-white/40 transition-colors">
            {expanded ? '收起' : '查看全部'}
            <ChevronDown size={12} className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
          </div>
        )}
      </button>
      <div className="space-y-2">
        {earned.length === 0 ? (
          <div className="text-center py-8 text-white/15 glass rounded-xl border border-dashed border-white/10">
            <p className="font-medium text-sm">还没有积分记录</p>
          </div>
        ) : (
          <>
            {visible.map((record, idx) => (
              <div key={idx} className="glass p-3 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${record.amount < 0 ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
                    <ArrowUpRight className={`w-4 h-4 ${record.amount < 0 ? 'text-red-400 rotate-180' : 'text-amber-400'}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-white/80 text-sm">{record.reason}</p>
                    <p className="text-[10px] text-white/20">{new Date(record.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                <div className={`text-lg font-bold ${record.amount < 0 ? 'text-red-400' : 'text-amber-400'}`}>
                  {record.amount > 0 ? '+' : ''}{record.amount}
                </div>
              </div>
            ))}
            {!expanded && earned.length > 3 && (
              <button
                onClick={() => setExpanded(true)}
                className="w-full py-2 text-[11px] text-white/25 hover:text-white/40 transition-colors"
              >
                还有 {earned.length - 3} 条记录 · 点击展开
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );
};

const Profile: React.FC<ProfileProps> = ({ user, onLogout, onUpdate, onViewHistory, onViewErrorBook, onViewRewards, onViewRedemptionHistory }) => {

  const [isEditing, setIsEditing] = React.useState(false);
  const [key, setKey] = React.useState(0);

  if (isEditing) {
    return (
      <div className="flex flex-col h-full relative">
        <button onClick={() => setIsEditing(false)} className="absolute top-0 left-0 z-10 p-2 glass-light rounded-xl hover:bg-white/10 transition-colors">
          <ChevronLeft size={24} className="text-white/60" />
        </button>
        <ProfileSetup user={user} onComplete={() => { setIsEditing(false); setKey(k => k + 1); if (onUpdate) onUpdate(); }} />
      </div>
    );
  }

  const getRegionName = (id?: string) => {
    if (!id) return '';
    const p = REGIONS.find(r => r.id === id);
    if (p) return p.name;
    for (const prov of REGIONS) {
      const c = prov.cities.find(city => city.id === id);
      if (c) return c.name;
      for (const city of prov.cities) {
        const d = city.districts.find(dist => dist.id === id);
        if (d) return d.name;
      }
    }
    return id;
  };

  const locationStr = [getRegionName(user.province), getRegionName(user.city), getRegionName(user.district)].filter(Boolean).join(' · ');

  return (
    <div key={key} className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-white">个人中心</h2>
        <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 px-3 py-1.5 glass-light rounded-lg text-white/50 text-sm font-medium hover:bg-white/8 transition-colors">
          <Edit2 size={14} /> 编辑
        </button>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="overflow-y-auto scrollbar-hide space-y-5 pb-20">
          {/* User Card */}
          <div className="bg-gradient-to-br from-blue-600/30 to-purple-600/20 rounded-2xl p-5 border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />

            <div className="flex items-center gap-4 mb-5 relative z-10">
              <img src={user.avatar} className="w-16 h-16 rounded-2xl border-2 border-white/10 object-cover" alt="" />
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{user.name}</h3>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 text-white/30 text-xs font-medium">
                    <MapPin size={11} /> <span>{locationStr || '未设置地区'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/30 text-xs font-medium">
                    <School size={11} /> <span>{user.schoolName || '未设置学校'}</span>
                  </div>
                  {user.grade && (
                    <div className="flex items-center gap-1.5 text-white/30 text-xs font-medium">
                      <GraduationCap size={11} /> <span>{user.grade > 9 ? `高${user.grade - 9}` : user.grade > 6 ? `初${user.grade - 6}` : `${user.grade}年级`}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 relative z-10">
              <div className="bg-white/8 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Trophy size={13} className="text-amber-400" />
                  <span className="text-[10px] font-medium text-white/30 uppercase">最高分</span>
                </div>
                <p className="text-2xl font-bold text-white">{user.highScore}</p>
              </div>
              <div className="bg-white/8 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Coins size={13} className="text-amber-400" />
                  <span className="text-[10px] font-medium text-white/30 uppercase">总积分</span>
                </div>
                <p className="text-2xl font-bold text-white">{user.totalPoints}</p>
              </div>
            </div>
          </div>

          {/* Point Records - Collapsible */}
          <HistorySection records={user.pointRecords} />

          {/* Quick Actions */}
          <div className="space-y-2">
            {onViewRewards && (
              <button onClick={onViewRewards} className="w-full flex items-center justify-between glass p-3 rounded-xl hover:bg-white/8 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-500/10 p-2 rounded-lg"><Gift size={16} className="text-amber-400" /></div>
                  <span className="font-semibold text-white/70 text-sm">福利社</span>
                </div>
                <ChevronRight size={16} className="text-white/20" />
              </button>
            )}
            {/* 兑换记录 - navigates to full page */}
            <RedemptionSection records={user.pointRecords} onNavigate={onViewRedemptionHistory} />
            {onViewHistory && (
              <button onClick={onViewHistory} className="w-full flex items-center justify-between glass p-3 rounded-xl hover:bg-white/8 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500/10 p-2 rounded-lg"><History size={16} className="text-blue-400" /></div>
                  <span className="font-semibold text-white/70 text-sm">答题历史</span>
                </div>
                <ChevronRight size={16} className="text-white/20" />
              </button>
            )}
            {onViewErrorBook && (
              <button onClick={onViewErrorBook} className="w-full flex items-center justify-between glass p-3 rounded-xl hover:bg-white/8 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="bg-red-500/10 p-2 rounded-lg"><BookX size={16} className="text-red-400" /></div>
                  <span className="font-semibold text-white/70 text-sm">我的错题本</span>
                </div>
                <ChevronRight size={16} className="text-white/20" />
              </button>
            )}
          </div>

          {/* Logout */}
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 glass border border-red-500/10 text-red-400/60 py-3 rounded-xl font-medium text-sm hover:bg-red-500/5 transition-all">
            <LogOut size={16} /> 退出登录
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
