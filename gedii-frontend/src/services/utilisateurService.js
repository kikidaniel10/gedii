import api from './api';

export const utilisateurService = {
  getEnAttente: async () => {
    const response = await api.get('/utilisateurs/en-attente');
    return response.data;
  },

  getActifs: async () => {
    const response = await api.get('/utilisateurs/actifs');
    return response.data;
  },

  getTechniciens: async () => {
    const response = await api.get('/utilisateurs/techniciens');
    return response.data;
  },

  valider: async (id) => {
    const response = await api.put(`/utilisateurs/${id}/valider`);
    return response.data;
  },

  rejeter: async (id) => {
    const response = await api.put(`/utilisateurs/${id}/rejeter`);
    return response.data;
  },

  promouvoirTechnicien: async (id, specialite) => {
    const response = await api.put(`/utilisateurs/${id}/promouvoir-technicien`, { specialite });
    return response.data;
  },

  getTechniciens: async () => {
  const response = await api.get('/utilisateurs/actifs');
  return response.data;
  },
};
