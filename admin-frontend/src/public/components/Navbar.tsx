import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import logo from '../imports/a1.png'

const navItems: { label: string; path: string }[] = [
  { label: 'Home', path: '/' },
  { label: 'Activities', path: '/activities' },
  { label: 'Newsletters', path: '/newsletters' },
  { label: 'Committee', path: '/committee' },
]

function isActive(pathname: string, itemPath: string) {
  if (itemPath === '/') return pathname === '/'
  return pathname.startsWith(itemPath)
}

export default function Navbar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleContact = () => {
    if (pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    } else {
      document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileOpen(false)
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#040814]/85 backdrop-blur-2xl border-b border-cyan-400/10 shadow-[0_4px_40px_rgba(6,182,212,0.05)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 group focus:outline-none"
            aria-label="Go to home"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white/5 ring-1 ring-cyan-400/20 p-0.5 transition-all group-hover:ring-cyan-400/40 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <img src={logo} alt="ASTHRA Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-orbitron text-sm font-bold tracking-[0.22em] text-white group-hover:text-cyan-400 transition-colors">
              ASTHRA
            </span>
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`relative font-orbitron text-[0.65rem] font-500 tracking-[0.18em] transition-colors group focus:outline-none focus-visible:underline ${
                  isActive(pathname, item.path)
                    ? 'text-cyan-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-300 ${
                    isActive(pathname, item.path) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </button>
            ))}
            <button onClick={handleContact} className="btn-outline !py-2 !px-5 !text-[0.65rem]">
              Contact
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors focus:outline-none"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
          } bg-[#040814]/95 backdrop-blur-2xl border-t border-cyan-400/10`}
        >
          <div className="px-6 py-5 flex flex-col gap-5">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setMobileOpen(false) }}
                className={`font-orbitron text-xs tracking-[0.18em] text-left transition-colors ${
                  isActive(pathname, item.path) ? 'text-cyan-400' : 'text-slate-400'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button onClick={handleContact} className="btn-outline !py-2 !px-5 self-start">
              Contact
            </button>
          </div>
        </div>
      </nav>
    </>
  )
}
