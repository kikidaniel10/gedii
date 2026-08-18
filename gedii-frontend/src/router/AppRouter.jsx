import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import AppLayout from '../components/common/AppLayout';
import { ROLES } from '../utils/constants';

import LoginPage from '../pages/auth/LoginPage.jsx';
import RegisterPage from '../pages/auth/RegisterPage.jsx';

import SoumettreDemandePage from '../pages/agent/SoumettreDemandePage.jsx';
import HistoriquePage from '../pages/agent/HistoriquePage.jsx';

import DemandesEnAttentePage from '../pages/responsable/DemandesEnAttentePage.jsx';
import GestionUtilisateursPage from '../pages/responsable/GestionUtilisateursPage.jsx';
import GestionServicesPage from '../pages/responsable/GestionServicesPage.jsx';
import StatistiquesPage from '../pages/responsable/StatistiquesPage.jsx';

import InterventionsAssigneesPage from '../pages/technicien/InterventionsAssigneesPage.jsx';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/agent/soumettre"
        element={
          <ProtectedRoute allowedRoles={[ROLES.AGENT]}>
            <AppLayout><SoumettreDemandePage /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/agent/historique"
        element={
          <ProtectedRoute allowedRoles={[ROLES.AGENT]}>
            <AppLayout><HistoriquePage /></AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/responsable/demandes"
        element={
          <ProtectedRoute allowedRoles={[ROLES.RESPONSABLE]}>
            <AppLayout><DemandesEnAttentePage /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/responsable/utilisateurs"
        element={
          <ProtectedRoute allowedRoles={[ROLES.RESPONSABLE]}>
            <AppLayout><GestionUtilisateursPage /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/responsable/services"
        element={
          <ProtectedRoute allowedRoles={[ROLES.RESPONSABLE]}>
            <AppLayout><GestionServicesPage /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/responsable/statistiques"
        element={
          <ProtectedRoute allowedRoles={[ROLES.RESPONSABLE]}>
            <AppLayout><StatistiquesPage /></AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/technicien/interventions"
        element={
          <ProtectedRoute allowedRoles={[ROLES.TECHNICIEN]}>
            <AppLayout><InterventionsAssigneesPage /></AppLayout>
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}