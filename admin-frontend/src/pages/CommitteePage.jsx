// ─── CommitteePage (Admin) ────────────────────────────────────────────────
// Members grid + inline membership history management.

import { useState, useEffect, useCallback } from 'react';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import { LoadingState } from '../components/ui/Spinner';
import MemberForm from '../components/forms/MemberForm';
import { useToast } from '../context/ToastContext';
import * as Icon from '../components/ui/Icons';
import {
  getMembers, getMember,
  createMember, updateMember, deleteMember,
  addMembership, deleteMembership,
} from '../api/members';

// ── Member avatar ─────────────────────────────────────────────────────────────
function MemberAvatar({ name, photoUrl }) {
  if (photoUrl) {
    return <img src={photoUrl} alt={name} className="member-avatar" />;
  }
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return <div className="member-avatar-placeholder">{initials}</div>;
}

// ── Membership history section (inside edit modal) ─────────────────────────────
function MembershipSection({ memberId, memberships, onRefresh }) {
  const { showToast } = useToast();
  const [addForm, setAddForm] = useState({ acadamic_year: '', position: '' });
  const [addErrors, setAddErrors] = useState({});
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const validateAdd = () => {
    const errs = {};
    if (!addForm.acadamic_year.trim()) errs.acadamic_year = 'Required.';
    else if (!/^\d{4}-\d{2}$/.test(addForm.acadamic_year.trim())) errs.acadamic_year = 'Format: YYYY-YY';
    if (!addForm.position.trim()) errs.position = 'Required.';
    setAddErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!validateAdd()) return;
    setAdding(true);
    try {
      await addMembership(memberId, addForm);
      showToast('success', 'Membership added', `${addForm.acadamic_year} — ${addForm.position}`);
      setAddForm({ acadamic_year: '', position: '' });
      onRefresh();
    } catch (err) {
      showToast('error', 'Failed to add membership', err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteMembership = async (id) => {
    setDeletingId(id);
    try {
      await deleteMembership(id);
      showToast('success', 'Membership removed');
      onRefresh();
    } catch (err) {
      showToast('error', 'Failed to remove membership', err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={{ marginTop: 24 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--color-text-secondary)' }}>
        Membership History
      </h3>

      {memberships.length === 0 ? (
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 12 }}>
          No memberships yet — add the first one below.
        </p>
      ) : (
        <div style={{ border: '1px solid var(--color-border-light)', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
          <table className="membership-table" aria-label="Membership history">
            <thead>
              <tr>
                <th>Academic Year</th>
                <th>Position</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {memberships.map((ms) => (
                <tr key={ms.id}>
                  <td>
                    <span className="badge badge-primary">{ms.acadamic_year}</span>
                  </td>
                  <td>{ms.position}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      id={`delete-membership-${ms.id}`}
                      className="action-btn action-btn-delete"
                      style={{ width: 26, height: 26, fontSize: 13, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                      onClick={() => handleDeleteMembership(ms.id)}
                      disabled={deletingId === ms.id}
                      aria-label={`Remove ${ms.acadamic_year} membership`}
                      title="Remove membership"
                    >
                      {deletingId === ms.id
                        ? <span className="spinner" style={{ width: 12, height: 12 }} />
                        : <Icon.Close size={12} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add membership inline form */}
      <div className="inline-add-form">
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="ms-year" style={{ fontSize: 12 }}>Academic Year</label>
          <input
            id="ms-year"
            className={`form-input ${addErrors.acadamic_year ? 'error' : ''}`}
            value={addForm.acadamic_year}
            onChange={(e) => setAddForm((f) => ({ ...f, acadamic_year: e.target.value }))}
            placeholder="2025-26"
            style={{ fontSize: 13 }}
          />
          {addErrors.acadamic_year && <span className="form-error">{addErrors.acadamic_year}</span>}
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" htmlFor="ms-position" style={{ fontSize: 12 }}>Position</label>
          <input
            id="ms-position"
            className={`form-input ${addErrors.position ? 'error' : ''}`}
            value={addForm.position}
            onChange={(e) => setAddForm((f) => ({ ...f, position: e.target.value }))}
            placeholder="Treasurer"
            style={{ fontSize: 13 }}
          />
          {addErrors.position && <span className="form-error">{addErrors.position}</span>}
        </div>
        <button
          id="add-membership-btn"
          className="btn btn-secondary btn-sm"
          onClick={handleAdd}
          disabled={adding}
          style={{ alignSelf: 'flex-end', whiteSpace: 'nowrap' }}
        >
          {adding
            ? <><span className="spinner" style={{ width: 12, height: 12 }} /> Adding…</>
            : <><Icon.Plus size={13} /> Add Year</>}
        </button>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CommitteePage() {
  const { showToast } = useToast();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState({ open: false, mode: 'create', data: null });
  const [submitting, setSubmitting] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null, name: '' });
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMembers();
      setMembers(data || []);
    } catch (e) {
      showToast('error', 'Failed to load members', e.message);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const openEdit = async (id) => {
    try {
      const detail = await getMember(id);
      setModal({ open: true, mode: 'edit', data: detail });
    } catch (e) {
      showToast('error', 'Failed to load member', e.message);
    }
  };

  const refreshModalMember = useCallback(async () => {
    if (!modal.data?.id) return;
    try {
      const detail = await getMember(modal.data.id);
      setModal((m) => ({ ...m, data: detail }));
    } catch { /* ignore */ }
  }, [modal.data?.id]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (modal.mode === 'create') {
        await createMember(formData);
        showToast('success', 'Member added', `${formData.name} has been added.`);
        setModal({ open: false, mode: 'create', data: null });
        load();
      } else {
        await updateMember(modal.data.id, formData);
        showToast('success', 'Member updated', `${formData.name} has been saved.`);
        const updated = await getMember(modal.data.id);
        setModal((m) => ({ ...m, data: updated }));
      }
    } catch (e) {
      showToast('error', 'Save failed', e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteMember(confirmDelete.id);
      showToast('success', 'Deleted', `${confirmDelete.name} has been removed.`);
      setConfirmDelete({ open: false, id: null, name: '' });
      load();
    } catch (e) {
      showToast('error', 'Delete failed', e.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="animate-slideUp" id="committee-page">
      <div className="page-header">
        <div className="page-header-text">
          <h1>Committee</h1>
          <p>Manage committee members and their academic year memberships.</p>
        </div>
        <button
          id="add-member-btn"
          className="btn btn-primary"
          onClick={() => setModal({ open: true, mode: 'create', data: null })}
        >
          <Icon.Plus size={16} /> Add Member
        </button>
      </div>

      {loading ? (
        <LoadingState message="Loading members…" />
      ) : members.length === 0 ? (
        <div className="data-table-wrapper">
          <EmptyState
            icon={<Icon.Committee size={40} />}
            title="No members yet"
            description="Add your first committee member to get started."
            action={
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setModal({ open: true, mode: 'create', data: null })}
              >
                Add Member
              </button>
            }
          />
        </div>
      ) : (
        <div className="members-grid" role="list" aria-label="Committee members">
          {members.map((mem) => (
            <div key={mem.id} className="member-card" role="listitem">
              <MemberAvatar name={mem.name} photoUrl={mem.photo_url} />
              <div className="member-info">
                <div className="member-name">{mem.name}</div>
                <div className="member-meta">
                  {mem.linkedin_url && (
                    <a
                      href={mem.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="member-linkedin"
                      aria-label={`${mem.name}'s LinkedIn profile`}
                    >
                      <Icon.LinkedIn size={13} /> LinkedIn
                    </a>
                  )}
                </div>
              </div>
              <div className="table-actions">
                <button
                  id={`edit-member-${mem.id}`}
                  className="action-btn action-btn-edit"
                  onClick={() => openEdit(mem.id)}
                  aria-label={`Edit ${mem.name}`}
                  title="Edit member"
                >
                  <Icon.Edit size={15} />
                </button>
                <button
                  id={`delete-member-${mem.id}`}
                  className="action-btn action-btn-delete"
                  onClick={() => setConfirmDelete({ open: true, id: mem.id, name: mem.name })}
                  aria-label={`Delete ${mem.name}`}
                  title="Delete member"
                >
                  <Icon.Trash size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modal.open}
        onClose={() => !submitting && setModal({ open: false, mode: 'create', data: null })}
        title={modal.mode === 'create' ? 'Add New Member' : `Edit — ${modal.data?.name ?? ''}`}
        size="md"
        footer={
          <>
            <button
              className="btn btn-ghost"
              onClick={() => setModal({ open: false, mode: 'create', data: null })}
              disabled={submitting}
            >
              {modal.mode === 'edit' ? 'Close' : 'Cancel'}
            </button>
            <button
              id="member-form-submit-btn"
              className="btn btn-primary"
              type="submit"
              form="member-form"
              disabled={submitting}
            >
              {submitting ? (
                <><span className="spinner" style={{ borderTopColor: '#fff' }} /> Saving…</>
              ) : (
                modal.mode === 'create' ? 'Add Member' : 'Save Changes'
              )}
            </button>
          </>
        }
      >
        <MemberForm
          key={modal.data?.id ?? 'new'}
          initial={modal.data}
          onSubmit={handleSubmit}
          isSubmitting={submitting}
        />

        {/* Membership history (only in edit mode) */}
        {modal.mode === 'edit' && modal.data && (
          <>
            <div className="divider" />
            <MembershipSection
              memberId={modal.data.id}
              memberships={modal.data.memberships || []}
              onRefresh={refreshModalMember}
            />
          </>
        )}
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, id: null, name: '' })}
        onConfirm={handleDelete}
        title={`Delete "${confirmDelete.name}"?`}
        message="This will permanently remove the member and all their membership records."
        isLoading={deleting}
      />
    </div>
  );
}
