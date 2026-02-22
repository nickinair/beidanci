
export interface RewardProduct {
    id: string;
    name: string;
    category: 'phone' | 'tablet' | 'accessory' | 'game_voucher' | 'gift_card';
    description: string;
    priceRMB: number;       // Price in RMB
    pointsCost: number;     // Price in points (priceRMB * 5)
    image: string;          // Emoji as placeholder
    specs?: string[];
    tag?: string;           // "热门" / "新品" etc.
}

export interface CartItem {
    product: RewardProduct;
    quantity: number;
}

export interface RewardOrder {
    id: string;
    items: CartItem[];
    totalPoints: number;
    timestamp: number;
}

export const REWARD_PRODUCTS: RewardProduct[] = [
    // === Phones ===
    {
        id: 'phone_vivo_x200',
        name: 'vivo X200',
        category: 'phone',
        description: 'vivo X200 旗舰手机，搭载天玑9400处理器，蔡司影像系统，6.67英寸AMOLED屏幕',
        priceRMB: 3999,
        pointsCost: 19995,
        image: '📱',
        specs: ['天玑9400', '蔡司影像', '6.67" AMOLED', '5000mAh', '120W快充'],
        tag: '热门',
    },
    {
        id: 'phone_xiaomi_15',
        name: '小米15',
        category: 'phone',
        description: '小米15旗舰手机，骁龙8至尊版，徕卡光学镜头，6.36英寸小尺寸旗舰',
        priceRMB: 4499,
        pointsCost: 22495,
        image: '📱',
        specs: ['骁龙8至尊版', '徕卡影像', '6.36" AMOLED', '5400mAh', '90W快充'],
        tag: '新品',
    },
    {
        id: 'phone_iphone16',
        name: 'iPhone 16',
        category: 'phone',
        description: 'Apple iPhone 16，A18芯片，4800万主摄，Action按键，6.1英寸超视网膜XDR显示屏',
        priceRMB: 5999,
        pointsCost: 29995,
        image: '📱',
        specs: ['A18芯片', '4800万主摄', '6.1" OLED', 'USB-C', 'iOS 18'],
        tag: '旗舰',
    },

    // === Tablets ===
    {
        id: 'tablet_vivo_pad3',
        name: 'vivo Pad3',
        category: 'tablet',
        description: 'vivo Pad3 平板电脑，天玑9300+处理器，12.1英寸大屏，支持手写笔',
        priceRMB: 2499,
        pointsCost: 12495,
        image: '📟',
        specs: ['天玑9300+', '12.1" LCD', '11500mAh', '支持手写笔'],
    },
    {
        id: 'tablet_xiaomi_pad7',
        name: '小米平板7',
        category: 'tablet',
        description: '小米平板7，骁龙7+Gen3处理器，11.2英寸高刷屏幕，MIUI Pad系统',
        priceRMB: 1999,
        pointsCost: 9995,
        image: '📟',
        specs: ['骁龙7+Gen3', '11.2" LCD', '8850mAh', '67W快充'],
        tag: '性价比',
    },
    {
        id: 'tablet_ipad_air',
        name: 'iPad Air M3',
        category: 'tablet',
        description: 'Apple iPad Air M3芯片版，11英寸Liquid Retina显示屏，支持Apple Pencil Pro',
        priceRMB: 4799,
        pointsCost: 23995,
        image: '📟',
        specs: ['M3芯片', '11" Liquid Retina', '10小时续航', 'Apple Pencil Pro'],
        tag: '旗舰',
    },

    // === Accessories ===
    {
        id: 'acc_case',
        name: '高级手机壳',
        category: 'accessory',
        description: '高品质磨砂手机壳，防摔防刮，超薄设计，多色可选',
        priceRMB: 69,
        pointsCost: 345,
        image: '🛡️',
        specs: ['磨砂材质', '防摔设计', '多色可选'],
    },
    {
        id: 'acc_earbuds',
        name: '无线蓝牙耳机',
        category: 'accessory',
        description: 'TWS真无线蓝牙耳机，主动降噪，蓝牙5.3，30小时总续航',
        priceRMB: 299,
        pointsCost: 1495,
        image: '🎧',
        specs: ['主动降噪', '蓝牙5.3', '30小时续航', 'IPX4防水'],
        tag: '热门',
    },
    {
        id: 'acc_powerbank',
        name: '20000mAh充电宝',
        category: 'accessory',
        description: '大容量移动电源，22.5W快充，双USB输出，LED数显',
        priceRMB: 129,
        pointsCost: 645,
        image: '🔋',
        specs: ['20000mAh', '22.5W快充', '双口输出', 'LED数显'],
    },
    {
        id: 'acc_screen',
        name: '钢化膜套装',
        category: 'accessory',
        description: '9H硬度钢化玻璃膜，防指纹，高清透光，含安装工具',
        priceRMB: 39,
        pointsCost: 195,
        image: '📋',
        specs: ['9H硬度', '防指纹', '高清透光'],
    },

    // === Game Vouchers ===
    // 王者荣耀
    { id: 'game_wzry_50', name: '王者荣耀点券', category: 'game_voucher', description: '王者荣耀50元点券充值兑换券，可购买皮肤和英雄', priceRMB: 50, pointsCost: 250, image: '⚔️', tag: '50元' },
    { id: 'game_wzry_100', name: '王者荣耀点券', category: 'game_voucher', description: '王者荣耀100元点券充值兑换券，可购买皮肤和英雄', priceRMB: 100, pointsCost: 500, image: '⚔️', tag: '100元' },
    { id: 'game_wzry_200', name: '王者荣耀点券', category: 'game_voucher', description: '王者荣耀200元点券充值兑换券，可购买限定皮肤', priceRMB: 200, pointsCost: 1000, image: '⚔️', tag: '200元' },
    { id: 'game_wzry_500', name: '王者荣耀点券', category: 'game_voucher', description: '王者荣耀500元点券充值兑换券，畅享王者世界', priceRMB: 500, pointsCost: 2500, image: '⚔️', tag: '500元' },

    // 和平精英
    { id: 'game_hpjy_50', name: '和平精英点券', category: 'game_voucher', description: '和平精英50元点券充值兑换券，购买枪皮和时装', priceRMB: 50, pointsCost: 250, image: '🎯', tag: '50元' },
    { id: 'game_hpjy_100', name: '和平精英点券', category: 'game_voucher', description: '和平精英100元点券充值兑换券，购买枪皮和时装', priceRMB: 100, pointsCost: 500, image: '🎯', tag: '100元' },
    { id: 'game_hpjy_200', name: '和平精英点券', category: 'game_voucher', description: '和平精英200元点券充值兑换券，购买限定套装', priceRMB: 200, pointsCost: 1000, image: '🎯', tag: '200元' },
    { id: 'game_hpjy_500', name: '和平精英点券', category: 'game_voucher', description: '和平精英500元点券充值兑换券，尽享和平精英', priceRMB: 500, pointsCost: 2500, image: '🎯', tag: '500元' },

    // 三角洲行动
    { id: 'game_sjz_50', name: '三角洲行动代币', category: 'game_voucher', description: '三角洲行动50元代币充值兑换券', priceRMB: 50, pointsCost: 250, image: '🔫', tag: '50元' },
    { id: 'game_sjz_100', name: '三角洲行动代币', category: 'game_voucher', description: '三角洲行动100元代币充值兑换券', priceRMB: 100, pointsCost: 500, image: '🔫', tag: '100元' },
    { id: 'game_sjz_200', name: '三角洲行动代币', category: 'game_voucher', description: '三角洲行动200元代币充值兑换券', priceRMB: 200, pointsCost: 1000, image: '🔫', tag: '200元' },
    { id: 'game_sjz_500', name: '三角洲行动代币', category: 'game_voucher', description: '三角洲行动500元代币充值兑换券', priceRMB: 500, pointsCost: 2500, image: '🔫', tag: '500元' },

    // === 京东卡 ===
    { id: 'jd_100', name: '京东E卡100元', category: 'gift_card', description: '京东E卡100元面额，可在京东商城购买自营商品', priceRMB: 100, pointsCost: 500, image: '🛒', tag: '100元' },
    { id: 'jd_200', name: '京东E卡200元', category: 'gift_card', description: '京东E卡200元面额，可在京东商城购买自营商品', priceRMB: 200, pointsCost: 1000, image: '🛒', tag: '200元' },
    { id: 'jd_500', name: '京东E卡500元', category: 'gift_card', description: '京东E卡500元面额，可在京东商城购买自营商品', priceRMB: 500, pointsCost: 2500, image: '🛒', tag: '500元' },
];
