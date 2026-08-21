// ─── Auth API ─────────────────────────────────────────────────────────────
// POST /admin/login   — { username, password } → sets admin_session cookie
// POST /admin/logout  — clears admin_session cookie

import { apiPost, apiFetch } from './client';

export const login = (username, password) =>
  apiPost('/admin/login', { username, password });

export const logout = () =>
  apiFetch('/admin/logout', { method: 'POST' });
