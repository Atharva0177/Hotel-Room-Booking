import { create } from 'zustand';
import { api } from '../services/api';

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,
  setUser: (user) => set({ user }),
  login: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', payload);
      set({ user: data.data.user, loading: false });
      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Login failed', loading: false });
      throw error;
    }
  },
  register: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/register', payload);
      set({ user: data.data.user, loading: false });
      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Registration failed', loading: false });
      throw error;
    }
  },
  fetchMe: async () => {
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data.data });
    } catch (_error) {
      set({ user: null });
    }
  },
  logout: async () => {
    await api.post('/auth/logout');
    set({ user: null });
  },
}));
