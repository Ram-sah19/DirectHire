import React from 'react';
import { Sparkles, Compass } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#060a18]/80 backdrop-blur-xl text-white">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Compass className="h-5 w-5 text-white stroke-[2]" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                CareerFetch
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                DIRECT ATS
              </span>
            </div>
          </div>

          {/* Nav items */}
          <div className="hidden md:flex items-center gap-1 text-sm font-medium">
            <button className="px-3.5 py-1.5 rounded-lg bg-white/[0.08] text-white">
              Verified Jobs
            </button>
            <button className="px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors">
              Greenhouse Board
            </button>
            <button className="px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors">
              Lever Feeds
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Live Pipeline
            </span>
            <a 
              href="#search"
              className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:brightness-110 transition-all"
            >
              Explore Jobs
            </a>
          </div>

        </div>
      </nav>
    </header>
  );
}
