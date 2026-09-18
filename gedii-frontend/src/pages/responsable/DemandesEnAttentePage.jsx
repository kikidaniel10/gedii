import { useState, useEffect } from 'react';
import { demandeService } from '../../services/demandeService';

const URGENCE_CONFIG = {
  FAIBLE: { label: 'Faible', color: 'var(--color-primary)' },
  NORMALE: { label: 'Normale', color: 'var(--color-accent-gold)' },
  URGENTE: { label: 'Urgente', color: 'var(--color-accent-red)' },
};

export default function DemandesEnAttentePage() {
  const [demandes, setDemandes] = useState([]);
  const [confirmAction, setConfirmAction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDemandes();
  }, []);

  const loadDemandes = () => {
    setLoading(true);
    demandeService.getEnAttente()
      .then((data) => setDemandes(data))
      .catch(() => setDemandes([]))
      .finally(() => setLoading(false));
  };

  const handleAction = (id, type) => {
    const action = type === 'valider'
      ? demandeService.valider(id)
      : demandeService.rejeter(id);

    action
      .then(() => {
        setConfirmAction(null);
        loadDemandes();
      })
      .catch(() => setConfirmAction(null));
  };

  return (
    <div>
      <h1 style={styles.title}>Demandes en attente</h1>
      <p style={styles.pageSubtitle}>
        {demandes.length} demande{demandes.length !== 1 ? 's' : ''} à traiter
      </p>

      {loading ? (
        <p style={styles.empty}>Chargement...</p>
      ) : demandes.length === 0 ? (
        <p style={styles.empty}>Aucune demande en attente pour le moment.</p>
      ) : (
        <div style={styles.list}>
          {demandes.map((d) => {
            const urgenceCfg = URGENCE_CONFIG[d.urgence];
            const isConfirming = confirmAction?.id === d.id;

            return (
              <div key={d.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.cardTitle}>{d.titre}</h3>
                    <p style={styles.cardMeta}>
                      Par <strong>{d.agentNom}</strong> · {new Date(d.dateCreation).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <span style={{ ...styles.badge, background: urgenceCfg.color }}>
                    {urgenceCfg.label}
                  </span>
                </div>

                <p style={styles.description}>{d.description}</p>

                {isConfirming ? (
                  <div style={styles.confirmBox}>
                    <span style={styles.confirmText}>
                      Confirmer : {confirmAction.type === 'valider' ? 'valider' : 'rejeter'} cette demande ?
                    </span>
                    <div style={styles.confirmActions}>
                      <button
                        onClick={() => handleAction(d.id, confirmAction.type)}
                        style={{
                          ...styles.confirmBtn,
                          background:
                            confirmAction.type === 'valider'
                              ? 'var(--color-primary)'
                              : 'var(--color-accent-red)',
                        }}
                      >
                        Oui, confirmer
                      </button>
                      <button
                        onClick={() => setConfirmAction(null)}
                        style={styles.cancelBtn}
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={styles.actions}>
                    <button
                      onClick={() => setConfirmAction({ id: d.id, type: 'valider' })}
                      style={styles.validerBtn}
                    >
                      Valider
                    </button>
                    <button
                      onClick={() => setConfirmAction({ id: d.id, type: 'rejeter' })}
                      style={styles.rejeterBtn}
                    >
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
  );
}

const styles = {
  title: { fontSize: '24px', color: 'var(--color-text)', marginBottom: '6px' },
  pageSubtitle: { fontSize: '14px', color: 'var(--color-text-soft)', marginBottom: '24px' },
  list: { display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '680px' },
  card: {
    background: 'var(--color-surface)',
    padding: '20px 22px',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow-card)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '10px',
  },
  cardTitle: { fontSize: '16px', fontWeight: 600, color: 'var(--color-text)', margin: '0 0 4px 0' },
  cardMeta: { fontSize: '12px', color: 'var(--color-text-soft)', margin: 0 },
  badge: {
    padding: '4px 10px',
    borderRadius: '999px',
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--color-surface)',
    whiteSpace: 'nowrap',
  },
  description: {
    fontSize: '14px',
    color: 'var(--color-text-soft)',
    lineHeight: 1.5,
    marginBottom: '16px',
  },
  actions: { display: 'flex', gap: '10px' },
  validerBtn: {
    padding: '9px 18px',
    borderRadius: '6px',
    border: 'none',
    background: 'var(--color-primary)',
    color: 'var(--color-surface)',
    fontSize: '14px',
    fontWeight: 600,
  },
  rejeterBtn: {
    padding: '9px 18px',
    borderRadius: '6px',
    border: '1px solid var(--color-accent-red)',
    background: 'transparent',
    color: 'var(--color-accent-red)',
    fontSize: '14px',
    fontWeight: 600,
  },
  confirmBox: {
    background: 'var(--color-bg-strong)',
    borderRadius: '8px',
    padding: '14px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px',
  },
  confirmText: { fontSize: '13px', color: 'var(--color-text)', fontWeight: 500 },
  confirmActions: { display: 'flex', gap: '8px' },
  confirmBtn: {
    padding: '7px 14px',
    borderRadius: '6px',
    border: 'none',
    color: 'var(--color-surface)',
    fontSize: '13px',
    fontWeight: 600,
  },
  cancelBtn: {
    padding: '7px 14px',
    borderRadius: '6px',
    border: '1px solid var(--color-border)',
    background: 'transparent',
    color: 'var(--color-text-soft)',
    fontSize: '13px',
  },
  empty: { color: 'var(--color-text-soft)', fontSize: '14px' },
};