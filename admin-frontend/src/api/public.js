// ─── Public API ────────────────────────────────────────────────────────────
// Read-only public endpoints — no auth needed, no credentials.
// All under the /asthra prefix as defined by the backend.

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

async function publicFetch(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `${res.status} ${res.statusText}`);
  }
  return res.json();
}

// GET /asthra/activities → [{ id, title, activity_date, thumbnail_url }]
export const getPublicActivities = () =>
  publicFetch('/asthra/activities');

// GET /asthra/activities/{id} → { id, title, activity_date, description, thumbnail_url, image_url[] }
export const getPublicActivity = (id) =>
  publicFetch(`/asthra/activities/${id}`);

// GET /asthra/newsletters → [{ id, title, newsletter_date, cover_image_url }]
export const getPublicNewsletters = () =>
  publicFetch('/asthra/newsletters');

// GET /asthra/newsletters/{id} → { id, title, newsletter_date, description, cover_image_url, pdf_url }
export const getPublicNewsletter = (id) =>
  publicFetch(`/asthra/newsletters/${id}`);

// GET /asthra/committee → [{ acadamic_year, members: [{ id, name, photo_url, linkedin_url, position }] }]
// Note: "acadamic_year" is the exact backend field (intentional typo preserved).
export const getPublicCommittee = () =>
  publicFetch('/asthra/committee');
