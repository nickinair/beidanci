
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// ── Local cache (fallback when Supabase is unreachable) ──────────────────────
const LS_AUTH_KEY = 'wordChallenge_auth_accounts';

interface CachedAccount {
    username: string;
    passwordHash: string;
}

function getCached(): CachedAccount[] {
    try { return JSON.parse(localStorage.getItem(LS_AUTH_KEY) || '[]'); } catch { return []; }
}

function saveToCache(username: string, passwordHash: string) {
    const accounts = getCached().filter(a => a.username !== username);
    accounts.push({ username, passwordHash });
    localStorage.setItem(LS_AUTH_KEY, JSON.stringify(accounts));
}

// ── Simple deterministic hash (NOT production-safe, demo only) ───────────────
function simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }
    return hash.toString(36);
}

// ── Helper: Promise with timeout ─────────────────────────────────────────────
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), ms)
        ),
    ]);
}

// ── Auth Service ─────────────────────────────────────────────────────────────
export const authService = {
    /**
     * Register a new account.
     * Saves to Supabase and caches locally.
     */
    async register(username: string, password: string): Promise<boolean> {
        if (username.length < 2) throw new Error('用户名至少需要2个字符');
        if (password.length < 4) throw new Error('密码至少需要4位');

        const hash = simpleHash(password);

        if (supabase) {
            // Check if username already taken in Supabase
            const checkResult = await withTimeout<{ data: any; error: any }>(
                Promise.resolve(supabase.from('profiles').select('id').eq('name', username).maybeSingle()),
                6000
            );
            if (checkResult.data) throw new Error('该用户名已被注册');

            // Create profile with password_hash
            const insertResult = await withTimeout<{ error: any }>(
                Promise.resolve(supabase.from('profiles').insert([{ name: username, password_hash: hash }])),
                6000
            );
            if (insertResult.error) throw new Error('注册失败，请稍后重试');
        } else {
            // Offline: check local cache
            const cached = getCached();
            if (cached.some(a => a.username === username)) throw new Error('该用户名已被注册（本地）');
        }

        // Cache locally for offline fallback
        saveToCache(username, hash);
        return true;
    },

    /**
     * Login — verifies credentials against Supabase first, then local cache.
     */
    async login(username: string, password: string): Promise<boolean> {
        const hash = simpleHash(password);

        if (supabase) {
            try {
                const { data: profile, error } = await withTimeout<{ data: any; error: any }>(
                    Promise.resolve(supabase.from('profiles').select('password_hash').eq('name', username).maybeSingle()),
                    6000
                );

                if (error) throw error;
                if (!profile) throw new Error('用户名不存在');

                // Handle legacy accounts created before password_hash was added
                if (!profile.password_hash) {
                    // Set password on first login for old accounts
                    await supabase.from('profiles')
                        .update({ password_hash: hash })
                        .eq('name', username);
                    saveToCache(username, hash);
                    return true;
                }

                if (profile.password_hash !== hash) throw new Error('密码错误');

                // Refresh local cache
                saveToCache(username, hash);
                return true;
            } catch (err: any) {
                if (err.message === 'timeout') {
                    console.warn('[Auth] Supabase timeout, falling back to local cache');
                    // Fall through to local cache below
                } else {
                    throw err; // Real errors (wrong password, no user) bubble up
                }
            }
        }

        // Offline / timeout fallback: check local cache
        const cached = getCached();
        const account = cached.find(a => a.username === username);
        if (!account) throw new Error('用户名不存在（网络不可用，请联网后重试）');
        if (account.passwordHash !== hash) throw new Error('密码错误');
        return true;
    },

    /**
     * Check if username is taken (used during registration).
     */
    async checkUsername(username: string): Promise<boolean> {
        if (supabase) {
            try {
                const { data } = await withTimeout<{ data: any; error: any }>(
                    Promise.resolve(supabase.from('profiles').select('id').eq('name', username).maybeSingle()),
                    4000
                );
                return !!data;
            } catch {
                // timeout → fallback to local
            }
        }
        return getCached().some(a => a.username === username);
    },
};
