import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Play, CheckCircle2 } from 'lucide-react';
import { interventionService } from '../../services/interventionService';

const STATUT_CONFIG = {
  ASSIGNEE: { label: 'À démarrer', color: 'var(--color-primary-soft)', text: 'var(--color-primary-dark)' },
  EN_COURS: { label: 'En cours', color: 'var(--color-accent-gold)', text: 'var(--color-text)' },
  TERMINEE: { label: 'Terminée', color: 'var(--color-primary)', text: 'var(--color-surface)' },
};

export default function MettreAJourStatutPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [intervention, setIntervention] = useState(location.state?.intervention || null);
  const [compteRenduDraft, setCompteRenduDraft] = useState('');
  const [loading, setLoading] = useState(!location.state?.intervention);
  const [actionEnCours, setActionEnCours] = useState(false);

  useEffect(() => {
    if (!intervention) {
      // Fallback : recharge depuis la liste si on arrive direct sur l'URL
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
    interventionService.demarrer(intervention.id)
      .then(() => {
        setIntervention({ ...intervention, statut: 'EN_COURS', dateDebut: new Date().toISOString() });
      })
      .catch(() => {})
      .finally(() => setActionEnCours(false));
  };

  const cloturer = () => {
    if (!compteRenduDraft.trim()) return;
    setActionEnCours(true);
    interventionService.cloturer(intervention.id, compteRenduDraft)
      .then(() => {
        setIntervention({
          ...intervention,
          statut: 'TERMINEE',
          compteRendu: compteRenduDraft,
          dateFin: new Date().toISOString(),
        });
      })
      .catch(() => {})
      .finally(() => setActionEnCours(false));
  };

  if (loading) return <p style={styles.empty}>Chargement...</p>;
  if (!intervention) return <p style={styles.empty}>Intervention introuvable.</p>;

  const statutCfg = STATUT_CONFIG[intervention.statut];

  return (
    <div>
      <button onClick={() => navigate('/technicien/interventions')} style={styles.backBtn}>
        <ArrowLeft size={16} /> Retour aux interventions
      </button>

      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>{intervention.demandeTitre}</h1>
          <p style={styles.subtitle}>
            {intervention.dateDebut
              ? `Démarrée le ${new Date(intervention.dateDebut).toLocaleDateString('fr-FR')}`
              : 'Pas encore démarrée'}
          </p>
        </div>
        <span style={{ ...styles.badge, background: statutCfg.color, color: statutCfg.text }}>
          {statutCfg.label}
        </span>
      </div>

      <div style={styles.card}>
        <p style={styles.sectionLabel}>Statut actuel</p>
        <p style={styles.statutLine}>{statutCfg.label}</p>

        {intervention.statut === 'ASSIGNEE' && (
          <button
            onClick={demarrer}
            disabled={actionEnCours}
            style={{ ...styles.actionBtn, opacity: actionEnCours ? 0.6 : 1 }}
          >
            <Play size={16} /> Démarrer l'intervention
          </button>
        )}

        {intervention.statut === 'EN_COURS' && (
          <>
            <p style={styles.sectionLabel}>Compte-rendu</p>
            <textarea
              value={compteRenduDraft}
              onChange={(e) => setCompteRenduDraft(e.target.value)}
              placeholder="Décrivez ce qui a été fait pour résoudre le problème..."
              style={styles.textarea}
              rows={5}
            />
            <button
              onClick={cloturer}
              disabled={!compteRenduDraft.trim() || actionEnCours}
              style={{
                ...styles.actionBtn,
                opacity: compteRenduDraft.trim() && !actionEnCours ? 1 : 0.5,
                cursor: compteRenduDraft.trim() && !actionEnCours ? 'pointer' : 'not-allowed',
              }}
            >
              <CheckCircle2 size={16} /> Clôturer l'intervention
            </button>
          </>
        )}

        {intervention.statut === 'TERMINEE' && (
          <>
            <p style={styles.sectionLabel}>Compte-rendu final</p>
            <p style={styles.crReadonly}>{intervention.compteRendu}</p>
            {intervention.dateFin && (
              <p style={styles.dateFin}>
                Terminée le {new Date(intervention.dateFin).toLocaleDateString('fr-FR')}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  backBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    background: 'transparent', border: 'none', color: 'var(--color-primary)',
    fontSize: '13px', fontWeight: 500, cursor: 'pointer', padding: 0, marginBottom: '18px',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    gap: '12px', marginBottom: '24px', flexWrap: 'wrap',
  },
  title: { fontSize: '24px', color: 'var(--color-text)', margin: '0 0 4px 0' },
  subtitle: { fontSize: '13px', color: 'var(--color-text-soft)', margin: 0 },
  badge: {
    padding: '6px 14px', borderRadius: '999px', fontSize: '12px',
    fontWeight: 600, whiteSpace: 'nowrap', height: 'fit-content',
  },
  card: {
    background: 'var(--color-surface)', padding: '24px',
    borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-card)',
    maxWidth: '680px', display: 'flex', flexDirection: 'column', gap: '10px',
  },
  sectionLabel: {
    fontSize: '12px', fontWeight: 600, color: 'var(--color-text-soft)',
    textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0,
  },
  statutLine: { fontSize: '18px', fontWeight: 600, color: 'var(--color-text)', margin: '0 0 12px 0' },
  actionBtn: {
    display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 18px',
    borderRadius: '6px', border: 'none', background: 'var(--color-primary)',
    color: 'var(--color-surface)', fontSize: '14px', fontWeight: 600,
    alignSelf: 'flex-start', cursor: 'pointer',
  },
  textarea: {
    padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--color-border)',
    fontSize: '14px', fontFamily: 'var(--font-body)', background: 'var(--color-surface)',
    color: 'var(--color-text)', resize: 'vertical',
  },
  crReadonly: {
    fontSize: '14px', color: 'var(--color-text)', background: 'var(--color-bg-strong)',
    padding: '12px 14px', borderRadius: '6px', margin: 0, lineHeight: 1.5,
  },
  dateFin: { fontSize: '12px', color: 'var(--color-text-soft)', margin: '6px 0 0 0' },
  empty: { color: 'var(--color-text-soft)', fontSize: '14px' },
};