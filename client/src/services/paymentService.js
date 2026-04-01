import { api } from './api';

export const paymentService = {
  createIntent: (payload) => api.post('/payments/create-intent', payload),
};
