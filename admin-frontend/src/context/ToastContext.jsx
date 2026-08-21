// ─── ToastContext ──────────────────────────────────────────────────────────
// Global toast notification system.
// Usage: const { showToast } = useToast();
//        showToast('success', 'Saved!', 'Activity created successfully.')

import { createContext, useContext, useState, useCallback } from 'react';
import * as Icon from '../components/ui/Icons';

const ToastContext = createContext(null);

let nextId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((type = 'info', title, message, duration = 4000) => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
};

// ── Toast rendering ─────────────────────────────────────────────────────────
const ICONS = {
  success: <Icon.Check size={16} />,
  error:   <Icon.Warning size={16} />,
  info:    <Icon.Info size={16} />,
  warning: <Icon.Warning size={16} />,
};

function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null;

  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast ${toast.type}`}
          role="alert"
          aria-live="polite"
        >
          <span className="toast-icon" aria-hidden="true">
            {ICONS[toast.type] || ICONS.info}
          </span>
          <div className="toast-body">
            {toast.title && <div className="toast-title">{toast.title}</div>}
            {toast.message && <div className="toast-message">{toast.message}</div>}
          </div>
          <button
            className="btn btn-ghost btn-icon btn-sm"
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss notification"
            style={{ marginLeft: 'auto', flexShrink: 0 }}
          >
            <Icon.Close size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
