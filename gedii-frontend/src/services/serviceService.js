import api from './api';

export const serviceService = {
  getAll: async () => {
    const response = await api.get('/services');
    return response.data;
  },

  create: async (nom) => {
    const response = await api.post('/services', { nom });
    return response.data;
  },
};