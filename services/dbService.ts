
import { supabase } from './supabaseClient';
import { UserProfile, QuizResult, PointRecord } from '../types';
import { SCHOOLS } from '../data/schools';

// Constants for LocalStorage keys
const LS_KEYS = {
    PROFILES: 'wordChallenge_profiles',
    HISTORY: 'wordChallenge_history',
    POINTS: 'wordChallenge_points',
    PENDING_HISTORY: 'wordChallenge_pending_history',
    PENDING_POINTS: 'wordChallenge_pending_points',
    PENDING_PROFILES: 'wordChallenge_pending_profiles',
};

// Helper: race a promise against a timeout
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))
    ]);
}

export const dbService = {
    /**
     * Helper to get local data
     */
    _getLocalData(key: string) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    },

    /**
     * Helper to set local data
     */
    _setLocalData(key: string, data: any) {
        localStorage.setItem(key, JSON.stringify(data));
    },

    /**
     * Login or Register a user by username
     */
    async loginOrRegister(username: string, avatar: string = ''): Promise<UserProfile> {
        // Generate a consistently random avatar based on username if not provided
        if (!avatar) {
            const seed = username;
            avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
        }

        if (!supabase) {
            console.log('Offline Mode: loginOrRegister');
            const profiles = this._getLocalData(LS_KEYS.PROFILES);
            let profile = profiles.find((p: any) => p.name === username || p.username === username);

            if (!profile) {
                profile = {
                    id: 'local_' + Date.now(),
                    name: username,
                    username,
                    avatar,
                    created_at: new Date().toISOString()
                };
                profiles.push(profile);
                this._setLocalData(LS_KEYS.PROFILES, profiles);
            }

            const history = await this.fetchUserHistory(profile.id);
            const pointRecords = await this.fetchPointRecords(profile.id);
            const totalPointsObj = await this.fetchUserTotalPoints(profile.id);

            return {
                ...profile,
                totalPoints: totalPointsObj?.total_points || 0,
                highScore: 0,
                history,
                pointRecords
            } as any;
        }

        try {
            // Wrap entire Supabase flow in a 6s timeout
            return await withTimeout((async () => {
                console.log('[DB] loginOrRegister (Supabase): checking for user', username);

                let { data: profile, error } = await supabase!
                    .from('profiles')
                    .select('*')
                    .eq('name', username)
                    .maybeSingle();

                if (error) {
                    console.error('[DB] Error checking user:', error);
                    throw error;
                }

                if (!profile) {
                    console.log('[DB] Creating new Supabase profile...');
                    const { data: newProfile, error: createError } = await supabase!
                        .from('profiles')
                        .insert([{ name: username, avatar }])
                        .select()
                        .single();

                    if (createError) {
                        console.error('[DB] Error creating profile:', createError);
                        throw createError;
                    }
                    console.log('[DB] Profile created:', newProfile?.id);
                    profile = newProfile;
                } else {
                    console.log('[DB] Existing profile found:', profile.id);
                }

                // Sync any pending data from offline sessions - wait for it to finish
                await this._syncPendingData(profile.id, username).catch(() => { });

                const [history, pointRecords, leaderboardEntry] = await Promise.all([
                    this.fetchUserHistory(profile.id),
                    this.fetchPointRecords(profile.id),
                    this.fetchUserTotalPoints(profile.id)
                ]);

                const totalPoints = leaderboardEntry?.total_points || profile.total_points || 0;

                return {
                    id: profile.id,
                    name: profile.name,
                    username: profile.name,
                    avatar: profile.avatar,
                    province: profile.province,
                    city: profile.city,
                    district: profile.district,
                    schoolId: profile.school_id,
                    schoolName: profile.school_name,
                    grade: profile.grade,
                    lastCheckIn: profile.last_check_in,
                    checkInStreak: profile.check_in_streak || 0,
                    totalPoints,
                    highScore: profile.high_score || 0,
                    history,
                    pointRecords
                } as any;
            })(), 6000);
        } catch (err: any) {
            console.warn('[DB] Supabase loginOrRegister failed/timed out, using offline profile:', err.message);
            // Fall back: create/load local profile, mark for later sync
            const profiles = this._getLocalData(LS_KEYS.PROFILES);
            let profile = profiles.find((p: any) => p.name === username || p.username === username);
            if (!profile) {
                profile = {
                    id: 'local_' + Date.now(),
                    name: username,
                    username,
                    avatar,
                    created_at: new Date().toISOString(),
                    _pendingSupabaseCreate: true,
                };
                profiles.push(profile);
                this._setLocalData(LS_KEYS.PROFILES, profiles);
                // Queue for later Supabase sync
                const pending = this._getLocalData(LS_KEYS.PENDING_PROFILES);
                pending.push({ name: username, avatar });
                this._setLocalData(LS_KEYS.PENDING_PROFILES, pending);
            }
            const history = await this.fetchUserHistory(profile.id);
            const pointRecords = await this.fetchPointRecords(profile.id);
            const totalPointsObj = await this.fetchUserTotalPoints(profile.id);
            return {
                ...profile,
                totalPoints: totalPointsObj?.total_points || 0,
                highScore: 0,
                history,
                pointRecords
            } as any;
        }
    },

    /**
     * Update User Profile (Location, School, etc)
     */
    async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
        // Also save to local storage for extended profile persistence
        const extendedKey = `ext_profile_${userId}`;
        const existing = JSON.parse(localStorage.getItem(extendedKey) || '{}');
        localStorage.setItem(extendedKey, JSON.stringify({ ...existing, ...updates }));

        if (!supabase) {
            const profiles = this._getLocalData(LS_KEYS.PROFILES);
            const index = profiles.findIndex((p: any) => p.id === userId);
            if (index !== -1) {
                profiles[index] = { ...profiles[index], ...updates };
                this._setLocalData(LS_KEYS.PROFILES, profiles);
            }
            return;
        }

        // Map UserProfile fields to DB column names
        const dbUpdates: Record<string, any> = {};
        if (updates.province !== undefined) dbUpdates.province = updates.province;
        if (updates.city !== undefined) dbUpdates.city = updates.city;
        if (updates.district !== undefined) dbUpdates.district = updates.district;
        if (updates.schoolId !== undefined) dbUpdates.school_id = updates.schoolId;
        if (updates.schoolName !== undefined) dbUpdates.school_name = updates.schoolName;
        if (updates.grade !== undefined) dbUpdates.grade = updates.grade;
        // profiles.total_points is the authoritative running balance.
        // It is updated atomically here whenever points change.
        if (updates.totalPoints !== undefined) dbUpdates.total_points = updates.totalPoints;
        if (updates.highScore !== undefined) dbUpdates.high_score = updates.highScore;
        if (updates.lastCheckIn !== undefined) dbUpdates.last_check_in = updates.lastCheckIn;
        if (updates.checkInStreak !== undefined) dbUpdates.check_in_streak = updates.checkInStreak;
        if (updates.avatar !== undefined) dbUpdates.avatar = updates.avatar;

        if (Object.keys(dbUpdates).length === 0) return;

        try {
            const { error } = await supabase
                .from('profiles')
                .update(dbUpdates)
                .eq('id', userId);

            if (error) {
                console.error('Failed to update profile in Supabase:', error);
            }
        } catch (err) {
            console.error('Supabase updateProfile error:', err);
        }
    },

    // Helper to merge extended profile
    getExtendedProfile(userId: string) {
        return JSON.parse(localStorage.getItem(`ext_profile_${userId}`) || '{}');
    },

    /**
     * Save a quiz result and update points
     * Strategy: always save locally first, then try Supabase in background
     */
    async saveQuizResult(userId: string, result: QuizResult): Promise<void> {
        const historyRecord = {
            user_id: userId,
            score: result.score,
            total_questions: result.totalQuestions,
            correct_count: result.correctCount,
            time_spent: result.timeSpent,
            points_earned: result.pointsEarned,
            attempts: result.attempts,
            timestamp: new Date(result.timestamp).toISOString()
        };
        const pointRecord = result.pointsEarned > 0 ? {
            user_id: userId,
            amount: result.pointsEarned,
            reason: `挑战成绩: ${result.score}分`,
            timestamp: new Date(result.timestamp).toISOString()
        } : null;

        // 1. Always save locally first (guaranteed, instant)
        const localHistory = this._getLocalData(LS_KEYS.HISTORY);
        localHistory.push(historyRecord);
        this._setLocalData(LS_KEYS.HISTORY, localHistory);
        if (pointRecord) {
            const localPoints = this._getLocalData(LS_KEYS.POINTS);
            localPoints.push(pointRecord);
            this._setLocalData(LS_KEYS.POINTS, localPoints);
        }

        if (!supabase || userId.startsWith('local_')) {
            // Queue for later sync when online
            const pending = this._getLocalData(LS_KEYS.PENDING_HISTORY);
            pending.push(historyRecord);
            this._setLocalData(LS_KEYS.PENDING_HISTORY, pending);
            if (pointRecord) {
                const pendingPts = this._getLocalData(LS_KEYS.PENDING_POINTS);
                pendingPts.push(pointRecord);
                this._setLocalData(LS_KEYS.PENDING_POINTS, pendingPts);
            }
            return;
        }

        // 2. Try Supabase in background (non-blocking, fire-and-forget)
        (async () => {
            try {
                const result1 = await withTimeout(
                    Promise.resolve(supabase!.from('test_history').insert([historyRecord])),
                    8000
                );
                const historyError = (result1 as any).error;
                if (historyError) {
                    console.error('[DB] Failed to save history to Supabase:', historyError);
                    // Queue for retry
                    const pending = this._getLocalData(LS_KEYS.PENDING_HISTORY);
                    pending.push(historyRecord);
                    this._setLocalData(LS_KEYS.PENDING_HISTORY, pending);
                } else {
                    console.log('[DB] Quiz history saved to Supabase ✓');
                }

                if (pointRecord) {
                    const result2 = await withTimeout(
                        Promise.resolve(supabase!.from('user_points').insert([pointRecord])),
                        8000
                    );
                    const pointsError = (result2 as any).error;
                    if (pointsError) {
                        console.error('[DB] Failed to save points to Supabase:', pointsError);
                        const pendingPts = this._getLocalData(LS_KEYS.PENDING_POINTS);
                        pendingPts.push(pointRecord);
                        this._setLocalData(LS_KEYS.PENDING_POINTS, pendingPts);
                    } else {
                        console.log('[DB] Points saved to Supabase ✓');
                    }
                }
            } catch (err) {
                console.warn('[DB] Supabase saveQuizResult timed out, queued for sync:', err);
                const pending = this._getLocalData(LS_KEYS.PENDING_HISTORY);
                pending.push(historyRecord);
                this._setLocalData(LS_KEYS.PENDING_HISTORY, pending);
                if (pointRecord) {
                    const pendingPts = this._getLocalData(LS_KEYS.PENDING_POINTS);
                    pendingPts.push(pointRecord);
                    this._setLocalData(LS_KEYS.PENDING_POINTS, pendingPts);
                }
            }
        })();
    },

    /**
     * Save a single point record (e.g. redemption deduction, check-in bonus)
     * to the user_points table. Local-first with async Supabase sync.
     */
    async savePointRecord(userId: string, amount: number, reason: string): Promise<void> {
        const record = {
            user_id: userId,
            amount,
            reason,
            timestamp: new Date().toISOString(),
        };

        // Always persist locally first (both in history and in sync queue)
        const localPoints = this._getLocalData(LS_KEYS.POINTS);
        localPoints.push(record);
        this._setLocalData(LS_KEYS.POINTS, localPoints);

        const pending = this._getLocalData(LS_KEYS.PENDING_POINTS);
        pending.push(record);
        this._setLocalData(LS_KEYS.PENDING_POINTS, pending);

        if (!supabase) return;

        // Async push to Supabase
        (async () => {
            try {
                const result = await withTimeout(
                    Promise.resolve(supabase!.from('user_points').insert([record])),
                    8000
                );
                const error = (result as any).error;
                if (!error) {
                    // Remove from pending queue on success
                    const updated = this._getLocalData(LS_KEYS.PENDING_POINTS)
                        .filter((r: any) => !(r.user_id === userId && r.reason === reason && r.timestamp === record.timestamp));
                    this._setLocalData(LS_KEYS.PENDING_POINTS, updated);
                    console.log('[DB] Point record saved to Supabase ✓', reason);
                } else {
                    console.error('[DB] Failed to save point record:', error);
                }
            } catch (err) {
                console.warn('[DB] savePointRecord timed out, queued for sync:', err);
            }
        })();
    },

    /**
     * Sync any locally-queued data to Supabase (called after successful login)
     */
    async _syncPendingData(supabaseUserId: string, username: string): Promise<void> {
        if (!supabase) return;

        // Sync pending profiles (offline registrations)
        const pendingProfiles = this._getLocalData(LS_KEYS.PENDING_PROFILES);
        const myPending = pendingProfiles.filter((p: any) => p.name === username);
        if (myPending.length > 0) {
            console.log('[DB] No need to sync profile - already created in Supabase');
            // Clear pending profiles for this user
            const remaining = pendingProfiles.filter((p: any) => p.name !== username);
            this._setLocalData(LS_KEYS.PENDING_PROFILES, remaining);

            // Update local profile id to match Supabase
            const profiles = this._getLocalData(LS_KEYS.PROFILES);
            const idx = profiles.findIndex((p: any) => p.name === username);
            if (idx !== -1 && profiles[idx].id?.startsWith('local_')) {
                const oldId = profiles[idx].id;
                profiles[idx].id = supabaseUserId;
                this._setLocalData(LS_KEYS.PROFILES, profiles);

                // Fix user_id in pending history/points
                const ph = this._getLocalData(LS_KEYS.PENDING_HISTORY)
                    .map((r: any) => r.user_id === oldId ? { ...r, user_id: supabaseUserId } : r);
                this._setLocalData(LS_KEYS.PENDING_HISTORY, ph);
                const pp = this._getLocalData(LS_KEYS.PENDING_POINTS)
                    .map((r: any) => r.user_id === oldId ? { ...r, user_id: supabaseUserId } : r);
                this._setLocalData(LS_KEYS.PENDING_POINTS, pp);
            }
        }

        // Sync pending history
        const pendingHistory = this._getLocalData(LS_KEYS.PENDING_HISTORY)
            .filter((r: any) => r.user_id === supabaseUserId);
        if (pendingHistory.length > 0) {
            console.log(`[DB] Syncing ${pendingHistory.length} pending history records...`);
            try {
                const r1 = await withTimeout(
                    Promise.resolve(supabase!.from('test_history').insert(pendingHistory)),
                    10000
                );
                const error = (r1 as any).error;
                if (!error) {
                    const remaining = this._getLocalData(LS_KEYS.PENDING_HISTORY)
                        .filter((r: any) => r.user_id !== supabaseUserId);
                    this._setLocalData(LS_KEYS.PENDING_HISTORY, remaining);
                    console.log('[DB] Pending history synced ✓');
                }
            } catch (e) { console.warn('[DB] History sync failed:', e); }
        }

        // Sync pending points
        const pendingPoints = this._getLocalData(LS_KEYS.PENDING_POINTS)
            .filter((r: any) => r.user_id === supabaseUserId);
        if (pendingPoints.length > 0) {
            console.log(`[DB] Syncing ${pendingPoints.length} pending point records...`);
            try {
                const r2 = await withTimeout(
                    Promise.resolve(supabase!.from('user_points').insert(pendingPoints)),
                    10000
                );
                const error = (r2 as any).error;
                if (!error) {
                    const remaining = this._getLocalData(LS_KEYS.PENDING_POINTS)
                        .filter((r: any) => r.user_id !== supabaseUserId);
                    this._setLocalData(LS_KEYS.PENDING_POINTS, remaining);
                    console.log('[DB] Pending points synced ✓');
                }
            } catch (e) { console.warn('[DB] Points sync failed:', e); }
        }
    },

    /**
     * Fetch test history for a specific user
     */
    async fetchUserHistory(userId: string): Promise<QuizResult[]> {
        if (!supabase) {
            const allHistory = this._getLocalData(LS_KEYS.HISTORY);
            const userHistory = allHistory.filter((h: any) => h.user_id === userId);
            return userHistory.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((item: any) => ({
                    score: item.score,
                    totalQuestions: item.total_questions,
                    correctCount: item.correct_count,
                    timeSpent: item.time_spent,
                    pointsEarned: item.points_earned,
                    attempts: item.attempts,
                    timestamp: new Date(item.timestamp).getTime()
                }));
        }

        const { data, error } = await supabase
            .from('test_history')
            .select('*')
            .eq('user_id', userId)
            .order('timestamp', { ascending: false });

        if (error) throw error;

        return data.map(item => ({
            score: item.score,
            totalQuestions: item.total_questions,
            correctCount: item.correct_count,
            timeSpent: item.time_spent,
            pointsEarned: item.points_earned,
            attempts: item.attempts,
            timestamp: new Date(item.timestamp).getTime()
        }));
    },

    /**
     * Fetch point records for a specific user
     */
    async fetchPointRecords(userId: string): Promise<PointRecord[]> {
        if (!supabase) {
            const allPoints = this._getLocalData(LS_KEYS.POINTS);
            const userPoints = allPoints.filter((p: any) => p.user_id === userId);
            return userPoints.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((item: any) => ({
                    amount: item.amount,
                    reason: item.reason,
                    timestamp: new Date(item.timestamp).getTime()
                }));
        }

        const { data, error } = await supabase
            .from('user_points')
            .select('*')
            .eq('user_id', userId)
            .order('timestamp', { ascending: false });

        if (error) throw error;

        // Also merge local pending points that haven't been synced yet for UI consistency
        const pending = this._getLocalData(LS_KEYS.PENDING_POINTS)
            .filter((p: any) => p.user_id === userId);

        const combined = [...data, ...pending].sort((a: any, b: any) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        return combined.map(item => ({
            amount: item.amount,
            reason: item.reason,
            timestamp: new Date(item.timestamp).getTime()
        }));
    },

    /**
     * Fetch total points - uses profiles.total_points as the authoritative balance.
     * This field is explicitly written whenever points change (quiz, check-in, redemption),
     * making it the most reliable single source of truth.
     * The leaderboard table can accumulate incorrectly due to trigger double-fires
     * from pending-point syncs, so we avoid using it for the user's own balance.
     */
    async fetchUserTotalPoints(userId: string) {
        if (!supabase) {
            const allPoints = this._getLocalData(LS_KEYS.POINTS);
            const userPoints = allPoints.filter((p: any) => p.user_id === userId);
            const total = userPoints.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
            return { total_points: total };
        }

        // Primary source: profiles.total_points (explicitly maintained running balance)
        const profileRes = await supabase
            .from('profiles')
            .select('total_points')
            .eq('id', userId)
            .maybeSingle();

        return { total_points: profileRes.data?.total_points || 0 };
    },

    /**
     * Fetch global leaderboard
     */
    async fetchLeaderboard() {
        if (!supabase) {
            const profiles = this._getLocalData(LS_KEYS.PROFILES);
            const allPoints = this._getLocalData(LS_KEYS.POINTS);

            // Calculate total points for each user
            const leaderboard = profiles.map((p: any) => {
                const userPoints = allPoints.filter((rec: any) => rec.user_id === p.id);
                const total = userPoints.reduce((sum: number, rec: any) => sum + (rec.amount || 0), 0);
                return {
                    name: p.name,
                    avatar: p.avatar,
                    totalPoints: total,
                    highScore: 0 // Simplification for offline mode
                };
            });

            return leaderboard.sort((a: any, b: any) => b.totalPoints - a.totalPoints);
        }

        const { data, error } = await supabase
            .from('profiles')
            .select('name, avatar, high_score, total_points')
            .order('total_points', { ascending: false })
            .limit(50);

        if (error) throw error;

        return data.map(item => ({
            name: item.name,
            avatar: item.avatar,
            totalPoints: item.total_points || 0,
            highScore: item.high_score || 0
        }));
    },

    /**
     * Fetch all users (for the login screen previous users)
     */
    async fetchAllUsers(): Promise<UserProfile[]> {
        if (!supabase) {
            return this._getOfflineUsers();
        }

        try {
            // Create a timeout promise
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Connection timeout')), 5000);
            });

            // Race supabase fetch against timeout
            const fetchPromise = (async () => {
                const { data: profiles, error: pError } = await supabase
                    .from('profiles')
                    .select('*');

                if (pError) {
                    if (pError.code === 'PGRST205') {
                        throw new Error('数据库表 "profiles" 不存在，请确保您已在 Supabase 中运行了初始化 SQL。');
                    }
                    throw pError;
                }

                const { data: leaderboard, error: lError } = await supabase
                    .from('leaderboard')
                    .select('*');

                if (lError) throw lError;

                return { profiles, leaderboard };
            })();

            const result = await Promise.race([fetchPromise, timeoutPromise]) as any;
            const { profiles, leaderboard } = result;

            return profiles.map((p: any) => {
                return {
                    id: p.id,
                    name: p.name,
                    avatar: p.avatar,
                    province: p.province,
                    city: p.city,
                    schoolId: p.school_id,
                    schoolName: p.school_name,
                    grade: p.grade,
                    // Use profiles.total_points as authoritative balance (consistently maintained).
                    // The leaderboard table can be corrupted by trigger double-fires.
                    totalPoints: p.total_points || 0,
                    highScore: p.high_score || 0,
                    history: [],
                    pointRecords: [],
                    wrongQuestions: []
                };
            });
        } catch (error) {
            console.warn('Supabase fetch failed or timed out, falling back to offline mode:', error);
            return this._getOfflineUsers();
        }
    },

    _getOfflineUsers() {
        const profiles = this._getLocalData(LS_KEYS.PROFILES);
        const allPoints = this._getLocalData(LS_KEYS.POINTS);

        // --- Mock Data Injection for Leaderboard ---
        // If we have very few users, generate some mock users from our schools list
        if (profiles.length < 50) {
            const adjectives = ['Happy', 'Smart', 'Fast', 'Cool', 'Bright', 'Brave', 'Super', 'Mega', 'Ultra', 'Wonder'];
            const nouns = ['Student', 'Learner', 'Tiger', 'Panda', 'Eagle', 'Dragon', 'Star', 'Hero', 'Wizard', 'Ninja'];

            const newProfiles = [...profiles];
            const newPoints = [...allPoints];

            for (let i = profiles.length; i < 50; i++) {
                const randomSchool = SCHOOLS[Math.floor(Math.random() * SCHOOLS.length)];
                const randomName = `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${Math.floor(Math.random() * 100)}`;
                const seed = Math.random().toString(36).substring(7);

                const mockUser = {
                    id: `mock_${Date.now()}_${i}`,
                    name: randomName,
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`,
                    province: randomSchool.province,
                    city: randomSchool.city,
                    district: randomSchool.district,
                    schoolId: randomSchool.id,
                    schoolName: randomSchool.name,
                    grade: Math.floor(Math.random() * 6) + 1, // 1-6 for primary demo
                    created_at: new Date().toISOString()
                };

                newProfiles.push(mockUser);

                // Add some random points
                const points = Math.floor(Math.random() * 5000) + 1000;
                newPoints.push({
                    user_id: mockUser.id,
                    amount: points,
                    reason: '初始积分',
                    timestamp: new Date().toISOString()
                });
            }

            // Persist mock data so it doesn't change on reload
            this._setLocalData(LS_KEYS.PROFILES, newProfiles);
            this._setLocalData(LS_KEYS.POINTS, newPoints);

            // Return updated list
            return newProfiles.map((p: any) => {
                const userPoints = newPoints.filter((rec: any) => rec.user_id === p.id);
                const total = userPoints.reduce((sum: number, rec: any) => sum + (rec.amount || 0), 0);
                return {
                    id: p.id,
                    name: p.name,
                    avatar: p.avatar,
                    province: p.province,
                    city: p.city,
                    schoolId: p.schoolId,
                    schoolName: p.schoolName,
                    grade: p.grade,
                    totalPoints: total,
                    highScore: 0,
                    history: [],
                    pointRecords: [],
                    wrongQuestions: []
                };
            });
        }

        return profiles.map((p: any) => {
            const userPoints = allPoints.filter((rec: any) => rec.user_id === p.id);
            const total = userPoints.reduce((sum: number, rec: any) => sum + (rec.amount || 0), 0);
            return {
                id: p.id,
                name: p.name,
                avatar: p.avatar,
                province: p.province,
                city: p.city,
                schoolId: p.schoolId,
                schoolName: p.schoolName,
                grade: p.grade,
                totalPoints: total,
                highScore: 0,
                history: [],
                pointRecords: [],
                wrongQuestions: []
            };
        });
    },

    /**
     * Save a wrong question to local storage (or DB if we had a table)
     */
    async saveWrongQuestion(userId: string, question: any, userAnswer: string) {
        // For now, always use local storage for Error Book to avoid schema changes
        const key = `wrong_questions_${userId}`;
        const current = JSON.parse(localStorage.getItem(key) || '[]');

        // Check if already exists
        if (!current.some((q: any) => q.word.id === question.word.id)) {
            current.push({
                id: Date.now().toString(),
                word: question.word,
                userAnswer,
                timestamp: Date.now()
            });
            localStorage.setItem(key, JSON.stringify(current));
        }
    },

    /**
     * Get wrong questions for a user
     */
    async getWrongQuestions(userId: string) {
        const key = `wrong_questions_${userId}`;
        return JSON.parse(localStorage.getItem(key) || '[]');
    },

    /**
     * Remove a wrong question (when answered correctly)
     */
    async removeWrongQuestion(userId: string, wordId: string) {
        const key = `wrong_questions_${userId}`;
        const current = JSON.parse(localStorage.getItem(key) || '[]');
        const updated = current.filter((q: any) => q.word.id !== wordId);
        localStorage.setItem(key, JSON.stringify(updated));
    },

    /**
     * Fetch rankings by scope
     */
    async fetchRankings(scope: 'school' | 'city' | 'province' | 'global', currentUser: UserProfile) {
        const allUsers = await this.fetchAllUsers();

        let filtered = allUsers;
        if (scope === 'school' && currentUser.schoolId) {
            filtered = allUsers.filter(u => u.schoolId === currentUser.schoolId);
        } else if (scope === 'city' && currentUser.city) {
            filtered = allUsers.filter(u => u.city === currentUser.city);
        } else if (scope === 'province' && currentUser.province) {
            filtered = allUsers.filter(u => u.province === currentUser.province);
        }

        return filtered.sort((a, b) => b.totalPoints - a.totalPoints).slice(0, 100);
    }
};
