import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import logo from '../imports/a1.png'
import { getPublicActivities, getPublicNewsletters } from '../../api/public'
import { mapActivityListItem, mapNewsletterListItem } from '../mappers'
import { useReveal, useCounter } from '../hooks'
import type { Activity, Newsletter } from '../types'

const CircuitBg = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
    <svg
      className="absolute w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity: 0.055 }}
    >
      <defs>
        <pattern id="circuit-hero" x="0" y="0" width="180" height="180" patternUnits="userSpaceOnUse">
          <path d="M0 90 H70 V30 H130" stroke="#06b6d4" strokeWidth="1" fill="none" />
          <circle cx="70" cy="90" r="2.5" fill="#06b6d4" />
          <circle cx="130" cy="30" r="2.5" fill="#06b6d4" />
          <path d="M180 90 H110 V150 H50" stroke="#8b5cf6" strokeWidth="1" fill="none" />
          <circle cx="110" cy="90" r="2.5" fill="#8b5cf6" />
          <circle cx="50" cy="150" r="2.5" fill="#8b5cf6" />
          <path d="M90 0 V55 H150 V110" stroke="#22d3ee" strokeWidth="0.7" fill="none" strokeDasharray="4 3" />
          <circle cx="90" cy="55" r="2" fill="#22d3ee" />
          <path d="M90 180 V125 H30 V70" stroke="#a78bfa" strokeWidth="0.7" fill="none" strokeDasharray="4 3" />
          <circle cx="90" cy="125" r="2" fill="#a78bfa" />
          <circle cx="30" cy="70" r="2" fill="#ec4899" />
          <rect x="62" y="82" width="16" height="16" stroke="#06b6d4" strokeWidth="0.8" fill="none" rx="1" />
          <rect x="102" y="22" width="16" height="16" stroke="#8b5cf6" strokeWidth="0.8" fill="none" rx="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circuit-hero)" />
    </svg>
  </div>
)

