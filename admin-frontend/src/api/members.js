// ─── Members API ──────────────────────────────────────────────────────────
// Members: /asthra/admin/members
// Memberships: /asthra/admin/members/{id}/memberships, /asthra/admin/memberships/{id}
//
// NOTE: Backend schema uses "acadamic_year" (intentional typo preserved here)
// to match the backend field name exactly.

import { apiFetch, apiPost, apiPut, apiDelete } from './client';

const MEMBERS_BASE = '/asthra/admin/members';
const MEMBERSHIPS_BASE = '/asthra/admin/memberships';

// ── Members ──────────────────────────────────────────────────────────────
export const getMembers = () =>
  apiFetch(MEMBERS_BASE);

export const getMember = (id) =>
  apiFetch(`${MEMBERS_BASE}/${id}`);

/**
 * Create a member.
 * Body: { name, photo_url, position, linkedin_url, acadamic_year }
 */
export const createMember = (body) =>
  apiPost(MEMBERS_BASE, body);

/**
 * Update a member.
 * Body: { name, photo_url, position, linkedin_url, acadamic_year }
 */
export const updateMember = (id, body) =>
  apiPut(`${MEMBERS_BASE}/${id}`, body);

export const deleteMember = (id) =>
  apiDelete(`${MEMBERS_BASE}/${id}`);

// ── Memberships ───────────────────────────────────────────────────────────
/**
 * Add a membership row to a member.
 * Body: { acadamic_year: "2025-26", position: "Treasurer" }
 */
export const addMembership = (memberId, body) =>
  apiPost(`${MEMBERS_BASE}/${memberId}/memberships`, body);

export const deleteMembership = (membershipId) =>
  apiDelete(`${MEMBERSHIPS_BASE}/${membershipId}`);
