import { create } from 'zustand';
import { api } from '../services/api';

export const useBookingStore = create((set) => ({
  bookingDraft: null,
  myBookings: [],
  loading: false,
  setBookingDraft: (bookingDraft) => set({ bookingDraft }),
  createBooking: async (payload) => {
    set({ loading: true });
    try {
      const { data } = await api.post('/bookings', payload);
      set({ loading: false, bookingDraft: null });
      return data.data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
  fetchMyBookings: async () => {
    const { data } = await api.get('/users/bookings');
    set({ myBookings: data.data });
  },
}));
