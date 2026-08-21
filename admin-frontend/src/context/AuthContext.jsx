// ─── AuthContext ───────────────────────────────────────────────────────────
// Tracks login state. Since auth is purely cookie-based (httpOnly), the
// frontend can't read the cookie directly. Instead it tracks a JS-side
// isAuthenticated flag, persisted to sessionStorage so page refreshes don't
// immediately boot the user to /login (the backend will 401 if the cookie
// actually expired).

import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('asthra_admin_auth') === 'true';
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (username, password) => {
    setIsLoading(true);
    try {
      await apiLogin(username, password);
      sessionStorage.setItem('asthra_admin_auth', 'true');
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } finally {
      sessionStorage.removeItem('asthra_admin_auth');
      setIsAuthenticated(false);
    }
  };

  // If a protected API call gets a 401, clear the auth flag.
  // The apiFetch client will redirect to /login, but we also sync state here.
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'asthra_admin_auth' && !e.newValue) {
        setIsAuthenticated(false);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
