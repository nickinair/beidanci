
import React from 'react';
import { ChevronLeft, Coins, Sparkles, BookOpen, Gift, ShieldCheck } from 'lucide-react';

interface RulesProps {
  onBack: () => void;
}

const Rules: React.FC<RulesProps> = ({ onBack }) => {
  const tiers = [
    { range: '90 - 100分', reward: '50 积分', color: 'text-amber-400' },
    { range: '80 - 89分', reward: '20 积分', color: 'text-purple-400' },
    { range: '70 - 79分', reward: '10 积分', color: 'text-emerald-400' },
    { range: '60 - 69分', reward: '5 积分', color: 'text-blue-400' },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="p-2 glass-light rounded-xl hover:bg-white/10 transition-colors">
          <ChevronLeft size={20} className="text-white/60" />
        </button>
        <h2 className="text-lg font-bold text-white">挑战与兑换规则</h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-5 pb-6 scrollbar-hide">
        {/* Conversion Card */}
        <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl p-5 border border-amber-500/20 text-center">
          <Gift size={32} className="text-amber-400 mx-auto mb-2 animate-float" />
          <h3 className="text-lg font-bold text-white mb-1">积分兑换标准</h3>
          <p className="text-3xl font-bold gradient-text-gold">5 积分 = 1 人民币</p>
          <p className="mt-1.5 text-xs text-white/30 font-medium">学得越好，奖学金越多！</p>
        </div>

        {/* Tiers */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-amber-400" />
            <h4 className="text-sm font-bold text-white/60">挑战奖励阶梯</h4>
          </div>
          <div className="space-y-2">
            {tiers.map((tier, idx) => (
              <div key={idx} className="glass p-3.5 rounded-xl flex items-center justify-between">
                <span className="text-sm font-medium text-white/40">{tier.range}</span>
                <span className={`text-base font-bold ${tier.color}`}>+{tier.reward}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-white/15 mt-2 ml-1">注：得分低于60分没有积分奖励</p>
        </section>

        {/* Rules */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={16} className="text-blue-400" />
            <h4 className="text-sm font-bold text-white/60">挑战须知</h4>
          </div>
          <div className="space-y-3">
            <div className="flex gap-3 glass p-3 rounded-xl">
              <div className="bg-blue-500/10 p-2 rounded-lg h-fit"><ShieldCheck size={16} className="text-blue-400" /></div>
              <div>
                <p className="text-sm font-semibold text-white/80">限时挑战</p>
                <p className="text-xs text-white/30">每轮共有20道单词选择题，限时200秒。</p>
              </div>
            </div>
            <div className="flex gap-3 glass p-3 rounded-xl">
              <div className="bg-amber-500/10 p-2 rounded-lg h-fit"><Coins size={16} className="text-amber-400" /></div>
              <div>
                <p className="text-sm font-semibold text-white/80">结算与复习</p>
                <p className="text-xs text-white/30">答题结束后立即结算积分，并展示错题方便复习。</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="glass-light p-4 rounded-xl text-center border border-dashed border-white/10">
          <p className="text-white/30 text-sm font-medium">好好学习，天天向上！<br />单词记心间，大奖等你拿！</p>
        </div>
      </div>

      <button onClick={onBack} className="mt-3 w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3.5 rounded-xl transition-all hover:scale-[1.02] glow-blue">
        我知道了，去挑战！
      </button>
    </div>
  );
};

export default Rules;
