import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './landingpage/Navbar';
import HomePage from './landingpage/HomePage';
import JobsPage from './landingpage/JobsPage';

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
      <p>Figma is the leading collaborative design tool. We are building the future of software development, starting with design.</p>
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
      <p>Vercel provides the developer experience and infrastructure to build, deploy, and scale frontend applications.</p>
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
      <p>Stripe is a financial infrastructure platform for the internet.</p>
    `
  }
];

function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'jobs'
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/jobs?page=${currentPage}&limit=12`);
      const data = await response.json();

      if (data.success && data.jobs && data.jobs.length > 0) {
        setJobs(data.jobs);
        setTotalJobs(data.meta.totalJobs);
        setTotalPages(data.meta.totalPages);
      } else {
        setJobs(MOCK_JOBS);
        setTotalJobs(MOCK_JOBS.length);
        setTotalPages(1);
      }
    } catch (err) {
      setJobs(MOCK_JOBS);
      setTotalJobs(MOCK_JOBS.length);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return (
    <div className="min-h-screen bg-[#060a18] text-white">
      {/* Top Navbar with Navigation Controls */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#060a18]/80 backdrop-blur-xl text-white">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            
            <div 
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <span className="font-extrabold text-white">C</span>
              </div>
              <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                CareerFetch
              </span>
            </div>

            {/* Navigation Links for dedicated pages */}
            <div className="flex items-center gap-2 text-sm font-medium">
              <button 
                onClick={() => setCurrentView('home')}
                className={`px-3.5 py-1.5 rounded-lg transition-colors ${currentView === 'home' ? 'bg-white/[0.08] text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Home
              </button>
              <button 
                onClick={() => setCurrentView('jobs')}
                className={`px-3.5 py-1.5 rounded-lg transition-colors ${currentView === 'jobs' ? 'bg-white/[0.08] text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Verified Jobs ({totalJobs})
              </button>
            </div>

            <button 
              onClick={() => setCurrentView('jobs')}
              className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:brightness-110 transition-all"
            >
              View All Jobs
            </button>

          </div>
        </nav>
      </header>

      {/* Render Dedicated Page Views */}
      {currentView === 'home' && (
        <HomePage 
          onNavigateToJobs={() => setCurrentView('jobs')} 
        />
      )}

      {currentView === 'jobs' && (
        <JobsPage 
          jobs={jobs}
          loading={loading}
          totalJobs={totalJobs}
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          selectedJob={selectedJob}
          setSelectedJob={setSelectedJob}
        />
      )}
    </div>
  );
}

export default App;
