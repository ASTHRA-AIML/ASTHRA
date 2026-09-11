// ─── App.jsx — Root router ──────────────────────────────────────────────────
// Admin Routes:
//   /admin/login, /admin/dashboard, /admin/activities,
//   /admin/newsletters, /admin/committee
// Public Routes:
//   /* (All non-admin routes render the winning UI/UX PublicApp)

import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// ── Public App (STATIC import — testing lazy vs static for Tailwind CSS) ─────
import PublicApp from './public/PublicApp';

// ── Admin Layout ─────────────────────────────────────────────────────────────
import AdminLayout from './components/layout/AdminLayout';

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

      {/* ── Legacy redirects ────────────────────────────────────────────── */}
      <Route path="/login" element={<Navigate to="/admin/login" replace />} />
      <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />

      {/* ── Public catch-all ────────────────────────────────────────────── */}
      <Route
        path="/*"
        element={<PublicApp />}
      />
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
