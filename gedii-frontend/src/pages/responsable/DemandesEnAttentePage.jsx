import { useState, useEffect } from 'react';
import {
  Check, X, Circle, Zap, Flame, Clock, User as UserIcon, AlertCircle, Inbox,
} from 'lucide-react';
import { demandeService } from '../../services/demandeService';

const URGENCE_CONFIG = {
  FAIBLE: { label: 'Faible', color: 'var(--color-primary)', text: '#fff', Icon: Circle },
  NORMALE: { label: 'Normale', color: 'var(--color-accent-gold)', text: 'var(--color-text)', Icon: Zap },
  URGENTE: { label: 'Urgente', color: 'var(--color-accent-red)', text: '#fff', Icon: Flame },
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

export default function DemandesEnAttentePage() {
  const [demandes, setDemandes] = useState([]);
  const [confirmAction, setConfirmAction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionEnCours, setActionEnCours] = useState(false);

  useEffect(() => {
    loadDemandes();
  }, []);

  const loadDemandes = () => {
    setLoading(true);
    demandeService.getEnAttente()
      .then(setDemandes)
      .catch(() => setDemandes([]))
      .finally(() => setLoading(false));
  };

  const handleAction = (id, type) => {
    setActionEnCours(true);
    const action = type === 'valider'
      ? demandeService.valider(id)
      : demandeService.rejeter(id);

    action
      .then(() => {
        setConfirmAction(null);
        loadDemandes();
      })
      .catch(() => setConfirmAction(null))
      .finally(() => setActionEnCours(false));
  };

  return (
    <>
      <style>{`
        .dea-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 16px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }

        .dea-title {
          font-size: 26px;
          color: var(--color-text);
          margin: 0 0 6px 0;
          font-family: var(--font-display);
          letter-spacing: -0.02em;
        }

        .dea-subtitle {
          font-size: 14px;
          color: var(--color-text-soft);
          margin: 0;
        }

        .dea-counter {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 999px;
          background: rgba(252, 209, 22, 0.15);
          color: #8a6d00;
          font-size: 13px;
          font-weight: 700;
          border: 1px solid rgba(252, 209, 22, 0.3);
        }

        .dea-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 760px;
        }

        .dea-card {
          position: relative;
          background: var(--color-surface);
          padding: 22px 24px 22px 28px;
          border-radius: 14px;
          box-shadow: 0 2px 10px rgba(10, 21, 17, 0.06);
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          animation: deaFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .dea-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(10, 21, 17, 0.1);
        }

        .dea-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 5px;
          border-radius: 14px 0 0 14px;
        }

        .dea-card.urgence-FAIBLE::before { background: var(--color-primary); }
        .dea-card.urgence-NORMALE::before { background: var(--color-accent-gold); }
        .dea-card.urgence-URGENTE::before { background: var(--color-accent-red); }

        @keyframes deaFadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dea-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 14px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .dea-card-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--color-text);
          margin: 0 0 6px 0;
          letter-spacing: -0.01em;
          line-height: 1.3;
        }

        .dea-card-meta {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          font-size: 12px;
          color: var(--color-text-soft);
        }

        .dea-meta-item {
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .dea-badge-urgence {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
          letter-spacing: 0.02em;
        }

        .dea-description {
          font-size: 14px;
          color: var(--color-text-soft);
          line-height: 1.6;
          margin: 0 0 18px 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .dea-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .dea-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 18px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
          border: none;
        }

        .dea-btn:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .dea-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .dea-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .dea-btn-validate {
          background: linear-gradient(180deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
          color: #fff;
          box-shadow: 0 6px 16px rgba(11, 110, 79, 0.24);
        }

        .dea-btn-validate:hover:not(:disabled) {
          box-shadow: 0 10px 22px rgba(11, 110, 79, 0.32);
        }

        .dea-btn-reject {
          background: transparent;
          color: var(--color-accent-red);
          border: 1.5px solid var(--color-accent-red);
        }

        .dea-btn-reject:hover:not(:disabled) {
          background: rgba(206, 17, 38, 0.06);
        }

        .dea-confirm {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          border-radius: 12px;
          background: var(--color-bg-strong);
          flex-wrap: wrap;
          animation: deaConfirmIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes deaConfirmIn {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .dea-confirm-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .dea-confirm-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .dea-confirm-text {
          font-size: 13px;
          font-weight: 600;
          color: var(--color-text);
          margin: 0;
        }

        .dea-confirm-subtext {
          font-size: 11px;
          color: var(--color-text-soft);
          margin: 2px 0 0 0;
        }

        .dea-confirm-actions {
          display: flex;
          gap: 8px;
        }

        .dea-confirm-yes {
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          font-size: 13px;
          font-weight: 700;
          color: #fff;
          cursor: pointer;
          transition: transform 0.15s ease, opacity 0.15s ease;
        }

        .dea-confirm-yes:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .dea-confirm-yes:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .dea-confirm-cancel {
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px solid var(--color-border);
          background: transparent;
          color: var(--color-text-soft);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .dea-confirm-cancel:hover {
          background: var(--color-surface);
        }

        .dea-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          padding: 60px 24px;
          background: var(--color-surface);
          border-radius: 16px;
          border: 1px dashed var(--color-border);
          max-width: 760px;
          text-align: center;
          animation: deaFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .dea-empty-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(11, 110, 79, 0.08);
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dea-empty-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--color-text);
          margin: 0;
        }

        .dea-empty-text {
          font-size: 13px;
          color: var(--color-text-soft);
          margin: 0;
          max-width: 340px;
          line-height: 1.5;
        }

        .dea-loading {
          padding: 60px 20px;
          text-align: center;
          color: var(--color-text-soft);
          font-size: 14px;
        }

        .dea-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid var(--color-border);
          border-top-color: var(--color-primary);
          border-radius: 50%;
          animation: deaSpin 0.8s linear infinite;
          margin: 0 auto 16px auto;
        }

        @keyframes deaSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div>
        <div className="dea-header">
          <div>
            <h1 className="dea-title">Demandes en attente</h1>
            <p className="dea-subtitle">
              Validez ou rejetez les demandes soumises par les agents.
            </p>
          </div>
          {!loading && demandes.length > 0 && (
            <div className="dea-counter">
              <Clock size={14} strokeWidth={2.5} />
              {demandes.length} à traiter
            </div>
          )}
        </div>

        {loading ? (
          <div className="dea-loading">
            <div className="dea-spinner"></div>
            Chargement des demandes...
          </div>
        ) : demandes.length === 0 ? (
          <div className="dea-empty">
            <div className="dea-empty-icon">
              <Inbox size={32} strokeWidth={2} />
            </div>
            <p className="dea-empty-title">Aucune demande en attente</p>
            <p className="dea-empty-text">
              Toutes les demandes ont été traitées. Vous serez notifié dès qu'une nouvelle demande sera soumise.
            </p>
          </div>
        ) : (
          <div className="dea-list">
            {demandes.map((d, index) => {
              const urgenceCfg = URGENCE_CONFIG[d.urgence];
              const UrgenceIcon = urgenceCfg.Icon;
              const isConfirming = confirmAction?.id === d.id;
              const isValider = confirmAction?.type === 'valider';

              return (
                <div
                  key={d.id}
                  className={`dea-card urgence-${d.urgence}`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="dea-card-header">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 className="dea-card-title">{d.titre}</h3>
                      <div className="dea-card-meta">
                        <span className="dea-meta-item">
                          <UserIcon size={12} strokeWidth={2.5} />
                          {d.agentNom}
                        </span>
                        <span className="dea-meta-item">
                          <Clock size={12} strokeWidth={2.5} />
                          {formatDate(d.dateCreation)}
                        </span>
                      </div>
                    </div>
                    <span
                      className="dea-badge-urgence"
                      style={{ background: urgenceCfg.color, color: urgenceCfg.text }}
                    >
                      <UrgenceIcon size={12} strokeWidth={2.5} />
                      {urgenceCfg.label}
                    </span>
                  </div>

                  <p className="dea-description">{d.description}</p>

                  {isConfirming ? (
                    <div className="dea-confirm">
                      <div className="dea-confirm-left">
                        <div
                          className="dea-confirm-icon"
                          style={{
                            background: isValider ? 'rgba(11, 110, 79, 0.12)' : 'rgba(206, 17, 38, 0.12)',
                            color: isValider ? 'var(--color-primary)' : 'var(--color-accent-red)',
                          }}
                        >
                          {isValider ? <Check size={18} strokeWidth={2.5} /> : <X size={18} strokeWidth={2.5} />}
                        </div>
                        <div>
                          <p className="dea-confirm-text">
                            {isValider ? 'Valider cette demande ?' : 'Rejeter cette demande ?'}
                          </p>
                          <p className="dea-confirm-subtext">
                            {isValider
                              ? 'Elle pourra ensuite être assignée à un technicien.'
                              : 'Cette action est définitive et notifiera l\'agent.'}
                          </p>
                        </div>
                      </div>
                      <div className="dea-confirm-actions">
                        <button
                          className="dea-confirm-yes"
                          onClick={() => handleAction(d.id, confirmAction.type)}
                          disabled={actionEnCours}
                          style={{
                            background: isValider ? 'var(--color-primary)' : 'var(--color-accent-red)',
                          }}
                        >
                          {actionEnCours ? '...' : `Oui, ${isValider ? 'valider' : 'rejeter'}`}
                        </button>
                        <button
                          className="dea-confirm-cancel"
                          onClick={() => setConfirmAction(null)}
                          disabled={actionEnCours}
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="dea-actions">
                      <button
                        className="dea-btn dea-btn-validate"
                        onClick={() => setConfirmAction({ id: d.id, type: 'valider' })}
                      >
                        <Check size={16} strokeWidth={2.5} />
                        Valider
                      </button>
                      <button
                        className="dea-btn dea-btn-reject"
                        onClick={() => setConfirmAction({ id: d.id, type: 'rejeter' })}
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
      </div>
    </>
  );
}