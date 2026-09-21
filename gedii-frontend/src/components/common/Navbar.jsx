import { useState, useRef, useEffect } from 'react';
import { ChevronDown, LogOut, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import coatOfArms from '../../assets/coat-of-arms.png';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = user?.nom
    ? user.nom.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const roleLabel = {
    AGENT: 'Agent',
    TECHNICIEN: 'Technicien',
    RESPONSABLE: 'Responsable',
  }[user?.role] || user?.role;

  const roleColor = {
    AGENT: 'var(--color-primary)',
    TECHNICIEN: 'var(--color-accent-gold)',
    RESPONSABLE: 'var(--color-accent-red)',
  }[user?.role] || 'var(--color-primary)';

  const goToProfil = () => {
    setMenuOpen(false);
    navigate('/profil');
  };

  return (
    <>
      <style>{`
        .gedii-navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 24px;
          background: var(--color-surface);
          border-bottom: 1px solid var(--color-border);
          position: sticky;
          top: 0;
          z-index: 100;
          transition: box-shadow 0.25s ease, background 0.25s ease, backdrop-filter 0.25s ease;
        }

        .gedii-navbar.scrolled {
          box-shadow: 0 4px 20px rgba(10, 21, 17, 0.08);
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
        }

        [data-theme='dark'] .gedii-navbar.scrolled {
          background: rgba(20, 26, 23, 0.85);
        }

        .gedii-navbar-left {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .gedii-navbar-left:hover {
          transform: translateX(2px);
        }

        .gedii-navbar-logo {
          width: 38px;
          height: 38px;
          object-fit: contain;
          transition: transform 0.3s ease;
        }

        .gedii-navbar-left:hover .gedii-navbar-logo {
          transform: rotate(-5deg) scale(1.05);
        }

        .gedii-navbar-title {
          font-family: var(--font-display);
          font-size: 17px;
          font-weight: 700;
          margin: 0;
          color: var(--color-text);
          letter-spacing: 0.02em;
          line-height: 1.1;
        }

        .gedii-navbar-subtitle {
          font-size: 11px;
          color: var(--color-text-soft);
          margin: 2px 0 0 0;
          letter-spacing: 0.01em;
        }

        .gedii-navbar-right {
          position: relative;
        }

        .gedii-user-button {
          display: flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          border: 1px solid transparent;
          padding: 6px 10px 6px 6px;
          border-radius: 999px;
          cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease;
        }

        .gedii-user-button:hover {
          background: var(--color-bg-strong);
          border-color: var(--color-border);
        }

        .gedii-avatar {
          position: relative;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--color-primary);
          color: var(--color-surface);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          overflow: hidden;
          flex-shrink: 0;
        }

        .gedii-avatar::after {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          border: 2px solid transparent;
          border-top-color: var(--color-primary);
          animation: spinRing 3s linear infinite;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .gedii-user-button:hover .gedii-avatar::after {
          opacity: 1;
        }

        @keyframes spinRing {
          to { transform: rotate(360deg); }
        }

        .gedii-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .gedii-user-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1px;
        }

        .gedii-user-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--color-text);
          line-height: 1.2;
        }

        .gedii-user-role {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 1px 7px;
          border-radius: 999px;
          color: #fff;
          line-height: 1.4;
        }

        .gedii-chevron {
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          color: var(--color-text-soft);
        }

        .gedii-user-button.open .gedii-chevron {
          transform: rotate(180deg);
        }

        .gedii-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          box-shadow: 0 12px 32px rgba(10, 21, 17, 0.14);
          min-width: 200px;
          overflow: hidden;
          padding: 6px;
          animation: dropdownSlide 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes dropdownSlide {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .gedii-dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 10px 14px;
          background: transparent;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          color: var(--color-text);
          text-align: left;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.1s ease;
        }

        .gedii-dropdown-item:hover {
          background: var(--color-bg-strong);
          transform: translateX(2px);
        }

        .gedii-dropdown-item.danger {
          color: var(--color-accent-red);
        }

        .gedii-dropdown-divider {
          height: 1px;
          background: var(--color-border);
          margin: 4px 8px;
        }
      `}</style>

      <header className={`gedii-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="gedii-navbar-left" onClick={() => navigate('/')}>
          <img src={coatOfArms} alt="République du Cameroun" className="gedii-navbar-logo" />
          <div>
            <p className="gedii-navbar-title">GEDII</p>
            <p className="gedii-navbar-subtitle">Ministère de la Communication</p>
          </div>
        </div>

        {user && (
          <div className="gedii-navbar-right" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`gedii-user-button ${menuOpen ? 'open' : ''}`}
            >
              <div className="gedii-avatar">
                {user.photoUrl ? (
                  <img src={user.photoUrl} alt={user.nom} />
                ) : (
                  initials
                )}
              </div>
              <div className="gedii-user-text">
                <span className="gedii-user-name">{user.nom}</span>
                <span className="gedii-user-role" style={{ background: roleColor }}>
                  {roleLabel}
                </span>
              </div>
              <ChevronDown size={16} className="gedii-chevron" />
            </button>

            {menuOpen && (
              <div className="gedii-dropdown">
                <button onClick={goToProfil} className="gedii-dropdown-item">
                  <UserIcon size={16} />
                  Mon profil
                </button>
                <div className="gedii-dropdown-divider" />
                <button onClick={logout} className="gedii-dropdown-item danger">
                  <LogOut size={16} />
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
}