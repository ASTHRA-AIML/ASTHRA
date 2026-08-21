// ─── Public Committee Page ────────────────────────────────────────────────
// GET /asthra/committee
// Returns: [{ acadamic_year, members: [{ id, name, photo_url, linkedin_url, position }] }]
// Groups sorted by acadamic_year descending (most recent first).

import { useState, useEffect } from 'react';
import { getPublicCommittee } from '../../api/public';
import * as Icon from '../../components/ui/Icons';

function MemberAvatar({ name, photoUrl }) {
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name}
        className="pub-member-photo"
        loading="lazy"
      />
    );
  }
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="pub-member-avatar-placeholder" aria-hidden="true">
      {initials}
    </div>
  );
}

export default function PublicCommitteePage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getPublicCommittee()
      .then((data) => {
        if (!data) { setGroups([]); return; }
        // Sort most recent academic year first
        const sorted = [...data].sort((a, b) =>
          b.acadamic_year.localeCompare(a.acadamic_year)
        );
        setGroups(sorted);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pub-animate-in">
      <div className="pub-container">
        <div className="pub-page-header">
          <h1>Committee</h1>
          <p>The people who make ASTHRA happen, year after year.</p>
        </div>

        {loading && (
          <div className="pub-loading" aria-live="polite">
            <div className="pub-spinner" aria-hidden="true" />
            <span>Loading committee…</span>
          </div>
        )}

        {!loading && error && (
          <div className="pub-error" role="alert">
            <Icon.Warning size={18} />
            {error || 'Could not load committee. Is the backend running?'}
          </div>
        )}

        {!loading && !error && groups.length === 0 && (
          <div className="pub-empty">
            <div className="pub-empty-icon">
              <Icon.Committee size={48} />
            </div>
            <h3>No committee data yet</h3>
            <p>Committee members will appear here once added.</p>
          </div>
        )}

        {!loading && !error && groups.length > 0 &&
          groups.map((group) => (
            <section
              key={group.acadamic_year}
              className="pub-year-section"
              aria-labelledby={`year-${group.acadamic_year}`}
            >
              <div
                className="pub-year-label"
                id={`year-${group.acadamic_year}`}
              >
                {group.acadamic_year}
              </div>

              <div
                className="pub-members-grid"
                role="list"
                aria-label={`Committee ${group.acadamic_year}`}
              >
                {group.members.map((member) => (
                  <div
                    key={member.id}
                    className="pub-member-card"
                    role="listitem"
                  >
                    <MemberAvatar
                      name={member.name}
                      photoUrl={member.photo_url}
                    />
                    <div className="pub-member-name">{member.name}</div>
                    <div className="pub-member-position">{member.position}</div>

                    {member.linkedin_url && (
                      <a
                        href={member.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pub-member-linkedin"
                        aria-label={`${member.name}'s LinkedIn profile`}
                      >
                        <Icon.LinkedIn size={13} /> LinkedIn
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))
        }
      </div>
    </div>
  );
}
