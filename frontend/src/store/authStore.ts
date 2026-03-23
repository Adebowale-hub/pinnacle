import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthResponse } from '../types';
import api from '../lib/api';

interface AuthState {
    user: User | null;
    token: string | null;
    isAdmin: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAdmin: false,

            login: async (email: string, password: string) => {
                const response = await api.post<AuthResponse>('/auth/login', { email, password });
                const { token, ...user } = response.data;
                localStorage.setItem('token', token);
                set({ user: user as any, token, isAdmin: false });
            },

            register: async (data: any) => {
                const response = await api.post<AuthResponse>('/auth/register', data);
                const { token, ...user } = response.data;
                localStorage.setItem('token', token);
                set({ user: user as any, token, isAdmin: false });
            },

            logout: () => {
                localStorage.removeItem('token');
                set({ user: null, token: null, isAdmin: false });
            },

            checkAuth: async () => {
                try {
                    const response = await api.get<User>('/auth/me');
                    set({ user: response.data });
                } catch (error) {
                    localStorage.removeItem('token');
                    set({ user: null, token: null });
                }
            }
        }),
        {
            name: 'auth-storage'
        }
    )
);
