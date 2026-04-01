import { api } from './api';

export const galleryService = {
  // Public
  getAll: () => api.get('/gallery'),
  getCategories: () => api.get('/gallery/categories'),
  
  // Admin
  getAllAdmin: () => api.get('/gallery/admin/all'),
  create: (payload) => api.post('/gallery', payload),
  update: (id, payload) => api.put(`/gallery/${id}`, payload),
  delete: (id) => api.delete(`/gallery/${id}`),
};
