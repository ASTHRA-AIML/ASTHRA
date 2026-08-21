// ─── ActivitiesPage (Admin) ────────────────────────────────────────────────
import { useState, useEffect, useCallback } from 'react';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import { TableSkeleton } from '../components/ui/Spinner';
import ActivityForm from '../components/forms/ActivityForm';
import { useToast } from '../context/ToastContext';
import * as Icon from '../components/ui/Icons';
import {
  getActivities, getActivity,
  createActivity, updateActivity, deleteActivity,
} from '../api/activities';

export default function ActivitiesPage() {
  const { showToast } = useToast();

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modal, setModal] = useState({ open: false, mode: 'create', data: null });
  const [submitting, setSubmitting] = useState(false);

  // Confirm delete
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null, title: '' });
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getActivities();
      setActivities(data || []);
    } catch (e) {
      showToast('error', 'Failed to load activities', e.message);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  // ── Open edit modal — fetch full detail ──────────────────────────────────
  const openEdit = async (id) => {
    try {
      const detail = await getActivity(id);
      setModal({ open: true, mode: 'edit', data: detail });
    } catch (e) {
      showToast('error', 'Failed to load activity', e.message);
    }
  };

  // ── Submit (create or edit) ──────────────────────────────────────────────
  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (modal.mode === 'create') {
        await createActivity(formData);
        showToast('success', 'Activity created', `"${formData.title}" has been added.`);
      } else {
        await updateActivity(modal.data.id, formData);
        showToast('success', 'Activity updated', `"${formData.title}" has been saved.`);
      }
      setModal({ open: false, mode: 'create', data: null });
      load();
    } catch (e) {
      showToast('error', 'Save failed', e.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteActivity(confirmDelete.id);
      showToast('success', 'Deleted', `"${confirmDelete.title}" has been removed.`);
      setConfirmDelete({ open: false, id: null, title: '' });
      load();
    } catch (e) {
      showToast('error', 'Delete failed', e.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="animate-slideUp" id="activities-page">
      {/* Page header */}
      <div className="page-header">
        <div className="page-header-text">
          <h1>Activities</h1>
          <p>Manage all department activities and events.</p>
        </div>
        <button
          id="add-activity-btn"
          className="btn btn-primary"
          onClick={() => setModal({ open: true, mode: 'create', data: null })}
        >
          <Icon.Plus size={16} /> Add Activity
        </button>
      </div>

      {/* Table */}
      <div className="data-table-wrapper">
        {loading ? (
          <TableSkeleton rows={5} cols={3} />
        ) : activities.length === 0 ? (
          <EmptyState
            icon={<Icon.Activities size={40} />}
            title="No activities yet"
            description="Add your first activity to get started."
            action={
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setModal({ open: true, mode: 'create', data: null })}
              >
                Add Activity
              </button>
            }
          />
        ) : (
          <table className="data-table" aria-label="Activities list">
            <thead>
              <tr>
                <th>Thumbnail</th>
                <th>Title</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((act) => (
                <tr key={act.id}>
                  <td>
                    {act.thumbnail_url ? (
                      <img src={act.thumbnail_url} alt="" className="table-thumb" />
                    ) : (
                      <div className="table-thumb-placeholder">
                        <Icon.Image size={20} />
                      </div>
                    )}
                  </td>
                  <td>
                    <span style={{ fontWeight: 500 }}>{act.title}</span>
                  </td>
                  <td style={{ color: 'var(--color-text-secondary)' }}>
                    {new Date(act.activity_date).toLocaleDateString('en-IN', {
                      day: '2-digit', month: 'short', year: 'numeric',
                    })}
                  </td>
                  <td>
                    <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                      <button
                        id={`edit-activity-${act.id}`}
                        className="action-btn action-btn-edit"
                        onClick={() => openEdit(act.id)}
                        aria-label={`Edit ${act.title}`}
                        title="Edit"
                      >
                        <Icon.Edit size={15} />
                      </button>
                      <button
                        id={`delete-activity-${act.id}`}
                        className="action-btn action-btn-delete"
                        onClick={() => setConfirmDelete({ open: true, id: act.id, title: act.title })}
                        aria-label={`Delete ${act.title}`}
                        title="Delete"
                      >
                        <Icon.Trash size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modal.open}
        onClose={() => !submitting && setModal({ open: false, mode: 'create', data: null })}
        title={modal.mode === 'create' ? 'Add New Activity' : 'Edit Activity'}
        size="md"
        footer={
          <>
            <button
              className="btn btn-ghost"
              onClick={() => setModal({ open: false, mode: 'create', data: null })}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              id="activity-form-submit-btn"
              className="btn btn-primary"
              type="submit"
              form="activity-form"
              disabled={submitting}
            >
              {submitting ? (
                <><span className="spinner" style={{ borderTopColor: '#fff' }} /> Saving…</>
              ) : (
                modal.mode === 'create' ? 'Create Activity' : 'Save Changes'
              )}
            </button>
          </>
        }
      >
        <ActivityForm
          key={modal.data?.id ?? 'new'}
          initial={modal.data}
          onSubmit={handleSubmit}
          isSubmitting={submitting}
        />
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, id: null, title: '' })}
        onConfirm={handleDelete}
        title={`Delete "${confirmDelete.title}"?`}
        message="This will permanently remove the activity and all its associated images. This action cannot be undone."
        isLoading={deleting}
      />
    </div>
  );
}
