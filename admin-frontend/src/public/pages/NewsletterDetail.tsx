import { useEffect, useState } from 'react'
import { getPublicNewsletter } from '../../api/public'
import { mapNewsletterDetail } from '../mappers'
import type { Newsletter } from '../types'
import type { NavigateFn } from '../App'
import LoadingScreen from '../components/LoadingScreen'

interface Props {
  newsletter: Newsletter
  navigate: NavigateFn
}

export default function NewsletterDetail({ newsletter, navigate }: Props) {
  const [detail, setDetail] = useState<Newsletter | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDetail = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getPublicNewsletter(newsletter.id)
      setDetail(mapNewsletterDetail(data))
    } catch (err: any) {
      console.error('Failed to load newsletter detail:', err)
      setError(err?.message || 'Failed to load newsletter details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (newsletter?.id) {
      fetchDetail()
    }
  }, [newsletter?.id])

  if (loading) {
    return <LoadingScreen />
  }

  if (error || !detail) {
    return (
      <div className="min-h-screen pt-32 pb-24 max-w-3xl mx-auto px-6 text-center">
        <div className="glass rounded-2xl p-10 border border-red-500/20">
          <div className="font-orbitron text-red-400 text-lg mb-4">Error Loading Newsletter</div>
          <p className="text-slate-400 text-sm mb-6">{error || 'Newsletter not found'}</p>
          <div className="flex justify-center gap-4">
            <button onClick={fetchDetail} className="btn-primary">
              Try Again
            </button>
            <button onClick={() => navigate('newsletters')} className="btn-outline">
              Back to Newsletters
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleDownload = () => {
    const downloadUrl = detail.pdfUrl || detail.coverUrl
    if (!downloadUrl) return
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = `ASTHRA-${detail.id}.${detail.pdfUrl ? 'pdf' : 'jpg'}`
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.click()
  }

  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <div className="relative h-[45vh] bg-[#0a1228]">
        {detail.coverUrl && (
          <img
            src={detail.coverUrl}
            alt={detail.title}
            className="absolute inset-0 w-full h-full object-cover opacity-40"
            style={{ objectPosition: 'center top' }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#040814] via-[#040814]/50 to-[#040814]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#040814]/60 to-transparent" />

        {/* Back */}
        <div className="absolute top-6 left-6">
          <button
            onClick={() => navigate('newsletters')}
            className="flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-slate-300 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Back to Newsletters
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="font-mono text-[0.6rem] text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/10 tracking-wide">
                  Published {detail.date}
                </span>
              </div>
              <h1 className="section-heading text-4xl md:text-5xl text-white mb-4">
                {detail.title}
              </h1>
            </div>

            {/* Cover image - shown inline on mobile, sidebar on desktop */}
            {detail.coverUrl && (
              <div className="lg:hidden rounded-2xl overflow-hidden bg-[#0a1228] max-w-xs">
                <img src={detail.coverUrl} alt={`${detail.title} cover`} className="w-full object-cover" />
              </div>
            )}

            {/* Description */}
            <div className="flex flex-col gap-5">
              {detail.fullDescription ? (
                detail.fullDescription.split('\n\n').map((para, i) => (
                  <p key={i} className="text-slate-400 leading-relaxed">{para}</p>
                ))
              ) : (
                <p className="text-slate-500 italic">No description provided for this newsletter.</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            {/* Cover */}
            {detail.coverUrl && (
              <div className="hidden lg:block rounded-2xl overflow-hidden bg-[#0a1228] border border-white/5">
                <img
                  src={detail.coverUrl}
                  alt={`${detail.title} cover`}
                  className="w-full object-cover"
                />
              </div>
            )}

            {/* Meta */}
            <div className="glass rounded-2xl p-6 border border-cyan-400/10">
              <h2 className="section-label mb-4">Publication Info</h2>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Published</span>
                  <span className="text-slate-300 font-mono text-xs">{detail.date}</span>
                </div>
                {detail.pdfUrl && (
                  <>
                    <div className="h-px bg-white/5" />
                    <div className="flex justify-between">
                      <span className="text-slate-600">Format</span>
                      <span className="text-cyan-400 font-mono text-xs">PDF</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Download */}
            {(detail.pdfUrl || detail.coverUrl) && (
              <button
                onClick={handleDownload}
                className="btn-primary w-full justify-center"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {detail.pdfUrl ? 'Download PDF' : 'Download Cover'}
              </button>
            )}

            <button onClick={() => navigate('newsletters')} className="btn-outline w-full justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              All Issues
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
