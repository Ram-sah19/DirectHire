import React from 'react';
import { MapPin, ExternalLink, Clock, Building2, CheckCircle2 } from 'lucide-react';

export default function JobCard({ job, onSelect }) {
  const companyName = job.company ? job.company.name : 'Corporate Board';

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

  const getCompanyAvatarColor = (name = 'C') => {
    const colors = [
      'from-indigo-500 to-purple-600',
      'from-purple-500 to-pink-600',
      'from-emerald-500 to-teal-600',
      'from-sky-500 to-indigo-600',
      'from-amber-500 to-rose-600'
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }
    return colors[sum % colors.length];
  };

  return (
    <div 
      onClick={() => onSelect(job)}
      className="group relative rounded-2xl p-[1px] transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
    >
      {/* Outer gradient glow effect on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/40 to-purple-500/40 opacity-0 blur-lg transition duration-300 group-hover:opacity-100"></div>

      <div className="relative flex flex-col justify-between h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-indigo-500/[0.06] backdrop-blur-xl transition duration-300 group-hover:border-indigo-500/40">
        
        {/* Shimmer light bar sweep */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
          <div className="absolute -left-20 top-0 h-full w-14 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.18] to-transparent transition-transform duration-700 group-hover:translate-x-[500px]"></div>
        </div>

        <div>
          {/* Top header line */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${getCompanyAvatarColor(companyName)} flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-indigo-500/20`}>
                {companyName.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">{companyName}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3 text-slate-500" />
                  {job.location}
                </p>
              </div>
            </div>

            <span className={`
              px-2.5 py-0.5 rounded-full text-[10px] font-semibold border uppercase tracking-wider
              ${job.workplaceMode === 'Remote' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 
                job.workplaceMode === 'Hybrid' ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300' : 
                'border-slate-500/30 bg-slate-500/10 text-slate-300'}
            `}>
              {job.workplaceMode}
            </span>
          </div>

          {/* Job Title */}
          <h2 className="text-base font-bold text-white group-hover:text-indigo-200 transition-colors leading-snug mb-3 line-clamp-2">
            {job.title}
          </h2>
        </div>

        {/* Bottom Metadata & Arrow CTA */}
        <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between mt-4">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-slate-500" />
            {formatDate(job.lastSeen)}
          </span>

          <a 
            href={job.rawApplicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 text-xs font-semibold border border-indigo-500/30 transition-all hover:scale-[1.02]"
          >
            Apply Direct
            <ExternalLink className="h-3.5 w-3.5 text-indigo-300" />
          </a>
        </div>

      </div>
    </div>
  );
}
