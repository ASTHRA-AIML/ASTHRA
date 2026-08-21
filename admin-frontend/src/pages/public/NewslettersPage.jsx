// ─── Public Newsletters List Page ─────────────────────────────────────────
// GET /asthra/newsletters → grid of cards
// Click a card → /newsletters/:id

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPublicNewsletters } from '../../api/public';
import * as Icon from '../../components/ui/Icons';

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  } catch { return dateStr; }
}

export default function PublicNewslettersPage() {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getPublicNewsletters()
      .then((data) => setNewsletters(data || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pub-animate-in">
      <div className="pub-container">
        <div className="pub-page-header">
          <h1>Newsletters</h1>
          <p>Stay up to date with ASTHRA&apos;s regular publications.</p>
        </div>

        {loading && (
          <div className="pub-loading" aria-live="polite">
            <div className="pub-spinner" aria-hidden="true" />
            <span>Loading newsletters…</span>
          </div>
        )}

        {!loading && error && (
          <div className="pub-error" role="alert">
            <Icon.Warning size={18} />
            {error || 'Could not load newsletters. Is the backend running?'}
          </div>
        )}

        {!loading && !error && newsletters.length === 0 && (
          <div className="pub-empty">
            <div className="pub-empty-icon">
              <Icon.Newsletters size={48} />
            </div>
            <h3>No newsletters yet</h3>
            <p>ASTHRA&apos;s first publication is coming soon!</p>
          </div>
        )}

        {!loading && !error && newsletters.length > 0 && (
          <div className="pub-card-grid" role="list" aria-label="Newsletters">
            {newsletters.map((nl) => (
              <article
                key={nl.id}
                className="pub-card"
                role="listitem"
                tabIndex={0}
                aria-label={`View newsletter ${nl.title}`}
                onClick={() => navigate(`/newsletters/${nl.id}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ')
                    navigate(`/newsletters/${nl.id}`);
                }}
              >
                {nl.cover_image_url ? (
                  <img
                    src={nl.cover_image_url}
                    alt={nl.title}
                    className="pub-card-thumb"
                    loading="lazy"
                  />
                ) : (
                  <div className="pub-card-thumb-placeholder" aria-hidden="true">
                    <Icon.FileText size={48} />
                  </div>
                )}
                <div className="pub-card-body">
                  <div className="pub-card-title">{nl.title}</div>
                  <div className="pub-card-meta">
                    <Icon.Calendar size={14} />
                    {formatDate(nl.newsletter_date)}
                  </div>
                  <span className="pub-card-badge">
                    <Icon.Pdf size={11} /> PDF Available
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
