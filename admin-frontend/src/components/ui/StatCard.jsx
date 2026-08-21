// ─── StatCard ───────────────────────────────────────────────────────────────
export default function StatCard({ icon, label, value, colorClass = 'violet' }) {
  return (
    <div className="stat-card" role="region" aria-label={`${label}: ${value}`}>
      <div className={`stat-card-icon ${colorClass}`} aria-hidden="true">
        {icon}
      </div>
      <div className="stat-card-body">
        <div className="stat-card-number">
          {value === null || value === undefined ? (
            <span className="skeleton skeleton-line" style={{ width: 48, height: 28, display: 'inline-block' }} />
          ) : (
            value
          )}
        </div>
        <div className="stat-card-label">{label}</div>
      </div>
    </div>
  );
}
