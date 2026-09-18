import api from './api';

export const interventionService = {
  assigner: async (demandeId, technicienId) => {
    const response = await api.post('/interventions/assigner', { demandeId, technicienId });
    return response.data;
  },

  getMesInterventions: async () => {
    const response = await api.get('/interventions/mes-interventions');
    return response.data;
  },

  demarrer: async (id) => {
    const response = await api.put(`/interventions/${id}/demarrer`);
    return response.data;
  },

  cloturer: async (id, compteRendu) => {
    const response = await api.put(`/interventions/${id}/cloturer`, { compteRendu });
    return response.data;
  },
};