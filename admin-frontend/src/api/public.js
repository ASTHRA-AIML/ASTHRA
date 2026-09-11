// ─── Public API ────────────────────────────────────────────────────────────
// Read-only public endpoints — no auth needed, no credentials.
// All under the /asthra prefix as defined by the backend.

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

async function publicFetch(path) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    let data;
    const text = await res.text();
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }

    if (!res.ok) {
      const message =
        (data && (data.detail || data.message)) ||
        text ||
        `${res.status} ${res.statusText}`;
      throw new Error(message);
    }

    return data;
  } catch (err) {
    console.error(`[Public API Error] ${path}:`, err);
    throw err;
  }
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

// GET /asthra/committee/current
export const getPublicCommitteeCurrent = (date) =>
  publicFetch(date ? `/asthra/committee/current?date=${encodeURIComponent(date)}` : '/asthra/committee/current');
