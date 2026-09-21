import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight, Clock, Timer, CheckCircle2, Wrench,
  Calendar, FileText, Inbox,
} from 'lucide-react';
import { interventionService } from '../../services/interventionService';

const STATUT_CONFIG = {
  ASSIGNEE: {
    label: 'À démarrer',
    color: 'var(--color-primary-soft)',
    text: 'var(--color-primary-dark)',
    stripe: 'var(--color-primary)',
    Icon: Clock,
  },
  EN_COURS: {
    label: 'En cours',
    color: 'var(--color-accent-gold)',
    text: 'var(--color-text)',
    stripe: 'var(--color-accent-gold)',
    Icon: Timer,
  },
  TERMINEE: {
    label: 'Terminée',
    color: 'var(--color-primary)',
    text: 'var(--color-surface)',
    stripe: 'var(--color-primary-dark)',
    Icon: CheckCircle2,
  },
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

export default function InterventionsAssigneesPage() {
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadInterventions();
  }, []);

  const loadInterventions = () => {
    setLoading(true);
    interventionService.getMesInterventions()
      .then((data) => setInterventions(data))
      .catch(() => setInterventions([]))
      .finally(() => setLoading(false));
  };

  const ouvrirDetail = (it) => {
    navigate(`/technicien/intervention/${it.id}`, { state: { intervention: it } });
  };

  const actives = interventions.filter((it) => it.statut !== 'TERMINEE');
  const terminees = interventions.filter((it) => it.statut === 'TERMINEE');

  return (
    <>
      <style>{`
        .ia-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 16px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }

        .ia-title {
          font-size: 26px;
          color: var(--color-text);
          margin: 0 0 6px 0;
          font-family: var(--font-display);
          letter-spacing: -0.02em;
        }

        .ia-subtitle {
          font-size: 14px;
          color: var(--color-text-soft);
          margin: 0;
        }

        .ia-counter {
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

        .ia-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 12px;
          margin-bottom: 28px;
          max-width: 780px;
        }

        .ia-stat {
          background: var(--color-surface);
          padding: 16px 18px;
          border-radius: 12px;
          border-left: 4px solid var(--stat-color);
          box-shadow: 0 2px 8px rgba(10, 21, 17, 0.05);
          animation: iaFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .ia-stat-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--color-text-soft);
          margin: 0 0 6px 0;
        }

        .ia-stat-value {
          font-size: 24px;
          font-weight: 800;
          color: var(--color-text);
          margin: 0;
          font-family: var(--font-display);
          letter-spacing: -0.02em;
        }

        .ia-section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-text-soft);
          margin: 28px 0 14px 0;
        }

        .ia-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          max-width: 780px;
        }

        .ia-card {
          position: relative;
          background: var(--color-surface);
          padding: 20px 22px 20px 26px;
          border-radius: 14px;
          box-shadow: 0 2px 10px rgba(10, 21, 17, 0.06);
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          animation: iaFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .ia-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(10, 21, 17, 0.1);
        }

        .ia-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 5px;
          border-radius: 14px 0 0 14px;
          background: var(--stripe-color);
        }

        .ia-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 14px;
          flex-wrap: wrap;
        }

        .ia-card-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--color-text);
          margin: 0 0 6px 0;
          letter-spacing: -0.01em;
          line-height: 1.3;
        }

        .ia-card-meta {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          font-size: 12px;
          color: var(--color-text-soft);
        }

        .ia-meta-item {
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .ia-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
        }

        .ia-chevron {
          color: var(--color-text-soft);
          transition: transform 0.2s ease, color 0.2s ease;
          flex-shrink: 0;
        }

        .ia-card:hover .ia-chevron {
          transform: translateX(4px);
          color: var(--color-primary);
        }

        .ia-badges-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ia-cr {
          margin-top: 14px;
          padding: 12px 14px 12px 42px;
          background: var(--color-bg-strong);
          border-radius: 10px;
          font-size: 13px;
          color: var(--color-text);
          line-height: 1.6;
          position: relative;
          white-space: pre-wrap;
        }

        .ia-cr-icon {
          position: absolute;
          left: 14px;
          top: 12px;
          color: var(--color-primary);
        }

        .ia-card-done {
          opacity: 0.85;
        }

        .ia-card-done::before {
          opacity: 0.6;
        }

        @keyframes iaFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .ia-empty {
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

        .ia-empty-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(11, 110, 79, 0.08);
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ia-empty-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--color-text);
          margin: 0;
        }

        .ia-empty-text {
          font-size: 13px;
          color: var(--color-text-soft);
          margin: 0;
          max-width: 340px;
          line-height: 1.5;
        }

        .ia-loading {
          padding: 60px 20px;
          text-align: center;
          color: var(--color-text-soft);
          font-size: 14px;
        }

        .ia-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid var(--color-border);
          border-top-color: var(--color-primary);
          border-radius: 50%;
          animation: iaSpin 0.8s linear infinite;
          margin: 0 auto 16px auto;
        }

        @keyframes iaSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div>
        <div className="ia-header">
          <div>
            <h1 className="ia-title">Mes interventions</h1>
            <p className="ia-subtitle">
              Consultez et traitez les interventions qui vous sont assignées.
            </p>
          </div>
          {!loading && (
            <div className="ia-counter">
              <Wrench size={14} strokeWidth={2.5} />
              {actives.length} active{actives.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {loading ? (
          <div className="ia-loading">
            <div className="ia-spinner"></div>
            Chargement des interventions...
          </div>
        ) : (
          <>
            {/* Statistiques */}
            {interventions.length > 0 && (
              <div className="ia-stats">
                <div className="ia-stat" style={{ '--stat-color': 'var(--color-primary)', animationDelay: '0s' }}>
                  <p className="ia-stat-label">
                    <Wrench size={12} strokeWidth={2.5} /> Total
                  </p>
                  <p className="ia-stat-value">{interventions.length}</p>
                </div>
                <div className="ia-stat" style={{ '--stat-color': 'var(--color-primary-soft)', animationDelay: '0.05s' }}>
                  <p className="ia-stat-label">
                    <Clock size={12} strokeWidth={2.5} /> À démarrer
                  </p>
                  <p className="ia-stat-value">
                    {interventions.filter((i) => i.statut === 'ASSIGNEE').length}
                  </p>
                </div>
                <div className="ia-stat" style={{ '--stat-color': 'var(--color-accent-gold)', animationDelay: '0.1s' }}>
                  <p className="ia-stat-label">
                    <Timer size={12} strokeWidth={2.5} /> En cours
                  </p>
                  <p className="ia-stat-value">
                    {interventions.filter((i) => i.statut === 'EN_COURS').length}
                  </p>
                </div>
                <div className="ia-stat" style={{ '--stat-color': 'var(--color-primary-dark)', animationDelay: '0.15s' }}>
                  <p className="ia-stat-label">
                    <CheckCircle2 size={12} strokeWidth={2.5} /> Terminées
                  </p>
                  <p className="ia-stat-value">{terminees.length}</p>
                </div>
              </div>
            )}

            {/* Interventions actives */}
            {actives.length === 0 ? (
              <div className="ia-empty">
                <div className="ia-empty-icon">
                  <Inbox size={32} strokeWidth={2} />
                </div>
                <p className="ia-empty-title">Aucune intervention active</p>
                <p className="ia-empty-text">
                  Vous n'avez aucune intervention en cours ou à démarrer. Vous serez notifié lorsqu'une nouvelle intervention vous sera assignée.
                </p>
              </div>
            ) : (
              <div className="ia-list">
                {actives.map((it, index) => {
                  const statutCfg = STATUT_CONFIG[it.statut];
                  const StatutIcon = statutCfg.Icon;
                  return (
                    <div
                      key={it.id}
                      className="ia-card"
                      style={{
                        '--stripe-color': statutCfg.stripe,
                        animationDelay: `${index * 0.05}s`,
                      }}
                      onClick={() => ouvrirDetail(it)}
                    >
                      <div className="ia-card-header">
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h3 className="ia-card-title">{it.demandeTitre}</h3>
                          <div className="ia-card-meta">
                            {it.dateDebut ? (
                              <span className="ia-meta-item">
                                <Calendar size={12} strokeWidth={2.5} />
                                Démarrée le {formatDate(it.dateDebut)}
                              </span>
                            ) : (
                              <span className="ia-meta-item">
                                <Clock size={12} strokeWidth={2.5} />
                                En attente de démarrage
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="ia-badges-wrapper">
                          <span
                            className="ia-badge"
                            style={{ background: statutCfg.color, color: statutCfg.text }}
                          >
                            <StatutIcon size={12} strokeWidth={2.5} />
                            {statutCfg.label}
                          </span>
                          <ChevronRight size={18} className="ia-chevron" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Interventions terminées */}
            {terminees.length > 0 && (
              <>
                <p className="ia-section-title">
                  <CheckCircle2 size={14} strokeWidth={2.5} />
                  Terminées récemment ({terminees.length})
                </p>
                <div className="ia-list">
                  {terminees.map((it, index) => {
                    const statutCfg = STATUT_CONFIG.TERMINEE;
                    const StatutIcon = statutCfg.Icon;
                    return (
                      <div
                        key={it.id}
                        className="ia-card ia-card-done"
                        style={{
                          '--stripe-color': statutCfg.stripe,
                          animationDelay: `${index * 0.05}s`,
                        }}
                        onClick={() => ouvrirDetail(it)}
                      >
                        <div className="ia-card-header">
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h3 className="ia-card-title">{it.demandeTitre}</h3>
                            <div className="ia-card-meta">
                              {it.dateFin && (
                                <span className="ia-meta-item">
                                  <CheckCircle2 size={12} strokeWidth={2.5} />
                                  Terminée le {formatDate(it.dateFin)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="ia-badges-wrapper">
                            <span
                              className="ia-badge"
                              style={{ background: statutCfg.color, color: statutCfg.text }}
                            >
                              <StatutIcon size={12} strokeWidth={2.5} />
                              {statutCfg.label}
                            </span>
                            <ChevronRight size={18} className="ia-chevron" />
                          </div>
                        </div>
                        {it.compteRendu && (
                          <div className="ia-cr">
                            <FileText size={16} strokeWidth={2.5} className="ia-cr-icon" />
                            {it.compteRendu}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}