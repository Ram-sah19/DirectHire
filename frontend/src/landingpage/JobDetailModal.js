import React from 'react';
import { X, ExternalLink, MapPin, Building2, ShieldCheck } from 'lucide-react';

export default function JobDetailModal({ job, onClose }) {
  if (!job) return null;

  const companyName = job.company ? job.company.name : 'Corporate Career Board';

  const decodeHtml = (htmlStr = '') => {
    if (!htmlStr) return '';
    let txt = htmlStr;
    if (txt.includes('&lt;') || txt.includes('&gt;')) {
      txt = txt
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, '&');
    }
    return txt;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-[#060a18]/80 backdrop-blur-xl transition-opacity animate-in fade-in duration-200">
      
      {/* Backdrop click handler */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Slide-over panel */}
      <div className="relative w-full max-w-2xl bg-[#0b1122] border-l border-white/10 h-full shadow-2xl flex flex-col z-10 overflow-hidden text-white animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-white/[0.08] flex items-start justify-between gap-4 bg-white/[0.02]">
          <div className="space-y-2 pr-6">
            <div className="flex items-center gap-2">
              <span className={`
                px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border
                ${job.workplaceMode === 'Remote' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 
                  job.workplaceMode === 'Hybrid' ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300' : 
                  'border-slate-500/30 bg-slate-500/10 text-slate-300'}
              `}>
                {job.workplaceMode}
              </span>
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-500" />
                {job.location}
              </span>
            </div>

            <h2 className="text-2xl font-extrabold text-white leading-snug">
              {job.title}
            </h2>

            <p className="text-sm font-semibold text-indigo-300 flex items-center gap-1.5">
              <Building2 className="h-4 w-4" />
              {companyName}
            </p>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Verification banner */}
        <div className="px-6 md:px-8 py-3 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center justify-between text-xs text-emerald-300">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Verified Direct Ingestion (No Recruiter Intermediaries)
          </span>
          <span className="font-mono text-[10px] text-emerald-400">Official ATS Payload</span>
        </div>

        {/* Description Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 text-slate-300 text-sm leading-relaxed space-y-4 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-white [&_h3]:mt-6 [&_h3]:mb-2 [&_h4]:text-sm [&_h4]:font-semibold [&_h4]:text-slate-100 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:text-slate-300 [&_a]:text-indigo-400 [&_a]:underline hover:[&_a]:text-indigo-300">
          <div 
            dangerouslySetInnerHTML={{ __html: decodeHtml(job.description) }} 
            className="space-y-3"
          />
        </div>

        {/* Footer sticky bar */}
        <div className="p-6 border-t border-white/[0.08] bg-[#060a18]/90 backdrop-blur-xl flex items-center justify-between gap-4">
          <div className="text-xs text-slate-400 hidden sm:block">
            Synced on {new Date(job.lastSeen).toLocaleDateString()}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-white/[0.1] bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white text-sm font-semibold transition-colors flex-1 sm:flex-initial"
            >
              Close
            </button>

            <a 
              href={job.rawApplicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 hover:brightness-110 transition-all flex items-center justify-center gap-2 flex-1 sm:flex-initial whitespace-nowrap"
            >
              Apply on {companyName} Portal
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}
