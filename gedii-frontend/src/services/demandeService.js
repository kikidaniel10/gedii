import api from './api';

export const demandeService = {
  creer: async (data) => {
    const response = await api.post('/demandes', data);
    return response.data;
  },

  getMesDemandes: async () => {
    const response = await api.get('/demandes/mes-demandes');
    return response.data;
  },

  getEnAttente: async () => {
    const response = await api.get('/demandes/en-attente');
    return response.data;
  },

  getValidees: async () => {
    const response = await api.get('/demandes/validees');
    return response.data;
  },

  valider: async (id) => {
    const response = await api.put(`/demandes/${id}/valider`);
    return response.data;
  },

  rejeter: async (id) => {
    const response = await api.put(`/demandes/${id}/rejeter`);
    return response.data;
  },
};