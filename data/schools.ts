import { School } from '../types';

export const SCHOOLS: School[] = [
    // ============ 北京市 ============

    // 海淀区 (bj_hd)
    { id: 's_bj_hd_1', name: '北京市海淀区实验小学', type: 'primary', province: 'bj', city: 'bj_bj', district: 'bj_hd' },
    { id: 's_bj_hd_2', name: '中关村第一小学', type: 'primary', province: 'bj', city: 'bj_bj', district: 'bj_hd' },
    { id: 's_bj_hd_3', name: '中关村第三小学', type: 'primary', province: 'bj', city: 'bj_bj', district: 'bj_hd' },
    { id: 's_bj_hd_4', name: '海淀区五一小学', type: 'primary', province: 'bj', city: 'bj_bj', district: 'bj_hd' },
    { id: 's_bj_hd_5', name: '人大附中', type: 'senior', province: 'bj', city: 'bj_bj', district: 'bj_hd' },
    { id: 's_bj_hd_6', name: '清华附中', type: 'senior', province: 'bj', city: 'bj_bj', district: 'bj_hd' },
    { id: 's_bj_hd_7', name: '北大附中', type: 'senior', province: 'bj', city: 'bj_bj', district: 'bj_hd' },
    { id: 's_bj_hd_8', name: '一零一中学', type: 'junior', province: 'bj', city: 'bj_bj', district: 'bj_hd' },
    { id: 's_bj_hd_9', name: '海淀区教师进修学校附属实验学校', type: 'junior', province: 'bj', city: 'bj_bj', district: 'bj_hd' },
    { id: 's_bj_hd_10', name: '十一学校', type: 'junior', province: 'bj', city: 'bj_bj', district: 'bj_hd' },
    { id: 's_bj_hd_11', name: '北外附校', type: 'junior', province: 'bj', city: 'bj_bj', district: 'bj_hd' },
    { id: 'u_bj_hd_1', name: '北京大学', type: 'university', province: 'bj', city: 'bj_bj', district: 'bj_hd' },
    { id: 'u_bj_hd_2', name: '清华大学', type: 'university', province: 'bj', city: 'bj_bj', district: 'bj_hd' },
    { id: 'u_bj_hd_3', name: '中国人民大学', type: 'university', province: 'bj', city: 'bj_bj', district: 'bj_hd' },
    { id: 'u_bj_hd_4', name: '北京师范大学', type: 'university', province: 'bj', city: 'bj_bj', district: 'bj_hd' },

    // 东城区 (bj_dc)
    { id: 's_bj_dc_1', name: '北京市府学胡同小学', type: 'primary', province: 'bj', city: 'bj_bj', district: 'bj_dc' },
    { id: 's_bj_dc_2', name: '史家胡同小学', type: 'primary', province: 'bj', city: 'bj_bj', district: 'bj_dc' },
    { id: 's_bj_dc_3', name: '景山学校', type: 'primary', province: 'bj', city: 'bj_bj', district: 'bj_dc' },
    { id: 's_bj_dc_4', name: '北京二中', type: 'senior', province: 'bj', city: 'bj_bj', district: 'bj_dc' },
    { id: 's_bj_dc_5', name: '北京五中', type: 'senior', province: 'bj', city: 'bj_bj', district: 'bj_dc' },
    { id: 's_bj_dc_6', name: '北京市东直门中学', type: 'junior', province: 'bj', city: 'bj_bj', district: 'bj_dc' },
    { id: 's_bj_dc_7', name: '北京市第一七一中学', type: 'junior', province: 'bj', city: 'bj_bj', district: 'bj_dc' },

    // 西城区 (bj_xc)
    { id: 's_bj_xc_1', name: '北京实验二小', type: 'primary', province: 'bj', city: 'bj_bj', district: 'bj_xc' },
    { id: 's_bj_xc_2', name: '育翔小学', type: 'primary', province: 'bj', city: 'bj_bj', district: 'bj_xc' },
    { id: 's_bj_xc_3', name: '宏庙小学', type: 'primary', province: 'bj', city: 'bj_bj', district: 'bj_xc' },
    { id: 's_bj_xc_4', name: '北京四中', type: 'senior', province: 'bj', city: 'bj_bj', district: 'bj_xc' },
    { id: 's_bj_xc_5', name: '北师大附属实验中学', type: 'senior', province: 'bj', city: 'bj_bj', district: 'bj_xc' },
    { id: 's_bj_xc_6', name: '北京八中', type: 'junior', province: 'bj', city: 'bj_bj', district: 'bj_xc' },
    { id: 's_bj_xc_7', name: '三帆中学', type: 'junior', province: 'bj', city: 'bj_bj', district: 'bj_xc' },

    // 朝阳区 (bj_cy)
    { id: 's_bj_cy_1', name: '北京市朝阳区白家庄小学', type: 'primary', province: 'bj', city: 'bj_bj', district: 'bj_cy' },
    { id: 's_bj_cy_2', name: '朝阳区芳草地国际学校', type: 'primary', province: 'bj', city: 'bj_bj', district: 'bj_cy' },
    { id: 's_bj_cy_3', name: '呼家楼中心小学', type: 'primary', province: 'bj', city: 'bj_bj', district: 'bj_cy' },
    { id: 's_bj_cy_4', name: '北京八十中学', type: 'senior', province: 'bj', city: 'bj_bj', district: 'bj_cy' },
    { id: 's_bj_cy_5', name: '陈经纶中学', type: 'senior', province: 'bj', city: 'bj_bj', district: 'bj_cy' },
    { id: 's_bj_cy_6', name: '朝阳外国语学校', type: 'junior', province: 'bj', city: 'bj_bj', district: 'bj_cy' },
    { id: 's_bj_cy_7', name: '北京市日坛中学', type: 'junior', province: 'bj', city: 'bj_bj', district: 'bj_cy' },

    // ============ 上海市 ============

    // 浦东新区 (sh_pd)
    { id: 's_sh_pd_1', name: '上海市浦东新区第二中心小学', type: 'primary', province: 'sh', city: 'sh_sh', district: 'sh_pd' },
    { id: 's_sh_pd_2', name: '明珠小学', type: 'primary', province: 'sh', city: 'sh_sh', district: 'sh_pd' },
    { id: 's_sh_pd_3', name: '福山外国语小学', type: 'primary', province: 'sh', city: 'sh_sh', district: 'sh_pd' },
    { id: 's_sh_pd_4', name: '上海中学东校', type: 'senior', province: 'sh', city: 'sh_sh', district: 'sh_pd' },
    { id: 's_sh_pd_5', name: '进才中学', type: 'senior', province: 'sh', city: 'sh_sh', district: 'sh_pd' },
    { id: 's_sh_pd_6', name: '建平中学', type: 'junior', province: 'sh', city: 'sh_sh', district: 'sh_pd' },
    { id: 's_sh_pd_7', name: '张江集团学校', type: 'junior', province: 'sh', city: 'sh_sh', district: 'sh_pd' },
    { id: 's_sh_pd_8', name: '浦东模范中学', type: 'junior', province: 'sh', city: 'sh_sh', district: 'sh_pd' },

    // 黄浦区 (sh_hp)
    { id: 's_sh_hp_1', name: '上海市实验小学', type: 'primary', province: 'sh', city: 'sh_sh', district: 'sh_hp' },
    { id: 's_sh_hp_2', name: '蓬莱路第二小学', type: 'primary', province: 'sh', city: 'sh_sh', district: 'sh_hp' },
    { id: 's_sh_hp_3', name: '上海外国语大学附属大境中学', type: 'senior', province: 'sh', city: 'sh_sh', district: 'sh_hp' },
    { id: 's_sh_hp_4', name: '格致中学', type: 'senior', province: 'sh', city: 'sh_sh', district: 'sh_hp' },
    { id: 's_sh_hp_5', name: '大同中学', type: 'senior', province: 'sh', city: 'sh_sh', district: 'sh_hp' },
    { id: 's_sh_hp_6', name: '向明初级中学', type: 'junior', province: 'sh', city: 'sh_sh', district: 'sh_hp' },
    { id: 's_sh_hp_7', name: '永昌学校', type: 'junior', province: 'sh', city: 'sh_sh', district: 'sh_hp' },

    // 徐汇区 (sh_xh)
    { id: 's_sh_xh_1', name: '上海市世界外国语小学', type: 'primary', province: 'sh', city: 'sh_sh', district: 'sh_xh' },
    { id: 's_sh_xh_2', name: '向阳小学', type: 'primary', province: 'sh', city: 'sh_sh', district: 'sh_xh' },
    { id: 's_sh_xh_3', name: '高安路第一小学', type: 'primary', province: 'sh', city: 'sh_sh', district: 'sh_xh' },
    { id: 's_sh_xh_4', name: '上海中学', type: 'senior', province: 'sh', city: 'sh_sh', district: 'sh_xh' },
    { id: 's_sh_xh_5', name: '南洋模范中学', type: 'senior', province: 'sh', city: 'sh_sh', district: 'sh_xh' },
    { id: 's_sh_xh_6', name: '华育中学', type: 'junior', province: 'sh', city: 'sh_sh', district: 'sh_xh' },
    { id: 's_sh_xh_7', name: '世界外国语中学', type: 'junior', province: 'sh', city: 'sh_sh', district: 'sh_xh' },

    // 长宁区 (sh_cn)
    { id: 's_sh_cn_1', name: '愚园路第一小学', type: 'primary', province: 'sh', city: 'sh_sh', district: 'sh_cn' },
    { id: 's_sh_cn_2', name: '江苏路第五小学', type: 'primary', province: 'sh', city: 'sh_sh', district: 'sh_cn' },
    { id: 's_sh_cn_3', name: '延安中学', type: 'senior', province: 'sh', city: 'sh_sh', district: 'sh_cn' },
    { id: 's_sh_cn_4', name: '复旦中学', type: 'senior', province: 'sh', city: 'sh_sh', district: 'sh_cn' },
    { id: 's_sh_cn_5', name: '新世纪中学', type: 'junior', province: 'sh', city: 'sh_sh', district: 'sh_cn' },
    { id: 's_sh_cn_6', name: '长宁实验小学', type: 'primary', province: 'sh', city: 'sh_sh', district: 'sh_cn' },

    // 静安区 (sh_ja)
    { id: 's_sh_ja_1', name: '一师附小', type: 'primary', province: 'sh', city: 'sh_sh', district: 'sh_ja' },
    { id: 's_sh_ja_2', name: '静安区第一中心小学', type: 'primary', province: 'sh', city: 'sh_sh', district: 'sh_ja' },
    { id: 's_sh_ja_3', name: '市西中学', type: 'senior', province: 'sh', city: 'sh_sh', district: 'sh_ja' },
    { id: 's_sh_ja_4', name: '育才中学', type: 'senior', province: 'sh', city: 'sh_sh', district: 'sh_ja' },
    { id: 's_sh_ja_5', name: '市北初级中学', type: 'junior', province: 'sh', city: 'sh_sh', district: 'sh_ja' },
    { id: 's_sh_ja_6', name: '静教院附校', type: 'junior', province: 'sh', city: 'sh_sh', district: 'sh_ja' },
    { id: 'u_sh_xh_1', name: '上海交通大学', type: 'university', province: 'sh', city: 'sh_sh', district: 'sh_xh' },
    { id: 'u_sh_cn_1', name: '复旦大学', type: 'university', province: 'sh', city: 'sh_sh', district: 'sh_cn' },
    { id: 'u_sh_ja_1', name: '上海大学', type: 'university', province: 'sh', city: 'sh_sh', district: 'sh_ja' },

    // ============ 广东省 ============

    // 南山区 (gd_sz_ns)
    { id: 's_sz_ns_1', name: '深圳南山外国语学校', type: 'primary', province: 'gd', city: 'gd_sz', district: 'gd_sz_ns' },
    { id: 's_sz_ns_2', name: '南山实验小学', type: 'primary', province: 'gd', city: 'gd_sz', district: 'gd_sz_ns' },
    { id: 's_sz_ns_3', name: '深圳育才一小', type: 'primary', province: 'gd', city: 'gd_sz', district: 'gd_sz_ns' },
    { id: 's_sz_ns_4', name: '深圳育才二中', type: 'junior', province: 'gd', city: 'gd_sz', district: 'gd_sz_ns' },
    { id: 's_sz_ns_5', name: '南山第二外国语学校', type: 'junior', province: 'gd', city: 'gd_sz', district: 'gd_sz_ns' },
    { id: 's_sz_ns_6', name: '深圳实验学校', type: 'senior', province: 'gd', city: 'gd_sz', district: 'gd_sz_ns' },
    { id: 's_sz_ns_7', name: '育才中学', type: 'senior', province: 'gd', city: 'gd_sz', district: 'gd_sz_ns' },

    // 福田区 (gd_sz_ft)
    { id: 's_sz_ft_1', name: '深圳市福田区荔园小学', type: 'primary', province: 'gd', city: 'gd_sz', district: 'gd_sz_ft' },
    { id: 's_sz_ft_2', name: '园岭小学', type: 'primary', province: 'gd', city: 'gd_sz', district: 'gd_sz_ft' },
    { id: 's_sz_ft_3', name: '百花小学', type: 'primary', province: 'gd', city: 'gd_sz', district: 'gd_sz_ft' },
    { id: 's_sz_ft_4', name: '深圳中学', type: 'senior', province: 'gd', city: 'gd_sz', district: 'gd_sz_ft' },
    { id: 's_sz_ft_5', name: '深圳高级中学', type: 'senior', province: 'gd', city: 'gd_sz', district: 'gd_sz_ft' },
    { id: 's_sz_ft_6', name: '深圳市侨香外国语学校', type: 'junior', province: 'gd', city: 'gd_sz', district: 'gd_sz_ft' },
    { id: 's_sz_ft_7', name: '福田区外国语学校', type: 'junior', province: 'gd', city: 'gd_sz', district: 'gd_sz_ft' },

    // 罗湖区 (gd_sz_lh)
    { id: 's_sz_lh_1', name: '深圳市螺岭外国语实验学校', type: 'primary', province: 'gd', city: 'gd_sz', district: 'gd_sz_lh' },
    { id: 's_sz_lh_2', name: '翠竹外国语实验学校', type: 'primary', province: 'gd', city: 'gd_sz', district: 'gd_sz_lh' },
    { id: 's_sz_lh_3', name: '深圳外国语学校', type: 'senior', province: 'gd', city: 'gd_sz', district: 'gd_sz_lh' },
    { id: 's_sz_lh_4', name: '翠园中学', type: 'senior', province: 'gd', city: 'gd_sz', district: 'gd_sz_lh' },
    { id: 's_sz_lh_5', name: '桂园中学', type: 'junior', province: 'gd', city: 'gd_sz', district: 'gd_sz_lh' },
    { id: 's_sz_lh_6', name: '罗湖外语实验学校', type: 'junior', province: 'gd', city: 'gd_sz', district: 'gd_sz_lh' },

    // 越秀区 (gd_gz_yx)
    { id: 's_gz_yx_1', name: '广州市东风东路小学', type: 'primary', province: 'gd', city: 'gd_gz', district: 'gd_gz_yx' },
    { id: 's_gz_yx_2', name: '文德路小学', type: 'primary', province: 'gd', city: 'gd_gz', district: 'gd_gz_yx' },
    { id: 's_gz_yx_3', name: '朝天小学', type: 'primary', province: 'gd', city: 'gd_gz', district: 'gd_gz_yx' },
    { id: 's_gz_yx_4', name: '广东实验中学', type: 'senior', province: 'gd', city: 'gd_gz', district: 'gd_gz_yx' },
    { id: 's_gz_yx_5', name: '广州市执信中学', type: 'senior', province: 'gd', city: 'gd_gz', district: 'gd_gz_yx' },
    { id: 's_gz_yx_6', name: '广州市第二中学', type: 'junior', province: 'gd', city: 'gd_gz', district: 'gd_gz_yx' },
    { id: 's_gz_yx_7', name: '育才实验学校', type: 'junior', province: 'gd', city: 'gd_gz', district: 'gd_gz_yx' },

    // 天河区 (gd_gz_th)
    { id: 's_gz_th_1', name: '华阳小学', type: 'primary', province: 'gd', city: 'gd_gz', district: 'gd_gz_th' },
    { id: 's_gz_th_2', name: '天河区先烈东小学', type: 'primary', province: 'gd', city: 'gd_gz', district: 'gd_gz_th' },
    { id: 's_gz_th_3', name: '体育东路小学', type: 'primary', province: 'gd', city: 'gd_gz', district: 'gd_gz_th' },
    { id: 's_gz_th_4', name: '华南师范大学附属中学', type: 'senior', province: 'gd', city: 'gd_gz', district: 'gd_gz_th' },
    { id: 's_gz_th_5', name: '广州市第四十七中学', type: 'senior', province: 'gd', city: 'gd_gz', district: 'gd_gz_th' },
    { id: 's_gz_th_6', name: '天河外国语学校', type: 'junior', province: 'gd', city: 'gd_gz', district: 'gd_gz_th' },
    { id: 's_gz_th_7', name: '华师附中新世界学校', type: 'junior', province: 'gd', city: 'gd_gz', district: 'gd_gz_th' },

    // 海珠区 (gd_gz_hz)
    { id: 's_gz_hz_1', name: '广州市海珠区实验小学', type: 'primary', province: 'gd', city: 'gd_gz', district: 'gd_gz_hz' },
    { id: 's_gz_hz_2', name: '宝玉直小学', type: 'primary', province: 'gd', city: 'gd_gz', district: 'gd_gz_hz' },
    { id: 's_gz_hz_3', name: '同福中路第一小学', type: 'primary', province: 'gd', city: 'gd_gz', district: 'gd_gz_hz' },
    { id: 's_gz_hz_4', name: '广州市第五中学', type: 'senior', province: 'gd', city: 'gd_gz', district: 'gd_gz_hz' },
    { id: 's_gz_hz_5', name: '南武中学', type: 'senior', province: 'gd', city: 'gd_gz', district: 'gd_gz_hz' },
    { id: 's_gz_hz_6', name: '广州市第九十七中学', type: 'junior', province: 'gd', city: 'gd_gz', district: 'gd_gz_hz' },
    { id: 's_gz_hz_7', name: '海珠外国语实验中学', type: 'junior', province: 'gd', city: 'gd_gz', district: 'gd_gz_hz' },
    { id: 'u_gz_th_1', name: '中山大学', type: 'university', province: 'gd', city: 'gd_gz', district: 'gd_gz_th' },
    { id: 'u_gz_th_2', name: '华南理工大学', type: 'university', province: 'gd', city: 'gd_gz', district: 'gd_gz_th' },
    { id: 'u_sz_ns_1', name: '深圳大学', type: 'university', province: 'gd', city: 'gd_sz', district: 'gd_sz_ns' },
];
