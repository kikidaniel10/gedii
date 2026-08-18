import { NavLink } from 'react-router-dom';
import { FileText, History, ClipboardList, Users, KeyRound, BarChart3, Wrench } from 'lucide-react';
import { ROLES } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';

const MENUS = {
  [ROLES.AGENT]: [
    { path: '/agent/soumettre', label: 'Soumettre une demande', icon: FileText },
    { path: '/agent/historique', label: 'Mes demandes', icon: History },
  ],
  [ROLES.RESPONSABLE]: [
    { path: '/responsable/demandes', label: 'Demandes en attente', icon: ClipboardList },
    { path: '/responsable/utilisateurs', label: 'Utilisateurs', icon: Users },
    { path: '/responsable/services', label: 'Services & clés', icon: KeyRound },
    { path: '/responsable/statistiques', label: 'Statistiques', icon: BarChart3 },
  ],
  [ROLES.TECHNICIEN]: [
    { path: '/technicien/interventions', label: 'Mes interventions', icon: Wrench },
  ],
};

export default function Sidebar() {
  const { user } = useAuth();
  if (!user) return null;

  const items = MENUS[user.role] || [];

  return (
    <nav style={styles.sidebar}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className="sidebar-link"
            style={({ isActive }) => ({
              ...styles.link,
              ...(isActive ? styles.linkActive : {}),
            })}
          >
            <Icon size={18} strokeWidth={2} />
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
}

const styles = {
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    width: '240px',
    padding: '20px 12px',
    background: 'var(--color-surface-alt)',
    borderRight: '1px solid var(--color-border)',
    minHeight: 'calc(100vh - 61px)',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: 'var(--radius)',
    fontSize: '14px',
    color: 'var(--color-text)',
    textDecoration: 'none',
    transition: 'background 0.15s ease, color 0.15s ease, transform 0.1s ease',
  },
  linkActive: {
    background: 'var(--color-primary)',
    color: 'var(--color-surface)',
    fontWeight: 500,
  },
};