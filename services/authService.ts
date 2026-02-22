
// Auth Service — Username/Password based
const LS_AUTH_KEY = 'wordChallenge_auth_accounts';

interface AuthAccount {
    username: string;
    passwordHash: string; // Simple hash for demo
    createdAt: string;
}

// Simple string hash for demo purposes (NOT production-safe)
function simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }
    return hash.toString(36);
}

function getAccounts(): AuthAccount[] {
    const data = localStorage.getItem(LS_AUTH_KEY);
    return data ? JSON.parse(data) : [];
}

function saveAccounts(accounts: AuthAccount[]) {
    localStorage.setItem(LS_AUTH_KEY, JSON.stringify(accounts));
}

export const authService = {
    /**
     * Check if a username is already taken
     */
    async checkUsername(username: string): Promise<boolean> {
        await new Promise(resolve => setTimeout(resolve, 200));
        const accounts = getAccounts();
        return accounts.some(a => a.username === username);
    },

    /**
     * Register a new account
     */
    async register(username: string, password: string): Promise<boolean> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const accounts = getAccounts();

        if (accounts.some(a => a.username === username)) {
            throw new Error('该用户名已被注册');
        }

        if (username.length < 2) {
            throw new Error('用户名至少需要2个字符');
        }

        if (password.length < 4) {
            throw new Error('密码至少需要4位');
        }

        accounts.push({
            username,
            passwordHash: simpleHash(password),
            createdAt: new Date().toISOString()
        });
        saveAccounts(accounts);
        return true;
    },

    /**
     * Login with username and password
     */
    async login(username: string, password: string): Promise<boolean> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const accounts = getAccounts();
        const account = accounts.find(a => a.username === username);

        if (!account) {
            throw new Error('用户名不存在');
        }

        if (account.passwordHash !== simpleHash(password)) {
            throw new Error('密码错误');
        }

        return true;
    }
};
