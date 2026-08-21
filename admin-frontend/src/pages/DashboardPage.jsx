// ─── DashboardPage ────────────────────────────────────────────────────────
import { useEffect, useState } from 'react';
import StatCard from '../components/ui/StatCard';
import { getActivities } from '../api/activities';
import { getNewsletters } from '../api/newsletters';
import { getMembers } from '../api/members';
import * as Icon from '../components/ui/Icons';

export default function DashboardPage() {
  const [counts, setCounts] = useState({ activities: null, newsletters: null, members: null });

  useEffect(() => {
    Promise.allSettled([
      getActivities(),
      getNewsletters(),
      getMembers(),
    ]).then(([acts, nls, mems]) => {
      setCounts({
        activities:  acts.status  === 'fulfilled' ? acts.value?.length  ?? 0 : '—',
        newsletters: nls.status   === 'fulfilled' ? nls.value?.length   ?? 0 : '—',
        members:     mems.status  === 'fulfilled' ? mems.value?.length  ?? 0 : '—',
      });
    });
  }, []);

  const now = new Date();
  const timeOfDay = now.getHours() < 12 ? 'morning' : now.getHours() < 17 ? 'afternoon' : 'evening';

  return (
    <div className="animate-slideUp" id="dashboard-page">
      {/* Welcome banner */}
      <div className="welcome-banner" role="banner">
        <h2>Good {timeOfDay}, SANKAR!</h2>
        <p>
          Welcome to the ASTHRA admin panel. Manage activities, newsletters,
          and committee members from the sidebar.
        </p>
      </div>

      {/* Stat cards */}
      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--color-text-secondary)' }}>
        Content Overview
      </h2>
      <div className="stats-grid" role="region" aria-label="Content statistics">
        <StatCard
          icon={<Icon.Activities size={22} />}
          label="Total Activities"
          value={counts.activities}
          colorClass="violet"
        />
        <StatCard
          icon={<Icon.Newsletters size={22} />}
          label="Total Newsletters"
          value={counts.newsletters}
          colorClass="blue"
        />
        <StatCard
          icon={<Icon.Committee size={22} />}
          label="Committee Members"
          value={counts.members}
          colorClass="green"
        />
      </div>

      {/* Quick links */}
      <div style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--color-text-secondary)' }}>
          Quick Actions
        </h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { href: '/admin/activities',  icon: <Icon.Activities size={16} />,  label: 'Manage Activities' },
            { href: '/admin/newsletters', icon: <Icon.Newsletters size={16} />, label: 'Manage Newsletters' },
            { href: '/admin/committee',   icon: <Icon.Committee size={16} />,   label: 'Manage Committee' },
          ].map(({ href, icon, label }) => (
            <a
              key={href}
              href={href}
              className="btn btn-secondary"
              style={{ textDecoration: 'none' }}
            >
              {icon} {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
