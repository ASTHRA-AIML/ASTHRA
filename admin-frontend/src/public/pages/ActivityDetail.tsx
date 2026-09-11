import { useEffect, useState } from 'react'
import { getPublicActivity } from '../../api/public'
import { mapActivityDetail } from '../mappers'
import type { Activity } from '../types'
import type { NavigateFn } from '../App'
import LoadingScreen from '../components/LoadingScreen'

interface Props {
  activity: Activity
  navigate: NavigateFn
}

export default function ActivityDetail({ activity, navigate }: Props) {
  const [detail, setDetail] = useState<Activity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  const fetchDetail = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getPublicActivity(activity.id)
      setDetail(mapActivityDetail(data))
    } catch (err: any) {
      console.error('Failed to load activity detail:', err)
      setError(err?.message || 'Failed to load activity details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (activity?.id) {
      fetchDetail()
    }
  }, [activity?.id])

  if (loading) {
    return <LoadingScreen />
  }

  if (error || !detail) {
    return (
      <div className="min-h-screen pt-32 pb-24 max-w-3xl mx-auto px-6 text-center">
        <div className="glass rounded-2xl p-10 border border-red-500/20">
          <div className="font-orbitron text-red-400 text-lg mb-4">Error Loading Activity</div>
          <p className="text-slate-400 text-sm mb-6">{error || 'Activity not found'}</p>
          <div className="flex justify-center gap-4">
            <button onClick={fetchDetail} className="btn-primary">
              Try Again
            </button>
            <button onClick={() => navigate('activities')} className="btn-outline">
              Back to Activities
            </button>
          </div>
        </div>
      </div>
    )
  }

  const gallery = detail.gallery || []

  const openLightbox = (i: number) => setLightboxIdx(i)
  const closeLightbox = () => setLightboxIdx(null)
  const prevPhoto = () => setLightboxIdx((i) => (i === null ? null : (i - 1 + gallery.length) % gallery.length))
  const nextPhoto = () => setLightboxIdx((i) => (i === null ? null : (i + 1) % gallery.length))

  return (
    <div className="min-h-screen pt-24">
      {/* Hero image */}
      <div className="relative h-[50vh] md:h-[60vh] bg-[#0a1228]">
        {detail.imageUrl && (
          <img
            src={detail.imageUrl}
            alt={detail.title}
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#040814] via-[#040814]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#040814]/60 via-transparent to-transparent" />

        {/* Back button */}
        <div className="absolute top-6 left-6">
          <button
            onClick={() => navigate('activities')}
            className="flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-slate-300 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Back to Activities
          </button>
        </div>

        {/* Date */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-5xl px-6 lg:px-8 flex items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
              {detail.date}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            <div>
              <h1 className="section-heading text-4xl md:text-5xl text-white mb-6">
                {detail.title}
              </h1>
              <div className="space-y-5">
                {detail.fullDescription ? (
                  detail.fullDescription.split('\n\n').map((para, i) => (
                    <p key={i} className="text-slate-400 leading-relaxed">{para}</p>
                  ))
                ) : (
                  <p className="text-slate-500 italic">No description provided for this activity.</p>
                )}
              </div>
            </div>

            {/* Gallery */}
            {gallery.length > 0 && (
              <div>
                <h2 className="section-label mb-6">Event Gallery</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {gallery.map((img, i) => (
                    <div
                      key={i}
                      className="card-image-container rounded-xl h-40 cursor-pointer hover:opacity-90 transition-opacity group relative overflow-hidden bg-[#0a1228]"
                      onClick={() => openLightbox(i)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && openLightbox(i)}
                      aria-label={`Open photo ${i + 1} in lightbox`}
                    >
                      <img src={img} alt={`${detail.title} photo ${i + 1}`} />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-70 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            <div className="glass rounded-2xl p-6 border border-cyan-400/10">
              <h2 className="section-label mb-4">Event Info</h2>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Date</span>
                  <span className="text-slate-300 font-mono text-xs">{detail.date}</span>
                </div>
                {gallery.length > 0 && (
                  <>
                    <div className="h-px bg-white/5" />
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Photos</span>
                      <span className="text-slate-300 font-mono text-xs">{gallery.length}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <button onClick={() => navigate('activities')} className="btn-outline w-full justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              Back to Activities
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && gallery.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors p-2"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {gallery.length > 1 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-3 glass rounded-full"
              onClick={(e) => { e.stopPropagation(); prevPhoto() }}
              aria-label="Previous photo"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          <img
            src={gallery[lightboxIdx]}
            alt={`Gallery photo ${lightboxIdx + 1}`}
            className="max-w-4xl max-h-[80vh] w-full object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />

          {gallery.length > 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-3 glass rounded-full"
              onClick={(e) => { e.stopPropagation(); nextPhoto() }}
              aria-label="Next photo"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs text-slate-500">
            {lightboxIdx + 1} / {gallery.length}
          </div>
        </div>
      )}
    </div>
  )
}
