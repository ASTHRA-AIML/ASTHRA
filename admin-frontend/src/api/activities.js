// ─── Activities API ────────────────────────────────────────────────────────
// All endpoints under /asthra/admin/activities
// Request body: { title, activity_date, thumbnail_url, description, image_url[] }

import { apiFetch, apiPost, apiPut, apiDelete } from './client';

const BASE = '/asthra/admin/activities';

export const getActivities = () =>
  apiFetch(BASE);

export const getActivity = (id) =>
  apiFetch(`${BASE}/${id}`);

export const createActivity = (body) =>
  apiPost(BASE, body);

export const updateActivity = (id, body) =>
  apiPut(`${BASE}/${id}`, body);

export const deleteActivity = (id) =>
  apiDelete(`${BASE}/${id}`);
