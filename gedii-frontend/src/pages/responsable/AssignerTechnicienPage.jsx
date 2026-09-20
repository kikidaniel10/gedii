import { useState, useEffect } from 'react';
import { UserCheck } from 'lucide-react';
import { demandeService } from '../../services/demandeService';
import { utilisateurService } from '../../services/utilisateurService';
import { interventionService } from '../../services/interventionService';

const URGENCE_CONFIG = {
  FAIBLE: { label: 'Faible', color: 'var(--color-primary)' },
  NORMALE: { label: 'Normale', color: 'var(--color-accent-gold)' },
  URGENTE: { label: 'Urgente', color: 'var(--color-accent-red)' },
};

export default function AssignerTechnicienPage() {
  const [demandes, setDemandes] = useState([]);
  const [techniciens, setTechniciens] = useState([]);
  const [selection, setSelection] = useState({});
  const [confirmId, setConfirmId] = useState(null);
  const [loading, setLoading] = useState(true);

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
    interventionService.assigner(demandeId, technicienId)
      .then(() => {
        setConfirmId(null);
        loadData();
      })
      .catch(() => setConfirmId(null));
  };

  return (
    <div>
      <h1 style={styles.title}>Assigner un technicien</h1>
      <p style={styles.pageSubtitle}>
        {demandes.length} demande{demandes.length !== 1 ? 's' : ''} validée
        {demandes.length !== 1 ? 's' : ''} en attente d'assignation
      </p>

      {loading ? (
        <p style={styles.empty}>Chargement...</p>
      ) : demandes.length === 0 ? (
        <p style={styles.empty}>Aucune demande à assigner pour le moment.</p>
      ) : (
        <div style={styles.list}>
          {demandes.map((d) => {
            const urgenceCfg = URGENCE_CONFIG[d.urgence];
            const technicienChoisi = selection[d.id];
            const isConfirming = confirmId === d.id;

            return (
              <div key={d.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.cardTitle}>{d.titre}</h3>
                    <p style={styles.cardMeta}>
                      Demandé par <strong>{d.agentNom}</strong> · Validée le{' '}
                      {new Date(d.dateValidation).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <span style={{ ...styles.badge, background: urgenceCfg.color }}>
                    {urgenceCfg.label}
                  </span>
                </div>

                {isConfirming ? (
                  <div style={styles.confirmBox}>
                    <span style={styles.confirmText}>
                      Assigner à <strong>{techniciens.find((t) => t.id === technicienChoisi)?.nom}</strong> ?
                    </span>
                    <div style={styles.confirmActions}>
                      <button onClick={() => confirmerAssignation(d.id)} style={styles.confirmBtn}>
                        Confirmer
                      </button>
                      <button onClick={() => setConfirmId(null)} style={styles.cancelBtn}>
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={styles.assignRow}>
                    <select
                      value={technicienChoisi || ''}
                      onChange={(e) => handleSelect(d.id, Number(e.target.value))}
                      style={styles.select}
                    >
                      <option value="">Choisir un technicien...</option>
                      {techniciens.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.nom}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => setConfirmId(d.id)}
                      disabled={!technicienChoisi}
                      style={{
                        ...styles.assignBtn,
                        opacity: technicienChoisi ? 1 : 0.5,
                        cursor: technicienChoisi ? 'pointer' : 'not-allowed',
                      }}
                    >
                      <UserCheck size={16} />
                      Assigner
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <p style={styles.sectionTitle}>Techniciens actifs</p>
      <div style={styles.techGrid}>
        {techniciens.length === 0 ? (
          <p style={styles.empty}>Aucun technicien actif pour le moment.</p>
        ) : (
          techniciens.map((t) => (
            <div key={t.id} style={styles.techCard}>
              <div style={styles.avatarSmall}>
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
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  title: { fontSize: '24px', color: 'var(--color-text)', marginBottom: '6px' },
  pageSubtitle: { fontSize: '14px', color: 'var(--color-text-soft)', marginBottom: '24px' },
  sectionTitle: { fontSize: '14px', fontWeight: 600, color: 'var(--color-text-soft)', margin: '32px 0 14px 0' },
  list: { display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '680px' },
  card: {
    background: 'var(--color-surface)', padding: '20px 22px',
    borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-card)',
  },
  cardHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    gap: '12px', marginBottom: '16px', flexWrap: 'wrap',
  },
  cardTitle: { fontSize: '16px', fontWeight: 600, color: 'var(--color-text)', margin: '0 0 4px 0' },
  cardMeta: { fontSize: '12px', color: 'var(--color-text-soft)', margin: 0 },
  badge: {
    padding: '4px 10px', borderRadius: '999px', fontSize: '11px',
    fontWeight: 600, color: 'var(--color-surface)', whiteSpace: 'nowrap',
  },
  assignRow: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  select: {
    flex: 1, minWidth: '220px', padding: '9px 12px', borderRadius: '6px',
    border: '1px solid var(--color-border)', fontSize: '14px',
    background: 'var(--color-surface)', color: 'var(--color-text)',
  },
  assignBtn: {
    display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 16px',
    borderRadius: '6px', border: 'none', background: 'var(--color-primary)',
    color: 'var(--color-surface)', fontSize: '14px', fontWeight: 600,
  },
  confirmBox: {
    background: 'var(--color-bg-strong)', borderRadius: '8px', padding: '12px 14px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    flexWrap: 'wrap', gap: '10px',
  },
  confirmText: { fontSize: '13px', color: 'var(--color-text)' },
  confirmActions: { display: 'flex', gap: '8px' },
  confirmBtn: {
    padding: '7px 14px', borderRadius: '6px', border: 'none',
    background: 'var(--color-primary)', color: 'var(--color-surface)',
    fontSize: '13px', fontWeight: 600, cursor: 'pointer',
  },
  cancelBtn: {
    padding: '7px 14px', borderRadius: '6px', border: '1px solid var(--color-border)',
    background: 'transparent', color: 'var(--color-text-soft)', fontSize: '13px', cursor: 'pointer',
  },
  empty: { color: 'var(--color-text-soft)', fontSize: '14px' },
  techGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '12px', maxWidth: '760px',
  },
  techCard: {
    display: 'flex', alignItems: 'center', gap: '12px',
    background: 'var(--color-surface)', padding: '14px 16px',
    borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-card)',
  },
  avatarSmall: {
    width: '36px', height: '36px', minWidth: '36px', borderRadius: '50%',
    background: 'var(--color-primary-soft)', color: 'var(--color-primary-dark)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '13px', fontWeight: 600, overflow: 'hidden',
  },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
  techName: { fontSize: '13px', fontWeight: 500, color: 'var(--color-text)', margin: 0 },
  techMeta: { fontSize: '11px', color: 'var(--color-text-soft)', margin: '2px 0 0 0' },
};