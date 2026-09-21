import { useState, useEffect } from 'react';
import {
  Copy, Check, Plus, Trash2, KeyRound, Clock, AlertCircle,
  Shield, Sparkles, Lock, X, Building2,
} from 'lucide-react';
import { serviceService } from '../../services/serviceService';

const formatDate = (date) =>
  new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

export default function GestionServicesPage() {
  const [services, setServices] = useState([]);
  const [nomService, setNomService] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = () => {
    serviceService.getAll().then(setServices).catch(() => setServices([]));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!nomService.trim()) {
      setError('Le nom du service est requis');
      return;
    }
    setCreating(true);
    setError('');
    setSuccess('');
    serviceService.create(nomService.trim())
      .then((newService) => {
        setNomService('');
        setSuccess(`Service "${newService.nom}" créé avec succès`);
        loadServices();
        setTimeout(() => setSuccess(''), 3000);
      })
      .catch((err) => setError(err.response?.data?.erreur || 'Erreur lors de la création'))
      .finally(() => setCreating(false));
  };

  const handleCopy = (id, cle) => {
    navigator.clipboard.writeText(cle);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const ouvrirDelete = (s) => {
    setDeleteModal(s);
    setError('');
  };

  const fermerDelete = () => {
    setDeleteModal(null);
  };

  const confirmerSuppression = () => {
    setDeleting(true);
    serviceService.delete(deleteModal.id)
      .then(() => {
        fermerDelete();
        setSuccess(`Service "${deleteModal.nom}" supprimé`);
        loadServices();
        setTimeout(() => setSuccess(''), 3000);
      })
      .catch((err) => setError(err.response?.data?.erreur || 'Erreur lors de la suppression'))
      .finally(() => setDeleting(false));
  };

  return (
    <>
      <style>{`
        .gs-header {
          margin-bottom: 24px;
        }

        .gs-title {
          font-size: 26px;
          color: var(--color-text);
          margin: 0 0 6px 0;
          font-family: var(--font-display);
          letter-spacing: -0.02em;
        }

        .gs-subtitle {
          font-size: 14px;
          color: var(--color-text-soft);
          margin: 0;
          line-height: 1.5;
          max-width: 560px;
        }

        .gs-info-banner {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 16px;
          background: rgba(252, 209, 22, 0.1);
          border-left: 4px solid var(--color-accent-gold);
          border-radius: 10px;
          font-size: 13px;
          color: var(--color-text);
          line-height: 1.5;
          margin-bottom: 24px;
          max-width: 640px;
        }

        .gs-info-icon {
          color: #8a6d00;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .gs-create-card {
          background: var(--color-surface);
          padding: 24px 26px;
          border-radius: 14px;
          box-shadow: 0 2px 10px rgba(10, 21, 17, 0.06);
          max-width: 640px;
          margin-bottom: 24px;
          animation: gsFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes gsFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .gs-create-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--color-text-soft);
          margin: 0 0 16px 0;
        }

        .gs-form {
          display: flex;
          gap: 10px;
          align-items: stretch;
        }

        @media (max-width: 640px) {
          .gs-form { flex-direction: column; }
        }

        .gs-input-wrapper {
          position: relative;
          flex: 1;
        }

        .gs-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-soft);
          pointer-events: none;
        }

        .gs-input {
          width: 100%;
          padding: 12px 14px 12px 42px;
          border-radius: 10px;
          border: 1px solid var(--color-border);
          font-size: 14px;
          font-family: var(--font-body);
          background: var(--color-surface);
          color: var(--color-text);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          box-sizing: border-box;
        }

        .gs-input:hover {
          border-color: rgba(11, 110, 79, 0.4);
        }

        .gs-input:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 4px rgba(11, 110, 79, 0.12);
        }

        .gs-create-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 22px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(180deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
          box-shadow: 0 6px 16px rgba(11, 110, 79, 0.24);
        }

        .gs-create-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 22px rgba(11, 110, 79, 0.32);
        }

        .gs-create-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .gs-feedback {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 12px;
          font-size: 13px;
          font-weight: 600;
          padding: 10px 14px;
          border-radius: 10px;
          animation: gsFeedbackIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes gsFeedbackIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .gs-feedback.error {
          background: rgba(206, 17, 38, 0.08);
          color: var(--color-accent-red);
        }

        .gs-feedback.success {
          background: rgba(11, 110, 79, 0.08);
          color: var(--color-primary-dark);
        }

        .gs-list-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-text-soft);
          margin: 32px 0 14px 0;
        }

        .gs-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-width: 720px;
        }

        .gs-card {
          position: relative;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          background: var(--color-surface);
          padding: 18px 22px;
          border-radius: 14px;
          box-shadow: 0 2px 10px rgba(10, 21, 17, 0.06);
          flex-wrap: wrap;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          animation: gsFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .gs-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(10, 21, 17, 0.1);
        }

        .gs-card-info {
          display: flex;
          align-items: center;
          gap: 14px;
          flex: 1;
          min-width: 0;
        }

        .gs-card-icon {
          width: 42px;
          height: 42px;
          min-width: 42px;
          border-radius: 12px;
          background: rgba(11, 110, 79, 0.1);
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gs-card-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--color-text);
          margin: 0 0 4px 0;
          letter-spacing: -0.01em;
        }

        .gs-card-meta {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          color: var(--color-text-soft);
          margin: 0;
        }

        .gs-key-box {
          display: flex;
          align-items: center;
          gap: 4px;
          background: var(--color-bg-strong);
          padding: 6px 6px 6px 12px;
          border-radius: 10px;
          border: 1px solid var(--color-border);
        }

        .gs-key-text {
          font-family: var(--font-mono, monospace);
          font-size: 13px;
          font-weight: 600;
          color: var(--color-primary-dark);
          letter-spacing: 0.02em;
          user-select: all;
        }

        .gs-icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          padding: 7px;
          border-radius: 8px;
          cursor: pointer;
          color: var(--color-text-soft);
          transition: background 0.15s ease, color 0.15s ease, transform 0.15s ease;
        }

        .gs-icon-btn:hover {
          background: var(--color-surface);
          transform: scale(1.05);
        }

        .gs-icon-btn.danger {
          color: var(--color-accent-red);
        }

        .gs-icon-btn.danger:hover {
          background: rgba(206, 17, 38, 0.1);
        }

        .gs-icon-btn.copied {
          color: var(--color-primary);
          background: rgba(11, 110, 79, 0.12);
        }

        .gs-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          padding: 60px 24px;
          background: var(--color-surface);
          border-radius: 16px;
          border: 1px dashed var(--color-border);
          max-width: 720px;
          text-align: center;
        }

        .gs-empty-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(11, 110, 79, 0.08);
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gs-empty-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--color-text);
          margin: 0;
        }

        .gs-empty-text {
          font-size: 13px;
          color: var(--color-text-soft);
          margin: 0;
          max-width: 340px;
          line-height: 1.5;
        }

        .gs-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 21, 17, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 20px;
          animation: gsOverlayIn 0.2s ease;
        }

        @keyframes gsOverlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .gs-modal {
          background: var(--color-surface);
          border-radius: 16px;
          padding: 28px 30px;
          max-width: 440px;
          width: 100%;
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
          animation: gsModalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes gsModalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .gs-modal-icon {
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

        .gs-modal-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--color-text);
          margin: 0 0 10px 0;
          letter-spacing: -0.01em;
        }

        .gs-modal-text {
          font-size: 13px;
          color: var(--color-text-soft);
          line-height: 1.6;
          margin: 0 0 8px 0;
        }

        .gs-modal-text strong {
          color: var(--color-text);
          font-weight: 700;
        }

        .gs-modal-warning {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 12px 14px;
          background: rgba(206, 17, 38, 0.06);
          border-radius: 10px;
          font-size: 12px;
          color: var(--color-accent-red);
          line-height: 1.5;
          margin: 16px 0 20px 0;
        }

        .gs-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }

        .gs-modal-cancel {
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

        .gs-modal-cancel:hover:not(:disabled) {
          background: var(--color-bg-strong);
        }

        .gs-modal-delete {
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

        .gs-modal-delete:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(206, 17, 38, 0.35);
        }

        .gs-modal-delete:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>

      <div>
        <div className="gs-header">
          <h1 className="gs-title">Services & clés d'accès</h1>
          <p className="gs-subtitle">
            Créez un service pour générer sa clé d'accès. Communiquez cette clé aux agents concernés pour qu'ils puissent s'inscrire.
          </p>
        </div>

        <div className="gs-info-banner">
          <Shield size={16} className="gs-info-icon" strokeWidth={2.5} />
          <span>
            <strong>Astuce sécurité :</strong> chaque clé d'accès est unique et sert à valider l'inscription d'un agent au service correspondant. Ne partagez ces clés qu'avec les personnes concernées.
          </span>
        </div>

        <div className="gs-create-card">
          <p className="gs-create-title">
            <Sparkles size={13} strokeWidth={2.5} />
            Créer un nouveau service
          </p>
          <form className="gs-form" onSubmit={handleCreate}>
            <div className="gs-input-wrapper">
              <Building2 size={16} className="gs-input-icon" strokeWidth={2.5} />
              <input
                type="text"
                placeholder="Ex : Direction des Ressources Humaines"
                value={nomService}
                onChange={(e) => {
                  setNomService(e.target.value);
                  setError('');
                  setSuccess('');
                }}
                className="gs-input"
              />
            </div>
            <button type="submit" className="gs-create-btn" disabled={creating}>
              <Plus size={16} strokeWidth={2.5} />
              {creating ? 'Création...' : 'Créer'}
            </button>
          </form>
          {error && (
            <div className="gs-feedback error">
              <AlertCircle size={15} strokeWidth={2.5} />
              {error}
            </div>
          )}
          {success && (
            <div className="gs-feedback success">
              <Check size={15} strokeWidth={2.5} />
              {success}
            </div>
          )}
        </div>

        <p className="gs-list-header">
          <KeyRound size={14} strokeWidth={2.5} />
          Services existants ({services.length})
        </p>

        {services.length === 0 ? (
          <div className="gs-empty">
            <div className="gs-empty-icon">
              <Building2 size={32} strokeWidth={2} />
            </div>
            <p className="gs-empty-title">Aucun service</p>
            <p className="gs-empty-text">
              Créez votre premier service pour générer sa clé d'accès.
            </p>
          </div>
        ) : (
          <div className="gs-list">
            {services.map((s, index) => (
              <div
                key={s.id}
                className="gs-card"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="gs-card-info">
                  <div className="gs-card-icon">
                    <Building2 size={20} strokeWidth={2.5} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h3 className="gs-card-title">{s.nom}</h3>
                    <p className="gs-card-meta">
                      <Clock size={11} strokeWidth={2.5} />
                      Créé le {formatDate(s.dateCreation)}
                    </p>
                  </div>
                </div>

                <div className="gs-key-box">
                  <code className="gs-key-text">{s.cleAcces}</code>
                  <button
                    onClick={() => handleCopy(s.id, s.cleAcces)}
                    className={`gs-icon-btn ${copiedId === s.id ? 'copied' : ''}`}
                    title="Copier la clé"
                  >
                    {copiedId === s.id ? (
                      <Check size={16} strokeWidth={2.5} />
                    ) : (
                      <Copy size={16} strokeWidth={2.5} />
                    )}
                  </button>
                  <button
                    onClick={() => ouvrirDelete(s)}
                    className="gs-icon-btn danger"
                    title="Supprimer le service"
                  >
                    <Trash2 size={16} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {deleteModal && (
          <div className="gs-modal-overlay" onClick={fermerDelete}>
            <div className="gs-modal" onClick={(e) => e.stopPropagation()}>
              <div className="gs-modal-icon">
                <Trash2 size={24} strokeWidth={2.5} />
              </div>
              <h3 className="gs-modal-title">Supprimer le service ?</h3>
              <p className="gs-modal-text">
                Vous êtes sur le point de supprimer le service <strong>« {deleteModal.nom} »</strong>.
              </p>
              <div className="gs-modal-warning">
                <AlertCircle size={14} strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>
                  Cette action est <strong>irréversible</strong>. Les agents utilisant cette clé d'accès ne pourront plus s'inscrire avec elle. Vérifiez qu'aucun utilisateur actif n'est rattaché à ce service avant de continuer.
                </span>
              </div>
              <div className="gs-modal-actions">
                <button
                  className="gs-modal-cancel"
                  onClick={fermerDelete}
                  disabled={deleting}
                >
                  Annuler
                </button>
                <button
                  className="gs-modal-delete"
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