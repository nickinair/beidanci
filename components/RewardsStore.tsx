import React, { useState } from 'react';
import { UserProfile } from '../types';
import { REWARD_PRODUCTS, RewardProduct, CartItem } from '../data/rewardsData';
import { ChevronLeft, ShoppingCart, Plus, Minus, Trash2, CheckCircle, Gift, Package, Sparkles, ChevronRight, Coins, History } from 'lucide-react';

interface RewardsStoreProps {
    user: UserProfile;
    onBack: () => void;
    onDeductPoints: (amount: number, reason: string) => void;
    onViewRedemptionHistory?: () => void;
}

type StoreView = 'catalog' | 'detail' | 'cart' | 'complete';
type Category = 'all' | 'phone' | 'tablet' | 'accessory' | 'game_voucher' | 'gift_card';

const CATEGORY_LABELS: Record<Category, string> = {
    all: '全部',
    phone: '手机',
    tablet: '平板',
    accessory: '配件',
    game_voucher: '游戏券',
    gift_card: '京东卡',
};

const RewardsStore: React.FC<RewardsStoreProps> = ({ user, onBack, onDeductPoints, onViewRedemptionHistory }) => {
    const [view, setView] = useState<StoreView>('catalog');
    const [selectedProduct, setSelectedProduct] = useState<RewardProduct | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [category, setCategory] = useState<Category>('all');
    const [orderTotal, setOrderTotal] = useState(0);

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cart.reduce((sum, item) => sum + item.product.pointsCost * item.quantity, 0);

    const filteredProducts = category === 'all' ? REWARD_PRODUCTS : REWARD_PRODUCTS.filter(p => p.category === category);

    const addToCart = (product: RewardProduct) => {
        setCart(prev => {
            const existing = prev.find(c => c.product.id === product.id);
            if (existing) {
                return prev.map(c => c.product.id === product.id ? { ...c, quantity: c.quantity + 1 } : c);
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart(prev => prev.map(c => {
            if (c.product.id === productId) {
                const newQty = c.quantity + delta;
                return newQty > 0 ? { ...c, quantity: newQty } : c;
            }
            return c;
        }).filter(c => c.quantity > 0));
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(c => c.product.id !== productId));
    };

    const handleCheckout = () => {
        if (cartTotal > user.totalPoints) {
            alert('积分不足，请继续答题赚取更多积分！');
            return;
        }
        if (cart.length === 0) return;
        const itemNames = cart.map(c => `${c.product.name}×${c.quantity}`).join('、');
        onDeductPoints(cartTotal, `兑换商品: ${itemNames}`);
        setOrderTotal(cartTotal);
        setCart([]);
        setView('complete');
    };

    // ==================== CATALOG VIEW ====================
    if (view === 'catalog') {
        return (
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <button onClick={onBack} className="p-2 glass-light rounded-xl hover:bg-white/10 transition-colors">
                            <ChevronLeft size={20} className="text-white/60" />
                        </button>
                        <div>
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Gift size={18} className="text-amber-400" /> 福利社
                            </h2>
                            <p className="text-[10px] text-white/25">用积分兑换心仪好物</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {onViewRedemptionHistory && (
                            <button
                                onClick={onViewRedemptionHistory}
                                title="兑换记录"
                                className="p-2.5 glass-light rounded-xl hover:bg-white/10 transition-colors relative"
                            >
                                <History size={18} className="text-white/60" />
                            </button>
                        )}
                        <button onClick={() => setView('cart')} className="relative p-2.5 glass-light rounded-xl hover:bg-white/10 transition-colors">
                            <ShoppingCart size={18} className="text-white/60" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Points Bar */}
                <div className="glass p-3 rounded-xl mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Coins size={16} className="text-amber-400" />
                        <span className="text-white/50 text-xs font-medium">我的积分</span>
                    </div>
                    <span className="text-amber-400 font-bold text-lg">{user.totalPoints}</span>
                </div>

                {/* Category Tabs */}
                <div className="flex gap-1.5 mb-4 overflow-x-auto scrollbar-hide">
                    {(Object.keys(CATEGORY_LABELS) as Category[]).map(cat => (
                        <button key={cat} onClick={() => setCategory(cat)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${category === cat ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-white/5 text-white/30 hover:text-white/50'}`}>
                            {CATEGORY_LABELS[cat]}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                <div className="flex-1 overflow-y-auto scrollbar-hide pb-4">
                    <div className="grid grid-cols-2 gap-2.5">
                        {filteredProducts.map(product => (
                            <button key={product.id} onClick={() => { setSelectedProduct(product); setView('detail'); }}
                                className="glass p-3 rounded-xl text-left hover:bg-white/8 transition-all active:scale-[0.98] relative overflow-hidden group">
                                {product.tag && (
                                    <span className="absolute top-2 right-2 bg-amber-500/20 text-amber-400 text-[9px] font-bold px-1.5 py-0.5 rounded">{product.tag}</span>
                                )}
                                <div className="text-3xl mb-2 h-10 flex items-center">{product.image}</div>
                                <h3 className="text-sm font-bold text-white/90 truncate mb-0.5">{product.name}</h3>
                                <p className="text-[10px] text-white/25 line-clamp-1 mb-2">{product.description}</p>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-amber-400 font-bold text-sm">{product.pointsCost.toLocaleString()}</span>
                                        <span className="text-amber-400/50 text-[10px] ml-0.5">积分</span>
                                    </div>
                                    <span className="text-white/15 text-[10px]">≈¥{product.priceRMB}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (view === 'detail' && selectedProduct) {
        const inCart = cart.find(c => c.product.id === selectedProduct.id);
        const canAfford = user.totalPoints >= selectedProduct.pointsCost;
        return (
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center gap-3 mb-5">
                    <button onClick={() => setView('catalog')} className="p-2 glass-light rounded-xl hover:bg-white/10 transition-colors">
                        <ChevronLeft size={20} className="text-white/60" />
                    </button>
                    <h2 className="text-base font-bold text-white truncate">{selectedProduct.name}</h2>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-hide pb-4">
                    {/* Hero */}
                    <div className="glass-light rounded-2xl p-8 text-center mb-4 relative overflow-hidden">
                        {selectedProduct.tag && (
                            <span className="absolute top-3 right-3 bg-amber-500/20 text-amber-400 text-xs font-bold px-2 py-0.5 rounded-lg">{selectedProduct.tag}</span>
                        )}
                        <div className="text-6xl mb-3">{selectedProduct.image}</div>
                        <h2 className="text-xl font-bold text-white mb-1">{selectedProduct.name}</h2>
                        <div className="flex items-center justify-center gap-3">
                            <span className="text-2xl font-bold text-amber-400">{selectedProduct.pointsCost.toLocaleString()} <span className="text-sm">积分</span></span>
                            <span className="text-white/20 text-sm">¥{selectedProduct.priceRMB}</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="glass p-4 rounded-xl mb-3">
                        <h3 className="text-sm font-bold text-white/50 mb-2 flex items-center gap-1.5">
                            <Package size={14} /> 商品介绍
                        </h3>
                        <p className="text-sm text-white/60 leading-relaxed">{selectedProduct.description}</p>
                    </div>

                    {/* Specs */}
                    {selectedProduct.specs && selectedProduct.specs.length > 0 && (
                        <div className="glass p-4 rounded-xl mb-3">
                            <h3 className="text-sm font-bold text-white/50 mb-2 flex items-center gap-1.5">
                                <Sparkles size={14} /> 规格参数
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {selectedProduct.specs.map((spec, i) => (
                                    <span key={i} className="bg-white/5 text-white/50 text-xs font-medium px-2.5 py-1 rounded-lg">{spec}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Afford check */}
                    {!canAfford && (
                        <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-center mb-3">
                            <p className="text-red-400 text-xs font-medium">
                                积分不足，还差 <span className="font-bold">{(selectedProduct.pointsCost - user.totalPoints).toLocaleString()}</span> 积分
                            </p>
                        </div>
                    )}
                </div>

                {/* Bottom Action */}
                <div className="pt-3 flex gap-2.5">
                    <button onClick={() => { addToCart(selectedProduct); setView('cart'); }}
                        className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-3 rounded-xl transition-all hover:from-amber-600 hover:to-orange-600 flex items-center justify-center gap-2 text-sm">
                        <ShoppingCart size={16} /> {inCart ? '再加一个' : '加入购物车'}
                    </button>
                </div>
            </div>
        );
    }

    // ==================== CART VIEW ====================
    if (view === 'cart') {
        return (
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center gap-3 mb-5">
                    <button onClick={() => setView('catalog')} className="p-2 glass-light rounded-xl hover:bg-white/10 transition-colors">
                        <ChevronLeft size={20} className="text-white/60" />
                    </button>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <ShoppingCart size={18} className="text-amber-400" /> 兑换购物车
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-hide pb-4">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-white/15">
                            <ShoppingCart size={40} className="mb-3 opacity-30" />
                            <p className="text-sm font-medium">购物车还是空的</p>
                            <button onClick={() => setView('catalog')} className="mt-3 text-amber-400 text-xs font-medium bg-amber-500/10 px-4 py-2 rounded-lg hover:bg-amber-500/20 transition-colors">
                                去逛逛
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2.5">
                            {cart.map(item => (
                                <div key={item.product.id} className="glass p-3.5 rounded-xl">
                                    <div className="flex items-start gap-3">
                                        <div className="text-2xl w-10 h-10 flex items-center justify-center">{item.product.image}</div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-bold text-white/90 truncate">{item.product.name}</h3>
                                            {item.product.tag && <span className="text-[10px] text-amber-400/60">{item.product.tag}</span>}
                                            <div className="text-amber-400 font-bold text-sm mt-0.5">{item.product.pointsCost.toLocaleString()} 积分</div>
                                        </div>
                                        <button onClick={() => removeFromCart(item.product.id)} className="p-1.5 text-red-400/40 hover:text-red-400 transition-colors">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-end gap-3 mt-2">
                                        <button onClick={() => updateQuantity(item.product.id, -1)}
                                            className="p-1 glass-light rounded-lg hover:bg-white/10 transition-colors">
                                            <Minus size={14} className="text-white/40" />
                                        </button>
                                        <span className="text-white font-bold text-sm w-6 text-center">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.product.id, 1)}
                                            className="p-1 glass-light rounded-lg hover:bg-white/10 transition-colors">
                                            <Plus size={14} className="text-white/40" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Checkout Footer */}
                {cart.length > 0 && (
                    <div className="pt-3 border-t border-white/5">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <span className="text-white/30 text-xs">共 {cartCount} 件商品</span>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-white/50 text-xs">合计:</span>
                                    <span className="text-amber-400 font-bold text-lg">{cartTotal.toLocaleString()}</span>
                                    <span className="text-amber-400/50 text-xs">积分</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-white/20 text-[10px]">当前积分</span>
                                <div className={`font-bold text-sm ${cartTotal > user.totalPoints ? 'text-red-400' : 'text-emerald-400'}`}>
                                    {user.totalPoints.toLocaleString()}
                                </div>
                            </div>
                        </div>
                        <button onClick={handleCheckout} disabled={cartTotal > user.totalPoints}
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-40 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm">
                            {cartTotal > user.totalPoints ? '积分不足' : '确认兑换'}
                            <CheckCircle size={16} />
                        </button>
                    </div>
                )}
            </div>
        );
    }

    // ==================== COMPLETE VIEW ====================
    if (view === 'complete') {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500/20 to-green-500/20 border-2 border-emerald-500/30 flex items-center justify-center animate-float">
                        <CheckCircle size={48} className="text-emerald-400" />
                    </div>
                    <div className="absolute -top-2 -right-2">
                        <Sparkles size={20} className="text-amber-400 animate-pulse-soft" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">兑换成功！</h2>
                <p className="text-white/30 text-sm mb-6 max-w-xs">
                    恭喜你成功兑换，已消耗 <span className="text-amber-400 font-bold">{orderTotal.toLocaleString()}</span> 积分。
                    商品将在审核后安排发放，请耐心等待。
                </p>

                <div className="glass p-4 rounded-xl mb-8 w-full max-w-xs">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-white/40">消耗积分</span>
                        <span className="text-amber-400 font-bold">-{orderTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-white/40">剩余积分</span>
                        <span className="text-emerald-400 font-bold">{user.totalPoints.toLocaleString()}</span>
                    </div>
                </div>

                <button onClick={onBack}
                    className="w-full max-w-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 glow-blue">
                    返回我的页面
                    <ChevronRight size={16} />
                </button>
            </div>
        );
    }

    return null;
};

export default RewardsStore;
