import React, { useState, useEffect } from 'react';
import { REGIONS } from '../data/regions';
import { SCHOOLS } from '../data/schools';
import { School, UserProfile } from '../types';
import { MapPin, School as SchoolIcon, GraduationCap, CheckCircle, Smartphone, ChevronDown, Search } from 'lucide-react';
import { dbService } from '../services/dbService';

interface ProfileSetupProps {
    user: UserProfile;
    onComplete: () => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ user, onComplete }) => {
    const [provinceId, setProvinceId] = useState(user.province || '');
    const [cityId, setCityId] = useState(user.city || '');
    const [districtId, setDistrictId] = useState(user.district || '');
    const [schoolType, setSchoolType] = useState<'primary' | 'junior' | 'senior'>((user.grade && user.grade > 9 ? 'senior' : user.grade && user.grade > 6 ? 'junior' : 'primary') as any);
    const [schoolId, setSchoolId] = useState(user.schoolId || '');
    const [grade, setGrade] = useState(user.grade || 1);
    const [nickname, setNickname] = useState(user.name?.startsWith('User_') ? '' : user.name);
    const [loading, setLoading] = useState(false);
    const [phone, setPhone] = useState(user.phone || '');
    const [showPhoneBinding, setShowPhoneBinding] = useState(!!user.phone);
    const [schoolSearch, setSchoolSearch] = useState('');

    const cities = REGIONS.find(p => p.id === provinceId)?.cities || [];
    const districts = cities.find(c => c.id === cityId)?.districts || [];
    const availableSchools = SCHOOLS.filter(s => s.district === districtId && s.type === schoolType);
    const filteredSchools = schoolSearch.trim() ? availableSchools.filter(s => s.name.includes(schoolSearch.trim())) : availableSchools;
    const selectedSchoolName = SCHOOLS.find(s => s.id === schoolId)?.name || '';

    useEffect(() => { if (provinceId && provinceId !== user.province) { setCityId(''); setDistrictId(''); } }, [provinceId]);
    useEffect(() => { if (cityId && cityId !== user.city) { setDistrictId(''); } }, [cityId]);
    useEffect(() => {
        const isInitialLoad = (user.schoolId === schoolId && user.district === districtId);
        if (!isInitialLoad && districtId !== user.district) { setSchoolId(''); }
    }, [districtId, schoolType]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!provinceId || !cityId || !districtId || !schoolId || !nickname) { alert('请完整填写所有信息'); return; }
        setLoading(true);
        try {
            const selectedSchool = SCHOOLS.find(s => s.id === schoolId);
            const updates = { name: nickname, province: provinceId, city: cityId, district: districtId, schoolId, schoolName: selectedSchool?.name, grade, phone: phone || undefined };
            if (user.id) await dbService.updateProfile(user.id, updates);
            onComplete();
        } catch (err) { console.error(err); alert('保存失败，请重试'); }
        finally { setLoading(false); }
    };

    const selectCls = "w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium outline-none focus:border-blue-400/50 transition-colors appearance-none";
    const sectionCls = "space-y-3 p-4 glass-light rounded-xl";

    return (
        <div className="flex flex-col items-center justify-start min-h-[80vh] px-1 pt-12">
            <div className="w-full max-w-lg glass-light rounded-2xl p-5 border border-white/10">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-1">完善个人资料</h2>
                    <p className="text-white/30 text-sm">设置你的学校和年级，参与排名</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Nickname */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-white/40 ml-1">昵称</label>
                        <input
                            value={nickname}
                            onChange={e => setNickname(e.target.value)}
                            placeholder="给自己取个名字"
                            className="w-full p-3 bg-white/5 rounded-xl border border-white/10 focus:border-blue-400/50 text-white text-sm font-medium outline-none transition-all placeholder:text-white/15"
                            required
                        />
                    </div>

                    {/* Location */}
                    <div className={sectionCls}>
                        <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-blue-400" />
                            <h3 className="text-sm font-semibold text-white/60">选择地区</h3>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <select value={provinceId} onChange={e => setProvinceId(e.target.value)} className={selectCls}>
                                <option value="">省份</option>
                                {REGIONS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </select>
                            <select value={cityId} onChange={e => setCityId(e.target.value)} className={selectCls} disabled={!provinceId}>
                                <option value="">城市</option>
                                {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <select value={districtId} onChange={e => setDistrictId(e.target.value)} className={selectCls} disabled={!cityId}>
                                <option value="">区县</option>
                                {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* School */}
                    <div className={sectionCls}>
                        <div className="flex items-center gap-2">
                            <SchoolIcon size={14} className="text-emerald-400" />
                            <h3 className="text-sm font-semibold text-white/60">选择学校</h3>
                        </div>
                        <div className="flex gap-1.5">
                            {(['primary', 'junior', 'senior'] as const).map(type => (
                                <button key={type} type="button" onClick={() => setSchoolType(type)}
                                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${schoolType === type ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-white/30 hover:text-white/50'}`}>
                                    {type === 'primary' ? '小学' : type === 'junior' ? '初中' : '高中'}
                                </button>
                            ))}
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/15" size={14} />
                            <input type="text" value={schoolSearch} onChange={e => setSchoolSearch(e.target.value)}
                                placeholder={!districtId ? '请先选择地区' : `搜索学校（共${availableSchools.length}所）`}
                                disabled={!districtId}
                                className="w-full p-2.5 pl-8 rounded-lg bg-white/5 border border-white/8 text-sm text-white font-medium outline-none focus:border-emerald-400/40 transition-colors placeholder:text-white/15 disabled:opacity-30"
                            />
                        </div>
                        {districtId && (
                            <div className="max-h-32 overflow-y-auto rounded-lg bg-white/3 border border-white/5 divide-y divide-white/5 scrollbar-hide">
                                {filteredSchools.length === 0 ? (
                                    <div className="p-3 text-center text-xs text-white/20">{schoolSearch ? '没有匹配的学校' : '该地区暂无录入学校'}</div>
                                ) : (
                                    filteredSchools.map(s => (
                                        <button key={s.id} type="button" onClick={() => { setSchoolId(s.id); setSchoolSearch(''); }}
                                            className={`w-full text-left p-2.5 text-xs font-medium transition-colors ${schoolId === s.id ? 'bg-emerald-500/10 text-emerald-400' : 'text-white/50 hover:bg-white/5'}`}>
                                            {s.name}
                                            {schoolId === s.id && <CheckCircle className="inline ml-1.5 text-emerald-400" size={12} />}
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                        {schoolId && <p className="text-[10px] text-emerald-400/70 ml-1">✓ 已选择：{selectedSchoolName}</p>}
                    </div>

                    {/* Grade */}
                    <div className={sectionCls}>
                        <div className="flex items-center gap-2">
                            <GraduationCap size={14} className="text-amber-400" />
                            <h3 className="text-sm font-semibold text-white/60">选择年级</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter(g => {
                                if (schoolType === 'primary') return g <= 6;
                                if (schoolType === 'junior') return g >= 7 && g <= 9;
                                return g >= 10;
                            }).map(g => (
                                <button key={`grade-${g}`} type="button" onClick={() => setGrade(g)}
                                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${grade === g ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-white/5 text-white/30 hover:text-white/50'}`}>
                                    {g > 9 ? `高${g - 9}` : g > 6 ? `初${g - 6}` : `${g}年级`}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Phone */}
                    <div className={sectionCls}>
                        <button type="button" onClick={() => setShowPhoneBinding(!showPhoneBinding)} className="flex items-center gap-2 w-full">
                            <Smartphone size={14} className="text-purple-400" />
                            <h3 className="text-sm font-semibold text-white/60">绑定手机号</h3>
                            <span className="text-[10px] text-white/20 ml-1">（可选）</span>
                            <ChevronDown size={14} className={`ml-auto text-white/20 transition-transform ${showPhoneBinding ? 'rotate-180' : ''}`} />
                        </button>
                        {showPhoneBinding && (
                            <div>
                                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                                    placeholder="请输入手机号"
                                    className="w-full p-3 bg-white/5 rounded-xl border border-white/10 focus:border-purple-400/50 text-white text-sm font-medium outline-none transition-all placeholder:text-white/15"
                                />
                                <p className="text-[10px] text-white/20 mt-1 ml-1">绑定手机号后可用于找回密码</p>
                            </div>
                        )}
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-40 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 glow-blue">
                        {loading ? '保存中...' : (user.schoolId ? '保存修改' : '完成设置')}
                        <CheckCircle size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileSetup;
