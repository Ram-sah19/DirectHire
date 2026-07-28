import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Building2, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  Sparkles,
  ArrowRight,
  Filter,
  X
} from 'lucide-react';

// Premium realistic mock jobs to fall back on if the backend is not running yet
const MOCK_JOBS = [
  {
    _id: "mock-1",
    title: "Software Engineer, Systems (Figma Design)",
    company: {
      name: "Figma",
      industry: "Software & Design Tools",
      careerPageUrl: "https://www.figma.com/careers/"
    },
    location: "San Francisco, CA",
    workplaceMode: "Hybrid",
    rawApplicationUrl: "https://boards.greenhouse.io/figma/jobs/4829102",
    lastSeen: new Date().toISOString(),
    description: `
      <h3>About Figma</h3>
      <p class="mb-4 text-slate-600">Figma is the leading collaborative design tool. We are building the future of software development, starting with design. Our team is growing fast, and we are looking for Systems Engineers to join us.</p>
      <h3>The Role</h3>
      <p class="mb-4 text-slate-600">As a Systems Engineer on Figma Design, you will work on the core multiplayer syncing engine, canvas rendering architecture, and real-time collaborative protocols. You'll ensure our rendering pipeline is fast, responsive, and works seamlessly for millions of concurrent users.</p>
      <h3>Requirements</h3>
      <ul class="list-disc pl-5 mb-4 text-slate-600 space-y-1">
        <li>4+ years of professional experience writing high-performance C++, Rust, or TypeScript.</li>
        <li>Strong fundamentals in systems design, compilers, rendering algorithms, or memory management.</li>
        <li>Experience building real-time collaborative applications or multiplayer backends is a major plus.</li>
      </ul>
      <h3>Perks & Benefits</h3>
      <p class="text-slate-600">Competitive salary, equity, unlimited PTO, and remote-friendly hybrid setup (3 days in our beautiful SF office).</p>
    `
  },
  {
    _id: "mock-2",
    title: "Senior Frontend Engineer, React Frameworks",
    company: {
      name: "Vercel",
      industry: "Cloud Computing & DevTools",
      careerPageUrl: "https://vercel.com/careers"
    },
    location: "Remote (US/Canada)",
    workplaceMode: "Remote",
    rawApplicationUrl: "https://boards.greenhouse.io/vercel/jobs/5918239",
    lastSeen: new Date(Date.now() - 3600000 * 4).toISOString(),
    description: `
      <h3>About Vercel</h3>
      <p class="mb-4 text-slate-600">Vercel provides the developer experience and infrastructure to build, deploy, and scale frontend applications. We are the creators and maintainers of Next.js.</p>
      <h3>The Role</h3>
      <p class="mb-4 text-slate-600">We are seeking a Senior Frontend Engineer to work directly on Next.js core features, optimization strategies, and server-side rendering architecture. You will collaborate with open-source contributors and corporate partners to build the fastest web framework on earth.</p>
      <h3>Requirements</h3>
      <ul class="list-disc pl-5 mb-4 text-slate-600 space-y-1">
        <li>Deep expertise in React.js, server components, and modern V8 optimization.</li>
        <li>Prior contributions to React, Next.js, Webpack, Turbopack, or other build toolchains.</li>
        <li>Passionate about developer experience (DX) and frontend performance optimization.</li>
      </ul>
    `
  },
  {
    _id: "mock-3",
    title: "Staff Backend Engineer, Payment Flows",
    company: {
      name: "Stripe",
      industry: "Financial Technology",
      careerPageUrl: "https://stripe.com/jobs"
    },
    location: "New York, NY",
    workplaceMode: "Hybrid",
    rawApplicationUrl: "https://boards.greenhouse.io/stripe/jobs/4201938",
    lastSeen: new Date(Date.now() - 3600000 * 12).toISOString(),
    description: `
      <h3>About Stripe</h3>
      <p class="mb-4 text-slate-600">Stripe is a financial infrastructure platform for the internet. Millions of companies—from the world’s largest enterprises to the most ambitious startups—use Stripe to accept payments, grow their revenue, and accelerate new business opportunities.</p>
      <h3>The Role</h3>
      <p class="mb-4 text-slate-600">You will lead technical design and architecture for Stripe's core card processing routing engines. You will design fault-tolerant, high-throughput systems processing billions of dollars in transaction volume daily with strict latency constraints.</p>
      <h3>Requirements</h3>
      <ul class="list-disc pl-5 mb-4 text-slate-600 space-y-1">
        <li>8+ years of software engineering experience, preferably building high-throughput distributed systems in Go, Ruby, or Java.</li>
        <li>Deep understanding of transactional databases, concurrency control, and idempotency patterns.</li>
        <li>Excellent communication and architectural mentorship skills.</li>
      </ul>
    `
  },
  {
    _id: "mock-4",
    title: "Research Scientist, Large Language Models",
    company: {
      name: "OpenAI",
      industry: "Artificial Intelligence",
      careerPageUrl: "https://openai.com/careers"
    },
    location: "San Francisco, CA",
    workplaceMode: "Onsite",
    rawApplicationUrl: "https://boards.greenhouse.io/openai/jobs/6192837",
    lastSeen: new Date(Date.now() - 3600000 * 24).toISOString(),
    description: `
      <h3>About OpenAI</h3>
      <p class="mb-4 text-slate-600">OpenAI’s mission is to ensure that artificial general intelligence (AGI) benefits all of humanity.</p>
      <h3>The Role</h3>
      <p class="mb-4 text-slate-600">We are seeking research scientists to train the next generation of multimodal foundation models. You will design, scale, and optimize training runs on clusters of thousands of H100 GPUs, scaling token throughput, and experimenting with reinforcement learning paradigms.</p>
      <h3>Requirements</h3>
      <ul class="list-disc pl-5 mb-4 text-slate-600 space-y-1">
        <li>Ph.D. in Computer Science, Machine Learning, or equivalent research output (e.g. NeurIPS, ICML publications).</li>
        <li>Strong engineering skills in PyTorch, Triton, and CUDA programming.</li>
        <li>Experience training transformers or diffusion models at scale.</li>
      </ul>
    `
  }
];

