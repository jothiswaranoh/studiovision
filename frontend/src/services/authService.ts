import { User, AuthCredentials, SignupData, AuthResponse, Session } from '../types/auth';

/**
 * Authentication Service
 * Handles user authentication, registration, and session management
 * Uses localStorage for demo purposes
 */

const STORAGE_KEYS = {
    USERS: 'visual_ide_users',
    CURRENT_SESSION: 'visual_ide_session',
    ADMIN_SEEDED: 'visual_ide_admin_seeded',
};

const ADMIN_CREDENTIALS = {
    email: 'admin@hashagile.com',
    password: 'admin@123',
};

// Simple password hashing (for demo - use bcrypt in production)
function hashPassword(password: string): string {
    return btoa(password + 'salt_key_visual_ide');
}

function verifyPassword(password: string, hash: string): boolean {
    return hashPassword(password) === hash;
}

// Generate unique ID
function generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Seed admin account on first load
function seedAdminAccount(): void {
    const seeded = localStorage.getItem(STORAGE_KEYS.ADMIN_SEEDED);
    if (seeded) return;

    const users = getAllUsers();
    const adminExists = users.some(u => u.email === ADMIN_CREDENTIALS.email);

    if (!adminExists) {
        const admin: User = {
            id: 'admin_001',
            email: ADMIN_CREDENTIALS.email,
            name: 'Admin User',
            role: 'admin',
            onboardingComplete: true,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
        };

        // Store admin with hashed password
        const userWithPassword = {
            ...admin,
            passwordHash: hashPassword(ADMIN_CREDENTIALS.password),
        };

        users.push(userWithPassword);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        localStorage.setItem(STORAGE_KEYS.ADMIN_SEEDED, 'true');

        console.log('✅ Admin account created:', ADMIN_CREDENTIALS.email);
    }
}

// Initialize on module load
seedAdminAccount();

// Get all users from storage
function getAllUsers(): any[] {
    const usersJson = localStorage.getItem(STORAGE_KEYS.USERS);
    return usersJson ? JSON.parse(usersJson) : [];
}

// Save users to storage
function saveUsers(users: any[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

// Get current session
function getCurrentSession(): Session | null {
    const sessionJson = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
    if (!sessionJson) return null;

    const session: Session = JSON.parse(sessionJson);

    // Check if session expired
    if (new Date(session.expiresAt) < new Date()) {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
        return null;
    }

    return session;
}

// Create session
function createSession(userId: string): Session {
    const session: Session = {
        userId,
        token: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    };

    localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(session));
    return session;
}

/**
 * Login user
 */
export async function login(credentials: AuthCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const users = getAllUsers();
    const userWithPassword = users.find(u => u.email === credentials.email);

    if (!userWithPassword) {
        return {
            success: false,
            error: 'Invalid email or password',
        };
    }

    if (!verifyPassword(credentials.password, userWithPassword.passwordHash)) {
        return {
            success: false,
            error: 'Invalid email or password',
        };
    }

    // Update last login
    userWithPassword.lastLogin = new Date().toISOString();
    saveUsers(users);

    // Create session
    createSession(userWithPassword.id);

    // Return user without password
    const { passwordHash, ...user } = userWithPassword;

    return {
        success: true,
        user: user as User,
    };
}

/**
 * Signup new user
 */
export async function signup(data: SignupData): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const users = getAllUsers();

    // Check if email already exists
    if (users.some(u => u.email === data.email)) {
        return {
            success: false,
            error: 'Email already registered',
        };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        return {
            success: false,
            error: 'Invalid email format',
        };
    }

    // Validate password strength
    if (data.password.length < 6) {
        return {
            success: false,
            error: 'Password must be at least 6 characters',
        };
    }

    // Create new user
    const newUser: User = {
        id: generateId(),
        email: data.email,
        name: data.name,
        role: 'user',
        onboardingComplete: false,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
    };

    // Store with hashed password
    const userWithPassword = {
        ...newUser,
        passwordHash: hashPassword(data.password),
    };

    users.push(userWithPassword);
    saveUsers(users);

    // Create session
    createSession(newUser.id);

    return {
        success: true,
        user: newUser,
    };
}

/**
 * Logout user
 */
export function logout(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
}

/**
 * Get current authenticated user
 */
export function getCurrentUser(): User | null {
    const session = getCurrentSession();
    if (!session) return null;

    const users = getAllUsers();
    const userWithPassword = users.find(u => u.id === session.userId);

    if (!userWithPassword) {
        logout();
        return null;
    }

    const { passwordHash, ...user } = userWithPassword;
    return user as User;
}

/**
 * Update user profile
 */
export async function updateUser(userId: string, updates: Partial<User>): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const users = getAllUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        return {
            success: false,
            error: 'User not found',
        };
    }

    // Update user
    users[userIndex] = {
        ...users[userIndex],
        ...updates,
        id: userId, // Prevent ID change
        role: users[userIndex].role, // Prevent role change
    };

    saveUsers(users);

    const { passwordHash, ...user } = users[userIndex];

    return {
        success: true,
        user: user as User,
    };
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
    return getCurrentSession() !== null;
}

/**
 * Check if user is admin
 */
export function isAdmin(): boolean {
    const user = getCurrentUser();
    return user?.role === 'admin';
}
