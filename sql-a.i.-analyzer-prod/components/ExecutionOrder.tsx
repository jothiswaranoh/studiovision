
import React from 'react';
import { ArrowDown, CheckCircle2 } from 'lucide-react';

interface ExecutionOrderProps {
  query: string;
}

const LOGICAL_ORDER = [
  { key: 'FROM', label: 'FROM / JOIN', desc: 'Identify Data Sources' },
  { key: 'WHERE', label: 'WHERE', desc: 'Filter Rows' },
  { key: 'GROUP BY', label: 'GROUP BY', desc: 'Group Rows' },
  { key: 'HAVING', label: 'HAVING', desc: 'Filter Groups' },
  { key: 'SELECT', label: 'SELECT', desc: 'Select Columns' },
  { key: 'ORDER BY', label: 'ORDER BY', desc: 'Sort Results' },
  { key: 'LIMIT', label: 'LIMIT', desc: 'Limit Output' },
];

export const ExecutionOrder: React.FC<ExecutionOrderProps> = ({ query }) => {
  const upperQuery = query.toUpperCase();

  // Helper to extract details
  const getDetails = (key: string): string | null => {
      const regex = new RegExp(`${key}\\s+(.*?)(?=$|\\s+(FROM|WHERE|GROUP BY|HAVING|SELECT|ORDER BY|LIMIT))`, 'is');
      const match = query.match(regex);
      if (match && match[1]) {
          let text = match[1].trim();
          if (text.length > 40) text = text.substring(0, 37) + '...';
          return text;
      }
      return null;
  };

  const activeSteps = LOGICAL_ORDER.map(step => {
    let isActive = upperQuery.includes(step.key);
    // Special handling for FROM/JOIN
    if (step.key === 'FROM' && (upperQuery.includes('FROM') || upperQuery.includes('JOIN'))) {
        isActive = true;
    }
    
    // Always show mandatory steps if query is non-empty
    if (query.trim().length > 0 && (step.key === 'SELECT')) {
        isActive = true;
    }

    return {
        ...step,
        isActive,
        details: isActive ? getDetails(step.key) : null
    };
  }).filter(step => step.isActive);

  return (
    <div className="space-y-2">
       <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Execution Pipeline</span>
       </div>
       {activeSteps.length === 0 ? (
           <div className="text-xs text-slate-600 italic">No steps detected.</div>
       ) : (
           <div className="relative pl-4 space-y-0">
              {/* Vertical line connector */}
              <div className="absolute left-[5px] top-2 bottom-2 w-0.5 bg-slate-800" />
              
              {activeSteps.map((step, idx) => (
                 <div key={step.key} className="relative flex items-start gap-3 py-2">
                    {/* Dot */}
                    <div className="absolute -left-[5px] mt-1 w-2.5 h-2.5 rounded-full bg-slate-900 border-2 border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)] z-10" />
                    
                    <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase text-emerald-400">{step.label}</span>
                            <span className="text-[9px] text-slate-500 font-medium bg-slate-800/50 px-1 rounded border border-slate-700">{idx + 1}</span>
                        </div>
                        <span className="text-[10px] text-slate-300 font-medium leading-tight mt-0.5">{step.desc}</span>
                        {step.details && (
                            <div className="mt-1 text-[9px] font-mono text-slate-400 bg-black/20 p-1 rounded truncate max-w-[200px] border border-slate-800/50">
                                {step.details}
                            </div>
                        )}
                    </div>
                 </div>
              ))}
           </div>
       )}
    </div>
  );
};
