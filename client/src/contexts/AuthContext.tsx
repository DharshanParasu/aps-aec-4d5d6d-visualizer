'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_BASE_URL } from '@/config';

interface AuthContextType {
    isAuthenticated: boolean;
    accessToken: string | null;
    login: () => void;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    const checkAuth = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/token`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setAccessToken(data.accessToken);
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                setAccessToken(null);
            }
        } catch (error) {
            setIsAuthenticated(false);
            setAccessToken(null);
        }
    };

    const login = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/url`);
            const data = await response.json();
            window.location.href = data.url;
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const logout = async () => {
        try {
            await fetch(`${API_BASE_URL}/api/auth/logout`);
            setIsAuthenticated(false);
            setAccessToken(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    useEffect(() => {
        checkAuth();
        // Check for auth success from callback
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('auth') === 'success') {
            checkAuth();
            window.history.replaceState({}, '', '/');
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, accessToken, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
