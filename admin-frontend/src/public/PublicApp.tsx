import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
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

// Scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])
  return null
}

export default function PublicApp() {
  // Initial loading screen — only on first mount, NOT on every route change
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <HelmetProvider>
      <div className="public-wrapper">
        <ScrollToTop />
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/activities/:id" element={<ActivityDetail />} />
            <Route path="/newsletters" element={<Newsletters />} />
            <Route path="/newsletters/:id" element={<NewsletterDetail />} />
            <Route path="/committee" element={<Committee />} />
            {/* Fallback: redirect unknown sub-paths to home */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HelmetProvider>
  )
}
