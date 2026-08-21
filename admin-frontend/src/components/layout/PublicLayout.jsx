// ─── PublicLayout ─────────────────────────────────────────────────────────
// Navigation header + footer wrapping all public pages.

import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import * as Icon from '../ui/Icons';

const NAV_ITEMS = [
  { to: '/',            label: 'Home',        end: true },
  { to: '/activities',  label: 'Activities'  },
  { to: '/newsletters', label: 'Newsletters' },
  { to: '/committee',   label: 'Committee'   },
];

export default function PublicLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="public-page">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <header className="pub-header">
        <div className="pub-header-inner">
          {/* Logo */}
          <Link to="/" className="pub-logo" aria-label="ASTHRA home">
            <div className="pub-logo-icon">
              <Icon.Star size={18} />
            </div>
            ASTHRA
          </Link>

          {/* Desktop nav */}
          <nav className="pub-nav" aria-label="Main navigation">
            {NAV_ITEMS.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `pub-nav-link${isActive ? ' active' : ''}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            className="pub-mobile-menu-btn"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <Icon.Close size={22} /> : <Icon.Menu size={22} />}
          </button>
        </div>

        {/* Mobile nav drawer */}
        <nav
          className={`pub-mobile-nav${mobileOpen ? ' open' : ''}`}
          aria-label="Mobile navigation"
        >
          {NAV_ITEMS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `pub-nav-link${isActive ? ' active' : ''}`
              }
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      {/* ── Page content ───────────────────────────────────────────────── */}
      <div>{children}</div>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="pub-footer" role="contentinfo">
        <div className="pub-footer-inner">
          <div className="pub-footer-brand">
            <div className="pub-logo">
              <div className="pub-logo-icon">
                <Icon.Star size={16} />
              </div>
              ASTHRA
            </div>
            <p className="pub-footer-tagline">
              Department of Computer Science &amp; Engineering
            </p>
          </div>

          <div className="pub-footer-links">
            <a
              href="https://instagram.com/asthra_cse"
              target="_blank"
              rel="noopener noreferrer"
              className="pub-footer-link"
              aria-label="Follow ASTHRA on Instagram"
            >
              <Icon.Instagram size={16} /> @asthra_cse
            </a>
            <a
              href="mailto:asthra.cse@college.edu"
              className="pub-footer-link"
              aria-label="Email ASTHRA"
            >
              <Icon.Mail size={16} /> asthra.cse@college.edu
            </a>
          </div>
        </div>
        <div className="pub-footer-copy">
          © {new Date().getFullYear()} ASTHRA · Department Association
        </div>
      </footer>
    </div>
  );
}
