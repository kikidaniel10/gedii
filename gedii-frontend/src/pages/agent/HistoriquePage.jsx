import { useState } from 'react';

// Donnees fictives temporaires - seront remplacees par un appel a demandeService.getMesDemandes()
const DEMANDES_TEMP = [
  {
    id: 1,
    titre: 'Imprimante hors service au 2e étage',
    urgence: 'URGENTE',
    statut: 'EN_COURS',
    dateCreation: '2026-08-14',
  },
  {
    id: 2,
    titre: 'Écran qui clignote',
    urgence: 'NORMALE',
    statut: 'VALIDEE',
    dateCreation: '2026-08-12',
  },
  {
    id: 3,
    titre: 'Impossible de se connecter au réseau',
    urgence: 'URGENTE',
    statut: 'RESOLUE',
    dateCreation: '2026-08-05',
  },
  {
    id: 4,
    titre: 'Demande de nouveau clavier',
    urgence: 'FAIBLE',
    statut: 'EN_ATTENTE',
    dateCreation: '2026-08-19',
  },
  {
    id: 5,
    titre: 'Logiciel comptable qui plante',
    urgence: 'NORMALE',
    statut: 'REJETEE',
    dateCreation: '2026-08-01',
  },
];

const STATUT_CONFIG = {
  EN_ATTENTE: { label: 'En attente', color: 'var(--color-accent-gold)', text: 'var(--color-text)' },
  VALIDEE: { label: 'Validée', color: 'var(--color-primary-soft)', text: 'var(--color-primary-dark)' },
  EN_COURS: { label: 'En cours', color: 'var(--color-primary)', text: 'var(--color-surface)' },
  RESOLUE: { label: 'Résolue', color: 'var(--color-primary-dark)', text: 'var(--color-surface)' },
  REJETEE: { label: 'Rejetée', color: 'var(--color-accent-red)', text: 'var(--color-surface)' },
};

const URGENCE_LABEL = {
  FAIBLE: 'Faible',
  NORMALE: 'Normale',
  URGENTE: 'Urgente',
};

export default function HistoriquePage() {
  const [filtre, setFiltre] = useState('TOUS');

  const demandesFiltrees =
    filtre === 'TOUS'
      ? DEMANDES_TEMP
      : DEMANDES_TEMP.filter((d) => d.statut === filtre);

  return (
    <div>
      <h1 style={styles.title}>Mes demandes</h1>
      <p style={styles.pageSubtitle}>
        Retrouvez l'historique et le statut de toutes vos demandes.
      </p>

      <div style={styles.filters}>
        {['TOUS', 'EN_ATTENTE', 'VALIDEE', 'EN_COURS', 'RESOLUE', 'REJETEE'].map((f) => (
          <button
            key={f}
            onClick={() => setFiltre(f)}
            style={{
              ...styles.filterBtn,
              ...(filtre === f ? styles.filterBtnActive : {}),
            }}
          >
            {f === 'TOUS' ? 'Toutes' : STATUT_CONFIG[f].label}
          </button>
        ))}
      </div>

      {demandesFiltrees.length === 0 ? (
        <p style={styles.empty}>Aucune demande pour ce filtre.</p>
      ) : (
        <div style={styles.list}>
          {demandesFiltrees.map((d) => {
            const statutCfg = STATUT_CONFIG[d.statut];
            return (
              <div key={d.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>{d.titre}</h3>
                  <span
                    style={{
                      ...styles.badge,
                      background: statutCfg.color,
                      color: statutCfg.text,
                    }}
                  >
                    {statutCfg.label}
                  </span>
                </div>
                <div style={styles.cardMeta}>
                  <span style={styles.metaItem}>
                    Urgence : <strong>{URGENCE_LABEL[d.urgence]}</strong>
                  </span>
                  <span style={styles.metaItem}>
                    Soumise le {new Date(d.dateCreation).toLocaleDateString('fr-FR')}
                  </span>
                </div>
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
  filters: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' },
  filterBtn: {
    padding: '8px 14px',
    borderRadius: '999px',
    border: '1px solid var(--color-border)',
    background: 'var(--color-surface)',
    color: 'var(--color-text-soft)',
    fontSize: '13px',
  },
  filterBtnActive: {
    background: 'var(--color-primary)',
    borderColor: 'var(--color-primary)',
    color: 'var(--color-surface)',
    fontWeight: 600,
  },
  list: { display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '720px' },
  card: {
    background: 'var(--color-surface)',
    padding: '18px 20px',
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
  cardTitle: { fontSize: '15px', fontWeight: 600, color: 'var(--color-text)', margin: 0 },
  badge: {
    padding: '4px 10px',
    borderRadius: '999px',
    fontSize: '11px',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  cardMeta: { display: 'flex', gap: '16px', flexWrap: 'wrap' },
  metaItem: { fontSize: '13px', color: 'var(--color-text-soft)' },
  empty: { color: 'var(--color-text-soft)', fontSize: '14px' },
};