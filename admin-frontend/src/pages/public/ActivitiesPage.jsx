// ─── Public Activities List Page ──────────────────────────────────────────
// GET /asthra/activities → grid of cards
// Click a card → /activities/:id

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPublicActivities } from '../../api/public';
import * as Icon from '../../components/ui/Icons';

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  } catch { return dateStr; }
}

export default function PublicActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getPublicActivities()
      .then((data) => setActivities(data || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pub-animate-in">
      <div className="pub-container">
        <div className="pub-page-header">
          <h1>Activities</h1>
          <p>Events, workshops, and programmes organised by ASTHRA.</p>
        </div>

        {loading && (
          <div className="pub-loading" aria-live="polite">
            <div className="pub-spinner" aria-hidden="true" />
            <span>Loading activities…</span>
          </div>
        )}

        {!loading && error && (
          <div className="pub-error" role="alert">
            <Icon.Warning size={18} />
            {error || 'Could not load activities. Is the backend running?'}
          </div>
        )}

        {!loading && !error && activities.length === 0 && (
          <div className="pub-empty">
            <div className="pub-empty-icon">
              <Icon.Activities size={48} />
            </div>
            <h3>No activities yet</h3>
            <p>Check back soon — ASTHRA has events planned!</p>
          </div>
        )}

        {!loading && !error && activities.length > 0 && (
          <div className="pub-card-grid" role="list" aria-label="Activities">
            {activities.map((act) => (
              <article
                key={act.id}
                className="pub-card"
                role="listitem"
                tabIndex={0}
                aria-label={`View ${act.title}`}
                onClick={() => navigate(`/activities/${act.id}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ')
                    navigate(`/activities/${act.id}`);
                }}
              >
                {act.thumbnail_url ? (
                  <img
                    src={act.thumbnail_url}
                    alt={act.title}
                    className="pub-card-thumb"
                    loading="lazy"
                  />
                ) : (
                  <div className="pub-card-thumb-placeholder" aria-hidden="true">
                    <Icon.Image size={48} />
                  </div>
                )}
                <div className="pub-card-body">
                  <div className="pub-card-title">{act.title}</div>
                  <div className="pub-card-meta">
                    <Icon.Calendar size={14} />
                    {formatDate(act.activity_date)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
