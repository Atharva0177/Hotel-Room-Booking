import { create } from 'zustand';
import { api } from '../services/api';

const STORAGE_KEY = 'hotel_access_token';

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,
  token: localStorage.getItem(STORAGE_KEY) || null,
  setUser: (user) => set({ user }),
  login: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', payload);
      const token = data.data.accessToken;
      localStorage.setItem(STORAGE_KEY, token);
      set({ user: data.data.user, token, loading: false });
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
      const token = data.data.accessToken;
      localStorage.setItem(STORAGE_KEY, token);
      set({ user: data.data.user, token, loading: false });
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
    try {
      await api.post('/auth/logout');
    } catch (_) {}
    localStorage.removeItem(STORAGE_KEY);
    set({ user: null, token: null });
  },
}));
