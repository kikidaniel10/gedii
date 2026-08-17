import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Intercepteur : ajoute automatiquement le token JWT à chaque requête sortante
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gedii_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur : si le token est expiré/invalide (401), on déconnecte proprement
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('gedii_token');
      localStorage.removeItem('gedii_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;