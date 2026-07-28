import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import FilterBar from './FilterBar';
import JobCard from './JobCard';
import JobDetailModal from './JobDetailModal';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

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
      <p>Figma is the leading collaborative design tool. We are building the future of software development, starting with design. Our team is growing fast, and we are looking for Systems Engineers to join us.</p>
      <h3>The Role</h3>
      <p>As a Systems Engineer on Figma Design, you will work on the core multiplayer syncing engine, canvas rendering architecture, and real-time collaborative protocols.</p>
      <h3>Requirements</h3>
      <ul>
        <li>4+ years of professional experience writing high-performance C++, Rust, or TypeScript.</li>
        <li>Strong fundamentals in systems design, compilers, rendering algorithms, or memory management.</li>
      </ul>
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
      <p>Vercel provides the developer experience and infrastructure to build, deploy, and scale frontend applications. We are the creators and maintainers of Next.js.</p>
      <h3>The Role</h3>
      <p>We are seeking a Senior Frontend Engineer to work directly on Next.js core features, optimization strategies, and server-side rendering architecture.</p>
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
      <p>Stripe is a financial infrastructure platform for the internet. Millions of companies use Stripe to accept payments, grow their revenue, and accelerate new business opportunities.</p>
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
      <p>OpenAI’s mission is to ensure that artificial general intelligence (AGI) benefits all of humanity.</p>
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

  // Client fallback simulation
  const loadMockData = useCallback(() => {
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
  }, [search, location, workplaceModes]);

  // Main fetch call
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const selectedModes = Object.entries(workplaceModes)
        .filter(([_, enabled]) => enabled)
        .map(([mode]) => mode)
        .join(',');

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12'
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
      } else {
        loadMockData();
      }
    } catch (err) {
      console.warn("Backend API offline. Running in clean sandbox fallback mode.");
      loadMockData();
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, location, workplaceModes, loadMockData]);

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

  const handleResetFilters = () => {
    setSearch('');
    setLocation('');
    setWorkplaceModes({ Remote: true, Hybrid: true, Onsite: true });
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#060a18] text-white font-sans antialiased">
      
      {/* Top Navbar */}
      <Navbar />

      {/* Hero Section with Ambient Glows */}
      <Hero 
        search={search}
        setSearch={setSearch}
        location={location}
        setLocation={setLocation}
        onSearchSubmit={handleSearchSubmit}
        totalJobs={totalJobs}
      />

      {/* Filter Bar */}
      <FilterBar 
        workplaceModes={workplaceModes}
        handleWorkplaceToggle={handleWorkplaceToggle}
        totalJobs={totalJobs}
        onReset={handleResetFilters}
      />

      {/* Job Cards Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
            <span className="text-sm font-medium">Fetching verified job listings...</span>
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-12 text-center max-w-lg mx-auto shadow-xl backdrop-blur-xl">
            <h3 className="text-lg font-bold text-white mb-1">No postings found</h3>
            <p className="text-slate-400 text-sm mb-6">
              Try adjusting your search criteria or resetting filters.
            </p>
            <button 
              onClick={handleResetFilters}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:brightness-110 transition-all"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard 
                key={job._id}
                job={job}
                onSelect={(selected) => setSelectedJob(selected)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-14 flex items-center justify-center gap-4">
            <button 
              disabled={currentPage === 1 || loading}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-2.5 rounded-xl border border-white/[0.1] bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-semibold text-slate-400">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              disabled={currentPage === totalPages || loading}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="p-2.5 rounded-xl border border-white/[0.1] bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </main>

      {/* Slide-Over Detail Drawer Modal */}
      <JobDetailModal 
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
      />

    </div>
  );
}
