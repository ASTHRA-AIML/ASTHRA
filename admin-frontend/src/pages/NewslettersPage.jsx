// ─── NewslettersPage (Admin) ──────────────────────────────────────────────
import { useState, useEffect, useCallback } from 'react';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import { TableSkeleton } from '../components/ui/Spinner';
import NewsletterForm from '../components/forms/NewsletterForm';
import { useToast } from '../context/ToastContext';
import * as Icon from '../components/ui/Icons';
import {
  getNewsletters, getNewsletter,
  createNewsletter, updateNewsletter, deleteNewsletter,
} from '../api/newsletters';

export default function NewslettersPage() {
  const { showToast } = useToast();

  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState({ open: false, mode: 'create', data: null });
  const [submitting, setSubmitting] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null, title: '' });
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getNewsletters();
      setNewsletters(data || []);
    } catch (e) {
      showToast('error', 'Failed to load newsletters', e.message);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const openEdit = async (id) => {
    try {
      const detail = await getNewsletter(id);
      setModal({ open: true, mode: 'edit', data: detail });
    } catch (e) {
      showToast('error', 'Failed to load newsletter', e.message);
    }
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (modal.mode === 'create') {
        await createNewsletter(formData);
        showToast('success', 'Newsletter created', `"${formData.title}" has been added.`);
      } else {
        await updateNewsletter(modal.data.id, formData);
        showToast('success', 'Newsletter updated', `"${formData.title}" has been saved.`);
      }
      setModal({ open: false, mode: 'create', data: null });
      load();
    } catch (e) {
      showToast('error', 'Save failed', e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteNewsletter(confirmDelete.id);
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
    <div className="animate-slideUp" id="newsletters-page">
      <div className="page-header">
        <div className="page-header-text">
          <h1>Newsletters</h1>
          <p>Manage department newsletters and publications.</p>
        </div>
        <button
          id="add-newsletter-btn"
          className="btn btn-primary"
          onClick={() => setModal({ open: true, mode: 'create', data: null })}
        >
          <Icon.Plus size={16} /> Add Newsletter
        </button>
      </div>

      <div className="data-table-wrapper">
        {loading ? (
          <TableSkeleton rows={5} cols={3} />
        ) : newsletters.length === 0 ? (
          <EmptyState
            icon={<Icon.Newsletters size={40} />}
            title="No newsletters yet"
            description="Publish your first newsletter to get started."
            action={
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setModal({ open: true, mode: 'create', data: null })}
              >
                Add Newsletter
              </button>
            }
          />
        ) : (
          <table className="data-table" aria-label="Newsletters list">
            <thead>
              <tr>
                <th>Cover</th>
                <th>Title</th>
                <th>Date</th>
                <th>PDF</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {newsletters.map((nl) => (
                <tr key={nl.id}>
                  <td>
                    {nl.cover_image_url ? (
                      <img src={nl.cover_image_url} alt="" className="table-thumb" />
                    ) : (
                      <div className="table-thumb-placeholder">
                        <Icon.Image size={20} />
                      </div>
                    )}
                  </td>
                  <td>
                    <span style={{ fontWeight: 500 }}>{nl.title}</span>
                  </td>
                  <td style={{ color: 'var(--color-text-secondary)' }}>
                    {new Date(nl.newsletter_date).toLocaleDateString('en-IN', {
                      day: '2-digit', month: 'short', year: 'numeric',
                    })}
                  </td>
                  <td>
                    <span className="badge badge-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Icon.Pdf size={11} /> PDF
                    </span>
                  </td>
                  <td>
                    <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                      <button
                        id={`edit-newsletter-${nl.id}`}
                        className="action-btn action-btn-edit"
                        onClick={() => openEdit(nl.id)}
                        aria-label={`Edit ${nl.title}`}
                        title="Edit"
                      >
                        <Icon.Edit size={15} />
                      </button>
                      <button
                        id={`delete-newsletter-${nl.id}`}
                        className="action-btn action-btn-delete"
                        onClick={() => setConfirmDelete({ open: true, id: nl.id, title: nl.title })}
                        aria-label={`Delete ${nl.title}`}
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

      {/* Modal */}
      <Modal
        isOpen={modal.open}
        onClose={() => !submitting && setModal({ open: false, mode: 'create', data: null })}
        title={modal.mode === 'create' ? 'Add New Newsletter' : 'Edit Newsletter'}
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
              id="newsletter-form-submit-btn"
              className="btn btn-primary"
              type="submit"
              form="newsletter-form"
              disabled={submitting}
            >
              {submitting ? (
                <><span className="spinner" style={{ borderTopColor: '#fff' }} /> Saving…</>
              ) : (
                modal.mode === 'create' ? 'Publish Newsletter' : 'Save Changes'
              )}
            </button>
          </>
        }
      >
        <NewsletterForm
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
        message="This will permanently remove the newsletter and its associated files."
        isLoading={deleting}
      />
    </div>
  );
}
