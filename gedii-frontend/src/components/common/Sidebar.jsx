import { NavLink } from 'react-router-dom';
import { ROLES } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';
import {
  FileText, History, ClipboardList, Users, KeyRound,
  BarChart3, Wrench, UserCheck, LayoutDashboard,
} from 'lucide-react';

const MENUS = {
  [ROLES.AGENT]: [
    { path: '/agent/soumettre', label: 'Soumettre une demande', icon: FileText },
    { path: '/agent/historique', label: 'Mes demandes', icon: History },
  ],
  [ROLES.RESPONSABLE]: [
    { path: '/responsable/demandes', label: 'Demandes en attente', icon: ClipboardList },
    { path: '/responsable/assigner', label: 'Assigner un technicien', icon: UserCheck },
    { path: '/responsable/techniciens', label: 'Interventions techniciens', icon: Wrench },
    { path: '/responsable/utilisateurs', label: 'Utilisateurs', icon: Users },
    { path: '/responsable/services', label: 'Services & clés', icon: KeyRound },
    { path: '/responsable/statistiques', label: 'Statistiques', icon: BarChart3 },
  ],
  [ROLES.TECHNICIEN]: [
    { path: '/technicien/interventions', label: 'Mes interventions', icon: Wrench },
  ],
};

const ROLE_LABELS = {
  AGENT: 'Espace Agent',
  RESPONSABLE: 'Espace Responsable',
  TECHNICIEN: 'Espace Technicien',
};

export default function Sidebar() {
  const { user } = useAuth();
  if (!user) return null;

  const items = MENUS[user.role] || [];

  return (
    <>
      <style>{`
        .gedii-sidebar {
          display: flex;
          flex-direction: column;
          gap: 4px;
          width: 250px;
          padding: 20px 14px;
          background: var(--color-surface-alt);
          border-right: 1px solid var(--color-border);
          min-height: calc(100vh - 63px);
          position: sticky;
          top: 63px;
          height: calc(100vh - 63px);
          overflow-y: auto;
          transition: background 0.25s ease;
        }

        .gedii-sidebar-header {
          padding: 4px 12px 16px 12px;
          border-bottom: 1px solid var(--color-border);
          margin-bottom: 12px;
        }

        .gedii-sidebar-header-label {
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-text-soft);
          margin: 0;
        }

        .gedii-sidebar-link {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 12px 11px 16px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          color: var(--color-text-soft);
          text-decoration: none;
          transition: background 0.18s ease, color 0.18s ease, transform 0.15s ease;
          overflow: hidden;
        }

        .gedii-sidebar-link::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%) scaleY(0);
          width: 3px;
          height: 60%;
          background: var(--color-primary);
          border-radius: 0 4px 4px 0;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          transform-origin: center;
        }

        .gedii-sidebar-link:hover {
          background: var(--color-bg-strong);
          color: var(--color-text);
          transform: translateX(2px);
        }

        .gedii-sidebar-link:hover::before {
          transform: translateY(-50%) scaleY(1);
        }

        .gedii-sidebar-link.active {
          background: linear-gradient(90deg, var(--color-primary-soft) 0%, transparent 100%);
          color: var(--color-primary-dark);
          font-weight: 600;
        }

        .gedii-sidebar-link.active::before {
          transform: translateY(-50%) scaleY(1);
          background: var(--color-primary);
        }

        .gedii-sidebar-link svg {
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }

        .gedii-sidebar-link:hover svg {
          transform: scale(1.08);
        }

        .gedii-sidebar-link.active svg {
          color: var(--color-primary);
        }

        .gedii-sidebar-footer {
          margin-top: auto;
          padding: 14px 12px 4px 12px;
          border-top: 1px solid var(--color-border);
        }

        .gedii-sidebar-footer-text {
          font-size: 11px;
          color: var(--color-text-soft);
          line-height: 1.5;
          margin: 0;
        }

        .gedii-sidebar-footer-brand {
          font-family: var(--font-mono, monospace);
          font-weight: 700;
          font-size: 10px;
          letter-spacing: 0.1em;
          color: var(--color-primary);
          margin: 0 0 4px 0;
          text-transform: uppercase;
        }

        @media (max-width: 900px) {
          .gedii-sidebar {
            width: 70px;
            padding: 20px 8px;
          }

          .gedii-sidebar-header,
          .gedii-sidebar-footer {
            display: none;
          }

          .gedii-sidebar-link {
            justify-content: center;
            padding: 12px;
          }

          .gedii-sidebar-link span {
            display: none;
          }
        }
      `}</style>

      <nav className="gedii-sidebar">
        <div className="gedii-sidebar-header">
          <p className="gedii-sidebar-header-label">{ROLE_LABELS[user.role]}</p>
        </div>

        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `gedii-sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={18} strokeWidth={2} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        <div className="gedii-sidebar-footer">
          <p className="gedii-sidebar-footer-brand">GEDII v1.0</p>
          <p className="gedii-sidebar-footer-text">
            Cellule Informatique<br />
            MINCOM © {new Date().getFullYear()}
          </p>
        </div>
      </nav>
    </>
  );
}