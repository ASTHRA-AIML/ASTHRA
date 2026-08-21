// ─── Public Home Page ─────────────────────────────────────────────────────
import { Link } from 'react-router-dom';
import * as Icon from '../../components/ui/Icons';

const MISSION = [
  {
    icon: <Icon.Activities size={24} />,
    title: 'Our Mission',
    body: 'To bridge the gap between academic learning and real-world application by organising events, workshops, and collaborative projects that empower every student.',
  },
  {
    icon: <Icon.Committee size={24} />,
    title: 'Community',
    body: 'Building a tight-knit network of students and alumni who share knowledge, mentor each other, and grow together throughout their academic journey.',
  },
  {
    icon: <Icon.Globe size={24} />,
    title: 'Innovation',
    body: 'Encouraging a culture of creativity and experimentation — from hackathons to research showcases — so every idea has a platform to become a reality.',
  },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="pub-hero" id="home">
        <div className="pub-container">
          <div className="pub-hero-badge">
            <Icon.Star size={13} /> Department Association
          </div>
          <h1>
            Welcome to <span className="accent">ASTHRA</span>
          </h1>
          <p className="pub-hero-subtitle">
            The official student association of the Department of Computer Science
            &amp; Engineering. We foster innovation, collaboration, and community
            among students, faculty, and alumni.
          </p>
          <div className="pub-hero-actions">
            <Link to="/activities" className="pub-btn-primary">
              <Icon.Activities size={16} /> Explore Activities
            </Link>
            <Link to="/committee" className="pub-btn-outline">
              <Icon.Committee size={16} /> Meet the Team
            </Link>
          </div>
        </div>
      </section>

      {/* ── Mission ───────────────────────────────────────────────────── */}
      <section className="pub-section" id="mission">
        <div className="pub-container">
          <div className="pub-mission-grid">
            {MISSION.map(({ icon, title, body }) => (
              <div className="pub-mission-card" key={title}>
                <div className="pub-mission-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quick links ───────────────────────────────────────────────── */}
      <section className="pub-section" style={{ paddingTop: 0 }}>
        <div className="pub-container">
          <div
            style={{
              background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
              borderRadius: 16,
              padding: '48px 40px',
              textAlign: 'center',
              color: '#fff',
            }}
          >
            <h2
              style={{
                fontSize: 28,
                fontWeight: 800,
                marginBottom: 12,
                letterSpacing: '-0.02em',
              }}
            >
              Stay Connected with ASTHRA
            </h2>
            <p
              style={{
                fontSize: 15,
                opacity: 0.85,
                marginBottom: 28,
                maxWidth: 460,
                margin: '0 auto 28px',
              }}
            >
              Browse our newsletters, follow our activities, and see the amazing
              team behind it all.
            </p>
            <div
              style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}
            >
              <Link
                to="/newsletters"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 22px',
                  background: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: 14,
                  textDecoration: 'none',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  transition: 'background 200ms',
                }}
              >
                <Icon.Newsletters size={16} /> Newsletters
              </Link>
              <Link
                to="/activities"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 22px',
                  background: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: 14,
                  textDecoration: 'none',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  transition: 'background 200ms',
                }}
              >
                <Icon.Activities size={16} /> Activities
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
