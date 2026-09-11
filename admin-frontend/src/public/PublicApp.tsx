import { useState, useEffect } from 'react'
import './index.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoadingScreen from './components/LoadingScreen'
import Home from './pages/Home'
import Activities from './pages/Activities'
import ActivityDetail from './pages/ActivityDetail'
import Newsletters from './pages/Newsletters'
import NewsletterDetail from './pages/NewsletterDetail'
import Committee from './pages/Committee'
import type { Activity, Newsletter } from './types'

export type PageName =
  | 'home'
  | 'activities'
  | 'activity-detail'
  | 'newsletters'
  | 'newsletter-detail'
  | 'committee'

export type NavigateFn = (page: PageName, data?: Activity | Newsletter) => void

export default function PublicApp() {
  const [page, setPage] = useState<PageName>('home')
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900)
    return () => clearTimeout(timer)
  }, [])

  const navigate: NavigateFn = (p, data) => {
    if (p === 'activity-detail' && data) setSelectedActivity(data as Activity)
    if (p === 'newsletter-detail' && data) setSelectedNewsletter(data as Newsletter)
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className="public-wrapper">
      <Navbar currentPage={page} navigate={navigate} />
      <main>
        {page === 'home' && <Home navigate={navigate} />}
        {page === 'activities' && <Activities navigate={navigate} />}
        {page === 'activity-detail' && selectedActivity && (
          <ActivityDetail activity={selectedActivity} navigate={navigate} />
        )}
        {page === 'newsletters' && <Newsletters navigate={navigate} />}
        {page === 'newsletter-detail' && selectedNewsletter && (
          <NewsletterDetail newsletter={selectedNewsletter} navigate={navigate} />
        )}
        {page === 'committee' && <Committee />}
      </main>
      <Footer navigate={navigate} />
    </div>
  )
}
