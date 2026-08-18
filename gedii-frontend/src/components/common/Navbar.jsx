import { useState, useRef, useEffect } from 'react';
import { ChevronDown, LogOut } from 'lucide-react';
import coatOfArms from '../../assets/coat-of-arms.png';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
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

  return (
    <header
      style={styles.navbar}
      className={scrolled ? 'navbar-scrolled' : ''}
    >
      <div style={styles.left}>
        <img src={coatOfArms} alt="République du Cameroun" style={styles.logo} />
        <div>
          <p style={styles.title}>GEDII</p>
          <p style={styles.subtitle}>Ministère de la Communication</p>
        </div>
      </div>

      {user && (
        <div style={styles.right} ref={menuRef}>
          <button onClick={() => setMenuOpen(!menuOpen)} style={styles.userButton}>
            <div style={styles.avatar}>{initials}</div>
            <div style={styles.userText}>
              <span style={styles.userName}>{user.nom}</span>
              <span style={styles.userRole}>{user.role}</span>
            </div>
            <ChevronDown
              size={16}
              style={{
                transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            />
          </button>

          {menuOpen && (
            <div style={styles.dropdown} className="page-transition">
              <button onClick={logout} style={styles.dropdownItem}>
                <LogOut size={16} />
                Déconnexion
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    background: 'var(--color-surface)',
    borderBottom: '1px solid var(--color-border)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    transition: 'box-shadow 0.2s ease, background 0.25s ease',
  },
  left: { display: 'flex', alignItems: 'center', gap: '12px' },
  logo: { width: '36px', height: '36px', objectFit: 'contain' },
  title: { fontFamily: 'var(--font-display)', fontSize: '16px', margin: 0, color: 'var(--color-text)' },
  subtitle: { fontSize: '11px', color: 'var(--color-text-soft)', margin: 0 },
  right: { position: 'relative' },
  userButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'transparent',
    border: 'none',
    padding: '6px 8px',
    borderRadius: 'var(--radius)',
  },
  avatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    background: 'var(--color-primary)',
    color: 'var(--color-surface)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: 600,
  },
  userText: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' },
  userName: { fontSize: '13px', fontWeight: 500, color: 'var(--color-text)' },
  userRole: { fontSize: '11px', color: 'var(--color-text-soft)' },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius)',
    boxShadow: '0 8px 24px var(--color-shadow)',
    minWidth: '180px',
    overflow: 'hidden',
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    padding: '10px 14px',
    background: 'transparent',
    border: 'none',
    fontSize: '14px',
    color: 'var(--color-accent-red)',
    textAlign: 'left',
  },
};