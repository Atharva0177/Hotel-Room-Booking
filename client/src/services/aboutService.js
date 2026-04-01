import { api } from './api';

const aboutService = {
  getAbout: () => api.get('/about'),
  updateAbout: (data) => api.put('/about', data),
};

export default aboutService;
