import axios from 'axios';

const STORAGE_KEY = 'hotel_access_token';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

// Add token to Authorization header if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const { data } = await api.post('/auth/refresh-token');
        if (data.data?.accessToken) {
          localStorage.setItem(STORAGE_KEY, data.data.accessToken);
        }
        return api(error.config);
      } catch (_refreshError) {
        localStorage.removeItem(STORAGE_KEY);
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);
