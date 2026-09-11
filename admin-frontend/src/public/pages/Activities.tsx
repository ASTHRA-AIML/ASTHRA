import { useEffect, useState } from 'react'
import { getPublicActivities } from '../../api/public'
import { mapActivityListItem } from '../mappers'
import { useReveal } from '../hooks'
import type { Activity } from '../types'
import type { NavigateFn } from '../App'

interface Props {
  navigate: NavigateFn
}

export default function Activities({ navigate }: Props) {
  const [activitiesList, setActivitiesList] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const headerRef = useReveal()
  const gridRef = useReveal()

  const loadActivities = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getPublicActivities()
      setActivitiesList(Array.isArray(data) ? data.map(mapActivityListItem) : [])
    } catch (err: any) {
      console.error('Failed to load activities:', err)
      setError(err?.message || 'Failed to fetch activities')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadActivities()
  }, [])

  return (
    <div className="min-h-screen pt-28 pb-24">
      {/* Page header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-16">
        <div ref={headerRef} className="reveal">
          <span className="section-label block mb-4">What We Do</span>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h1 className="section-heading text-5xl md:text-6xl text-white">
              Our <span className="gradient-text">Activities</span>
            </h1>
            <p className="text-slate-400 max-w-md leading-relaxed">
              From workshops and symposiums to technical competitions, explore all ASTHRA
              events designed to challenge, inspire, and connect our community.
            </p>
          </div>
        </div>
      </div>

      {/* Error notification banner */}
      {error && (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-8">
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl text-sm font-mono flex items-center justify-between">
            <span>Error loading activities: {error}</span>
            <button
              onClick={loadActivities}
              className="px-3 py-1 bg-red-500/20 rounded hover:bg-red-500/30 text-white transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="glass rounded-2xl overflow-hidden animate-pulse">
                <div className="h-52 bg-white/5" />
                <div className="p-6 flex flex-col gap-3">
                  <div className="h-3 w-20 bg-white/10 rounded" />
                  <div className="h-5 w-3/4 bg-white/10 rounded" />
                  <div className="h-4 w-full bg-white/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div ref={gridRef} className="reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {activitiesList.map((activity, i) => (
              <div
                key={activity.id}
                className={`glass glass-hover rounded-2xl overflow-hidden cursor-pointer group reveal-delay-${Math.min(i + 1, 6)}`}
                onClick={() => navigate('activity-detail', activity)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate('activity-detail', activity)}
                aria-label={`View details for ${activity.title}`}
              >
                {/* Image */}
                <div className="card-image-container h-52 relative bg-[#0a1228]">
                  {activity.imageUrl ? (
                    <img src={activity.imageUrl} alt={activity.title} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600 font-mono text-xs">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#040814]/60 via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[0.6rem] text-slate-500 tracking-wide">
                      {activity.date}
                    </span>
                  </div>
                  <h2 className="font-orbitron text-sm font-700 text-white group-hover:text-cyan-400 transition-colors leading-snug">
                    {activity.title}
                  </h2>
                  {activity.shortDescription && (
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                      {activity.shortDescription}
                    </p>
                  )}
                  <button
                    className="btn-outline !py-2 !px-4 !text-[0.6rem] self-start mt-2"
                    onClick={(e) => { e.stopPropagation(); navigate('activity-detail', activity) }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && activitiesList.length === 0 && !error && (
          <div className="text-center py-20 text-slate-600 font-orbitron text-sm tracking-widest">
            No activities available yet.
          </div>
        )}
      </div>
    </div>
  )
}
