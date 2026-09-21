import { useState, useEffect } from 'react';
import {
  Check, X, Search, Trash2, User as UserIcon, Clock, Shield,
  Users, Inbox, AlertCircle, Lock, Eye, EyeOff, Mail, Briefcase,
} from 'lucide-react';
import { utilisateurService } from '../../services/utilisateurService';

const ROLE_LABEL = {
  AGENT: 'Agent',
  TECHNICIEN: 'Technicien',
  RESPONSABLE: 'Responsable',
};

const ROLE_COLORS = {
  AGENT: { bg: 'rgba(11, 110, 79, 0.12)', text: 'var(--color-primary-dark)' },
  TECHNICIEN: { bg: 'rgba(252, 209, 22, 0.18)', text: '#8a6d00' },
  RESPONSABLE: { bg: 'rgba(206, 17, 38, 0.12)', text: 'var(--color-accent-red)' },
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

export default function GestionUtilisateursPage() {
  const [onglet, setOnglet] = useState('attente');
  const [comptesEnAttente, setComptesEnAttente] = useState([]);
  const [comptesActifs, setComptesActifs] = useState([]);
  const [confirmAction, setConfirmAction] = useState(null);
  const [recherche, setRecherche] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionEnCours, setActionEnCours] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      utilisateurService.getEnAttente(),
      utilisateurService.getActifs(),
    ])
      .then(([attente, actifs]) => {
        setComptesEnAttente(attente);
        setComptesActifs(actifs);
      })
      .catch(() => {
        setComptesEnAttente([]);
        setComptesActifs([]);
      })
      .finally(() => setLoading(false));
  };

  const handleAction = (id, type) => {
    setActionEnCours(true);
    const action = type === 'valider'
      ? utilisateurService.valider(id)
      : utilisateurService.rejeter(id);

    action
      .then(() => {
        setConfirmAction(null);
        loadData();
      })
      .catch(() => setConfirmAction(null))
      .finally(() => setActionEnCours(false));
  };

  const ouvrirDelete = (c) => {
    setDeleteModal({ id: c.id, nom: c.nom, role: c.role });
    setDeletePassword('');
    setDeleteError('');
    setShowPassword(false);
  };

  const fermerDelete = () => {
    setDeleteModal(null);
    setDeletePassword('');
    setDeleteError('');
    setShowPassword(false);
  };

  const confirmerSuppression = () => {
    if (!deletePassword.trim()) {
      setDeleteError('Le mot de passe est requis');
      return;
    }

    setDeleting(true);
    utilisateurService.supprimer(deleteModal.id, deletePassword)
      .then(() => {
        fermerDelete();
        loadData();
      })
      .catch((err) => {
        setDeleteError(err.response?.data?.erreur || 'Mot de passe incorrect');
      })
      .finally(() => setDeleting(false));
  };

  const comptesActifsFiltres = comptesActifs.filter(
    (c) =>
      c.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      c.matricule.toLowerCase().includes(recherche.toLowerCase()) ||
      c.serviceNom.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <>
      <style>{`
        .gu-header {
          margin-bottom: 24px;
        }

        .gu-title {
          font-size: 26px;
          color: var(--color-text);
          margin: 0 0 6px 0;
          font-family: var(--font-display);
          letter-spacing: -0.02em;
        }

        .gu-subtitle {
          font-size: 14px;
          color: var(--color-text-soft);
          margin: 0;
        }

        .gu-tabs {
          display: flex;
          gap: 4px;
          margin-bottom: 28px;
          border-bottom: 1px solid var(--color-border);
        }

        .gu-tab {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 4px;
          margin-right: 24px;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          font-size: 14px;
          font-weight: 600;
          color: var(--color-text-soft);
          cursor: pointer;
          transition: color 0.2s ease, border-color 0.2s ease;
          margin-bottom: -1px;
        }

        .gu-tab:hover {
          color: var(--color-text);
        }

        .gu-tab.active {
          color: var(--color-primary);
          border-bottom-color: var(--color-primary);
        }

        .gu-tab-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 20px;
          height: 20px;
          padding: 0 6px;
          border-radius: 999px;
          background: var(--color-accent-gold);
          color: var(--color-text);
          font-size: 11px;
          font-weight: 800;
        }

        .gu-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          max-width: 780px;
        }

        .gu-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          background: var(--color-surface);
          padding: 20px 22px;
          border-radius: 14px;
          box-shadow: 0 2px 10px rgba(10, 21, 17, 0.06);
          flex-wrap: wrap;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          animation: guFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .gu-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(10, 21, 17, 0.1);
        }

        @keyframes guFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .gu-card-main {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
          min-width: 0;
        }

        .gu-avatar {
          width: 48px;
          height: 48px;
          min-width: 48px;
          border-radius: 50%;
          background: var(--color-primary);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          font-weight: 700;
          overflow: hidden;
          position: relative;
        }

        .gu-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .gu-avatar-pending::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--color-accent-gold);
          border: 2px solid var(--color-surface);
          animation: guPulse 2s ease-in-out infinite;
        }

        @keyframes guPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(252, 209, 22, 0.5); }
          50% { box-shadow: 0 0 0 6px rgba(252, 209, 22, 0); }
        }

        .gu-card-info {
          min-width: 0;
          flex: 1;
        }

        .gu-card-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--color-text);
          margin: 0 0 5px 0;
          letter-spacing: -0.01em;
        }

        .gu-card-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          font-size: 12px;
          color: var(--color-text-soft);
        }

        .gu-meta-item {
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .gu-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .gu-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 16px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          border: none;
          transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
        }

        .gu-btn:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .gu-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .gu-btn-validate {
          background: linear-gradient(180deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
          color: #fff;
          box-shadow: 0 4px 12px rgba(11, 110, 79, 0.22);
        }

        .gu-btn-reject {
          background: transparent;
          color: var(--color-accent-red);
          border: 1.5px solid var(--color-accent-red);
        }

        .gu-btn-reject:hover:not(:disabled) {
          background: rgba(206, 17, 38, 0.06);
        }

        .gu-confirm {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          border-radius: 12px;
          background: var(--color-bg-strong);
          flex-wrap: wrap;
          animation: guConfirmIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          width: 100%;
        }

        @keyframes guConfirmIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }

        .gu-confirm-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .gu-confirm-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .gu-confirm-text {
          font-size: 13px;
          font-weight: 600;
          color: var(--color-text);
          margin: 0;
        }

        .gu-confirm-subtext {
          font-size: 11px;
          color: var(--color-text-soft);
          margin: 2px 0 0 0;
        }

        .gu-confirm-actions {
          display: flex;
          gap: 8px;
        }

        .gu-confirm-yes {
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.15s ease;
        }

        .gu-confirm-yes:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .gu-confirm-yes:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .gu-confirm-cancel {
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px solid var(--color-border);
          background: transparent;
          color: var(--color-text-soft);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .gu-search {
          display: flex;
          align-items: center;
          gap: 10px;
          max-width: 420px;
          padding: 11px 14px;
          border-radius: 10px;
          border: 1px solid var(--color-border);
          background: var(--color-surface);
          margin-bottom: 20px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .gu-search:focus-within {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 4px rgba(11, 110, 79, 0.1);
        }

        .gu-search input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          color: var(--color-text);
          font-size: 14px;
          font-family: var(--font-body);
        }

        .gu-table {
          max-width: 900px;
          background: var(--color-surface);
          border-radius: 14px;
          box-shadow: 0 2px 10px rgba(10, 21, 17, 0.06);
          overflow: hidden;
        }

        .gu-table-header {
          display: flex;
          padding: 14px 22px;
          background: var(--color-bg-strong);
          font-size: 11px;
          font-weight: 700;
          color: var(--color-text-soft);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .gu-table-row {
          display: flex;
          align-items: center;
          padding: 16px 22px;
          border-top: 1px solid var(--color-border);
          transition: background 0.15s ease;
        }

        .gu-table-row:hover {
          background: var(--color-bg-strong);
        }

        .gu-avatar-sm {
          width: 38px;
          height: 38px;
          min-width: 38px;
          border-radius: 50%;
          background: var(--color-primary-soft);
          color: var(--color-primary-dark);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          overflow: hidden;
        }

        .gu-avatar-sm img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .gu-row-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--color-text);
          margin: 0;
        }

        .gu-row-sub {
          font-size: 12px;
          color: var(--color-text-soft);
          margin: 2px 0 0 0;
          font-family: var(--font-mono, monospace);
        }

        .gu-role-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .gu-delete-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          color: var(--color-accent-red);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s ease, transform 0.15s ease;
        }

        .gu-delete-btn:hover {
          background: rgba(206, 17, 38, 0.1);
          transform: scale(1.05);
        }

        .gu-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          padding: 60px 24px;
          background: var(--color-surface);
          border-radius: 16px;
          border: 1px dashed var(--color-border);
          max-width: 780px;
          text-align: center;
        }

        .gu-empty-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(11, 110, 79, 0.08);
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gu-empty-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--color-text);
          margin: 0;
        }

        .gu-empty-text {
          font-size: 13px;
          color: var(--color-text-soft);
          margin: 0;
          max-width: 340px;
          line-height: 1.5;
        }

        .gu-loading {
          padding: 60px 20px;
          text-align: center;
          color: var(--color-text-soft);
          font-size: 14px;
        }

        .gu-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid var(--color-border);
          border-top-color: var(--color-primary);
          border-radius: 50%;
          animation: guSpin 0.8s linear infinite;
          margin: 0 auto 16px auto;
        }

        @keyframes guSpin {
          to { transform: rotate(360deg); }
        }

        .gu-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 21, 17, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 20px;
          animation: guOverlayIn 0.2s ease;
        }

        @keyframes guOverlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .gu-modal {
          background: var(--color-surface);
          border-radius: 16px;
          padding: 28px 30px;
          max-width: 440px;
          width: 100%;
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
          animation: guModalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes guModalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .gu-modal-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(206, 17, 38, 0.1);
          color: var(--color-accent-red);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .gu-modal-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--color-text);
          margin: 0 0 10px 0;
          letter-spacing: -0.01em;
        }

        .gu-modal-text {
          font-size: 13px;
          color: var(--color-text-soft);
          line-height: 1.6;
          margin: 0 0 18px 0;
        }

        .gu-modal-text strong {
          color: var(--color-text);
          font-weight: 700;
        }

        .gu-modal-label {
          font-size: 12px;
          font-weight: 700;
          color: var(--color-text);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0 0 8px 0;
        }

        .gu-password-wrapper {
          display: flex;
          align-items: center;
          border-radius: 10px;
          border: 1px solid var(--color-border);
          background: var(--color-surface);
          padding-right: 6px;
          margin-bottom: 10px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .gu-password-wrapper:focus-within {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 4px rgba(11, 110, 79, 0.1);
        }

        .gu-password-wrapper input {
          flex: 1;
          padding: 12px 14px;
          border: none;
          outline: none;
          font-size: 14px;
          background: transparent;
          color: var(--color-text);
          font-family: var(--font-body);
        }

        .gu-eye-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 6px;
          color: var(--color-text-soft);
          display: flex;
          align-items: center;
        }

        .gu-modal-error {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--color-accent-red);
          margin-bottom: 12px;
          font-weight: 500;
        }

        .gu-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 18px;
        }

        .gu-modal-cancel {
          padding: 10px 18px;
          border-radius: 9px;
          border: 1px solid var(--color-border);
          background: transparent;
          color: var(--color-text-soft);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .gu-modal-cancel:hover:not(:disabled) {
          background: var(--color-bg-strong);
        }

        .gu-modal-delete {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 18px;
          border-radius: 9px;
          border: none;
          background: var(--color-accent-red);
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          box-shadow: 0 4px 12px rgba(206, 17, 38, 0.28);
        }

        .gu-modal-delete:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(206, 17, 38, 0.35);
        }

        .gu-modal-delete:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>

      <div>
        <div className="gu-header">
          <h1 className="gu-title">Gestion des utilisateurs</h1>
          <p className="gu-subtitle">
            Validez les nouveaux comptes ou consultez les utilisateurs déjà actifs.
          </p>
        </div>

        <div className="gu-tabs">
          <button
            className={`gu-tab ${onglet === 'attente' ? 'active' : ''}`}
            onClick={() => setOnglet('attente')}
          >
            <Clock size={16} strokeWidth={2.5} />
            En attente
            {comptesEnAttente.length > 0 && (
              <span className="gu-tab-badge">{comptesEnAttente.length}</span>
            )}
          </button>
          <button
            className={`gu-tab ${onglet === 'actifs' ? 'active' : ''}`}
            onClick={() => setOnglet('actifs')}
          >
            <Users size={16} strokeWidth={2.5} />
            Comptes actifs ({comptesActifs.length})
          </button>
        </div>

        {loading ? (
          <div className="gu-loading">
            <div className="gu-spinner"></div>
            Chargement des comptes...
          </div>
        ) : (
          <>
            {onglet === 'attente' && (
              <>
                {comptesEnAttente.length === 0 ? (
                  <div className="gu-empty">
                    <div className="gu-empty-icon">
                      <Inbox size={32} strokeWidth={2} />
                    </div>
                    <p className="gu-empty-title">Aucun compte en attente</p>
                    <p className="gu-empty-text">
                      Tous les comptes ont été traités. Les nouvelles inscriptions apparaîtront ici.
                    </p>
                  </div>
                ) : (
                  <div className="gu-list">
                    {comptesEnAttente.map((c, index) => {
                      const isConfirming = confirmAction?.id === c.id;
                      const isValider = confirmAction?.type === 'valider';
                      const initials = c.nom.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

                      return (
                        <div
                          key={c.id}
                          className="gu-card"
                          style={{ animationDelay: `${index * 0.05}s`, flexDirection: isConfirming ? 'column' : 'row', alignItems: isConfirming ? 'stretch' : 'center' }}
                        >
                          <div className="gu-card-main">
                            <div className="gu-avatar gu-avatar-pending">
                              {c.photoUrl ? (
                                <img src={c.photoUrl} alt={c.nom} />
                              ) : (
                                initials
                              )}
                            </div>
                            <div className="gu-card-info">
                              <h3 className="gu-card-title">{c.nom}</h3>
                              <div className="gu-card-meta">
                                <span className="gu-meta-item">
                                  <Shield size={12} strokeWidth={2.5} />
                                  {c.matricule}
                                </span>
                                <span className="gu-meta-item">
                                  <Mail size={12} strokeWidth={2.5} />
                                  {c.email}
                                </span>
                                <span className="gu-meta-item">
                                  <Briefcase size={12} strokeWidth={2.5} />
                                  {c.serviceNom}
                                </span>
                                <span className="gu-meta-item">
                                  <Clock size={12} strokeWidth={2.5} />
                                  {formatDate(c.dateCreation)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {isConfirming ? (
                            <div className="gu-confirm">
                              <div className="gu-confirm-left">
                                <div
                                  className="gu-confirm-icon"
                                  style={{
                                    background: isValider ? 'rgba(11, 110, 79, 0.12)' : 'rgba(206, 17, 38, 0.12)',
                                    color: isValider ? 'var(--color-primary)' : 'var(--color-accent-red)',
                                  }}
                                >
                                  {isValider ? <Check size={18} strokeWidth={2.5} /> : <X size={18} strokeWidth={2.5} />}
                                </div>
                                <div>
                                  <p className="gu-confirm-text">
                                    {isValider ? 'Activer ce compte ?' : 'Rejeter ce compte ?'}
                                  </p>
                                  <p className="gu-confirm-subtext">
                                    {isValider
                                      ? 'L\'utilisateur pourra se connecter et accéder à son espace.'
                                      : 'L\'utilisateur ne pourra pas se connecter à la plateforme.'}
                                  </p>
                                </div>
                              </div>
                              <div className="gu-confirm-actions">
                                <button
                                  className="gu-confirm-yes"
                                  style={{ background: isValider ? 'var(--color-primary)' : 'var(--color-accent-red)' }}
                                  onClick={() => handleAction(c.id, confirmAction.type)}
                                  disabled={actionEnCours}
                                >
                                  {actionEnCours ? '...' : `Oui, ${isValider ? 'activer' : 'rejeter'}`}
                                </button>
                                <button
                                  className="gu-confirm-cancel"
                                  onClick={() => setConfirmAction(null)}
                                  disabled={actionEnCours}
                                >
                                  Annuler
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="gu-actions">
                              <button
                                className="gu-btn gu-btn-validate"
                                onClick={() => setConfirmAction({ id: c.id, type: 'valider' })}
                              >
                                <Check size={16} strokeWidth={2.5} />
                                Activer
                              </button>
                              <button
                                className="gu-btn gu-btn-reject"
                                onClick={() => setConfirmAction({ id: c.id, type: 'rejeter' })}
                              >
                                <X size={16} strokeWidth={2.5} />
                                Rejeter
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {onglet === 'actifs' && (
              <>
                <div className="gu-search">
                  <Search size={16} color="var(--color-text-soft)" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, matricule ou service..."
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                  />
                </div>

                {comptesActifsFiltres.length === 0 ? (
                  <div className="gu-empty">
                    <div className="gu-empty-icon">
                      <Search size={32} strokeWidth={2} />
                    </div>
                    <p className="gu-empty-title">Aucun résultat</p>
                    <p className="gu-empty-text">
                      Aucun utilisateur ne correspond à « {recherche} ».
                    </p>
                  </div>
                ) : (
                  <div className="gu-table">
                    <div className="gu-table-header">
                      <span style={{ flex: 2 }}>Utilisateur</span>
                      <span style={{ flex: 1.5 }}>Service</span>
                      <span style={{ flex: 1 }}>Rôle</span>
                      <span style={{ flex: 1 }}>Actif depuis</span>
                      <span style={{ flex: 0.5, textAlign: 'right' }}>Actions</span>
                    </div>
                    {comptesActifsFiltres.map((c) => {
                      const initials = c.nom.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
                      const roleColors = ROLE_COLORS[c.role] || ROLE_COLORS.AGENT;
                      return (
                        <div key={c.id} className="gu-table-row">
                          <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div className="gu-avatar-sm">
                              {c.photoUrl ? (
                                <img src={c.photoUrl} alt={c.nom} />
                              ) : (
                                initials
                              )}
                            </div>
                            <div>
                              <p className="gu-row-name">{c.nom}</p>
                              <p className="gu-row-sub">{c.matricule}</p>
                            </div>
                          </div>
                          <span style={{ flex: 1.5, fontSize: '13px', color: 'var(--color-text-soft)' }}>
                            {c.serviceNom}
                          </span>
                          <span style={{ flex: 1 }}>
                            <span
                              className="gu-role-badge"
                              style={{ background: roleColors.bg, color: roleColors.text }}
                            >
                              {ROLE_LABEL[c.role]}
                            </span>
                          </span>
                          <span style={{ flex: 1, fontSize: '13px', color: 'var(--color-text-soft)' }}>
                            {formatDate(c.dateCreation)}
                          </span>
                          <span style={{ flex: 0.5, textAlign: 'right' }}>
                            <button
                              className="gu-delete-btn"
                              onClick={() => ouvrirDelete(c)}
                              title="Supprimer cet utilisateur"
                            >
                              <Trash2 size={16} strokeWidth={2.5} />
                            </button>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {deleteModal && (
          <div className="gu-modal-overlay" onClick={fermerDelete}>
            <div className="gu-modal" onClick={(e) => e.stopPropagation()}>
              <div className="gu-modal-icon">
                <Trash2 size={24} strokeWidth={2.5} />
              </div>
              <h3 className="gu-modal-title">Confirmer la suppression</h3>
              <p className="gu-modal-text">
                Vous êtes sur le point de supprimer <strong>{deleteModal.nom}</strong> et toutes ses données associées.
                Cette action est <strong>irréversible</strong>.
              </p>

              <p className="gu-modal-label">Votre mot de passe</p>
              <div className="gu-password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={deletePassword}
                  onChange={(e) => { setDeletePassword(e.target.value); setDeleteError(''); }}
                  placeholder="Saisissez votre mot de passe"
                  autoFocus
                />
                <button
                  type="button"
                  className="gu-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {deleteError && (
                <div className="gu-modal-error">
                  <AlertCircle size={14} strokeWidth={2.5} />
                  {deleteError}
                </div>
              )}

              <div className="gu-modal-actions">
                <button
                  className="gu-modal-cancel"
                  onClick={fermerDelete}
                  disabled={deleting}
                >
                  Annuler
                </button>
                <button
                  className="gu-modal-delete"
                  onClick={confirmerSuppression}
                  disabled={deleting}
                >
                  <Trash2 size={14} strokeWidth={2.5} />
                  {deleting ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}