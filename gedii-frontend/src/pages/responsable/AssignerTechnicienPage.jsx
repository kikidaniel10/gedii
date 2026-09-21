import { useState, useEffect } from 'react';
import {
  UserCheck, Circle, Zap, Flame, Clock, User as UserIcon,
  ChevronDown, AlertCircle, CheckCircle2, X, Users, Inbox,
} from 'lucide-react';
import { demandeService } from '../../services/demandeService';
import { utilisateurService } from '../../services/utilisateurService';
import { interventionService } from '../../services/interventionService';

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

export default function AssignerTechnicienPage() {
  const [demandes, setDemandes] = useState([]);
  const [techniciens, setTechniciens] = useState([]);
  const [selection, setSelection] = useState({});
  const [confirmId, setConfirmId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionEnCours, setActionEnCours] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      demandeService.getValidees(),
      utilisateurService.getTechniciens(),
    ])
      .then(([demandesData, utilisateursData]) => {
        setDemandes(demandesData);
        setTechniciens(utilisateursData.filter((u) => u.role === 'TECHNICIEN'));
      })
      .catch(() => {
        setDemandes([]);
        setTechniciens([]);
      })
      .finally(() => setLoading(false));
  };

  const handleSelect = (demandeId, technicienId) => {
    setSelection({ ...selection, [demandeId]: technicienId });
  };

  const confirmerAssignation = (demandeId) => {
    const technicienId = selection[demandeId];
    setActionEnCours(true);
    interventionService.assigner(demandeId, technicienId)
      .then(() => {
        setConfirmId(null);
        loadData();
      })
      .catch(() => setConfirmId(null))
      .finally(() => setActionEnCours(false));
  };

  return (
    <>
      <style>{`
        .ass-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 16px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }

        .ass-title {
          font-size: 26px;
          color: var(--color-text);
          margin: 0 0 6px 0;
          font-family: var(--font-display);
          letter-spacing: -0.02em;
        }

        .ass-subtitle {
          font-size: 14px;
          color: var(--color-text-soft);
          margin: 0;
        }

        .ass-counter {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 999px;
          background: rgba(11, 110, 79, 0.12);
          color: var(--color-primary-dark);
          font-size: 13px;
          font-weight: 700;
          border: 1px solid rgba(11, 110, 79, 0.2);
        }

        .ass-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 760px;
        }

        .ass-card {
          position: relative;
          background: var(--color-surface);
          padding: 22px 24px 22px 28px;
          border-radius: 14px;
          box-shadow: 0 2px 10px rgba(10, 21, 17, 0.06);
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          animation: assFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .ass-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(10, 21, 17, 0.1);
        }

        .ass-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 5px;
          border-radius: 14px 0 0 14px;
        }

        .ass-card.urgence-FAIBLE::before { background: var(--color-primary); }
        .ass-card.urgence-NORMALE::before { background: var(--color-accent-gold); }
        .ass-card.urgence-URGENTE::before { background: var(--color-accent-red); }

        @keyframes assFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .ass-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 14px;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }

        .ass-card-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--color-text);
          margin: 0 0 6px 0;
          letter-spacing: -0.01em;
          line-height: 1.3;
        }

        .ass-card-meta {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          font-size: 12px;
          color: var(--color-text-soft);
        }

        .ass-meta-item {
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .ass-badge-urgence {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
        }

        .ass-assign-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
        }

        .ass-select-wrapper {
          position: relative;
          flex: 1;
          min-width: 220px;
        }

        .ass-select {
          width: 100%;
          padding: 11px 40px 11px 14px;
          border-radius: 10px;
          border: 1px solid var(--color-border);
          font-size: 14px;
          font-weight: 500;
          background: var(--color-surface);
          color: var(--color-text);
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .ass-select:hover {
          border-color: rgba(11, 110, 79, 0.4);
        }

        .ass-select:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 4px rgba(11, 110, 79, 0.12);
        }

        .ass-select-chevron {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: var(--color-text-soft);
        }

        .ass-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 11px 20px;
          border-radius: 10px;
          border: none;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
        }

        .ass-btn-primary {
          background: linear-gradient(180deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
          color: #fff;
          box-shadow: 0 6px 16px rgba(11, 110, 79, 0.24);
        }

        .ass-btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 22px rgba(11, 110, 79, 0.32);
        }

        .ass-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .ass-confirm {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          border-radius: 12px;
          background: var(--color-bg-strong);
          flex-wrap: wrap;
          animation: assConfirmIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes assConfirmIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }

        .ass-confirm-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ass-confirm-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--color-primary);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
          overflow: hidden;
          flex-shrink: 0;
        }

        .ass-confirm-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .ass-confirm-text {
          font-size: 13px;
          color: var(--color-text);
          margin: 0;
          font-weight: 500;
        }

        .ass-confirm-text strong {
          font-weight: 700;
        }

        .ass-confirm-actions {
          display: flex;
          gap: 8px;
        }

        .ass-confirm-yes {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          background: var(--color-primary);
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.15s ease;
        }

        .ass-confirm-yes:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .ass-confirm-yes:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .ass-confirm-cancel {
          display: inline-flex;
          align-items: center;
          gap: 6px;
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

        .ass-confirm-cancel:hover {
          background: var(--color-surface);
        }

        .ass-section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-text-soft);
          margin: 32px 0 16px 0;
        }

        .ass-tech-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 12px;
          max-width: 900px;
        }

        .ass-tech-card {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--color-surface);
          padding: 14px 16px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(10, 21, 17, 0.05);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          animation: assFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .ass-tech-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(10, 21, 17, 0.1);
        }

        .ass-tech-avatar {
          width: 40px;
          height: 40px;
          min-width: 40px;
          border-radius: 50%;
          background: var(--color-primary-soft);
          color: var(--color-primary-dark);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          overflow: hidden;
          position: relative;
        }

        .ass-tech-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .ass-tech-avatar::after {
          content: '';
          position: absolute;
          bottom: 0;
          right: 0;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #22c55e;
          border: 2px solid var(--color-surface);
        }

        .ass-tech-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--color-text);
          margin: 0;
        }

        .ass-tech-meta {
          font-size: 11px;
          color: var(--color-text-soft);
          margin: 2px 0 0 0;
          font-family: var(--font-mono, monospace);
        }

        .ass-empty {
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
          animation: assFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .ass-empty-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(11, 110, 79, 0.08);
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ass-empty-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--color-text);
          margin: 0;
        }

        .ass-empty-text {
          font-size: 13px;
          color: var(--color-text-soft);
          margin: 0;
          max-width: 340px;
          line-height: 1.5;
        }

        .ass-loading {
          padding: 60px 20px;
          text-align: center;
          color: var(--color-text-soft);
          font-size: 14px;
        }

        .ass-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid var(--color-border);
          border-top-color: var(--color-primary);
          border-radius: 50%;
          animation: assSpin 0.8s linear infinite;
          margin: 0 auto 16px auto;
        }

        @keyframes assSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div>
        <div className="ass-header">
          <div>
            <h1 className="ass-title">Assigner un technicien</h1>
            <p className="ass-subtitle">
              Sélectionnez un technicien pour chaque demande validée.
            </p>
          </div>
          {!loading && demandes.length > 0 && (
            <div className="ass-counter">
              <UserCheck size={14} strokeWidth={2.5} />
              {demandes.length} à assigner
            </div>
          )}
        </div>

        {loading ? (
          <div className="ass-loading">
            <div className="ass-spinner"></div>
            Chargement des demandes...
          </div>
        ) : demandes.length === 0 ? (
          <div className="ass-empty">
            <div className="ass-empty-icon">
              <Inbox size={32} strokeWidth={2} />
            </div>
            <p className="ass-empty-title">Aucune demande à assigner</p>
            <p className="ass-empty-text">
              Toutes les demandes validées ont déjà été assignées. Validez de nouvelles demandes pour les voir apparaître ici.
            </p>
          </div>
        ) : (
          <div className="ass-list">
            {demandes.map((d, index) => {
              const urgenceCfg = URGENCE_CONFIG[d.urgence];
              const UrgenceIcon = urgenceCfg.Icon;
              const technicienChoisi = selection[d.id];
              const isConfirming = confirmId === d.id;
              const tech = techniciens.find((t) => t.id === technicienChoisi);
              const techInitials = tech?.nom
                ? tech.nom.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
                : '?';

              return (
                <div
                  key={d.id}
                  className={`ass-card urgence-${d.urgence}`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="ass-card-header">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 className="ass-card-title">{d.titre}</h3>
                      <div className="ass-card-meta">
                        <span className="ass-meta-item">
                          <UserIcon size={12} strokeWidth={2.5} />
                          {d.agentNom}
                        </span>
                        <span className="ass-meta-item">
                          <Clock size={12} strokeWidth={2.5} />
                          Validée le {formatDate(d.dateValidation)}
                        </span>
                      </div>
                    </div>
                    <span
                      className="ass-badge-urgence"
                      style={{ background: urgenceCfg.color, color: urgenceCfg.text }}
                    >
                      <UrgenceIcon size={12} strokeWidth={2.5} />
                      {urgenceCfg.label}
                    </span>
                  </div>

                  {isConfirming ? (
                    <div className="ass-confirm">
                      <div className="ass-confirm-left">
                        <div className="ass-confirm-avatar">
                          {tech?.photoUrl ? (
                            <img src={tech.photoUrl} alt={tech.nom} />
                          ) : (
                            techInitials
                          )}
                        </div>
                        <p className="ass-confirm-text">
                          Confirmer l'assignation à <strong>{tech?.nom}</strong> ?
                        </p>
                      </div>
                      <div className="ass-confirm-actions">
                        <button
                          className="ass-confirm-yes"
                          onClick={() => confirmerAssignation(d.id)}
                          disabled={actionEnCours}
                        >
                          <CheckCircle2 size={14} strokeWidth={2.5} />
                          {actionEnCours ? 'Assignation...' : 'Confirmer'}
                        </button>
                        <button
                          className="ass-confirm-cancel"
                          onClick={() => setConfirmId(null)}
                          disabled={actionEnCours}
                        >
                          <X size={14} strokeWidth={2.5} />
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="ass-assign-row">
                      <div className="ass-select-wrapper">
                        <select
                          className="ass-select"
                          value={technicienChoisi || ''}
                          onChange={(e) => handleSelect(d.id, Number(e.target.value))}
                        >
                          <option value="">Choisir un technicien...</option>
                          {techniciens.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.nom} — {t.matricule}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={16} className="ass-select-chevron" />
                      </div>
                      <button
                        className="ass-btn ass-btn-primary"
                        onClick={() => setConfirmId(d.id)}
                        disabled={!technicienChoisi}
                      >
                        <UserCheck size={16} strokeWidth={2.5} />
                        Assigner
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <p className="ass-section-title">
          <Users size={14} strokeWidth={2.5} />
          Techniciens actifs ({techniciens.length})
        </p>
        <div className="ass-tech-grid">
          {techniciens.length === 0 ? (
            <p style={{ color: 'var(--color-text-soft)', fontSize: '14px' }}>
              Aucun technicien actif pour le moment.
            </p>
          ) : (
            techniciens.map((t, i) => (
              <div
                key={t.id}
                className="ass-tech-card"
                style={{ animationDelay: `${i * 0.03}s` }}
              >
                <div className="ass-tech-avatar">
                  {t.photoUrl ? (
                    <img src={t.photoUrl} alt={t.nom} />
                  ) : (
                    t.nom.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
                  )}
                </div>
                <div>
                  <p className="ass-tech-name">{t.nom}</p>
                  <p className="ass-tech-meta">{t.matricule}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}