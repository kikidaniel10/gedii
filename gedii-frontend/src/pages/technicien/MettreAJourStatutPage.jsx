import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft, Play, CheckCircle2, Clock, Calendar,
  FileText, AlertCircle, ClipboardCheck, Timer, Flag, Info,
} from 'lucide-react';
import { interventionService } from '../../services/interventionService';

const MAX_CR = 1500;

const STATUT_CONFIG = {
  ASSIGNEE: {
    label: 'À démarrer',
    color: 'var(--color-primary-soft)',
    text: 'var(--color-primary-dark)',
    dot: 'var(--color-primary)',
    Icon: Flag,
  },
  EN_COURS: {
    label: 'En cours',
    color: 'var(--color-accent-gold)',
    text: 'var(--color-text)',
    dot: 'var(--color-accent-gold)',
    Icon: Timer,
  },
  TERMINEE: {
    label: 'Terminée',
    color: 'var(--color-primary)',
    text: 'var(--color-surface)',
    dot: 'var(--color-primary)',
    Icon: CheckCircle2,
  },
};

const formatDateLong = (date) =>
  new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const formatDate = (date) =>
  new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

export default function MettreAJourStatutPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [intervention, setIntervention] = useState(location.state?.intervention || null);
  const [compteRenduDraft, setCompteRenduDraft] = useState('');
  const [loading, setLoading] = useState(!location.state?.intervention);
  const [actionEnCours, setActionEnCours] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!intervention) {
      interventionService.getMesInterventions()
        .then((data) => {
          const found = data.find((it) => String(it.id) === String(id));
          setIntervention(found || null);
        })
        .catch(() => setIntervention(null))
        .finally(() => setLoading(false));
    }
  }, [id, intervention]);

  const demarrer = () => {
    setActionEnCours(true);
    setError('');
    interventionService.demarrer(intervention.id)
      .then(() => {
        setIntervention({ ...intervention, statut: 'EN_COURS', dateDebut: new Date().toISOString() });
      })
      .catch((err) => {
        setError(err.response?.data?.erreur || 'Erreur lors du démarrage');
      })
      .finally(() => setActionEnCours(false));
  };

  const cloturer = () => {
    if (!compteRenduDraft.trim()) return;
    setActionEnCours(true);
    setError('');
    interventionService.cloturer(intervention.id, compteRenduDraft)
      .then(() => {
        setIntervention({
          ...intervention,
          statut: 'TERMINEE',
          compteRendu: compteRenduDraft,
          dateFin: new Date().toISOString(),
        });
      })
      .catch((err) => {
        setError(err.response?.data?.erreur || 'Erreur lors de la clôture');
      })
      .finally(() => setActionEnCours(false));
  };

  if (loading) {
    return (
      <>
        <style>{`
          .mus-loading {
            padding: 60px 20px;
            text-align: center;
            color: var(--color-text-soft);
            font-size: 14px;
          }
          .mus-spinner {
            width: 32px;
            height: 32px;
            border: 3px solid var(--color-border);
            border-top-color: var(--color-primary);
            border-radius: 50%;
            animation: musSpin 0.8s linear infinite;
            margin: 0 auto 16px auto;
          }
          @keyframes musSpin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        <div className="mus-loading">
          <div className="mus-spinner"></div>
          Chargement de l'intervention...
        </div>
      </>
    );
  }

  if (!intervention) {
    return (
      <>
        <style>{`
          .mus-notfound {
            max-width: 480px;
            margin: 40px auto;
            padding: 40px 32px;
            text-align: center;
            background: var(--color-surface);
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(10, 21, 17, 0.08);
          }
          .mus-notfound-icon {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background: rgba(206, 17, 38, 0.1);
            color: var(--color-accent-red);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px auto;
          }
          .mus-notfound-title {
            font-size: 20px;
            font-weight: 700;
            color: var(--color-text);
            margin: 0 0 8px 0;
          }
          .mus-notfound-text {
            font-size: 14px;
            color: var(--color-text-soft);
            margin: 0 0 24px 0;
          }
          .mus-notfound-btn {
            padding: 10px 20px;
            border-radius: 8px;
            border: none;
            background: var(--color-primary);
            color: #fff;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
          }
        `}</style>
        <div className="mus-notfound">
          <div className="mus-notfound-icon">
            <AlertCircle size={32} strokeWidth={2.5} />
          </div>
          <h2 className="mus-notfound-title">Intervention introuvable</h2>
          <p className="mus-notfound-text">
            Cette intervention n'existe plus ou vous n'avez pas accès à ces informations.
          </p>
          <button
            className="mus-notfound-btn"
            onClick={() => navigate('/technicien/interventions')}
          >
            Retour à mes interventions
          </button>
        </div>
      </>
    );
  }

  const statutCfg = STATUT_CONFIG[intervention.statut];
  const StatutIcon = statutCfg.Icon;

  const steps = [
    { key: 'ASSIGNEE', label: 'Assignée', Icon: Flag, description: 'Intervention reçue' },
    { key: 'EN_COURS', label: 'En cours', Icon: Timer, description: 'Traitement en cours' },
    { key: 'TERMINEE', label: 'Terminée', Icon: CheckCircle2, description: 'Intervention clôturée' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === intervention.statut);

  return (
    <>
      <style>{`
        .mus-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          color: var(--color-primary);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          padding: 6px 10px 6px 0;
          margin-bottom: 18px;
          transition: transform 0.2s ease;
        }
        .mus-back:hover {
          transform: translateX(-3px);
        }

        .mus-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }

        .mus-title {
          font-size: 26px;
          color: var(--color-text);
          margin: 0 0 8px 0;
          font-family: var(--font-display);
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .mus-subtitle {
          font-size: 13px;
          color: var(--color-text-soft);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .mus-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
          white-space: nowrap;
          height: fit-content;
          letter-spacing: 0.01em;
        }

        .mus-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 20px;
          align-items: start;
        }

        @media (max-width: 900px) {
          .mus-grid {
            grid-template-columns: 1fr;
          }
        }

        .mus-card {
          background: var(--color-surface);
          padding: 26px 28px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(10, 21, 17, 0.06);
          animation: musCardIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .mus-card + .mus-card {
          margin-top: 0;
        }

        @keyframes musCardIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .mus-section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-text-soft);
          margin: 0 0 16px 0;
        }

        .mus-timeline {
          display: flex;
          flex-direction: column;
          gap: 0;
          padding: 0;
          margin: 0;
        }

        .mus-tl-item {
          display: flex;
          gap: 16px;
          position: relative;
          padding-bottom: 24px;
        }

        .mus-tl-item:last-child {
          padding-bottom: 0;
        }

        .mus-tl-marker {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
        }

        .mus-tl-dot {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--color-border);
          background: var(--color-surface);
          color: var(--color-text-soft);
          transition: all 0.3s ease;
          z-index: 1;
        }

        .mus-tl-dot.done {
          background: var(--color-primary);
          border-color: var(--color-primary);
          color: #fff;
          box-shadow: 0 0 0 4px rgba(11, 110, 79, 0.12);
        }

        .mus-tl-dot.current {
          background: var(--color-accent-gold);
          border-color: var(--color-accent-gold);
          color: var(--color-text);
          box-shadow: 0 0 0 6px rgba(252, 209, 22, 0.18);
          animation: musPulse 2s ease-in-out infinite;
        }

        @keyframes musPulse {
          0%, 100% { box-shadow: 0 0 0 6px rgba(252, 209, 22, 0.18); }
          50% { box-shadow: 0 0 0 12px rgba(252, 209, 22, 0); }
        }

        .mus-tl-line {
          flex: 1;
          width: 2px;
          background: var(--color-border);
          margin-top: 4px;
          margin-bottom: -4px;
          border-radius: 2px;
        }

        .mus-tl-line.done {
          background: var(--color-primary);
        }

        .mus-tl-content {
          padding-top: 6px;
          flex: 1;
        }

        .mus-tl-label {
          font-size: 15px;
          font-weight: 700;
          color: var(--color-text);
          margin: 0 0 2px 0;
        }

        .mus-tl-label.pending {
          color: var(--color-text-soft);
        }

        .mus-tl-desc {
          font-size: 12px;
          color: var(--color-text-soft);
          margin: 0;
          line-height: 1.4;
        }

        .mus-info-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .mus-info-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 10px;
          background: var(--color-bg-strong);
          transition: transform 0.2s ease;
        }

        .mus-info-item:hover {
          transform: translateX(2px);
        }

        .mus-info-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(11, 110, 79, 0.1);
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .mus-info-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--color-text-soft);
          margin: 0 0 3px 0;
        }

        .mus-info-value {
          font-size: 13px;
          font-weight: 600;
          color: var(--color-text);
          margin: 0;
          line-height: 1.4;
        }

        .mus-cr-label {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 8px;
        }

        .mus-cr-count {
          font-size: 11px;
          font-weight: 600;
          color: var(--color-text-soft);
          font-family: var(--font-mono, monospace);
        }

        .mus-cr-count.warn {
          color: var(--color-accent-gold);
        }

        .mus-cr-count.danger {
          color: var(--color-accent-red);
        }

        .mus-textarea {
          width: 100%;
          padding: 14px 16px;
          border-radius: 10px;
          border: 1px solid var(--color-border);
          font-size: 14px;
          font-family: var(--font-body);
          background: var(--color-surface);
          color: var(--color-text);
          resize: vertical;
          min-height: 140px;
          line-height: 1.6;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          box-sizing: border-box;
        }

        .mus-textarea:hover {
          border-color: rgba(11, 110, 79, 0.4);
        }

        .mus-textarea:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 4px rgba(11, 110, 79, 0.12);
        }

        .mus-cr-readonly {
          padding: 18px 20px;
          background: var(--color-bg-strong);
          border-left: 4px solid var(--color-primary);
          border-radius: 10px;
          font-size: 14px;
          color: var(--color-text);
          line-height: 1.7;
          white-space: pre-wrap;
          margin: 0;
        }

        .mus-error-banner {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 16px;
          background: rgba(206, 17, 38, 0.08);
          border-left: 4px solid var(--color-accent-red);
          border-radius: 8px;
          font-size: 13px;
          color: var(--color-accent-red);
          font-weight: 500;
          margin-bottom: 16px;
        }

        .mus-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 22px;
          border-radius: 10px;
          border: none;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
          width: 100%;
        }

        .mus-action-primary {
          background: linear-gradient(180deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
          color: #fff;
          box-shadow: 0 6px 18px rgba(11, 110, 79, 0.24);
        }

        .mus-action-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(11, 110, 79, 0.32);
        }

        .mus-action:active:not(:disabled) {
          transform: translateY(0);
        }

        .mus-action:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .mus-card {
            padding: 20px;
          }
          .mus-title {
            font-size: 22px;
          }
        }
      `}</style>

      <div>
        <button className="mus-back" onClick={() => navigate('/technicien/interventions')}>
          <ArrowLeft size={16} /> Retour aux interventions
        </button>

        <div className="mus-header">
          <div>
            <h1 className="mus-title">{intervention.demandeTitre}</h1>
            <p className="mus-subtitle">
              <FileText size={14} />
              Intervention #{intervention.id}
            </p>
          </div>
          <span
            className="mus-badge"
            style={{ background: statutCfg.color, color: statutCfg.text }}
          >
            <StatutIcon size={14} strokeWidth={2.5} />
            {statutCfg.label}
          </span>
        </div>

        {error && (
          <div className="mus-error-banner">
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            {error}
          </div>
        )}

        <div className="mus-grid">
          {/* Colonne principale */}
          <div>
            {/* Timeline de progression */}
            <div className="mus-card">
              <p className="mus-section-title">
                <ClipboardCheck size={14} />
                Progression
              </p>
              <div className="mus-timeline">
                {steps.map((step, i) => {
                  const done = i <= currentStepIndex;
                  const current = i === currentStepIndex;
                  const StepIcon = step.Icon;
                  return (
                    <div key={step.key} className="mus-tl-item">
                      <div className="mus-tl-marker">
                        <div className={`mus-tl-dot ${done ? 'done' : ''} ${current ? 'current' : ''}`}>
                          <StepIcon size={16} strokeWidth={2.5} />
                        </div>
                        {i < steps.length - 1 && (
                          <div className={`mus-tl-line ${done && i < currentStepIndex ? 'done' : ''}`} />
                        )}
                      </div>
                      <div className="mus-tl-content">
                        <p className={`mus-tl-label ${!done ? 'pending' : ''}`}>{step.label}</p>
                        <p className="mus-tl-desc">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions / Compte-rendu */}
            <div className="mus-card" style={{ marginTop: '20px' }}>
              {intervention.statut === 'ASSIGNEE' && (
                <>
                  <p className="mus-section-title">
                    <Play size={14} />
                    Prêt à démarrer
                  </p>
                  <p style={{ fontSize: '14px', color: 'var(--color-text-soft)', marginTop: 0, marginBottom: '20px', lineHeight: 1.6 }}>
                    Cliquez sur le bouton ci-dessous pour signaler que vous commencez le traitement de cette intervention.
                  </p>
                  <button
                    className="mus-action mus-action-primary"
                    onClick={demarrer}
                    disabled={actionEnCours}
                  >
                    <Play size={16} />
                    {actionEnCours ? 'Démarrage...' : "Démarrer l'intervention"}
                  </button>
                </>
              )}

              {intervention.statut === 'EN_COURS' && (
                <>
                  <div className="mus-cr-label">
                    <p className="mus-section-title" style={{ margin: 0 }}>
                      <FileText size={14} />
                      Compte-rendu de l'intervention
                    </p>
                    <span className={`mus-cr-count ${compteRenduDraft.length > MAX_CR * 0.9 ? 'warn' : ''} ${compteRenduDraft.length >= MAX_CR ? 'danger' : ''}`}>
                      {compteRenduDraft.length} / {MAX_CR}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-soft)', marginTop: 0, marginBottom: '14px', lineHeight: 1.5 }}>
                    Décrivez précisément les actions effectuées, les problèmes rencontrés et la solution appliquée. Ce compte-rendu sera transmis à l'agent demandeur.
                  </p>
                  <textarea
                    className="mus-textarea"
                    value={compteRenduDraft}
                    onChange={(e) => setCompteRenduDraft(e.target.value)}
                    placeholder="Ex : Remplacement du toner de l'imprimante, redémarrage du spouleur d'impression, test d'impression réussi. Le problème est résolu."
                    rows={6}
                    maxLength={MAX_CR}
                  />
                  <div style={{ marginTop: '16px' }}>
                    <button
                      className="mus-action mus-action-primary"
                      onClick={cloturer}
                      disabled={!compteRenduDraft.trim() || actionEnCours}
                    >
                      <CheckCircle2 size={16} />
                      {actionEnCours ? 'Clôture en cours...' : "Clôturer l'intervention"}
                    </button>
                  </div>
                </>
              )}

              {intervention.statut === 'TERMINEE' && (
                <>
                  <p className="mus-section-title">
                    <CheckCircle2 size={14} />
                    Compte-rendu final
                  </p>
                  <p className="mus-cr-readonly">{intervention.compteRendu}</p>
                </>
              )}
            </div>
          </div>

          {/* Colonne latérale */}
          <div className="mus-card">
            <p className="mus-section-title">
              <Info size={14} />
              Informations
            </p>
            <div className="mus-info-list">
              <div className="mus-info-item">
                <div className="mus-info-icon">
                  <Calendar size={16} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="mus-info-label">Date d'assignation</p>
                  <p className="mus-info-value">
                    {formatDate(intervention.dateDebut || new Date())}
                  </p>
                </div>
              </div>

              {intervention.dateDebut && (
                <div className="mus-info-item">
                  <div className="mus-info-icon">
                    <Clock size={16} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="mus-info-label">Débutée le</p>
                    <p className="mus-info-value">{formatDateLong(intervention.dateDebut)}</p>
                  </div>
                </div>
              )}

              {intervention.dateFin && (
                <div className="mus-info-item">
                  <div className="mus-info-icon" style={{ background: 'rgba(11, 110, 79, 0.15)' }}>
                    <CheckCircle2 size={16} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="mus-info-label">Clôturée le</p>
                    <p className="mus-info-value">{formatDateLong(intervention.dateFin)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}