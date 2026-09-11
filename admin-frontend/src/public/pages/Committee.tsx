import { useEffect, useState } from 'react'
import { getPublicCommittee } from '../../api/public'
import { mapCommitteeYear } from '../mappers'
import { useReveal } from '../hooks'
import type { CommitteeYear } from '../types'

const LinkedInIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

export default function Committee() {
  const [committeeList, setCommitteeList] = useState<CommitteeYear[]>([])
  const [activeYear, setActiveYear] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const headerRef = useReveal()
  const membersRef = useReveal()

  const loadCommittee = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getPublicCommittee()
      const mapped = Array.isArray(data) ? data.map(mapCommitteeYear) : []
      setCommitteeList(mapped)
      if (mapped.length > 0) {
        setActiveYear(mapped[0].year)
      }
    } catch (err: any) {
      console.error('Failed to load committee:', err)
      setError(err?.message || 'Failed to fetch committee members')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCommittee()
  }, [])

  const activeCommittee = committeeList.find((c) => c.year === activeYear) || committeeList[0]

  return (
    <div className="min-h-screen pt-28 pb-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-16">
        <div ref={headerRef} className="reveal">
          <span className="section-label block mb-4">Leadership</span>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h1 className="section-heading text-5xl md:text-6xl text-white">
              Our <span className="gradient-text">Committee</span>
            </h1>
            <p className="text-slate-400 max-w-md leading-relaxed">
              The students who plan, execute, and lead ASTHRA forward — representing
              and serving the department community.
            </p>
          </div>
        </div>
      </div>

      {/* Error notification banner */}
      {error && (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-8">
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl text-sm font-mono flex items-center justify-between">
            <span>Error loading committee data: {error}</span>
            <button
              onClick={loadCommittee}
              className="px-3 py-1 bg-red-500/20 rounded hover:bg-red-500/30 text-white transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Year tabs + timeline */}
      {committeeList.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-14">
          <div className="flex items-center gap-6 flex-wrap">
            {committeeList.map((cd, i) => (
              <button
                key={cd.year}
                onClick={() => setActiveYear(cd.year)}
                className={`relative flex items-center gap-3 transition-all focus:outline-none focus-visible:underline group`}
              >
                {/* Timeline dot */}
                <div className={`w-3 h-3 rounded-full border-2 transition-colors ${
                  activeYear === cd.year
                    ? 'border-cyan-400 bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                    : 'border-slate-600 group-hover:border-slate-400'
                }`} />
                {i < committeeList.length - 1 && (
                  <div className="hidden sm:block h-px w-12 bg-slate-700 absolute left-full ml-3" />
                )}
                <span className={`font-orbitron text-sm font-600 tracking-wide transition-colors ${
                  activeYear === cd.year ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                }`}>
                  {cd.year}
                </span>
                {i === 0 && (
                  <span className="font-mono text-[0.55rem] text-cyan-400/60 tracking-widest">
                    CURRENT
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Members grid */}
      {loading ? (
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="glass rounded-2xl overflow-hidden animate-pulse">
                <div className="h-64 bg-white/5" />
                <div className="p-5 flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="h-4 w-28 bg-white/10 rounded" />
                    <div className="h-3 w-16 bg-white/5 rounded" />
                  </div>
                  <div className="h-7 w-20 bg-white/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeCommittee && activeCommittee.members.length > 0 ? (
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div ref={membersRef} className="reveal">
            <h2 className="section-label mb-10">{activeCommittee.year} Committee</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
              {activeCommittee.members.map((member, i) => (
                <div
                  key={`${member.name}-${i}`}
                  className={`glass glass-hover rounded-2xl overflow-hidden group reveal-delay-${Math.min(i + 1, 6)}`}
                >
                  {/* Photo */}
                  <div className="relative h-64 bg-[#0a1228] overflow-hidden">
                    {member.imageUrl ? (
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600 font-orbitron text-xs">
                        No Photo
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#040814]/90 via-[#040814]/20 to-transparent" />

                    {/* LinkedIn badge */}
                    {member.linkedinUrl && (
                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#040814]/60 backdrop-blur border border-white/10 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-400/40 transition-all"
                        aria-label={`${member.name} on LinkedIn`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <LinkedInIcon />
                      </a>
                    )}

                    {/* Position badge */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="font-orbitron text-[0.6rem] tracking-[0.15em] text-cyan-400/80 mb-1">
                        {member.position}
                      </div>
                      <div className="font-orbitron text-sm font-700 text-white">
                        {member.name}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-5 py-4 flex items-center justify-between">
                    <div>
                      <div className="font-orbitron text-xs font-600 text-white">{member.name}</div>
                      <div className="font-mono text-[0.6rem] text-slate-500 tracking-wide mt-0.5">{member.position}</div>
                    </div>
                    {member.linkedinUrl && (
                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline !py-1.5 !px-3 !text-[0.6rem] flex items-center gap-1.5"
                        aria-label={`Connect with ${member.name} on LinkedIn`}
                      >
                        <LinkedInIcon />
                        Connect
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        !loading && !error && (
          <div className="text-center py-20 text-slate-600 font-orbitron text-sm tracking-widest">
            No committee records found.
          </div>
        )
      )}

      {/* Quote / call to action */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-24">
        <div
          className="relative rounded-3xl overflow-hidden p-10 md:p-16 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(139,92,246,0.1), rgba(236,72,153,0.06))',
            border: '1px solid rgba(6,182,212,0.12)',
          }}
        >
          <p className="section-label mb-4">Join the Team</p>
          <h2 className="section-heading text-3xl md:text-4xl text-white mb-4 max-w-2xl mx-auto">
            Interested in being part of the <span className="gradient-text">next committee</span>?
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto mb-8 leading-relaxed">
            Elections are held at the beginning of each academic year. Reach out to us to
            learn more about roles and how to get involved.
          </p>
          <a href="mailto:asthra@cse.edu" className="btn-primary">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  )
}
