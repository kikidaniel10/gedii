import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Breadcrumb from './Breadcrumb';

export default function AppLayout({ children }) {
  const location = useLocation();

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main key={location.pathname} className="page-transition" style={{ flex: 1, padding: '32px' }}>
          <Breadcrumb />
          {children}
        </main>
      </div>
    </div>
  );
}