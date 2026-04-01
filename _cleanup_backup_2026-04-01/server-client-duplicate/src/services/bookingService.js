import { api } from './api';

export const bookingService = {
  create: (payload) => api.post('/bookings', payload),
  list: () => api.get('/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  cancel: (id) => api.delete(`/bookings/${id}`),
};
