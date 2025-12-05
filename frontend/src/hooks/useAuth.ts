import { useState, useEffect, useCallback } from 'react';
import { User, AuthCredentials, SignupData } from '../types/auth';
import * as authService from '../services/authService';

/**
 * Authentication hook
 * Provides authentication state and methods
 */

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load current user on mount
    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setLoading(false);
    }, []);

    // Login
    const login = useCallback(async (credentials: AuthCredentials) => {
        setLoading(true);
        setError(null);

        const response = await authService.login(credentials);

        if (response.success && response.user) {
            setUser(response.user);
            setLoading(false);
            return { success: true };
        } else {
            setError(response.error || 'Login failed');
            setLoading(false);
            return { success: false, error: response.error };
        }
    }, []);

    // Signup
    const signup = useCallback(async (data: SignupData) => {
        setLoading(true);
        setError(null);

        const response = await authService.signup(data);

        if (response.success && response.user) {
            setUser(response.user);
            setLoading(false);
            return { success: true };
        } else {
            setError(response.error || 'Signup failed');
            setLoading(false);
            return { success: false, error: response.error };
        }
    }, []);

    // Logout
    const logout = useCallback(() => {
        authService.logout();
        setUser(null);
        setError(null);
    }, []);

    // Update user
    const updateUser = useCallback(async (updates: Partial<User>) => {
        if (!user) return { success: false, error: 'No user logged in' };

        setLoading(true);
        const response = await authService.updateUser(user.id, updates);

        if (response.success && response.user) {
            setUser(response.user);
            setLoading(false);
            return { success: true };
        } else {
            setError(response.error || 'Update failed');
            setLoading(false);
            return { success: false, error: response.error };
        }
    }, [user]);

    return {
        user,
        loading,
        error,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        signup,
        logout,
        updateUser,
    };
}
