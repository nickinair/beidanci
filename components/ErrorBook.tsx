import React, { useState, useEffect } from 'react';
import { ChevronLeft, XCircle, CheckCircle } from 'lucide-react';
import { dbService } from '../services/dbService';
import { WrongQuestion, UserProfile } from '../types';

interface ErrorBookProps {
    user: UserProfile;
    onBack: () => void;
}

const ErrorBook: React.FC<ErrorBookProps> = ({ user, onBack }) => {
    const [wrongQuestions, setWrongQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadErrors = async () => {
            if (user.id) {
                const errors = await dbService.getWrongQuestions(user.id);
                setWrongQuestions(errors);
            }
            setLoading(false);
        };
        loadErrors();
    }, [user.id]);

    const handleRemove = async (id: string, wordId: string) => {
        if (user.id) {
            await dbService.removeWrongQuestion(user.id, wordId);
            setWrongQuestions(prev => prev.filter(q => q.word.id !== wordId));
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-3 mb-5 sticky top-0 z-10 -mx-5 -mt-5 px-5 pt-5 pb-3" style={{ background: 'linear-gradient(to bottom, rgba(15,23,42,0.95) 60%, transparent)' }}>
                <button onClick={onBack} className="p-2 glass-light rounded-xl hover:bg-white/10 transition-colors">
                    <ChevronLeft size={20} className="text-white/60" />
                </button>
                <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <XCircle size={18} className="text-red-400" /> 错题本
                    </h2>
                    <p className="text-[10px] text-white/25">共 {wrongQuestions.length} 个生词需要攻克</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pb-10 scrollbar-hide">
                {loading ? (
                    <div className="text-center py-10 text-white/20 font-medium">加载中...</div>
                ) : wrongQuestions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-white/15">
                        <CheckCircle size={40} className="text-emerald-400/20 mb-3" />
                        <p className="font-medium text-sm">太棒了！目前没有错题</p>
                    </div>
                ) : (
                    wrongQuestions.map((item) => (
                        <div key={item.id} className="glass p-4 rounded-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-5">
                                <XCircle size={48} className="text-red-400" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-white mb-1">{item.word.english}</h3>
                                <div className="flex items-center gap-2 text-white/40 mb-3">
                                    <span className="text-xs bg-white/5 px-2 py-0.5 rounded text-white/50">{item.word.chinese}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="text-[10px] text-red-400/60">
                                        你的误答: <span className="line-through">{item.userAnswer}</span>
                                    </div>
                                    <button onClick={() => handleRemove(item.id, item.word.id)}
                                        className="flex items-center gap-1 text-emerald-400 font-medium text-xs bg-emerald-500/10 px-3 py-1.5 rounded-lg hover:bg-emerald-500/20 transition-colors border border-emerald-500/20">
                                        <CheckCircle size={12} /> 已掌握
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ErrorBook;
