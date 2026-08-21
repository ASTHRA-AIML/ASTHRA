// ─── API Base Client ───────────────────────────────────────────────────────
// All admin fetch calls go through this wrapper.
// Automatically includes credentials (cookie) and handles 401 redirects.

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Core fetch wrapper.
 * @param {string} path       - Endpoint path (e.g. "/admin/login")
 * @param {RequestInit} init  - Fetch init options
 * @returns {Promise<any>}    - Parsed JSON response
 * @throws {Error}            - With message from server or status text
 */
export async function apiFetch(path, init = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    credentials: 'include',           // always send cookies
    headers: {
      ...(init.headers || {}),
    },
  });

  // 401 → redirect to /admin/login (unless we're already on the login endpoint)
  if (response.status === 401 && !path.includes('/admin/login')) {
    sessionStorage.removeItem('asthra_admin_auth');
    window.location.href = '/admin/login';
    return;
  }

  // Parse JSON (backend always returns JSON)
  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      (data && (data.detail || data.message)) ||
      `Request failed: ${response.status} ${response.statusText}`;
    throw new Error(message);
  }

  return data;
}

/**
 * JSON POST/PUT helper — sends JSON body with Content-Type header.
 */
export function apiPost(path, body) {
  return apiFetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export function apiPut(path, body) {
  return apiFetch(path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export function apiDelete(path) {
  return apiFetch(path, { method: 'DELETE' });
}
