import { api } from './api';

export const amenitieService = {
  // Public
  getAll: () => api.get('/amenities'),
  
  // Admin
  getAllAdmin: () => api.get('/amenities/admin/all'),
  create: (payload) => api.post('/amenities', payload),
  update: (id, payload) => api.put(`/amenities/${id}`, payload),
  delete: (id) => api.delete(`/amenities/${id}`),
};
