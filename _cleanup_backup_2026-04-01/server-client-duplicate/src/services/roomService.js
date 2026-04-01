import { api } from './api';

export const roomService = {
  getRooms: (params) => api.get('/rooms', { params }),
  getRoom: (slug) => api.get(`/rooms/${slug}`),
  getAvailability: (id) => api.get(`/rooms/${id}/availability`),
};
