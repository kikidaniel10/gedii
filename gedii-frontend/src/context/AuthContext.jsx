import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('gedii_user');
    const token = localStorage.getItem('gedii_token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      // Rafraîchit le profil (récupère la photo à jour)
      refreshUser();
    }
    setLoading(false);
  }, []);

  const refreshUser = async () => {
    try {
      const response = await api.get('/utilisateurs/me');
      setUser(response.data);
      localStorage.setItem('gedii_user', JSON.stringify(response.data));
    } catch (e) {
      // silencieux
    }
  };

  const login = (userData, token) => {
    localStorage.setItem('gedii_token', token);
    localStorage.setItem('gedii_user', JSON.stringify(userData));
    setUser(userData);
    // Récupère le profil complet (avec photoUrl) après connexion
    setTimeout(refreshUser, 100);
  };

  const logout = () => {
    localStorage.removeItem('gedii_token');
    localStorage.removeItem('gedii_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}