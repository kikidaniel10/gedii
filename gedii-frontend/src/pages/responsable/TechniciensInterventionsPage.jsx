import { useState, useEffect } from 'react';
import {
  ArrowLeft, Download, FileText, Clock, CheckCircle2,
  Calendar, Users, Inbox, ChevronRight, Wrench, Timer,
} from 'lucide-react';
import { utilisateurService } from '../../services/utilisateurService';
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

export default function TechniciensInterventionsPage() {
  const [techniciens, setTechniciens] = useState([]);
  const [selectedTech, setSelectedTech] = useState(null);
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    utilisateurService.getTechniciens()
      .then((data) => setTechniciens(data.filter((t) => t.role === 'TECHNICIEN')))
      .catch(() => setTechniciens([]))
      .finally(() => setLoading(false));
  }, []);

  const voirInterventions = (tech) => {
    setSelectedTech(tech);
    setLoadingDetail(true);
    interventionService.getByTechnicien(tech.id)
      .then((data) => setInterventions(data))
      .catch(() => setInterventions([]))
      .finally(() => setLoadingDetail(false));
  };

  const retour = () => {
    setSelectedTech(null);
    setInterventions([]);
  };

  const telechargerRapport = async () => {
    setDownloading(true);
    try {
      const blob = await interventionService.downloadRapport(selectedTech.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `rapport-${selectedTech.nom.replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert('Erreur lors du téléchargement du rapport');
    } finally {
      setDownloading(false);
    }
  };

  // Statistiques du technicien sélectionné
  const statsTech = selectedTech ? {
    total: interventions.length,
    terminees: interventions.filter((i) => i.statut === 'TERMINEE').length,
    enCours: interventions.filter((i) => i.statut === 'EN_COURS').length,
    aDemarrer: interventions.filter((i) => i.statut === 'ASSIGNEE').length,
  } : null;

  return (
    <>
      <style>{`
        .ti-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 16px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }

        .ti-title {
          font-size: 26px;
          color: var(--color-text);
          margin: 0 0 6px 0;
          font-family: var(--font-display);
          letter-spacing: -0.02em;
        }

        .ti-subtitle {
          font-size: 14px;
          color: var(--color-text-soft);
          margin: 0;
        }

        .ti-back {
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
          margin-bottom: 16px;
          transition: transform 0.2s ease;
        }

        .ti-back:hover {
          transform: translateX(-3px);
        }

        .ti-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 14px;
          max-width: 900px;
        }

        .ti-tech-card {
          display: flex;
          align-items: center;
          gap: 14px;
          background: var(--color-surface);
          padding: 16px 18px;
          border-radius: 14px;
          box-shadow: 0 2px 10px rgba(10, 21, 17, 0.06);
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          animation: tiFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .ti-tech-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(10, 21, 17, 0.12);
        }

        @keyframes tiFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .ti-avatar {
          width: 48px;
          height: 48px;
          min-width: 48px;
          border-radius: 50%;
          background: var(--color-primary-soft);
          color: var(--color-primary-dark);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          font-weight: 700;
          overflow: hidden;
          position: relative;
        }

        .ti-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .ti-avatar::after {
          content: '';
          position: absolute;
          bottom: 0;
          right: 0;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #22c55e;
          border: 2px solid var(--color-surface);
        }

        .ti-tech-info {
          flex: 1;
          min-width: 0;
        }

        .ti-tech-name {
          font-size: 14px;
          font-weight: 700;
          color: var(--color-text);
          margin: 0 0 3px 0;
        }

        .ti-tech-meta {
          font-size: 11px;
          color: var(--color-text-soft);
          margin: 0;
          font-family: var(--font-mono, monospace);
        }

        .ti-chevron {
          color: var(--color-text-soft);
          transition: transform 0.2s ease, color 0.2s ease;
        }

        .ti-tech-card:hover .ti-chevron {
          transform: translateX(3px);
          color: var(--color-primary);
        }

        .ti-download-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 20px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(180deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
          box-shadow: 0 6px 16px rgba(11, 110, 79, 0.24);
        }

        .ti-download-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 22px rgba(11, 110, 79, 0.32);
        }

        .ti-download-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .ti-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 12px;
          margin-bottom: 24px;
          max-width: 780px;
        }

        .ti-stat {
          background: var(--color-surface);
          padding: 16px 18px;
          border-radius: 12px;
          border-left: 4px solid var(--stat-color);
          box-shadow: 0 2px 8px rgba(10, 21, 17, 0.05);
          animation: tiFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .ti-stat-label {
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

        .ti-stat-value {
          font-size: 24px;
          font-weight: 800;
          color: var(--color-text);
          margin: 0;
          font-family: var(--font-display);
          letter-spacing: -0.02em;
        }

        .ti-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          max-width: 780px;
        }

        .ti-card {
          position: relative;
          background: var(--color-surface);
          padding: 20px 22px 20px 26px;
          border-radius: 14px;
          box-shadow: 0 2px 10px rgba(10, 21, 17, 0.06);
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          animation: tiFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .ti-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(10, 21, 17, 0.1);
        }

        .ti-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 5px;
          border-radius: 14px 0 0 14px;
          background: var(--stripe-color);
        }

        .ti-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 10px;
        }

        .ti-card-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--color-text);
          margin: 0 0 6px 0;
          letter-spacing: -0.01em;
          line-height: 1.3;
        }

        .ti-card-meta {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          font-size: 12px;
          color: var(--color-text-soft);
        }

        .ti-meta-item {
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .ti-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
        }

        .ti-cr {
          margin-top: 14px;
          padding: 14px 16px;
          background: var(--color-bg-strong);
          border-radius: 10px;
          font-size: 13px;
          color: var(--color-text);
          line-height: 1.6;
          white-space: pre-wrap;
          position: relative;
          padding-left: 44px;
        }

        .ti-cr-icon {
          position: absolute;
          left: 14px;
          top: 14px;
          color: var(--color-primary);
        }

        .ti-empty {
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

        .ti-empty-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(11, 110, 79, 0.08);
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ti-empty-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--color-text);
          margin: 0;
        }

        .ti-empty-text {
          font-size: 13px;
          color: var(--color-text-soft);
          margin: 0;
          max-width: 340px;
          line-height: 1.5;
        }

        .ti-loading {
          padding: 60px 20px;
          text-align: center;
          color: var(--color-text-soft);
          font-size: 14px;
        }

        .ti-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid var(--color-border);
          border-top-color: var(--color-primary);
          border-radius: 50%;
          animation: tiSpin 0.8s linear infinite;
          margin: 0 auto 16px auto;
        }

        @keyframes tiSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {selectedTech ? (
        <div>
          <button className="ti-back" onClick={retour}>
            <ArrowLeft size={16} /> Retour aux techniciens
          </button>

          <div className="ti-header">
            <div>
              <h1 className="ti-title">{selectedTech.nom}</h1>
              <p className="ti-subtitle">
                {statsTech.total} intervention{statsTech.total !== 1 ? 's' : ''} au total
              </p>
            </div>
            <button
              className="ti-download-btn"
              onClick={telechargerRapport}
              disabled={downloading || interventions.length === 0}
            >
              <Download size={16} />
              {downloading ? 'Génération...' : 'Télécharger le rapport PDF'}
            </button>
          </div>

          {loadingDetail ? (
            <div className="ti-loading">
              <div className="ti-spinner"></div>
              Chargement des interventions...
            </div>
          ) : interventions.length === 0 ? (
            <div className="ti-empty">
              <div className="ti-empty-icon">
                <Wrench size={32} strokeWidth={2} />
              </div>
              <p className="ti-empty-title">Aucune intervention</p>
              <p className="ti-empty-text">
                Ce technicien n'a encore aucune intervention assignée.
              </p>
            </div>
          ) : (
            <>
              {/* Statistiques rapides */}
              <div className="ti-stats">
                <div className="ti-stat" style={{ '--stat-color': 'var(--color-primary)', animationDelay: '0s' }}>
                  <p className="ti-stat-label">
                    <Wrench size={12} strokeWidth={2.5} /> Total
                  </p>
                  <p className="ti-stat-value">{statsTech.total}</p>
                </div>
                <div className="ti-stat" style={{ '--stat-color': 'var(--color-primary-dark)', animationDelay: '0.05s' }}>
                  <p className="ti-stat-label">
                    <CheckCircle2 size={12} strokeWidth={2.5} /> Terminées
                  </p>
                  <p className="ti-stat-value">{statsTech.terminees}</p>
                </div>
                <div className="ti-stat" style={{ '--stat-color': 'var(--color-accent-gold)', animationDelay: '0.1s' }}>
                  <p className="ti-stat-label">
                    <Timer size={12} strokeWidth={2.5} /> En cours
                  </p>
                  <p className="ti-stat-value">{statsTech.enCours}</p>
                </div>
                <div className="ti-stat" style={{ '--stat-color': 'var(--color-primary-soft)', animationDelay: '0.15s' }}>
                  <p className="ti-stat-label">
                    <Clock size={12} strokeWidth={2.5} /> À démarrer
                  </p>
                  <p className="ti-stat-value">{statsTech.aDemarrer}</p>
                </div>
              </div>

              {/* Liste des interventions */}
              <div className="ti-list">
                {interventions.map((it, index) => {
                  const statutCfg = STATUT_CONFIG[it.statut];
                  const StatutIcon = statutCfg.Icon;
                  return (
                    <div
                      key={it.id}
                      className="ti-card"
                      style={{
                        '--stripe-color': statutCfg.stripe,
                        animationDelay: `${index * 0.05}s`,
                      }}
                    >
                      <div className="ti-card-header">
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h3 className="ti-card-title">{it.demandeTitre}</h3>
                          <div className="ti-card-meta">
                            {it.dateDebut && (
                              <span className="ti-meta-item">
                                <Calendar size={12} strokeWidth={2.5} />
                                Démarrée le {formatDate(it.dateDebut)}
                              </span>
                            )}
                            {!it.dateDebut && (
                              <span className="ti-meta-item">
                                <Clock size={12} strokeWidth={2.5} />
                                Pas encore démarrée
                              </span>
                            )}
                            {it.dateFin && (
                              <span className="ti-meta-item">
                                <CheckCircle2 size={12} strokeWidth={2.5} />
                                Terminée le {formatDate(it.dateFin)}
                              </span>
                            )}
                          </div>
                        </div>
                        <span
                          className="ti-badge"
                          style={{ background: statutCfg.color, color: statutCfg.text }}
                        >
                          <StatutIcon size={12} strokeWidth={2.5} />
                          {statutCfg.label}
                        </span>
                      </div>
                      {it.compteRendu && (
                        <div className="ti-cr">
                          <FileText size={16} strokeWidth={2.5} className="ti-cr-icon" />
                          {it.compteRendu}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      ) : (
        <div>
          <div className="ti-header">
            <div>
              <h1 className="ti-title">Interventions par technicien</h1>
              <p className="ti-subtitle">
                Cliquez sur un technicien pour consulter toutes ses interventions.
              </p>
            </div>
            {!loading && techniciens.length > 0 && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '999px',
                background: 'rgba(11, 110, 79, 0.12)',
                color: 'var(--color-primary-dark)',
                fontSize: '13px',
                fontWeight: 700,
                border: '1px solid rgba(11, 110, 79, 0.2)',
              }}>
                <Users size={14} strokeWidth={2.5} />
                {techniciens.length} technicien{techniciens.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {loading ? (
            <div className="ti-loading">
              <div className="ti-spinner"></div>
              Chargement des techniciens...
            </div>
          ) : techniciens.length === 0 ? (
            <div className="ti-empty">
              <div className="ti-empty-icon">
                <Inbox size={32} strokeWidth={2} />
              </div>
              <p className="ti-empty-title">Aucun technicien actif</p>
              <p className="ti-empty-text">
                Activez des comptes techniciens pour consulter leurs interventions ici.
              </p>
            </div>
          ) : (
            <div className="ti-grid">
              {techniciens.map((t, index) => {
                const initials = t.nom.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
                return (
                  <div
                    key={t.id}
                    className="ti-tech-card"
                    onClick={() => voirInterventions(t)}
                    style={{ animationDelay: `${index * 0.04}s` }}
                  >
                    <div className="ti-avatar">
                      {t.photoUrl ? (
                        <img src={t.photoUrl} alt={t.nom} />
                      ) : (
                        initials
                      )}
                    </div>
                    <div className="ti-tech-info">
                      <p className="ti-tech-name">{t.nom}</p>
                      <p className="ti-tech-meta">{t.matricule}</p>
                    </div>
                    <ChevronRight size={18} className="ti-chevron" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
}