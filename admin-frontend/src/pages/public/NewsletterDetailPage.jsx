// ─── Public Newsletter Detail Page ────────────────────────────────────────
// GET /asthra/newsletters/{id}
// URL: /newsletters/:id

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPublicNewsletter } from '../../api/public';
import * as Icon from '../../components/ui/Icons';

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  } catch { return dateStr; }
}

export default function NewsletterDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newsletter, setNewsletter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getPublicNewsletter(id)
      .then((data) => setNewsletter(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="pub-animate-in">
      <div className="pub-container">
        <button
          className="pub-detail-back"
          onClick={() => navigate('/newsletters')}
          aria-label="Back to newsletters"
        >
          <Icon.ArrowLeft size={16} /> Back to Newsletters
        </button>

        {loading && (
          <div className="pub-loading" aria-live="polite">
            <div className="pub-spinner" aria-hidden="true" />
            <span>Loading newsletter…</span>
          </div>
        )}

        {!loading && error && (
          <div className="pub-error" role="alert">
            <Icon.Warning size={18} />
            {error || 'Could not load newsletter details.'}
          </div>
        )}

        {!loading && !error && newsletter && (
          <article aria-label={newsletter.title}>
            {newsletter.cover_image_url && (
              <img
                src={newsletter.cover_image_url}
                alt={newsletter.title}
                className="pub-detail-hero"
              />
            )}

            <h1 className="pub-detail-title">{newsletter.title}</h1>

            <div className="pub-detail-meta">
              <Icon.Calendar size={15} />
              {formatDate(newsletter.newsletter_date)}
            </div>

            <p className="pub-detail-description">{newsletter.description}</p>

            {newsletter.pdf_url && (
              <a
                href={newsletter.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="pub-pdf-btn"
                aria-label={`Download PDF of ${newsletter.title}`}
              >
                <Icon.Download size={18} />
                Download PDF
                <Icon.ExternalLink size={14} />
              </a>
            )}
          </article>
        )}
      </div>
    </div>
  );
}
