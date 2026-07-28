import React from 'react';
import { Search, MapPin, Sparkles, ShieldCheck, Zap, Layers, RefreshCw } from 'lucide-react';

export default function Hero({ search, setSearch, location, setLocation, onSearchSubmit, totalJobs }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#060a18] via-[#0b1122] to-[#0d0f24] text-white pt-12 pb-16">
      
      {/* Background radial glow blobs */}
      <div className="pointer-events-none absolute -top-40 right-[10%] h-[500px] w-[500px] rounded-full bg-indigo-600/[0.12] blur-[140px]"></div>
      <div className="pointer-events-none absolute top-20 -left-20 h-[400px] w-[400px] rounded-full bg-purple-600/[0.12] blur-[120px]"></div>
      
      {/* Background dot pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/[0.08] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
            100% Direct Corporate Jobs • Zero Recruiter Spam
          </div>

          {/* Headline */}
          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl text-white">
            Direct Tech Jobs. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Fetched Verbatim from ATS.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-5 max-w-xl text-sm sm:text-base text-slate-400 leading-relaxed">
            CareerFetch aggregates job postings directly from public Greenhouse and Lever portals. Apply directly on official corporate websites.
          </p>

          {/* Floating Glassmorphism Search Bar */}
          <form 
            id="search"
            onSubmit={onSearchSubmit}
            className="mt-8 max-w-3xl mx-auto rounded-2xl border border-white/10 bg-white/[0.04] p-2.5 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-center gap-2"
          >
            {/* Search input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              <input 
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Title, skills, or company (e.g. React, Figma)..."
                className="w-full pl-11 pr-4 py-3 text-sm text-white placeholder:text-slate-500 bg-transparent focus:outline-none"
              />
            </div>

            <div className="hidden md:block h-6 w-px bg-white/10"></div>

            {/* Location input */}
            <div className="relative flex-1 w-full">
              <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              <input 
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location or 'Remote'..."
                className="w-full pl-11 pr-4 py-3 text-sm text-white placeholder:text-slate-500 bg-transparent focus:outline-none"
              />
            </div>

            {/* Submit CTA */}
            <button 
              type="submit"
              className="w-full md:w-auto rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/35 hover:brightness-110 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              Search Roles
            </button>
          </form>

        </div>

        {/* 4 Feature Stats Bar */}
        <div className="mt-14 max-w-5xl mx-auto rounded-2xl border border-white/[0.06] bg-white/[0.02] p-1 backdrop-blur-xl">
          <div className="grid grid-cols-2 divide-x divide-y sm:divide-y-0 sm:divide-x divide-white/[0.06] sm:grid-cols-4 text-center">
            
            <div className="p-4 sm:p-6">
              <div className="flex justify-center mb-2 text-indigo-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">100%</div>
              <p className="mt-1 text-[11px] font-medium text-slate-400">Verified Board Listings</p>
            </div>

            <div className="p-4 sm:p-6">
              <div className="flex justify-center mb-2 text-purple-400">
                <Zap className="h-5 w-5" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">Direct</div>
              <p className="mt-1 text-[11px] font-medium text-slate-400">No Recruiter Intermediaries</p>
            </div>

            <div className="p-4 sm:p-6">
              <div className="flex justify-center mb-2 text-pink-400">
                <Layers className="h-5 w-5" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">{totalJobs}+</div>
              <p className="mt-1 text-[11px] font-medium text-slate-400">Active Opportunities</p>
            </div>

            <div className="p-4 sm:p-6">
              <div className="flex justify-center mb-2 text-emerald-400">
                <RefreshCw className="h-5 w-5" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">Daily</div>
              <p className="mt-1 text-[11px] font-medium text-slate-400">Automated Pipeline</p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
