// ─── Upload API ───────────────────────────────────────────────────────────
// POST /asthra/admin/upload  — multipart/form-data: file + folder
// Returns: { url: string }
// Note: Backend protects this with require_admin (cookie must be present).

import { apiFetch } from './client';

/**
 * Upload a file to Cloudinary via the backend proxy.
 * @param {File}   file    - The File object to upload
 * @param {string} folder  - Cloudinary folder name (e.g. "activities", "newsletters/pdfs")
 * @returns {Promise<string>} - The hosted Cloudinary URL
 */
export async function uploadMedia(file, folder) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const data = await apiFetch('/asthra/admin/upload', {
    method: 'POST',
    body: formData,
    // Do NOT set Content-Type header — browser sets it with boundary for multipart
  });

  return data.url;
}
