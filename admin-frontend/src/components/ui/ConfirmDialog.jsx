// ─── ConfirmDialog ─────────────────────────────────────────────────────────
// Reusable destructive-action confirm modal.
import Modal from './Modal';
import * as Icon from './Icons';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Delete',
  isLoading = false,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Action"
      size="sm"
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
          <button
            id="confirm-dialog-confirm-btn"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <><span className="spinner" style={{ borderTopColor: '#fff' }} /> Deleting…</>
            ) : (
              <><Icon.Trash size={15} /> {confirmLabel}</>
            )}
          </button>
        </>
      }
    >
      <div className="confirm-dialog-body">
        <div className="confirm-dialog-icon" aria-hidden="true">
          <Icon.Warning size={32} />
        </div>
        <h3>{title}</h3>
        <p>{message}</p>
      </div>
    </Modal>
  );
}
