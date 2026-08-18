import { useLocation } from 'react-router-dom';

const LABELS = {
  agent: 'Agent',
  soumettre: 'Soumettre une demande',
  historique: 'Mes demandes',
  responsable: 'Responsable',
  demandes: 'Demandes en attente',
  utilisateurs: 'Utilisateurs',
  services: 'Services & clés',
  statistiques: 'Statistiques',
  technicien: 'Technicien',
  interventions: 'Mes interventions',
};

export default function Breadcrumb() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  return (
    <div style={styles.breadcrumb}>
      {segments.map((seg, i) => (
        <span key={i} style={styles.item}>
          {i > 0 && <span style={styles.separator}>/</span>}
          {LABELS[seg] || seg}
        </span>
      ))}
    </div>
  );
}

const styles = {
  breadcrumb: {
    fontSize: '13px',
    color: 'var(--color-text-soft)',
    marginBottom: '20px',
  },
  item: { display: 'inline-flex', alignItems: 'center', gap: '6px' },
  separator: { color: 'var(--color-border)' },
};