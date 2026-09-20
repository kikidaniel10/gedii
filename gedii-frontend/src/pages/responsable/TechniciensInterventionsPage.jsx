import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { utilisateurService } from '../../services/utilisateurService';
import { interventionService } from '../../services/interventionService';

const STATUT_CONFIG = {
  ASSIGNEE: { label: 'À démarrer', color: 'var(--color-primary-soft)', text: 'var(--color-primary-dark)' },
  EN_COURS: { label: 'En cours', color: 'var(--color-accent-gold)', text: 'var(--color-text)' },
  TERMINEE: { label: 'Terminée', color: 'var(--color-primary)', text: 'var(--color-surface)' },
};

export default function TechniciensInterventionsPage() {
  const [techniciens, setTechniciens] = useState([]);
  const [selectedTech, setSelectedTech] = useState(null);
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);

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

  if (selectedTech) {
    return (
      <div>
        <button onClick={retour} style={styles.backBtn}>
          <ArrowLeft size={16} /> Retour aux techniciens
        </button>

        <h1 style={styles.title}>{selectedTech.nom}</h1>
        <p style={styles.pageSubtitle}>
          {interventions.length} intervention{interventions.length !== 1 ? 's' : ''} au total
        </p>

        {loadingDetail ? (
          <p style={styles.empty}>Chargement...</p>
        ) : interventions.length === 0 ? (
          <p style={styles.empty}>Aucune intervention pour ce technicien.</p>
        ) : (
          <div style={styles.list}>
            {interventions.map((it) => {
              const statutCfg = STATUT_CONFIG[it.statut];
              return (
                <div key={it.id} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <div>
                      <h3 style={styles.cardTitle}>{it.demandeTitre}</h3>
                      <p style={styles.cardMeta}>
                        {it.dateDebut
                          ? `Démarrée le ${new Date(it.dateDebut).toLocaleDateString('fr-FR')}`
                          : 'Pas encore démarrée'}
                        {it.dateFin
                          ? ` · Terminée le ${new Date(it.dateFin).toLocaleDateString('fr-FR')}`
                          : ''}
                      </p>
                    </div>
                    <span style={{ ...styles.badge, background: statutCfg.color, color: statutCfg.text }}>
                      {statutCfg.label}
                    </span>
                  </div>
                  {it.compteRendu && (
                    <p style={styles.crReadonly}>{it.compteRendu}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <h1 style={styles.title}>Interventions par technicien</h1>
      <p style={styles.pageSubtitle}>
        Cliquez sur un technicien pour voir toutes ses interventions.
      </p>

      {loading ? (
        <p style={styles.empty}>Chargement...</p>
      ) : techniciens.length === 0 ? (
        <p style={styles.empty}>Aucun technicien actif pour le moment.</p>
      ) : (
        <div style={styles.grid}>
          {techniciens.map((t) => (
            <div
              key={t.id}
              style={styles.techCard}
              onClick={() => voirInterventions(t)}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-card)')}
            >
              <div style={styles.avatar}>
                {t.photoUrl ? (
                  <img src={t.photoUrl} alt={t.nom} style={styles.avatarImg} />
                ) : (
                  t.nom.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
                )}
              </div>
              <div>
                <p style={styles.techName}>{t.nom}</p>
                <p style={styles.techMeta}>{t.matricule}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  title: { fontSize: '24px', color: 'var(--color-text)', marginBottom: '6px' },
  pageSubtitle: { fontSize: '14px', color: 'var(--color-text-soft)', marginBottom: '24px' },
  backBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    background: 'transparent', border: 'none', color: 'var(--color-primary)',
    fontSize: '13px', fontWeight: 500, cursor: 'pointer', padding: 0, marginBottom: '18px',
  },
  list: { display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '680px' },
  card: {
    background: 'var(--color-surface)', padding: '20px 22px',
    borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-card)',
  },
  cardHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    gap: '12px', flexWrap: 'wrap',
  },
  cardTitle: { fontSize: '16px', fontWeight: 600, color: 'var(--color-text)', margin: '0 0 4px 0' },
  cardMeta: { fontSize: '12px', color: 'var(--color-text-soft)', margin: 0 },
  badge: {
    padding: '4px 10px', borderRadius: '999px', fontSize: '11px',
    fontWeight: 600, whiteSpace: 'nowrap', height: 'fit-content',
  },
  crReadonly: {
    fontSize: '13px', color: 'var(--color-text-soft)', background: 'var(--color-bg-strong)',
    padding: '10px 12px', borderRadius: '6px', margin: '12px 0 0 0',
  },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '12px', maxWidth: '760px',
  },
  techCard: {
    display: 'flex', alignItems: 'center', gap: '12px',
    background: 'var(--color-surface)', padding: '14px 16px',
    borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-card)',
    cursor: 'pointer', transition: 'box-shadow 0.15s',
  },
  avatar: {
    width: '42px', height: '42px', minWidth: '42px', borderRadius: '50%',
    background: 'var(--color-primary-soft)', color: 'var(--color-primary-dark)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '14px', fontWeight: 600, overflow: 'hidden',
  },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
  techName: { fontSize: '14px', fontWeight: 500, color: 'var(--color-text)', margin: 0 },
  techMeta: { fontSize: '12px', color: 'var(--color-text-soft)', margin: '2px 0 0 0' },
  empty: { color: 'var(--color-text-soft)', fontSize: '14px' },
};