export default function LandingPage() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [workplaceModes, setWorkplaceModes] = useState({
    Remote: true,
    Hybrid: true,
    Onsite: true
  });
  
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [usingMockData, setUsingMockData] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState('feed'); // 'filters', 'feed', 'detail'

  // Load local state mock data
  const loadMockData = useCallback(() => {
    // Client-side filtering simulation
    let filtered = [...MOCK_JOBS];
    
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(j => 
        j.title.toLowerCase().includes(q) || 
        j.description.toLowerCase().includes(q) ||
        j.company.name.toLowerCase().includes(q)
      );
    }

    if (location) {
      const loc = location.toLowerCase();
      filtered = filtered.filter(j => j.location.toLowerCase().includes(loc));
    }

    filtered = filtered.filter(j => workplaceModes[j.workplaceMode]);

    setJobs(filtered);
    setTotalJobs(filtered.length);
    setTotalPages(1);
    setUsingMockData(true);
    
    if (filtered.length > 0) {
      // Keep selected job if still in results, otherwise pick first
      const hasSelected = filtered.find(j => selectedJob && j._id === selectedJob._id);
      if (!hasSelected) {
        setSelectedJob(filtered[0]);
      }
    } else {
      setSelectedJob(null);
    }
  }, [search, location, workplaceModes, selectedJob]);

  // Debounced/Triggered API query constructor
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const selectedModes = Object.entries(workplaceModes)
        .filter(([_, enabled]) => enabled)
        .map(([mode]) => mode)
        .join(',');

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '15'
      });

      if (search) params.append('search', search);
      if (location) params.append('location', location);
      if (selectedModes) params.append('workplaceMode', selectedModes);

      const response = await fetch(`http://localhost:5000/api/jobs?${params.toString()}`);
      const data = await response.json();

      if (data.success && data.jobs && data.jobs.length > 0) {
        setJobs(data.jobs);
        setTotalJobs(data.meta.totalJobs);
        setTotalPages(data.meta.totalPages);
        setUsingMockData(false);
        
        // Auto-select first job if none selected
        if (!selectedJob || !data.jobs.some(j => j._id === selectedJob._id)) {
          setSelectedJob(data.jobs[0]);
        }
      } else {
        // Fallback to mock data if response empty
        loadMockData();
      }
    } catch (err) {
      console.warn("Backend API not reachable. Falling back to offline demonstration mode.");
      loadMockData();
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, location, workplaceModes, selectedJob, loadMockData]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleWorkplaceToggle = (mode) => {
    setWorkplaceModes(prev => ({
      ...prev,
      [mode]: !prev[mode]
    }));
    setCurrentPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchJobs();
  };

  const formatDate = (isoStr) => {
    const date = new Date(isoStr);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffHours < 24) {
      if (diffHours === 0) return 'Just now';
      return `${diffHours}h ago`;
    }
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  // Helper for generating dynamic company brand initial avatars
  const getCompanyColor = (name = 'C') => {
    const colors = [
      'bg-emerald-50 text-emerald-600 border-emerald-200',
      'bg-indigo-50 text-indigo-600 border-indigo-200',
      'bg-rose-50 text-rose-600 border-rose-200',
      'bg-amber-50 text-amber-600 border-amber-200',
      'bg-sky-50 text-sky-600 border-sky-200',
      'bg-purple-50 text-purple-600 border-purple-200'
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }
    return colors[sum % colors.length];
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-50 text-slate-800">
      
      {/* 1. Header Area */}
      <header className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center shadow-md shadow-brand-200">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">
              CareerFetch
            </h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">
              Bypassing recruiters. Direct listings only.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {usingMockData && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              Demo Mode (Offline)
            </span>
          )}
          <div className="text-right hidden md:block">
            <p className="text-xs font-semibold text-slate-700">Live Database</p>
            <p className="text-[10px] text-emerald-600 font-medium flex items-center justify-end gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              {totalJobs} Jobs aggregated
            </p>
          </div>
        </div>
      </header>

      {/* Mobile navigation tab buttons */}
      <div className="lg:hidden flex-shrink-0 bg-white border-b border-slate-200 grid grid-cols-3 text-center text-sm font-semibold">
        <button 
          onClick={() => setMobileActiveTab('filters')}
          className={`py-3 flex items-center justify-center gap-1.5 border-b-2 ${mobileActiveTab === 'filters' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500'}`}
        >
          <Filter className="h-4 w-4" /> Filters
        </button>
        <button 
          onClick={() => setMobileActiveTab('feed')}
          className={`py-3 flex items-center justify-center gap-1.5 border-b-2 ${mobileActiveTab === 'feed' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500'}`}
        >
          <Briefcase className="h-4 w-4" /> Jobs ({jobs.length})
        </button>
        <button 
          onClick={() => setMobileActiveTab('detail')}
          className={`py-3 flex items-center justify-center gap-1.5 border-b-2 ${mobileActiveTab === 'detail' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500'} ${!selectedJob ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <Building2 className="h-4 w-4" /> Details
        </button>
      </div>

      {/* Main Container for 3 Columns */}
      <div className="flex-1 flex overflow-hidden">

        {/* 2. Column 1: Filters (Sidebar) */}
        <aside className={`
          lg:block lg:w-80 flex-shrink-0 bg-white border-r border-slate-200 p-6 overflow-y-auto
          ${mobileActiveTab === 'filters' ? 'block w-full absolute inset-x-0 bottom-0 top-[110px] z-20' : 'hidden'}
        `}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              Filter Criteria
            </h2>
            {mobileActiveTab === 'filters' && (
              <button 
                onClick={() => setMobileActiveTab('feed')}
                className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 lg:hidden"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          <form onSubmit={handleSearchSubmit} className="space-y-6">
            {/* Keyword Search */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Search Jobs
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Software, Engineer, Product..."
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Location Search */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, State or 'Remote'"
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Workplace Modes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Workplace Mode
              </label>
              <div className="space-y-3 pt-1">
                {Object.keys(workplaceModes).map((mode) => (
                  <label key={mode} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox"
                      checked={workplaceModes[mode]}
                      onChange={() => handleWorkplaceToggle(mode)}
                      className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                      {mode}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-sm shadow-brand-100 hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              Apply Filters
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Scrape Target Badge */}
          <div className="mt-10 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <h3 className="font-bold text-xs text-slate-700 mb-1">How it works</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every 6 hours, CareerFetch connects to public Greenhouse API feeds to sync corporate openings. Since listings bypass recruiters, links land directly on the company's application form.
            </p>
          </div>
        </aside>

        {/* 3. Column 2: Scrollable Job Feed List */}
        <main className={`
          flex-1 lg:max-w-md xl:max-w-lg border-r border-slate-200 bg-white flex flex-col overflow-hidden
          ${mobileActiveTab === 'feed' ? 'block' : 'hidden lg:flex'}
        `}>
          {/* Header summary of results */}
          <div className="flex-shrink-0 border-b border-slate-100 px-6 py-4 bg-slate-50/50 flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {jobs.length} jobs matching
            </p>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">direct apply</span>
            </div>
          </div>

          {/* Job Feed Container */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 scroll-smooth">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-48 text-slate-400 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
                <span className="text-sm font-medium">Aggregating jobs...</span>
              </div>
            ) : jobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 px-6 text-center">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="font-bold text-slate-800 mb-1">No jobs match your search</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Try broadening your keyword, selection criteria, or location settings.
                </p>
              </div>
            ) : (
              jobs.map((job) => {
                const isSelected = selectedJob && job._id === selectedJob._id;
                const companyName = job.company ? job.company.name : 'Unknown Company';
                
                return (
                  <div 
                    key={job._id}
                    onClick={() => {
                      setSelectedJob(job);
                      setMobileActiveTab('detail');
                    }}
                    className={`
                      p-5 cursor-pointer hover:bg-slate-50/80 transition-colors flex gap-4 relative group
                      ${isSelected ? 'bg-brand-50/50 border-l-4 border-brand-600 pl-[16px]' : ''}
                    `}
                  >
                    {/* Company Initial Badge */}
                    <div className={`h-11 w-11 rounded-lg border flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-sm ${getCompanyColor(companyName)}`}>
                      {companyName.substring(0, 2).toUpperCase()}
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-brand-600 transition-colors truncate">
                          {job.title}
                        </h4>
                        <span className="text-[10px] font-medium text-slate-400 flex-shrink-0">
                          {formatDate(job.lastSeen)}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-2">
                        {companyName}
                        <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                        <span className="text-slate-500 font-medium">{job.location}</span>
                      </p>

                      <div className="flex items-center gap-2">
                        <span className={`
                          inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase border
                          ${job.workplaceMode === 'Remote' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                            job.workplaceMode === 'Hybrid' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                            'bg-slate-100 text-slate-700 border-slate-200'}
                        `}>
                          {job.workplaceMode}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          Bypasses Recruiters
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Simple API Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex-shrink-0 border-t border-slate-100 px-6 py-4 bg-slate-50 flex items-center justify-between">
              <button 
                disabled={currentPage === 1 || loading}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-semibold text-slate-600">
                Page {currentPage} of {totalPages}
              </span>
              <button 
                disabled={currentPage === totalPages || loading}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:pointer-events-none transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </main>

        {/* 4. Column 3: Dynamic Job Detail Pane */}
        <section className={`
          flex-1 bg-slate-50 overflow-y-auto p-6 lg:p-8 flex flex-col
          ${mobileActiveTab === 'detail' ? 'block' : 'hidden lg:flex'}
        `}>
          {selectedJob ? (
            <div className="max-w-3xl w-full mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden h-full lg:h-auto lg:max-h-full">
              
              {/* Sticky Top Info header */}
              <div className="border-b border-slate-100 p-6 bg-white flex-shrink-0">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="font-extrabold text-slate-900 text-lg lg:text-xl leading-snug mb-1.5">
                      {selectedJob.title}
                    </h2>
                    <p className="text-sm font-semibold text-brand-600 hover:underline flex items-center gap-1.5">
                      {selectedJob.company ? selectedJob.company.name : 'Unknown Company'}
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-300"></span>
                      <span className="text-slate-600 font-medium">{selectedJob.location}</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-300"></span>
                      <span className={`
                        inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide
                        ${selectedJob.workplaceMode === 'Remote' ? 'bg-emerald-50 text-emerald-700' : 
                          selectedJob.workplaceMode === 'Hybrid' ? 'bg-blue-50 text-blue-700' : 
                          'bg-slate-100 text-slate-700'}
                      `}>
                        {selectedJob.workplaceMode}
                      </span>
                    </p>
                  </div>
                  
                  {/* Company Logo Badge */}
                  <div className={`h-14 w-14 rounded-xl border flex items-center justify-center text-lg font-extrabold flex-shrink-0 shadow-sm ${getCompanyColor(selectedJob.company?.name)}`}>
                    {selectedJob.company?.name.substring(0, 2).toUpperCase()}
                  </div>
                </div>

                {/* Direct application alert info */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-150">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Direct Ingestion Link Verified</p>
                      <p className="text-[10px] text-slate-500">Direct carrier link — skips intermediaries.</p>
                    </div>
                  </div>
                  <a 
                    href={selectedJob.rawApplicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap"
                  >
                    Apply Direct
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              {/* Scrollable details description area */}
              <div className="flex-1 overflow-y-auto p-6 prose prose-slate max-w-none prose-sm leading-relaxed border-b border-slate-100">
                <div 
                  dangerouslySetInnerHTML={{ __html: selectedJob.description }} 
                  className="space-y-4"
                />
              </div>

              {/* CTA Footer */}
              <div className="bg-slate-50/50 p-4 px-6 flex items-center justify-between flex-shrink-0">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Aggregated on: {new Date(selectedJob.lastSeen).toLocaleDateString()}
                </span>
                <a 
                  href={selectedJob.rawApplicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 hover:text-brand-700"
                >
                  View Corporate Board Listing
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <Building2 className="h-16 w-16 text-slate-300 stroke-1 mb-4" />
              <h3 className="font-bold text-slate-800 text-base mb-1">Select a job from the list</h3>
              <p className="text-xs text-slate-500">Click any job posting to view its full direct-apply description here.</p>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
