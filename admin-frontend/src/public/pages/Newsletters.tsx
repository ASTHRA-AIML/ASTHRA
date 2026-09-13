import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getPublicNewsletters } from '../../api/public'
import { mapNewsletterListItem } from '../mappers'
import { useReveal } from '../hooks'
import type { Newsletter } from '../types'

export default function Newsletters() {
  const navigate = useNavigate()
  const [newslettersList, setNewslettersList] = useState<Newsletter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const headerRef = useReveal()
  const featuredRef = useReveal()
  const gridRef = useReveal()

  const loadNewsletters = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getPublicNewsletters()
      setNewslettersList(Array.isArray(data) ? data.map(mapNewsletterListItem) : [])
    } catch (err: any) {
      console.error('Failed to load newsletters:', err)
      setError(err?.message || 'Failed to fetch newsletters')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNewsletters()
  }, [])

  const [featured, ...rest] = newslettersList

  return (
    <div className="min-h-screen pt-28 pb-24">
      <Helmet>
        <title>Newsletter Archive — ASTHRA | Dept. of AIML</title>
        <meta
          name="description"
          content="Explore the ASTHRA newsletter archive — publications covering events, student achievements, and the technology shaping tomorrow."
        />
      </Helmet>
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-16">
        <div ref={headerRef} className="reveal">
          <span className="section-label block mb-4">Stay Informed</span>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h1 className="section-heading text-5xl md:text-6xl text-white">
              Newsletter <span className="gradient-text">Archive</span>
            </h1>
            <p className="text-slate-400 max-w-md leading-relaxed">
              Our publications covering events, student achievements, and
              the technology shaping tomorrow.
            </p>
          </div>
        </div>
      </div>

      {/* Error notification banner */}
      {error && (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-8">
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl text-sm font-mono flex items-center justify-between">
            <span>Error loading newsletters: {error}</span>
            <button
              onClick={loadNewsletters}
              className="px-3 py-1 bg-red-500/20 rounded hover:bg-red-500/30 text-white transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Featured (latest) newsletter */}
      {loading ? (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-16">
          <div className="glass rounded-3xl overflow-hidden animate-pulse flex flex-col md:flex-row">
            <div className="w-full md:w-80 h-72 md:h-auto shrink-0 bg-white/5" />
            <div className="p-8 md:p-12 flex flex-col justify-center gap-5 flex-1">
              <div className="h-4 w-24 bg-white/10 rounded-full" />
              <div className="h-8 w-1/2 bg-white/10 rounded" />
              <div className="h-4 w-3/4 bg-white/5 rounded" />
            </div>
          </div>
        </div>
      ) : featured ? (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-16">
          <div ref={featuredRef} className="reveal">
            <div
              className="glass glass-hover rounded-3xl overflow-hidden cursor-pointer group flex flex-col md:flex-row"
              onClick={() => navigate(`/newsletters/${featured.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/newsletters/${featured.id}`)}
              aria-label={`Read ${featured.title}`}
            >
              {/* Cover */}
              <div className="card-image-container w-full md:w-80 h-72 md:h-auto shrink-0 bg-[#0a1228]">
                {featured.coverUrl ? (
                  <img src={featured.coverUrl} alt={featured.title} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600 font-mono text-xs">
                    No Cover
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#040814]/40 hidden md:block" />
              </div>

              {/* Content */}
              <div className="p-8 md:p-12 flex flex-col justify-center gap-5">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[0.6rem] bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 px-3 py-1 rounded-full tracking-widest">
                    LATEST ISSUE
                  </span>
                  <span className="font-mono text-[0.6rem] text-slate-500 tracking-wide">
                    {featured.date}
                  </span>
                </div>
                <div>
                  <h2 className="section-heading text-3xl md:text-4xl text-white group-hover:text-cyan-400 transition-colors">
                    {featured.title}
                  </h2>
                </div>
                {featured.shortDescription && (
                  <p className="text-slate-400 leading-relaxed max-w-xl">
                    {featured.shortDescription}
                  </p>
                )}
                <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-orbitron font-600 tracking-wide group-hover:gap-3 transition-all">
                  Read Full Issue
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Rest of newsletters */}
      {rest.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="section-label mb-8">Previous Issues</h2>
          <div ref={gridRef} className="reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {rest.map((nl, i) => (
              <div
                key={nl.id}
                className={`glass glass-hover rounded-2xl overflow-hidden cursor-pointer group reveal-delay-${i + 1}`}
                onClick={() => navigate(`/newsletters/${nl.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/newsletters/${nl.id}`)}
                aria-label={`Read ${nl.title}`}
              >
                {/* Cover */}
                <div className="card-image-container h-56 relative bg-[#0a1228]">
                  {nl.coverUrl ? (
                    <img src={nl.coverUrl} alt={nl.title} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600 font-mono text-xs">
                      No Cover
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#040814]/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="font-mono text-[0.55rem] text-cyan-400/80 tracking-widest bg-[#040814]/60 px-2 py-1 rounded">
                      {nl.date}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col gap-3">
                  <h3 className="font-orbitron text-sm font-700 text-white group-hover:text-cyan-400 transition-colors">
                    {nl.title}
                  </h3>
                  {nl.shortDescription && (
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
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
        </div>
      )}

      {!loading && newslettersList.length === 0 && !error && (
        <div className="text-center py-20 text-slate-600 font-orbitron text-sm tracking-widest">
          No newsletters published yet.
        </div>
      )}
    </div>
  )
}
