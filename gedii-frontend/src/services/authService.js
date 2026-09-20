import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (data, photoFile) => {
    const formData = new FormData();
    formData.append('nom', data.nom);
    formData.append('matricule', data.matricule);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('serviceNom', data.serviceNom);
    formData.append('cleAcces', data.cleAcces);
    if (photoFile) {
      formData.append('photo', photoFile);
    }

    const response = await api.post('/auth/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};