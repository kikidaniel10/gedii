import api from './api';

export const statistiqueService = {
  getStatistiques: async () => {
    const response = await api.get('/statistiques');
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