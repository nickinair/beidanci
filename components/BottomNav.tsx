import React from 'react';
import { Home, Trophy, User } from 'lucide-react';

interface BottomNavProps {
    currentTab: 'home' | 'leaderboard' | 'profile';
    onTabChange: (tab: 'home' | 'leaderboard' | 'profile') => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
    const tabs = [
        { id: 'home' as const, label: '挑战', icon: Home },
        { id: 'leaderboard' as const, label: '排行', icon: Trophy },
        { id: 'profile' as const, label: '我的', icon: User },
    ];

    return (
        <div className="w-full" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
            <div className="px-4 pb-1">
                <div className="glass rounded-2xl px-2 py-1 flex justify-between items-center border border-white/10 shadow-lg shadow-black/20">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        const isActive = currentTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 rounded-xl transition-all duration-300 ${isActive
                                    ? 'bg-white/10 text-white'
                                    : 'text-white/40 hover:text-white/60'
                                    }`}
                            >
                                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                                <span className="text-[10px] font-semibold tracking-wide">{tab.label}</span>
                                {isActive && <div className="w-1 h-1 rounded-full bg-blue-400 mt-0.5" />}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default BottomNav;
