// ─── Sidebar ───────────────────────────────────────────────────────────────
import { NavLink } from 'react-router-dom';
import * as Icon from '../ui/Icons';

const NAV_ITEMS = [
  { to: '/admin/dashboard',   icon: <Icon.Dashboard size={18} />,   label: 'Dashboard'   },
  { to: '/admin/activities',  icon: <Icon.Activities size={18} />,  label: 'Activities'  },
  { to: '/admin/newsletters', icon: <Icon.Newsletters size={18} />, label: 'Newsletters' },
  { to: '/admin/committee',   icon: <Icon.Committee size={18} />,   label: 'Committee'   },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`sidebar ${isOpen ? 'open' : ''}`} aria-label="Main navigation">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon" aria-hidden="true">
            <Icon.Star size={20} />
          </div>
          <div className="sidebar-logo-text">
            <span className="sidebar-logo-title">ASTHRA</span>
            <span className="sidebar-logo-subtitle">Admin Panel</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav" aria-label="Admin navigation">
          <div className="sidebar-nav-section">
            <div className="sidebar-nav-section-label">Menu</div>
            {NAV_ITEMS.map(({ to, icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `sidebar-nav-item ${isActive ? 'active' : ''}`
                }
                onClick={onClose}
                aria-label={label}
              >
                <span className="sidebar-nav-icon" aria-hidden="true">{icon}</span>
                <span className="sidebar-nav-label">{label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>
            ASTHRA © {new Date().getFullYear()}
          </div>
        </div>
      </aside>
    </>
  );
}
