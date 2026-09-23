# GEDII — Gestion des Demandes et Interventions Informatiques

Application web de gestion des demandes d'intervention informatique pour la Cellule Informatique du Ministère de la Communication (MINCOM).

## Fonctionnalités

- Authentification sécurisée par JWT avec 3 rôles : Agent, Technicien, Responsable
- Inscription avec photo de profil et clé d'accès au service
- Validation des comptes par le Responsable
- Soumission et suivi des demandes par les agents
- Assignation des demandes aux techniciens
- Traitement des interventions avec compte-rendu
- Notifications email automatiques
- Statistiques avec export PDF et CSV
- Gestion des services et des utilisateurs

## Stack technique

- Frontend : React 18 + Vite + React Router
- Backend : Spring Boot 4 + Java 17
- Base de données : PostgreSQL (Supabase)
- Authentification : Spring Security + JWT
- Emails : JavaMail (SMTP Gmail)
- Stockage fichiers : Supabase Storage
- Génération PDF : OpenPDF
- Graphiques : Recharts

## Installation locale

### Prérequis

- Java 17+
- Node.js 18+
- Maven 3.9+

### Backend

cd gedii-backend
source .env
mvn spring-boot:run'''

Backend disponible sur : http://localhost:8080

### Frontend
cd gedii-frontend
npm install
npm run dev
Frontend disponible sur : http://localhost:5173

### Déploiement
Backend : Render (Docker)

Frontend : Vercel

Base de données : Supabase

### Structure du projet

gedii/
├── gedii-backend/     # API Spring Boot
└── gedii-frontend/    # Application React
Auteur
KIKI Daniel
Stagiaire — Cellule Informatique
Ministère de la Communication (MINCOM)
Année académique : 2025- 2026



