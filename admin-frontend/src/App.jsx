// ─── App.jsx — Root router ──────────────────────────────────────────────────
// Routes:
//   Public  →  /, /activities, /activities/:id, /newsletters, /newsletters/:id, /committee
//   Admin   →  /admin/login, /admin/dashboard, /admin/activities,
//               /admin/newsletters, /admin/committee

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// ── Layouts ──────────────────────────────────────────────────────────────────
import PublicLayout  from './components/layout/PublicLayout';
import AdminLayout   from './components/layout/AdminLayout';

// ── Public pages ─────────────────────────────────────────────────────────────
import HomePage            from './pages/public/HomePage';
import PublicActivitiesPage    from './pages/public/ActivitiesPage';
import ActivityDetailPage      from './pages/public/ActivityDetailPage';
import PublicNewslettersPage   from './pages/public/NewslettersPage';
import NewsletterDetailPage    from './pages/public/NewsletterDetailPage';
import PublicCommitteePage     from './pages/public/CommitteePage';

// ── Admin pages ───────────────────────────────────────────────────────────────
import LoginPage      from './pages/LoginPage';
import DashboardPage  from './pages/DashboardPage';
import ActivitiesPage from './pages/ActivitiesPage';
import NewslettersPage from './pages/NewslettersPage';
import CommitteePage  from './pages/CommitteePage';

// ── Route guard ───────────────────────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <AdminLayout>{children}</AdminLayout>;
}

// ── App shell ─────────────────────────────────────────────────────────────────
function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* ── Public pages ───────────────────────────────────────────────── */}
      <Route
        path="/"
        element={
          <PublicLayout>
            <HomePage />
          </PublicLayout>
        }
      />
      <Route
        path="/activities"
        element={
          <PublicLayout>
            <PublicActivitiesPage />
          </PublicLayout>
        }
      />
      <Route
        path="/activities/:id"
        element={
          <PublicLayout>
            <ActivityDetailPage />
          </PublicLayout>
        }
      />
      <Route
        path="/newsletters"
        element={
          <PublicLayout>
            <PublicNewslettersPage />
          </PublicLayout>
        }
      />
      <Route
        path="/newsletters/:id"
        element={
          <PublicLayout>
            <NewsletterDetailPage />
          </PublicLayout>
        }
      />
      <Route
        path="/committee"
        element={
          <PublicLayout>
            <PublicCommitteePage />
          </PublicLayout>
        }
      />

      {/* ── Admin: Login (unprotected) ─────────────────────────────────── */}
      <Route
        path="/admin/login"
        element={
          isAuthenticated
            ? <Navigate to="/admin/dashboard" replace />
            : <LoginPage />
        }
      />

      {/* ── Admin: Protected pages ─────────────────────────────────────── */}
      <Route
        path="/admin/dashboard"
        element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
      />
      <Route
        path="/admin/activities"
        element={<ProtectedRoute><ActivitiesPage /></ProtectedRoute>}
      />
      <Route
        path="/admin/newsletters"
        element={<ProtectedRoute><NewslettersPage /></ProtectedRoute>}
      />
      <Route
        path="/admin/committee"
        element={<ProtectedRoute><CommitteePage /></ProtectedRoute>}
      />

      {/* ── Legacy redirects (in case old /login bookmark exists) ─────── */}
      <Route path="/login" element={<Navigate to="/admin/login" replace />} />
      <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />

      {/* ── Default: unknown routes → public home ─────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
