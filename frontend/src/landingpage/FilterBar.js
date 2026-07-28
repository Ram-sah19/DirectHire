import React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

export default function FilterBar({ workplaceModes, handleWorkplaceToggle, totalJobs, onReset }) {
  const modes = ['Remote', 'Hybrid', 'Onsite'];

  return (
    <div className="bg-[#0b1122] border-b border-white/[0.06] text-slate-300 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Workplace mode filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-400" />
            Mode:
          </span>

          {modes.map((mode) => {
            const isActive = workplaceModes[mode];
            return (
              <button
                key={mode}
                onClick={() => handleWorkplaceToggle(mode)}
                className={`
                  px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 border
                  ${isActive 
                    ? 'border-indigo-500/40 bg-indigo-500/20 text-indigo-200 shadow-md shadow-indigo-500/10' 
                    : 'border-white/[0.08] bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-white'}
                `}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-indigo-400' : 'bg-slate-600'}`}></span>
                {mode}
              </button>
            );
          })}
        </div>

        {/* Counter & Reset */}
        <div className="flex items-center justify-between sm:justify-end gap-4 text-xs">
          <span className="text-slate-400">
            Showing <strong className="text-white font-semibold">{totalJobs}</strong> direct postings
          </span>
          <button 
            onClick={onReset}
            className="text-slate-400 hover:text-white font-medium flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        </div>

      </div>
    </div>
  );
}
