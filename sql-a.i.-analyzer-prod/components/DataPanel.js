import React, { useState } from 'react';
import { Play, ChevronRight, ChevronLeft, Table as TableIcon } from 'lucide-react';

export const DataPanel = ({ plan }) => {
  const [stepIndex, setStepIndex] = useState(0);

  if (!plan || plan.length === 0) return null;
  const currentStep = plan[stepIndex];
  
  // Safe access to resultData
  const resultData = currentStep.resultData || [];
  const columns = resultData.length > 0 ? Object.keys(resultData[0]) : [];

  return (
    <div className="h-64 bg-slate-900 border-t border-slate-700 flex flex-col shrink-0">
        <div className="h-10 border-b border-slate-700 px-4 flex items-center justify-between bg-slate-800/50">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <TableIcon className="w-4 h-4 text-emerald-400" />
                Execution Simulation
            </div>
            <div className="flex items-center gap-2">
                 <button 
                    onClick={() => setStepIndex(Math.max(0, stepIndex - 1))}
                    disabled={stepIndex === 0}
                    className="p-1 hover:bg-slate-700 rounded text-slate-400 disabled:opacity-30"
                 >
                    <ChevronLeft className="w-4 h-4" />
                 </button>
                 <span className="text-xs font-mono text-slate-400">Step {stepIndex + 1} / {plan.length}</span>
                 <button 
                    onClick={() => setStepIndex(Math.min(plan.length - 1, stepIndex + 1))}
                    disabled={stepIndex === plan.length - 1}
                    className="p-1 hover:bg-slate-700 rounded text-slate-400 disabled:opacity-30"
                 >
                    <ChevronRight className="w-4 h-4" />
                 </button>
            </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
             {/* Step Info */}
             <div className="w-64 border-r border-slate-800 p-4 overflow-y-auto bg-slate-900/30">
                <div className="text-xs font-bold text-blue-400 uppercase mb-1">{currentStep.operation}</div>
                <div className="text-sm text-slate-300 mb-2">{currentStep.description}</div>
             </div>

             {/* Data Table */}
             <div className="flex-1 overflow-auto bg-slate-950/50">
                {resultData.length === 0 ? (
                    <div className="p-8 text-center text-slate-600 text-sm">No data returned for this step.</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-900 sticky top-0">
                            <tr>
                                {columns.map(col => (
                                    <th key={col} className="px-4 py-2 text-xs font-medium text-slate-400 border-b border-slate-800 uppercase whitespace-nowrap">{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {resultData.map((row, i) => (
                                <tr key={i} className="hover:bg-slate-800/30">
                                    {columns.map(col => (
                                        <td key={col} className="px-4 py-2 text-xs text-slate-300 border-r border-slate-800/50 last:border-none whitespace-nowrap font-mono">
                                            {row[col] === null ? <span className="text-red-500">NULL</span> : String(row[col])}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
             </div>
        </div>
    </div>
  );
};