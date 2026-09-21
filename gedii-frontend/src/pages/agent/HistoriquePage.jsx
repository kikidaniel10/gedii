import { useState, useEffect } from 'react';
import { demandeService } from '../../services/demandeService';
import { Calendar, CheckCircle2, AlertTriangle, Zap, Flame, Circle } from 'lucide-react';

const STATUT_CONFIG = {
  EN_ATTENTE: { label: 'En attente', color: 'var(--color-accent-gold)', text: 'var(--color-text)', step: 1 },
  VALIDEE: { label: 'Validée', color: 'var(--color-primary-soft)', text: 'var(--color-primary-dark)', step: 2 },
  EN_COURS: { label: 'En cours', color: 'var(--color-primary)', text: 'var(--color-surface)', step: 3 },
  RESOLUE: { label: 'Résolue', color: 'var(--color-primary-dark)', text: 'var(--color-surface)', step: 4 },
  REJETEE: { label: 'Rejetée', color: 'var(--color-accent-red)', text: 'var(--color-surface)', step: -1 },
};

const URGENCE_CONFIG = {
  FAIBLE: { label: 'Faible', color: 'var(--color-primary)', Icon: Circle },
  NORMALE: { label: 'Normale', color: 'var(--color-accent-gold)', Icon: Zap },
  URGENTE: { label: 'Urgente', color: 'var(--color-accent-red)', Icon: Flame },
};

const STEPS = [
  { key: 'EN_ATTENTE', label: 'Soumise' },
  { key: 'VALIDEE', label: 'Validée' },
  { key: 'EN_COURS', label: 'En cours' },
  { key: 'RESOLUE', label: 'Résolue' },
];

