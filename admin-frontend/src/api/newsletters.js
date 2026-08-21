// ─── Newsletters API ───────────────────────────────────────────────────────
// All endpoints under /asthra/admin/newsletters
// Request body: { title, description, newsletter_date, cover_image_url, pdf_url }

import { apiFetch, apiPost, apiPut, apiDelete } from './client';

const BASE = '/asthra/admin/newsletters';

export const getNewsletters = () =>
  apiFetch(BASE);

export const getNewsletter = (id) =>
  apiFetch(`${BASE}/${id}`);

export const createNewsletter = (body) =>
  apiPost(BASE, body);

export const updateNewsletter = (id, body) =>
  apiPut(`${BASE}/${id}`, body);

export const deleteNewsletter = (id) =>
  apiDelete(`${BASE}/${id}`);
