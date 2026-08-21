// ─── Public Activity Detail Page ──────────────────────────────────────────
// GET /asthra/activities/{id}
// URL: /activities/:id

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPublicActivity } from '../../api/public';
import * as Icon from '../../components/ui/Icons';

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  } catch { return dateStr; }
}

export default function ActivityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getPublicActivity(id)
      .then((data) => setActivity(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="pub-animate-in">
      <div className="pub-container">
        <button
          className="pub-detail-back"
          onClick={() => navigate('/activities')}
          aria-label="Back to activities"
        >
          <Icon.ArrowLeft size={16} /> Back to Activities
        </button>

        {loading && (
          <div className="pub-loading" aria-live="polite">
            <div className="pub-spinner" aria-hidden="true" />
            <span>Loading activity…</span>
          </div>
        )}

        {!loading && error && (
          <div className="pub-error" role="alert">
            <Icon.Warning size={18} />
            {error || 'Could not load activity details.'}
          </div>
        )}

        {!loading && !error && activity && (
          <article aria-label={activity.title}>
            {activity.thumbnail_url && (
              <img
                src={activity.thumbnail_url}
                alt={activity.title}
                className="pub-detail-hero"
              />
            )}

            <h1 className="pub-detail-title">{activity.title}</h1>

            <div className="pub-detail-meta">
              <Icon.Calendar size={15} />
              {formatDate(activity.activity_date)}
            </div>

            <p className="pub-detail-description">{activity.description}</p>

            {/* Gallery */}
            {activity.image_url && activity.image_url.length > 0 && (
              <>
                <h2 className="pub-detail-gallery-heading">Gallery</h2>
                <div className="pub-detail-gallery">
                  {activity.image_url.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`${activity.title} image ${i + 1}`}
                      loading="lazy"
                    />
                  ))}
                </div>
              </>
            )}
          </article>
        )}
      </div>
    </div>
  );
}
