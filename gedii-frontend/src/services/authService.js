import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (data) => {
    const response = await api.post('/auth/register', {
      nom: data.nom,
      matricule: data.matricule,
      email: data.email,
      password: data.password,
      serviceNom: data.service,
      cleAcces: data.cleAcces,
    });
    return response.data;
  },
};