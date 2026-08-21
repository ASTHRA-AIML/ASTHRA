// ─── AdminLayout ───────────────────────────────────────────────────────────
// Wraps all protected pages with Sidebar + Topbar.
import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES = {
  '/admin/dashboard':   'Dashboard',
  '/admin/activities':  'Activities',
  '/admin/newsletters': 'Newsletters',
  '/admin/committee':   'Committee',
};

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const pageTitle =
    Object.entries(PAGE_TITLES).find(([path]) =>
      location.pathname.startsWith(path)
    )?.[1] ?? 'Admin';

  return (
    <div className="app-shell">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="main-wrapper">
        <Topbar
          pageTitle={pageTitle}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="page-content animate-fadeIn" id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
