// ─── Topbar ────────────────────────────────────────────────────────────────
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import * as Icon from '../ui/Icons';

export default function Topbar({ pageTitle, onMenuClick }) {
  const { logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      showToast('info', 'Logged out', 'You have been signed out successfully.');
      navigate('/admin/login', { replace: true });
    } catch {
      // Still redirect even on error
      navigate('/admin/login', { replace: true });
    }
  };

  return (
    <header className="topbar" role="banner">
      {/* Mobile menu button */}
      <button
        className="sidebar-toggle"
        onClick={onMenuClick}
        aria-label="Toggle navigation menu"
        style={{ display: 'flex' }}
      >
        <Icon.Menu size={20} />
      </button>

      <h1 className="topbar-title">{pageTitle}</h1>

      <div className="topbar-right">
        <div className="topbar-admin-pill" aria-label="Logged in as admin">
          <div className="topbar-admin-avatar" aria-hidden="true">A</div>
          <span>Admin</span>
        </div>
        <button
          id="topbar-logout-btn"
          className="topbar-logout-btn"
          onClick={handleLogout}
          aria-label="Log out"
        >
          <Icon.Logout size={16} />
          Logout
        </button>
      </div>
    </header>
  );
}
