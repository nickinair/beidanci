export interface District {
    id: string;
    name: string;
}

export interface City {
    id: string;
    name: string;
    districts: District[];
}

export interface Province {
    id: string;
    name: string;
    cities: City[];
}

export const REGIONS: Province[] = [
    {
        id: 'bj',
        name: '北京市',
        cities: [
            {
                id: 'bj_bj',
                name: '北京市',
                districts: [
                    { id: 'bj_dc', name: '东城区' },
                    { id: 'bj_xc', name: '西城区' },
                    { id: 'bj_cy', name: '朝阳区' },
                    { id: 'bj_hd', name: '海淀区' },
                ]
            }
        ]
    },
    {
        id: 'sh',
        name: '上海市',
        cities: [
            {
                id: 'sh_sh',
                name: '上海市',
                districts: [
                    { id: 'sh_hp', name: '黄浦区' },
                    { id: 'sh_xh', name: '徐汇区' },
                    { id: 'sh_cn', name: '长宁区' },
                    { id: 'sh_ja', name: '静安区' },
                    { id: 'sh_pd', name: '浦东新区' },
                ]
            }
        ]
    },
    {
        id: 'gd',
        name: '广东省',
        cities: [
            {
                id: 'gd_gz',
                name: '广州市',
                districts: [
                    { id: 'gd_gz_yx', name: '越秀区' },
                    { id: 'gd_gz_th', name: '天河区' },
                    { id: 'gd_gz_hz', name: '海珠区' },
                ]
            },
            {
                id: 'gd_sz',
                name: '深圳市',
                districts: [
                    { id: 'gd_sz_ft', name: '福田区' },
                    { id: 'gd_sz_ns', name: '南山区' },
                    { id: 'gd_sz_lh', name: '罗湖区' },
                ]
            }
        ]
    }
];
