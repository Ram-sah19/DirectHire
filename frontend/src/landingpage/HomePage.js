import React from 'react';
import { ArrowRight, ShieldCheck, Zap, Target, BookOpen, Clock } from 'lucide-react';

export default function HomePage({ onNavigateToJobs }) {
  return (
    <div className="bg-gradient-to-b from-[#060a18] via-[#0b1122] to-[#0d0f24] text-white">
      
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden pt-16 pb-20 px-4 sm:px-6 lg:px-8 text-center">
        {/* Glow radial background blobs */}
        <div className="pointer-events-none absolute -top-40 right-[10%] h-[500px] w-[500px] rounded-full bg-indigo-600/[0.1] blur-[140px]"></div>
        <div className="pointer-events-none absolute top-20 -left-20 h-[400px] w-[400px] rounded-full bg-purple-600/[0.1] blur-[120px]"></div>
        
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/[0.08] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
            Placement + Tech + Verified Jobs
          </span>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl text-white">
            Crack Placements. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Learn In-Demand Skills.
            </span> <br />
            Get Verified Jobs.
          </h1>

          <p className="mx-auto max-w-xl text-base text-slate-400 leading-relaxed">
            India's practical platform for placement preparation, interview mastery, and real tech jobs — straight from corporate career pages.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button 
              onClick={onNavigateToJobs}
              className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/35 hover:brightness-110 flex items-center gap-2"
            >
              Explore Verified Jobs
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Platform Key Stats Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-2 backdrop-blur-xl">
          <div className="grid grid-cols-2 divide-x divide-y sm:divide-y-0 sm:divide-x divide-white/[0.06] sm:grid-cols-4 text-center">
            <div className="px-6 py-6">
              <div className="text-3xl font-bold tracking-tight text-white sm:text-4xl">100%</div>
              <p className="mt-1 text-xs font-medium text-slate-400">Verified Corporate Listings</p>
            </div>
            <div className="px-6 py-6">
              <div className="text-3xl font-bold tracking-tight text-white sm:text-4xl">50+</div>
              <p className="mt-1 text-xs font-medium text-slate-400">Company ATS Integrations</p>
            </div>
            <div className="px-6 py-6">
              <div className="text-3xl font-bold tracking-tight text-white sm:text-4xl">0%</div>
              <p className="mt-1 text-xs font-medium text-slate-400">Recruiter Intermediaries</p>
            </div>
            <div className="px-6 py-6">
              <div className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Daily</div>
              <p className="mt-1 text-xs font-medium text-slate-400">Scraped Board Updates</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 5-Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          
          <div className="group relative rounded-2xl p-[1px] transition duration-300 hover:-translate-y-1.5">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-indigo-500/[0.06] backdrop-blur-xl h-full">
              <ShieldCheck className="h-6 w-6 text-indigo-400 mb-3" />
              <h3 className="text-sm font-semibold text-white">100% Verified Jobs</h3>
              <p className="mt-1 text-xs text-slate-400">Only official career site listings.</p>
            </div>
          </div>

          <div className="group relative rounded-2xl p-[1px] transition duration-300 hover:-translate-y-1.5">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-indigo-500/[0.06] backdrop-blur-xl h-full">
              <Zap className="h-6 w-6 text-purple-400 mb-3" />
              <h3 className="text-sm font-semibold text-white">No Fake Listings</h3>
              <p className="mt-1 text-xs text-slate-400">Zero spam or expired roles.</p>
            </div>
          </div>

          <div className="group relative rounded-2xl p-[1px] transition duration-300 hover:-translate-y-1.5">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-indigo-500/[0.06] backdrop-blur-xl h-full">
              <Target className="h-6 w-6 text-pink-400 mb-3" />
              <h3 className="text-sm font-semibold text-white">Placement-Focused</h3>
              <p className="mt-1 text-xs text-slate-400">Built for real tech hiring needs.</p>
            </div>
          </div>

          <div className="group relative rounded-2xl p-[1px] transition duration-300 hover:-translate-y-1.5">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-indigo-500/[0.06] backdrop-blur-xl h-full">
              <BookOpen className="h-6 w-6 text-emerald-400 mb-3" />
              <h3 className="text-sm font-semibold text-white">Real ATS Ingestion</h3>
              <p className="mt-1 text-xs text-slate-400">Greenhouse & Lever APIs.</p>
            </div>
          </div>

          <div className="group relative rounded-2xl p-[1px] transition duration-300 hover:-translate-y-1.5">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-indigo-500/[0.06] backdrop-blur-xl h-full">
              <Clock className="h-6 w-6 text-sky-400 mb-3" />
              <h3 className="text-sm font-semibold text-white">Updated Daily</h3>
              <p className="mt-1 text-xs text-slate-400">Fresh roles scraped every morning.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Student Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl overflow-hidden p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-400">Community Feedback</p>
              <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">What Seekers Say</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white">AP</div>
                <div>
                  <p className="text-sm font-semibold text-white">Arfin Parween</p>
                  <span className="inline-flex rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">TCS NQT</span>
                </div>
                <div className="ml-auto text-xs text-amber-400">★★★★★</div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">Overall, the direct apply links helped me land an interview without getting ghosted by agency portals!</p>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white">JM</div>
                <div>
                  <p className="text-sm font-semibold text-white">Jyoti Maurya</p>
                  <span className="inline-flex rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">Accenture</span>
                </div>
                <div className="ml-auto text-xs text-amber-400">★★★★★</div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">The listings are 100% verified. Every single job link takes you directly to the official Greenhouse application form.</p>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white">RS</div>
                <div>
                  <p className="text-sm font-semibold text-white">Riya Singh</p>
                  <span className="inline-flex rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">Cognizant</span>
                </div>
                <div className="ml-auto text-xs text-amber-400">★★★★★</div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">Simple, crisp, and no extra fluff. CareerFetch is the cleanest job search platform I've used.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
