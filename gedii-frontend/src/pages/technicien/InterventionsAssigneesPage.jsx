import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { interventionService } from '../../services/interventionService';

const STATUT_CONFIG = {
  ASSIGNEE: { label: 'À démarrer', color: 'var(--color-primary-soft)', text: 'var(--color-primary-dark)' },
  EN_COURS: { label: 'En cours', color: 'var(--color-accent-gold)', text: 'var(--color-text)' },
  TERMINEE: { label: 'Terminée', color: 'var(--color-primary)', text: 'var(--color-surface)' },
};

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
    <div>
      <h1 style={styles.title}>Mes interventions</h1>
      <p style={styles.pageSubtitle}>
        {actives.length} intervention{actives.length !== 1 ? 's' : ''} en cours ou à démarrer
      </p>

      {loading ? (
        <p style={styles.empty}>Chargement...</p>
      ) : actives.length === 0 ? (
        <p style={styles.empty}>Aucune intervention active pour le moment.</p>
      ) : (
        <div style={styles.list}>
          {actives.map((it) => {
            const statutCfg = STATUT_CONFIG[it.statut];
            return (
              <div
                key={it.id}
                style={styles.card}
                onClick={() => ouvrirDetail(it)}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-card)')}
              >
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.cardTitle}>{it.demandeTitre}</h3>
                    <p style={styles.cardMeta}>
                      {it.dateDebut
                        ? `Démarrée le ${new Date(it.dateDebut).toLocaleDateString('fr-FR')}`
                        : 'Pas encore démarrée'}
                    </p>
                  </div>
                  <div style={styles.badges}>
                    <span style={{ ...styles.badge, background: statutCfg.color, color: statutCfg.text }}>
                      {statutCfg.label}
                    </span>
                    <ChevronRight size={18} color="var(--color-text-soft)" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {terminees.length > 0 && (
        <>
          <p style={styles.sectionTitle}>Terminées récemment</p>
          <div style={styles.list}>
            {terminees.map((it) => (
              <div
                key={it.id}
                style={{ ...styles.card, opacity: 0.75, cursor: 'pointer' }}
                onClick={() => ouvrirDetail(it)}
              >
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.cardTitle}>{it.demandeTitre}</h3>
                    <p style={styles.cardMeta}>
                      {it.dateFin
                        ? `Terminée le ${new Date(it.dateFin).toLocaleDateString('fr-FR')}`
                        : ''}
                    </p>
                  </div>
                  <span style={{ ...styles.badge, background: 'var(--color-primary)', color: 'var(--color-surface)' }}>
                    Terminée
                  </span>
                </div>
                <p style={styles.crReadonly}>{it.compteRendu}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  title: { fontSize: '24px', color: 'var(--color-text)', marginBottom: '6px' },
  pageSubtitle: { fontSize: '14px', color: 'var(--color-text-soft)', marginBottom: '24px' },
  sectionTitle: { fontSize: '14px', fontWeight: 600, color: 'var(--color-text-soft)', margin: '28px 0 12px 0' },
  list: { display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '680px' },
  card: {
    background: 'var(--color-surface)', padding: '20px 22px',
    borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-card)',
    cursor: 'pointer', transition: 'box-shadow 0.15s',
  },
  cardHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    gap: '12px', flexWrap: 'wrap',
  },
  cardTitle: { fontSize: '16px', fontWeight: 600, color: 'var(--color-text)', margin: '0 0 4px 0' },
  cardMeta: { fontSize: '12px', color: 'var(--color-text-soft)', margin: 0 },
  badges: { display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 },
  badge: {
    padding: '4px 10px', borderRadius: '999px', fontSize: '11px',
    fontWeight: 600, whiteSpace: 'nowrap', height: 'fit-content',
  },
  crReadonly: {
    fontSize: '13px', color: 'var(--color-text-soft)', background: 'var(--color-bg-strong)',
    padding: '10px 12px', borderRadius: '6px', margin: '12px 0 0 0',
  },
  empty: { color: 'var(--color-text-soft)', fontSize: '14px' },
};