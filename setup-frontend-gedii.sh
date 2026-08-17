#!/bin/bash
# ============================================
# GEDII - Setup Frontend React
# A executer depuis le dossier ou tu veux creer le projet
# ============================================

set -e

echo "==> Creation du projet React avec Vite..."
npm create vite@latest gedii-frontend -- --template react
cd gedii-frontend

echo "==> Installation des dependances..."
npm install
npm install axios react-router-dom

echo "==> Creation de l'arborescence des dossiers..."
mkdir -p src/router
mkdir -p src/context
mkdir -p src/hooks
mkdir -p src/services
mkdir -p src/components/common
mkdir -p src/components/demande
mkdir -p src/components/intervention
mkdir -p src/pages/auth
mkdir -p src/pages/agent
mkdir -p src/pages/responsable
mkdir -p src/pages/technicien
mkdir -p src/utils
mkdir -p src/styles

echo "==> Creation des fichiers vides (squelette)..."

# Router
touch src/router/AppRouter.jsx

# Context
touch src/context/AuthContext.jsx

# Hooks
touch src/hooks/useAuth.js
touch src/hooks/useFetch.js

# Services (appels API)
touch src/services/api.js
touch src/services/authService.js
touch src/services/demandeService.js
touch src/services/interventionService.js
touch src/services/utilisateurService.js
touch src/services/serviceService.js
touch src/services/statistiqueService.js

# Components communs
touch src/components/common/Navbar.jsx
touch src/components/common/Sidebar.jsx
touch src/components/common/StatusBadge.jsx
touch src/components/common/ProtectedRoute.jsx

# Components demande
touch src/components/demande/DemandeCard.jsx
touch src/components/demande/DemandeForm.jsx

# Components intervention
touch src/components/intervention/InterventionCard.jsx

# Pages auth (publiques)
touch src/pages/auth/LoginPage.jsx
touch src/pages/auth/RegisterPage.jsx

# Pages agent
touch src/pages/agent/SoumettreDemandePage.jsx
touch src/pages/agent/ConsulterEtatPage.jsx
touch src/pages/agent/HistoriquePage.jsx

# Pages responsable
touch src/pages/responsable/DemandesEnAttentePage.jsx
touch src/pages/responsable/AssignerTechnicienPage.jsx
touch src/pages/responsable/GestionUtilisateursPage.jsx
touch src/pages/responsable/GestionServicesPage.jsx
touch src/pages/responsable/StatistiquesPage.jsx

# Pages technicien
touch src/pages/technicien/InterventionsAssigneesPage.jsx
touch src/pages/technicien/MettreAJourStatutPage.jsx

# Utils
touch src/utils/constants.js

# Styles
touch src/styles/index.css

# Fichier .env
echo "VITE_API_URL=http://localhost:8080/api" > .env

echo "==> Termine !"
echo ""
echo "Structure creee dans le dossier gedii-frontend/"
echo "Pour demarrer : cd gedii-frontend && npm run dev"