function StatItem({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const { count, ref } = useCounter(target)
  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <div className="font-orbitron text-4xl md:text-5xl font-800 gradient-text tabular-nums">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="section-label">{label}</div>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const missionRef = useReveal()
  const visionRef = useReveal()
  const quoteRef = useReveal()
  const statsRef = useReveal()
  const activitiesRef = useReveal()
  const newsletterRef = useReveal()
  const ctaRef = useReveal()

  const [activitiesList, setActivitiesList] = useState<Activity[]>([])
  const [newslettersList, setNewslettersList] = useState<Newsletter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [actData, nlData] = await Promise.all([
        getPublicActivities(),
        getPublicNewsletters(),
      ])
      setActivitiesList(Array.isArray(actData) ? actData.map(mapActivityListItem) : [])
      setNewslettersList(Array.isArray(nlData) ? nlData.map(mapNewsletterListItem) : [])
    } catch (err: any) {
      console.error('Failed to load homepage data:', err)
      setError(err?.message || 'Failed to connect to backend server')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const featuredActivities = activitiesList.slice(0, 3)
  const latestNewsletters = newslettersList.slice(0, 2)

  return (
    <div>
      <Helmet>
        <title>ASTHRA — Department of Artificial Intelligence &amp; Machine Learning</title>
        <meta
          name="description"
          content="ASTHRA is the official association of the Department of Artificial Intelligence & Machine Learning — driving innovation through workshops, symposiums, newsletters, and community events."
        />
        <meta property="og:title" content="ASTHRA — Dept. of AIML" />
        <meta
          property="og:description"
          content="ASTHRA is the heart of our department's technical community — advancing technology through innovation, education, and community."
        />
      </Helmet>
      {/* Error notification banner if backend fetch failed */}
      {error && (
        <div className="bg-red-500/10 border-b border-red-500/20 text-red-400 px-6 py-3 text-center text-xs font-mono flex items-center justify-center gap-4">
          <span>Failed to load live data: {error}</span>
          <button
            onClick={loadData}
            className="underline hover:text-red-300 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <CircuitBg />

        {/* Gradient mesh */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 70% at 15% 50%, rgba(6,182,212,0.13) 0%, transparent 55%), radial-gradient(ellipse 70% 70% at 85% 20%, rgba(139,92,246,0.11) 0%, transparent 55%), radial-gradient(ellipse 50% 50% at 50% 95%, rgba(236,72,153,0.07) 0%, transparent 50%)',
          }}
          aria-hidden="true"
        />

        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/5 w-80 h-80 rounded-full opacity-5 pointer-events-none animate-pulse-glow"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent 70%)' }}
          aria-hidden="true"
        />
        <div className="absolute bottom-1/4 right-1/5 w-64 h-64 rounded-full opacity-5 pointer-events-none animate-pulse-glow"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent 70%)', animationDelay: '2s' }}
          aria-hidden="true"
        />

        {/* Hero content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center flex flex-col items-center gap-8 pt-28 pb-20">
          {/* Logo */}
          <div
            className="animate-fade-in-up animate-float"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="w-28 h-28 mx-auto rounded-full overflow-hidden bg-white/5 ring-2 ring-cyan-400/20 p-1.5 shadow-[0_0_60px_rgba(6,182,212,0.25)]">
              <img src={logo} alt="ASTHRA" className="w-full h-full object-contain" />
            </div>
          </div>

          {/* Label */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
            <span className="section-label tracking-[0.25em]">
              Department of Artificial Intelligence &amp; Machine Learning
            </span>
          </div>

          {/* Heading */}
          <h1
            className="font-orbitron font-900 text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight animate-fade-in-up"
            style={{ animationDelay: '0.45s' }}
          >
            <span className="block text-white">UNLEASHING</span>
            <span className="block gradient-text mt-1">POTENTIAL</span>
          </h1>

          {/* Tagline */}
          <p
            className="text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed animate-fade-in-up"
            style={{ animationDelay: '0.6s' }}
          >
            Where engineering meets imagination. ASTHRA is the heart of our department&apos;s
            technical community — driving innovation, fostering talent, and building the future.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-wrap gap-4 justify-center animate-fade-in-up"
            style={{ animationDelay: '0.75s' }}
          >
            <button onClick={() => navigate('/activities')} className="btn-primary">
              Explore Activities
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button onClick={() => navigate('/newsletters')} className="btn-outline">
              Read Newsletters
            </button>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-40" aria-hidden="true">
            <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </section>

      {/* ── MISSION ──────────────────────────────────────────────────── */}
      <section className="py-28 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div ref={missionRef} className="reveal grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div className="flex flex-col gap-6">
              <span className="section-label">Our Mission</span>
              <h2 className="section-heading text-4xl md:text-5xl text-white">
                Building <span className="gradient-text">excellence</span>,<br />
                united.
              </h2>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-cyan-400/20 transition-all">
                  <span className="flex-shrink-0 font-mono text-xs font-bold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 rounded-lg w-7 h-7 flex items-center justify-center mt-0.5">
                    01
                  </span>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                    To equip students with advanced AI and ML skills to solve evolving complexities, driving sustainable and high-quality livelihoods.
                  </p>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-violet-400/20 transition-all">
                  <span className="flex-shrink-0 font-mono text-xs font-bold text-violet-400 bg-violet-400/10 border border-violet-400/20 rounded-lg w-7 h-7 flex items-center justify-center mt-0.5">
                    02
                  </span>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                    To foster a responsive learning space that encourages research, innovation, and entrepreneurial thinking in AI and ML, empowering students to create impactful solutions.
                  </p>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-pink-400/20 transition-all">
                  <span className="flex-shrink-0 font-mono text-xs font-bold text-pink-400 bg-pink-400/10 border border-pink-400/20 rounded-lg w-7 h-7 flex items-center justify-center mt-0.5">
                    03
                  </span>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                    To nurture ethical and proficient AI and ML professionals who contribute to societal welfare with integrity and responsibility.
                  </p>
                </div>
              </div>
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="glass rounded-2xl p-8 border border-cyan-400/10">
                <div className="grid grid-cols-2 gap-5">
                  {[
                    { icon: '⚡', label: 'Innovation', desc: 'Pushing boundaries every semester' },
                    { icon: '🤝', label: 'Community', desc: 'A network that lasts a lifetime' },
                    { icon: '🏆', label: 'Excellence', desc: 'High standards in everything we do' },
                    { icon: '🌐', label: 'Impact', desc: 'Work that extends beyond campus' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex flex-col gap-2 p-4 rounded-xl bg-white/3 border border-white/5 hover:border-cyan-400/20 transition-colors"
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <div className="font-orbitron text-xs font-600 text-white tracking-wide">{item.label}</div>
                      <div className="text-xs text-slate-500">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Decorative corner lines */}
              <div className="absolute -top-3 -left-3 w-12 h-12 border-t-2 border-l-2 border-cyan-400/30 rounded-tl-lg" />
              <div className="absolute -bottom-3 -right-3 w-12 h-12 border-b-2 border-r-2 border-violet-500/30 rounded-br-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* ── VISION ───────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-24 relative">
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background: 'radial-gradient(ellipse 60% 60% at 70% 50%, rgba(139,92,246,0.08) 0%, transparent 60%)',
          }}
          aria-hidden="true"
        />
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div ref={visionRef} className="reveal grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Visual first on desktop */}
            <div className="lg:order-first order-last relative max-w-lg lg:max-w-none w-full mx-auto">
              <div className="aspect-[16/10] max-h-[340px] rounded-2xl overflow-hidden bg-[#0a1228] relative">
                <img
                  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop&auto=format"
                  alt="Vision — technology landscape"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#040814]/70 via-transparent to-violet-900/30" />
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="font-mono text-xs text-cyan-400 mb-1 tracking-widest">VISION</div>
                  <div className="font-orbitron text-white text-xs sm:text-sm font-600">
                    Advancing sustainable technological excellence.
                  </div>
                </div>
              </div>
              <div className="absolute -top-2.5 -right-2.5 w-10 h-10 border-t-2 border-r-2 border-violet-500/30 rounded-tr-lg" />
              <div className="absolute -bottom-2.5 -left-2.5 w-10 h-10 border-b-2 border-l-2 border-cyan-400/20 rounded-bl-lg" />
            </div>

            {/* Text */}
            <div className="flex flex-col gap-6 max-w-xl">
              <span className="section-label">Our Vision</span>
              <h2 className="section-heading text-3xl sm:text-4xl md:text-5xl text-white leading-tight">
                Cultivating ethical <span className="gradient-text-warm">AI pioneers</span><br />
                for a sustainable tomorrow.
              </h2>
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 border-l-2 border-l-amber-400/50">
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  To cultivate highly ethical and innovative AI and ML professionals via superior education, proficiency-based learning, advanced training, and impactful research, promoting sustainable technological advancements with competence and integrity.
                </p>
              </div>
              <button onClick={() => navigate('/committee')} className="btn-outline self-start">
                Meet the Team
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUOTE ────────────────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(6,182,212,0.05) 0%, rgba(139,92,246,0.08) 50%, rgba(236,72,153,0.04) 100%)',
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 border-y border-white/5" aria-hidden="true" />
        <div ref={quoteRef} className="reveal relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div
            className="font-orbitron text-8xl text-cyan-400/15 leading-none select-none mb-6"
            aria-hidden="true"
          >
            "
          </div>
          <blockquote className="font-orbitron text-2xl md:text-3xl lg:text-4xl font-600 text-white leading-tight tracking-tight">
            The science of today is the technology of tomorrow.
          </blockquote>
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-cyan-400/30" />
            <p className="font-mono text-sm text-slate-500 tracking-widest">
              EDWARD TELLER
            </p>
            <div className="h-px w-12 bg-cyan-400/30" />
          </div>
        </div>
      </section>

      {/* ── STATS (KEEP UNCHANGED) ────────────────────────────────────
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div ref={statsRef} className="reveal">
            <div className="glass rounded-2xl border border-cyan-400/10 p-10 md:p-16">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6">
                <StatItem target={24} suffix="+" label="Events Per Year" />
                <StatItem target={500} suffix="+" label="Active Members" />
                <StatItem target={8} suffix="" label="Years of Impact" />
                <StatItem target={48} suffix="+" label="Industry Partners" />
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* ── FEATURED ACTIVITIES ──────────────────────────────────────── */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div ref={activitiesRef} className="reveal">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
              <div>
                <span className="section-label mb-3 block">What We Do</span>
                <h2 className="section-heading text-4xl md:text-5xl text-white">
                  Featured <span className="gradient-text">Activities</span>
                </h2>
              </div>
              <button
                onClick={() => navigate('/activities')}
                className="btn-outline self-start sm:self-auto shrink-0"
              >
                View All
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="glass rounded-2xl overflow-hidden animate-pulse">
                    <div className="h-48 bg-white/5" />
                    <div className="p-6 flex flex-col gap-3">
                      <div className="h-3 w-20 bg-white/10 rounded" />
                      <div className="h-5 w-3/4 bg-white/10 rounded" />
                      <div className="h-4 w-full bg-white/5 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : featuredActivities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredActivities.map((activity, i) => (
                  <div
                    key={activity.id}
                    className={`glass glass-hover rounded-2xl overflow-hidden cursor-pointer group reveal-delay-${i + 1}`}
                    onClick={() => navigate(`/activities/${activity.id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && navigate(`/activities/${activity.id}`)}
                    aria-label={`View details for ${activity.title}`}
                  >
                    <div className="card-image-container h-48 bg-[#0a1228]">
                      {activity.imageUrl ? (
                        <img src={activity.imageUrl} alt={activity.title} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600 font-mono text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[0.6rem] text-slate-500 tracking-wide">{activity.date}</span>
                      </div>
                      <h3 className="font-orbitron text-sm font-700 text-white group-hover:text-cyan-400 transition-colors leading-snug">
                        {activity.title}
                      </h3>
                      {activity.shortDescription && (
                        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                          {activity.shortDescription}
                        </p>
                      )}
                      <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-orbitron font-600 tracking-wide mt-1 group-hover:gap-3 transition-all">
                        View Details
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 font-mono text-sm">
                No featured activities available at the moment.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── LATEST NEWSLETTERS ───────────────────────────────────────── */}
      <section className="py-28 relative">
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 30% 50%, rgba(6,182,212,0.05) 0%, transparent 60%)',
          }}
          aria-hidden="true"
        />
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div ref={newsletterRef} className="reveal">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
              <div>
                <span className="section-label mb-3 block">Stay Informed</span>
                <h2 className="section-heading text-4xl md:text-5xl text-white">
                  Latest <span className="gradient-text">Newsletter</span>
                </h2>
              </div>
              <button
                onClick={() => navigate('/newsletters')}
                className="btn-outline self-start sm:self-auto shrink-0"
              >
                All Issues
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2].map((n) => (
                  <div key={n} className="glass rounded-2xl overflow-hidden animate-pulse flex flex-col sm:flex-row">
                    <div className="w-full sm:w-36 h-52 sm:h-auto shrink-0 bg-white/5" />
                    <div className="p-6 flex flex-col gap-3 flex-1 justify-center">
                      <div className="h-3 w-20 bg-white/10 rounded" />
                      <div className="h-5 w-3/4 bg-white/10 rounded" />
                      <div className="h-4 w-full bg-white/5 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : latestNewsletters.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {latestNewsletters.map((nl, i) => (
                  <div
                    key={nl.id}
                    className={`glass glass-hover rounded-2xl overflow-hidden cursor-pointer group flex flex-col sm:flex-row reveal-delay-${i + 1}`}
                    onClick={() => navigate(`/newsletters/${nl.id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && navigate(`/newsletters/${nl.id}`)}
                    aria-label={`Read ${nl.title}`}
                  >
                    <div className="card-image-container w-full sm:w-36 h-52 sm:h-auto shrink-0 bg-[#0a1228]">
                      {nl.coverUrl ? (
                        <img src={nl.coverUrl} alt={nl.title} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600 font-mono text-xs">
                          No Cover
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col gap-3 justify-center">
                      <div>
                        <span className="font-mono text-[0.6rem] text-cyan-600 tracking-wide">{nl.date}</span>
                      </div>
                      <h3 className="font-orbitron text-sm font-700 text-white group-hover:text-cyan-400 transition-colors">
                        {nl.title}
                      </h3>
                      {nl.shortDescription && (
                        <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                          {nl.shortDescription}
                        </p>
                      )}
                      <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-orbitron font-600 tracking-wide mt-1 group-hover:gap-3 transition-all">
                        Read More
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 font-mono text-sm">
                No newsletters published yet.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────── */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div ref={ctaRef} className="reveal">
            <div
              className="relative rounded-3xl overflow-hidden p-12 md:p-20 text-center flex flex-col items-center gap-8"
              style={{
                background: 'linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(139,92,246,0.12) 50%, rgba(236,72,153,0.08) 100%)',
                border: '1px solid rgba(6,182,212,0.15)',
              }}
            >
              <CircuitBg />
              <span className="section-label relative z-10">Join the Community</span>
              <h2 className="relative z-10 section-heading text-4xl md:text-5xl lg:text-6xl text-white max-w-3xl">
                Ready to shape the future of technology?
              </h2>
              <p className="relative z-10 text-slate-400 text-lg max-w-xl leading-relaxed">
                Whether you&apos;re a first-year student or a final-year researcher, ASTHRA
                has a place for you. Come build, learn, and lead.
              </p>
              <div className="relative z-10 flex flex-wrap gap-4 justify-center">
                <button onClick={() => navigate('/activities')} className="btn-primary">
                  Browse Events
                </button>
                <button onClick={() => navigate('/committee')} className="btn-outline">
                  Meet the Committee
                </button>
              </div>

              {/* Decorative corner accents */}
              <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-cyan-400/25 rounded-tl-xl" />
              <div className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 border-violet-500/25 rounded-br-xl" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
