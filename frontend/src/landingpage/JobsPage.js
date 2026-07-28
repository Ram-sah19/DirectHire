import React, { useState } from 'react';
import { Search, MapPin, SlidersHorizontal, ChevronDown, Clock, ShieldCheck, ArrowRight, RotateCcw } from 'lucide-react';
import JobCard from './JobCard';
import JobDetailModal from './JobDetailModal';

export default function JobsPage({ jobs, loading, totalJobs, totalPages, currentPage, setCurrentPage, onSearch, onSelectJob, selectedJob, setSelectedJob }) {
  const [activeTab, setActiveTab] = useState('Full Time'); // Full Time, Internship, Contract
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [workplaceModes, setWorkplaceModes] = useState({ Remote: true, Hybrid: true, Onsite: true });
  const [experienceRange, setExperienceRange] = useState('');
  const [salaryLimit, setSalaryLimit] = useState(50);
  const [sortBy, setSortBy] = useState('latest');

  const handleWorkplaceToggle = (mode) => {
    setWorkplaceModes(prev => ({ ...prev, [mode]: !prev[mode] }));
  };

  const handleReset = () => {
    setSearchQuery('');
    setLocationQuery('');
    setWorkplaceModes({ Remote: true, Hybrid: true, Onsite: true });
    setExperienceRange('');
    setSalaryLimit(50);
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#060a18] via-[#0b1122] to-[#19123d] text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header Banner */}
        <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-indigo-400/25 bg-indigo-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Trusted + Curated
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Verified <span className="bg-gradient-to-r from-indigo-200 via-blue-200 to-purple-200 bg-clip-text text-transparent">Tech Jobs</span>
            </h1>
            <p className="max-w-xl text-xs sm:text-sm text-slate-400 leading-relaxed">
              Only authentic listings sourced directly from official company career pages. No spam, no duplicates.
            </p>
          </div>
        </div>

        {/* Work Type Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-xl border border-white/[0.08] bg-white/[0.03] p-1 backdrop-blur-xl">
            {['Full Time', 'Internship', 'Contract'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  rounded-lg px-4 py-2 text-[13px] font-semibold transition-all duration-300
                  ${activeTab === tab 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25' 
                    : 'text-slate-400 hover:text-white'}
                `}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Grid: Sidebar Filters & Main Feed */}
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          
          {/* Sticky Filters Sidebar */}
          <aside className="hidden lg:block lg:sticky lg:top-24 h-fit">
            <div className="space-y-4 rounded-xl border border-white/[0.08] bg-[#0c1220]/90 p-5 shadow-2xl backdrop-blur-xl text-slate-300">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[13px] font-semibold text-white">
                  <SlidersHorizontal className="h-4 w-4 text-indigo-400" />
                  Filters
                </div>
                <button 
                  onClick={handleReset}
                  className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Reset
                </button>
              </div>

              {/* Keyword Search */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm focus-within:border-indigo-400/40">
                  <Search className="h-3.5 w-3.5 text-slate-500" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search role or company"
                    className="w-full bg-transparent text-[13px] text-slate-100 placeholder:text-slate-500 outline-none"
                  />
                </div>

                {/* Location Search */}
                <div className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm focus-within:border-indigo-400/40">
                  <MapPin className="h-3.5 w-3.5 text-slate-500" />
                  <input 
                    type="text" 
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    placeholder="Location"
                    className="w-full bg-transparent text-[13px] text-slate-100 placeholder:text-slate-500 outline-none"
                  />
                </div>
              </div>

              {/* Work Type Options */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
                <div className="text-[13px] font-semibold text-slate-200 mb-2">Workplace Mode</div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {['Remote', 'Hybrid', 'Onsite'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => handleWorkplaceToggle(mode)}
                      className={`
                        rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all border
                        ${workplaceModes[mode] 
                          ? 'border-indigo-500/40 bg-indigo-500/20 text-indigo-200' 
                          : 'border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-white'}
                      `}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience Range */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
                <div className="text-[13px] font-semibold text-slate-200 mb-2">Experience</div>
                <div className="flex flex-wrap gap-1.5">
                  {['0-1 yrs', '1-3 yrs', '3-5 yrs', '5+ yrs'].map((exp) => (
                    <button
                      key={exp}
                      onClick={() => setExperienceRange(experienceRange === exp ? '' : exp)}
                      className={`
                        rounded-lg px-2.5 py-1 text-[11px] font-semibold border transition-all
                        ${experienceRange === exp 
                          ? 'border-purple-500/40 bg-purple-500/20 text-purple-200' 
                          : 'border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-white'}
                      `}
                    >
                      {exp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Salary Slider */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
                <div className="flex items-center justify-between text-[13px] font-semibold text-slate-200 mb-2">
                  <span>Max Salary</span>
                  <span className="text-[11px] font-mono text-indigo-300">{salaryLimit} LPA</span>
                </div>
                <input 
                  type="range"
                  min="5"
                  max="50"
                  value={salaryLimit}
                  onChange={(e) => setSalaryLimit(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

            </div>
          </aside>

          {/* Main Listings Feed Column */}
          <div className="min-w-0 space-y-5">
            
            {/* Top Info Bar & Sort */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 backdrop-blur-xl text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
                Showing verified positions
              </span>

              <div className="flex items-center gap-2">
                <span className="text-slate-500 hidden sm:inline">Sort by</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border border-white/[0.08] bg-[#0c1220] px-2.5 py-1.5 text-[11px] font-medium text-slate-200 outline-none"
                >
                  <option value="latest">Latest First</option>
                  <option value="salary">Salary: High → Low</option>
                </select>
              </div>
            </div>

            {/* Job Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              {jobs.map((job) => (
                <JobCard 
                  key={job._id}
                  job={job}
                  onSelect={(job) => setSelectedJob(job)}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="mt-8 flex items-center justify-center gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-40"
              >
                Previous
              </button>
              <span className="rounded-lg border border-indigo-400/25 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-semibold text-indigo-200">
                {currentPage}
              </span>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-40"
              >
                Next
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Detail Modal */}
      <JobDetailModal 
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
      />
    </div>
  );
}
