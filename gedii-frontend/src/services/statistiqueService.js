import api from './api';

export const statistiqueService = {
  getStatistiques: async (periode, service) => {
    const params = {};
    if (periode) params.periode = periode;
    if (service) params.service = service;
    const response = await api.get('/statistiques', { params });
    return response.data;
  },

  getListeServices: async () => {
    const response = await api.get('/statistiques/services');
    return response.data;
  },

  getPerformanceTechniciens: async () => {
    const response = await api.get('/statistiques/techniciens');
    return response.data;
  },

  downloadRapport: async () => {
    const response = await api.get('/statistiques/rapport', {
      responseType: 'blob',
    });
    return response.data;
  },
};