import { useNavigate } from 'react-router-dom'
import logo from '../imports/a1.png'

export default function Footer() {
  const navigate = useNavigate()
  return (
    <footer className="bg-[#020610] border-t border-cyan-400/8 relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(rgba(6,182,212,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand column */}
          <div className="flex flex-col gap-5">
            <button onClick={() => navigate('/')} className="flex items-center gap-3 group self-start focus:outline-none">
              <div className="w-11 h-11 rounded-full overflow-hidden bg-white/5 ring-1 ring-cyan-400/20 p-0.5 group-hover:ring-cyan-400/40 transition-all">
                <img src={logo} alt="ASTHRA" className="w-full h-full object-contain" />
              </div>
              <span className="font-orbitron text-sm font-bold tracking-[0.22em] text-white group-hover:text-cyan-400 transition-colors">
                ASTHRA
              </span>
            </button>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Department of Artificial Intelligence &amp; Machine Learning. Advancing technology through
              innovation, education, and community.
            </p>
            <div className="flex gap-3 mt-1">
              <a
                href="https://instagram.com/asthra_cse"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/8 flex items-center justify-center text-slate-500 hover:text-pink-400 hover:border-pink-400/30 hover:bg-pink-400/5 transition-all"
                aria-label="ASTHRA on Instagram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="mailto:asthra@cse.edu"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/8 flex items-center justify-center text-slate-500 hover:text-cyan-400 hover:border-cyan-400/30 hover:bg-cyan-400/5 transition-all"
                aria-label="Email ASTHRA"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation column */}
          <div>
            <h4 className="section-label mb-6">Quick Links</h4>
            <div className="flex flex-col gap-3">
              {([['/', 'Home'], ['/activities', 'Activities'], ['/newsletters', 'Newsletters'], ['/committee', 'Committee']] as [string, string][]).map(([path, label]) => (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className="text-slate-500 hover:text-white text-sm text-left capitalize transition-colors w-fit"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact column */}
          <div id="contact-section">
            <h4 className="section-label mb-6">Contact</h4>
            <div className="flex flex-col gap-3 text-slate-500 text-sm">
              <p>Dept. of Artificial Intelligence &amp; Machine Learning</p>
              <p>Engineering Block A, Room 204</p>
              <a
                href="mailto:asthra@cse.edu"
                className="hover:text-cyan-400 transition-colors"
              >
                asthra@cse.edu
              </a>
              <a
                href="https://instagram.com/asthra_cse"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-400 transition-colors"
              >
                @asthra_cse
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[0.65rem] text-slate-700 tracking-widest">
            © 2026 ASTHRA — Dept. of Artificial Intelligence &amp; Machine Learning
          </p>
          <p className="font-mono text-[0.65rem] text-slate-700 tracking-widest">
            Built with innovation · Driven by purpose
          </p>
        </div>
      </div>
    </footer>
  )
}
