
import React from 'react';
import { PointRecord } from '../types';
import { ChevronLeft, Receipt, ShoppingBag, Coins, Clock } from 'lucide-react';

interface RedemptionHistoryProps {
    pointRecords: PointRecord[];
    currentPoints: number;
    onBack: () => void;
}

const RedemptionHistory: React.FC<RedemptionHistoryProps> = ({ pointRecords, currentPoints, onBack }) => {
    const redemptions = [...pointRecords]
        .filter(r => String(r.reason).startsWith('兑换商品'))
        .sort((a, b) => b.timestamp - a.timestamp);

    const totalSpent = redemptions.reduce((sum, r) => sum + Math.abs(r.amount), 0);

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
                <button
                    onClick={onBack}
                    className="p-2 glass-light rounded-xl hover:bg-white/10 transition-colors"
                >
                    <ChevronLeft size={20} className="text-white/60" />
                </button>
                <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Receipt size={18} className="text-purple-400" /> 兑换记录
                    </h2>
                    <p className="text-[10px] text-white/25">累计消耗 {totalSpent.toLocaleString()} 积分</p>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="glass rounded-xl p-3 text-center">
                    <p className="text-[10px] text-white/30 mb-1">共兑换</p>
                    <p className="text-xl font-bold text-white">{redemptions.length}</p>
                    <p className="text-[10px] text-white/20">次</p>
                </div>
                <div className="glass rounded-xl p-3 text-center">
                    <p className="text-[10px] text-white/30 mb-1">累计消耗</p>
                    <p className="text-xl font-bold text-amber-400">{totalSpent.toLocaleString()}</p>
                    <p className="text-[10px] text-white/20">积分</p>
                </div>
                <div className="glass rounded-xl p-3 text-center">
                    <p className="text-[10px] text-white/30 mb-1">当前剩余</p>
                    <p className="text-xl font-bold text-emerald-400">{currentPoints.toLocaleString()}</p>
                    <p className="text-[10px] text-white/20">积分</p>
                </div>
            </div>

            {/* Records List */}
            <div className="flex-1 overflow-y-auto scrollbar-hide pb-6">
                {redemptions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-white/15">
                        <ShoppingBag size={48} className="mb-4 opacity-30" />
                        <p className="font-medium text-sm">还没有兑换记录</p>
                        <p className="text-xs mt-1 text-white/10">去福利社用积分换好物吧 🎁</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {redemptions.map((record, idx) => {
                            const productPart = record.reason.replace('兑换商品: ', '');
                            // Parse multiple items if any (格式: 商品名×数量、商品名×数量)
                            const items = productPart.split('、').map(item => {
                                const match = item.match(/^(.+?)×(\d+)$/);
                                return match
                                    ? { name: match[1], qty: parseInt(match[2]) }
                                    : { name: item, qty: 1 };
                            });

                            return (
                                <div key={idx} className="glass rounded-2xl overflow-hidden">
                                    {/* Order header */}
                                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-white/3">
                                        <div className="flex items-center gap-2 text-[10px] text-white/30">
                                            <Clock size={11} />
                                            <span>{new Date(record.timestamp).toLocaleString('zh-CN', {
                                                year: 'numeric', month: '2-digit', day: '2-digit',
                                                hour: '2-digit', minute: '2-digit'
                                            })}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs font-semibold text-amber-400">
                                            <Coins size={12} />
                                            <span>-{Math.abs(record.amount).toLocaleString()}</span>
                                        </div>
                                    </div>

                                    {/* Products */}
                                    <div className="px-4 py-3 space-y-2.5">
                                        {items.map((item, i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center border border-white/5">
                                                        <ShoppingBag size={18} className="text-purple-300" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-white/85">{item.name}</p>
                                                        <p className="text-[10px] text-white/25">数量 × {item.qty}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Status badge */}
                                    <div className="px-4 pb-3">
                                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                            审核中 · 将于3-5个工作日内发放
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RedemptionHistory;
