// ─── Spinner ────────────────────────────────────────────────────────────────
export function Spinner({ size = 'md' }) {
  return (
    <span
      className={`spinner ${size === 'lg' ? 'spinner-lg' : ''}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export function LoadingState({ message = 'Loading…' }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <Spinner size="lg" />
      <span>{message}</span>
    </div>
  );
}

// ── Table Skeleton ──────────────────────────────────────────────────────────
export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div role="status" aria-label="Loading table data" aria-live="polite">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton-row">
          <div className="skeleton table-thumb" style={{ width: 44, height: 44, flexShrink: 0 }} />
          {Array.from({ length: cols }).map((_, j) => (
            <div
              key={j}
              className="skeleton skeleton-line"
              style={{ flex: 1, height: 14, borderRadius: 6 }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
