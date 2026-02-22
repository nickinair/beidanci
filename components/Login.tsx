import React, { useState } from 'react';
import { User, Lock, ArrowRight, ShieldCheck, UserPlus, LogIn } from 'lucide-react';
import { authService } from '../services/authService';

interface LoginProps {
  onLogin: (username: string) => void;
}

type Mode = 'login' | 'register';

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<Mode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username || !password) { setError('请输入用户名和密码'); return; }
    setLoading(true);
    try {
      await authService.login(username, password);
      onLogin(username);
    } catch (err: any) {
      setError(err.message || '登录失败');
    } finally { setLoading(false); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username || !password) { setError('请输入用户名和密码'); return; }
    if (password !== confirmPassword) { setError('两次密码输入不一致'); return; }
    if (!agreed) { setError('请先阅读并同意隐私协议'); return; }
    setLoading(true);
    try {
      await authService.register(username, password);
      onLogin(username);
    } catch (err: any) {
      setError(err.message || '注册失败');
    } finally { setLoading(false); }
  };

  const inputCls = "w-full bg-white/5 border border-white/10 focus:border-blue-400/60 focus:bg-white/8 p-4 pl-12 rounded-xl text-base font-medium outline-none transition-all placeholder:text-white/20 text-white";

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-2">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-4xl font-bold gradient-text mb-2">英榜</h1>
          <p className="text-white/40 text-sm font-medium">
            {mode === 'login' ? '登录账号，查看你的英语排名' : '创建账号，开始你的英语之旅'}
          </p>
        </div>

        <div className="glass-light rounded-2xl p-6 space-y-5">
          {/* Tab Switcher */}
          <div className="flex bg-white/5 rounded-xl p-1 gap-1">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === 'login' ? 'bg-white/10 text-white shadow-sm' : 'text-white/30 hover:text-white/50'}`}
            >
              <LogIn size={14} /> 登录
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === 'register' ? 'bg-white/10 text-white shadow-sm' : 'text-white/30 hover:text-white/50'}`}
            >
              <UserPlus size={14} /> 注册
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium p-3 rounded-xl text-center">
              {error}
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value.trim())} placeholder="请输入用户名" className={inputCls} autoComplete="username" />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="请输入密码" className={inputCls} autoComplete="current-password" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-40 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 glow-blue">
                {loading ? '登录中...' : '立即登录'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value.trim())} placeholder="设置用户名（至少2个字符）" className={inputCls} autoComplete="username" />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="设置密码（至少4位）" className={inputCls} autoComplete="new-password" />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="确认密码" className={inputCls} autoComplete="new-password" />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${agreed ? 'bg-blue-500 border-blue-500' : 'border-white/20 hover:border-white/40'}`}>
                  {agreed && <ShieldCheck className="w-3 h-3 text-white" />}
                </div>
                <input type="checkbox" className="hidden" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                <span className="text-xs text-white/30 font-medium">
                  我已阅读并同意 <span className="text-blue-400">《用户隐私协议》</span>
                </span>
              </label>
              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:opacity-40 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 glow-green">
                {loading ? '注册中...' : '立即注册'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
