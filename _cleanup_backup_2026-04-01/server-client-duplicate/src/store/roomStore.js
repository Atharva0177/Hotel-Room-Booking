import { create } from 'zustand';
import { api } from '../services/api';

export const useRoomStore = create((set) => ({
  rooms: [],
  featuredRooms: [],
  selectedRoom: null,
  loading: false,
  error: null,
  fetchRooms: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get('/rooms', { params });
      set({ rooms: data.data.rooms, loading: false });
      return data.data.rooms;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to load rooms', loading: false });
      throw error;
    }
  },
  fetchFeaturedRooms: async () => {
    const { data } = await api.get('/rooms', { params: { sort: 'newest' } });
    const featured = data.data.rooms.filter((room) => room.isFeatured).slice(0, 6);
    set({ featuredRooms: featured });
  },
  fetchRoomBySlug: async (slug) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get(`/rooms/${slug}`);
      set({ selectedRoom: data.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Room not found', loading: false });
    }
  },
}));
