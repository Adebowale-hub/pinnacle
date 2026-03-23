import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';

interface Admin {
    _id: string;
    name: string;
    email: string;
    role: 'super_admin' | 'admin';
}

interface AdminAuthResponse {
    _id: string;
    name: string;
    email: string;
    role: 'super_admin' | 'admin';
    token: string;
}

interface AdminState {
    admin: Admin | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export const useAdminStore = create<AdminState>()(
    persist(
        (set) => ({
            admin: null,
            token: null,

            login: async (email: string, password: string) => {
                const response = await api.post<AdminAuthResponse>('/admin/auth/login', { email, password });
                const { token, ...admin } = response.data;
                localStorage.setItem('adminToken', token);
                set({ admin: admin as Admin, token });
            },

            logout: () => {
                localStorage.removeItem('adminToken');
                set({ admin: null, token: null });
            },

            checkAuth: async () => {
                try {
                    const response = await api.get<Admin>('/admin/auth/me');
                    set({ admin: response.data });
                } catch (error) {
                    localStorage.removeItem('adminToken');
                    set({ admin: null, token: null });
                }
            }
        }),
        {
            name: 'admin-storage'
        }
    )
);
