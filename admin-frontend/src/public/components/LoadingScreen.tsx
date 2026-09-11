import logo from '../imports/a1.png'

export default function LoadingScreen() {
  return (
    <div className="public-wrapper fixed inset-0 bg-[#040814] flex items-center justify-center z-[100] select-none">
      <style>{`
        @keyframes ls-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes ls-spin-rev {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes ls-bar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        @keyframes ls-pulse-glow {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(1.08); }
        }
        .ls-spin { animation: ls-spin 12s linear infinite; }
        .ls-spin-rev { animation: ls-spin-rev 18s linear infinite; }
        .ls-bar { animation: ls-bar 1.8s ease-in-out infinite; }
        .ls-glow { animation: ls-pulse-glow 3s ease-in-out infinite; }
      `}</style>

      {/* Background radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[420px] h-[420px] rounded-full opacity-20 ls-glow"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.5) 0%, rgba(139,92,246,0.3) 50%, transparent 70%)',
          }}
        />
      </div>

      <div className="flex flex-col items-center gap-7 relative z-10">
        {/* Logo and concentric spinning rings */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          {/* Outer ring */}
          <svg
            className="absolute inset-0 w-full h-full ls-spin"
            viewBox="0 0 144 144"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="72"
              cy="72"
              r="66"
              stroke="url(#ls-ring-grad)"
              strokeWidth="2"
              strokeDasharray="10 8"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="ls-ring-grad" x1="0" y1="0" x2="144" y2="144" gradientUnits="userSpaceOnUse">
                <stop stopColor="#22d3ee" />
                <stop offset="0.5" stopColor="#8b5cf6" />
                <stop offset="1" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>

          {/* Inner counter-rotating ring */}
          <svg
            className="absolute inset-2 w-[128px] h-[128px] m-auto ls-spin-rev"
            viewBox="0 0 112 112"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="56"
              cy="56"
              r="52"
              stroke="rgba(34,211,238,0.4)"
              strokeWidth="1.5"
              strokeDasharray="4 10"
              strokeLinecap="round"
            />
          </svg>

          {/* Center ASTHRA Logo */}
          <div className="relative z-10 w-20 h-20 rounded-full overflow-hidden bg-white/5 ring-1 ring-cyan-400/30 p-1.5 backdrop-blur shadow-[0_0_30px_rgba(6,182,212,0.3)]">
            <img src={logo} alt="ASTHRA" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Brand name */}
        <div className="text-center">
          <div
            className="font-orbitron text-xl font-bold tracking-[0.35em] text-white"
            style={{
              textShadow: '0 0 20px rgba(6,182,212,0.6)',
            }}
          >
            ASTHRA
          </div>
          <div className="font-mono text-[0.65rem] text-cyan-400/80 tracking-[0.25em] mt-1">
            CSE DEPARTMENT
          </div>
        </div>

        {/* Loading progress track */}
        <div className="w-52 h-1 bg-white/10 overflow-hidden rounded-full relative">
          <div className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 rounded-full ls-bar" />
        </div>

        <p className="font-mono text-[0.65rem] text-slate-500 tracking-[0.3em] uppercase animate-pulse">
          INITIALIZING...
        </p>
      </div>
    </div>
  )
}
