import { api } from './api';

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getRevenue: () => api.get('/admin/revenue'),
  getGuests: () => api.get('/admin/guests'),
  getBookingCalendar: (params) => api.get('/admin/booking-calendar', { params }),
  listBookings: () => api.get('/bookings'),
  updateBookingStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status }),
  cancelBooking: (id) => api.delete(`/bookings/${id}`),
  deleteBooking: (id) => api.delete(`/bookings/${id}/hard`),
  downloadInvoice: (id) => api.get(`/bookings/${id}/invoice`, { responseType: 'blob' }),
  listRooms: () => api.get('/rooms'),
  createRoom: (payload) => api.post('/rooms', payload),
  updateRoom: (id, payload) => api.put(`/rooms/${id}`, payload),
  deleteRoom: (id) => api.delete(`/rooms/${id}`),
  getSiteSettings: () => api.get('/admin/site-settings'),
  updateSiteSettings: (payload) => api.put('/admin/site-settings', payload),
};
