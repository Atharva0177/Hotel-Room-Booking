import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await api.post('/auth/refresh-token');
        return api(error.config);
      } catch (_refreshError) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);