export default function HistoriquePage() {
  const [filtre, setFiltre] = useState('TOUS');
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    demandeService.getMesDemandes()
      .then(setDemandes)
      .catch(() => setDemandes([]))
      .finally(() => setLoading(false));
  }, []);

  const demandesFiltrees =
    filtre === 'TOUS'
      ? demandes
      : demandes.filter((d) => d.statut === filtre);

  return (
    <>
      <style>{`
        .histo-title {
          font-size: 26px;
          color: var(--color-text);
          margin: 0 0 6px 0;
          font-family: var(--font-display);
          letter-spacing: -0.02em;
        }

        .histo-subtitle {
          font-size: 14px;
          color: var(--color-text-soft);
          margin: 0 0 24px 0;
        }

        .histo-filters {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .histo-filter-btn {
          padding: 8px 16px;
          border-radius: 999px;
          border: 1px solid var(--color-border);
          background: var(--color-surface);
          color: var(--color-text-soft);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .histo-filter-btn:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
          transform: translateY(-1px);
        }

        .histo-filter-btn.active {
          background: var(--color-primary);
          border-color: var(--color-primary);
          color: var(--color-surface);
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(11, 110, 79, 0.28);
        }

        .histo-count {
          font-size: 13px;
          color: var(--color-text-soft);
          margin-bottom: 16px;
        }

        .histo-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          max-width: 760px;
        }

        .histo-card {
          position: relative;
          background: var(--color-surface);
          padding: 20px 22px 20px 26px;
          border-radius: 14px;
          box-shadow: 0 2px 8px rgba(10, 21, 17, 0.06);
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          animation: histoFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .histo-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(10, 21, 17, 0.1);
        }

        .histo-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 5px;
          border-radius: 14px 0 0 14px;
        }

        .histo-card.statut-EN_ATTENTE::before { background: var(--color-accent-gold); }
        .histo-card.statut-VALIDEE::before { background: var(--color-primary); }
        .histo-card.statut-EN_COURS::before { background: var(--color-primary); }
        .histo-card.statut-RESOLUE::before { background: var(--color-primary-dark); }
        .histo-card.statut-REJETEE::before { background: var(--color-accent-red); }

        @keyframes histoFadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .histo-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 14px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .histo-card-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--color-text);
          margin: 0 0 6px 0;
          letter-spacing: -0.01em;
        }

        .histo-badges {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }

        .histo-badge {
          padding: 4px 11px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
          letter-spacing: 0.02em;
        }

        .histo-badge-urgence {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .histo-meta {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .histo-meta-item {
          font-size: 12px;
          color: var(--color-text-soft);
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .histo-timeline {
          display: flex;
          align-items: center;
          gap: 0;
          padding: 8px 0;
          border-top: 1px dashed var(--color-border);
          margin-top: 4px;
          padding-top: 14px;
        }

        .histo-step {
          display: flex;
          align-items: center;
          flex: 1;
          gap: 0;
        }

        .histo-step-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid var(--color-border);
          background: var(--color-surface);
          flex-shrink: 0;
          position: relative;
          transition: all 0.3s ease;
        }

        .histo-step-line {
          flex: 1;
          height: 2px;
          background: var(--color-border);
          transition: background 0.3s ease;
        }

        .histo-step.done .histo-step-dot {
          background: var(--color-primary);
          border-color: var(--color-primary);
          box-shadow: 0 0 0 4px rgba(11, 110, 79, 0.15);
        }

        .histo-step.done .histo-step-line {
          background: var(--color-primary);
        }

        .histo-step:last-child .histo-step-line {
          display: none;
        }

        .histo-step-label {
          position: absolute;
          top: 18px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-text-soft);
          white-space: nowrap;
        }

        .histo-step.done .histo-step-label {
          color: var(--color-primary);
        }

        .histo-step-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
          padding-bottom: 22px;
        }

        .histo-rejected-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: rgba(206, 17, 38, 0.08);
          border-radius: 8px;
          font-size: 13px;
          color: var(--color-accent-red);
          font-weight: 500;
          margin-top: 8px;
        }

        .histo-empty {
          color: var(--color-text-soft);
          font-size: 14px;
          padding: 32px 20px;
          text-align: center;
          background: var(--color-surface);
          border-radius: 14px;
          border: 1px dashed var(--color-border);
        }
      `}</style>

      <div>
        <h1 className="histo-title">Mes demandes</h1>
        <p className="histo-subtitle">
          Retrouvez l'historique et le statut de toutes vos demandes.
        </p>

        <div className="histo-filters">
          {['TOUS', 'EN_ATTENTE', 'VALIDEE', 'EN_COURS', 'RESOLUE', 'REJETEE'].map((f) => (
            <button
              key={f}
              onClick={() => setFiltre(f)}
              className={`histo-filter-btn ${filtre === f ? 'active' : ''}`}
            >
              {f === 'TOUS' ? 'Toutes' : STATUT_CONFIG[f].label}
            </button>
          ))}
        </div>

        {!loading && (
          <p className="histo-count">
            {demandesFiltrees.length} demande{demandesFiltrees.length !== 1 ? 's' : ''}
            {filtre !== 'TOUS' ? ` avec le statut « ${STATUT_CONFIG[filtre].label} »` : ''}
          </p>
        )}

        {loading ? (
          <p className="histo-empty">Chargement...</p>
        ) : demandesFiltrees.length === 0 ? (
          <p className="histo-empty">Aucune demande pour ce filtre.</p>
        ) : (
          <div className="histo-list" style={{ maxWidth: '760px' }}>
            {demandesFiltrees.map((d, index) => {
              const statutCfg = STATUT_CONFIG[d.statut];
              const urgenceCfg = URGENCE_CONFIG[d.urgence];
              const UrgenceIcon = urgenceCfg.Icon;
              const currentStep = statutCfg.step;
              const isRejected = d.statut === 'REJETEE';

              return (
                <div
                  key={d.id}
                  className={`histo-card statut-${d.statut}`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="histo-card-header">
                    <h3 className="histo-card-title">{d.titre}</h3>
                    <div className="histo-badges">
                      <span
                        className="histo-badge histo-badge-urgence"
                        style={{ background: urgenceCfg.color, color: d.urgence === 'NORMALE' ? 'var(--color-text)' : '#fff' }}
                      >
                        <UrgenceIcon size={12} strokeWidth={2.5} />
                        {urgenceCfg.label}
                      </span>
                      <span
                        className="histo-badge"
                        style={{ background: statutCfg.color, color: statutCfg.text }}
                      >
                        {statutCfg.label}
                      </span>
                    </div>
                  </div>

                  <div className="histo-meta">
                    <span className="histo-meta-item">
                      <Calendar size={13} strokeWidth={2} />
                      Soumise le {new Date(d.dateCreation).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    {d.dateValidation && (
                      <span className="histo-meta-item">
                        <CheckCircle2 size={13} strokeWidth={2} />
                        Validée le {new Date(d.dateValidation).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                      </span>
                    )}
                  </div>

                  {isRejected ? (
                    <div className="histo-rejected-banner">
                      <AlertTriangle size={16} strokeWidth={2.5} />
                      Cette demande a été rejetée par le responsable.
                    </div>
                  ) : (
                    <div className="histo-timeline">
                      {STEPS.map((step, i) => {
                        const done = i + 1 <= currentStep;
                        return (
                          <div key={step.key} className="histo-step-wrapper">
                            <div className={`histo-step ${done ? 'done' : ''}`}>
                              <div className="histo-step-dot">
                                <span className="histo-step-label">{step.label}</span>
                              </div>
                              <div className="histo-step-line" />
                            </div>
                          </div>
                        );
                      })}
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