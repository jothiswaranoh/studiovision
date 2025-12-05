import React, { useState, useEffect } from 'react';
import { FlowchartVisualizer } from './FlowchartVisualizer.jsx';

export const ExecutionVisualizer = ({ analysis }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Fallback to empty array if undefined
  const steps = analysis.executionPlan || [];
  const currentStep = steps[currentStepIndex];

  // Helper to map Step ID to Index (since steps might not be perfectly sequential in array)
  const handleStepClick = (stepId) => {
    const index = steps.findIndex(s => s.stepId === stepId);
    if (index !== -1) {
        setCurrentStepIndex(index);
        setIsPlaying(false); // Stop playing if user interacts
    }
  };

  useEffect(() => {
    let interval;
    if (isPlaying && steps.length > 0 && currentStepIndex < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => prev + 1);
      }, 2000);
    } else if (currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStepIndex, steps.length]);

  if (!currentStep) return null;

  // Extract columns dynamically from the first row of data if available. Safe check resultData.
  const resultData = currentStep.resultData || [];
  const dataColumns = resultData.length > 0 
    ? Object.keys(resultData[0]) 
    : [];

  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
      
      {/* Top Half: Flowchart Visualization (Interactive) */}
      <div className="h-1/2 min-h-[300px] border-b border-gray-700 relative group">
        <div className="absolute top-0 left-0 z-20 bg-gray-900/80 px-2 py-1 rounded-br text-xs text-white border-r border-b border-gray-700 backdrop-blur-sm">
            Query Flow Map
        </div>
        {analysis.visualFlow ? (
             <FlowchartVisualizer 
                flow={analysis.visualFlow} 
                onStepClick={handleStepClick}
                activeStepId={currentStep.stepId}
             />
        ) : (
             <div className="flex items-center justify-center h-full text-gray-500">
                <p>Flowchart not available for this query.</p>
             </div>
        )}
      </div>

      {/* Bottom Half: Data Simulation Controls & Table */}
      <div className="flex-1 flex flex-col min-h-0 bg-[#1e1e1e]">
          {/* Controls Header */}
          <div className="bg-gray-900 px-4 py-2 border-b border-gray-700 flex flex-wrap gap-4 justify-between items-center shrink-0">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="bg-indigo-600 text-[10px] px-1.5 py-0.5 rounded text-white">{analysis.queryType}</span>
                Data Simulation
            </h2>
            
            <div className="flex items-center gap-2 bg-gray-800 p-0.5 rounded-lg border border-gray-700">
              <button 
                onClick={() => setCurrentStepIndex(0)}
                disabled={currentStepIndex === 0}
                className="p-1 hover:bg-gray-700 rounded text-gray-300 disabled:opacity-30 transition-colors"
                title="Restart"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v4.59l-2.69-2.69a.75.75 0 00-1.06 1.06l4 4a.75.75 0 001.06 0l4-4a.75.75 0 00-1.06-1.06l-2.69 2.69V6.75z" clipRule="evenodd" transform="rotate(90 10 10)" />
                </svg>
              </button>
              
              <button 
                onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
                disabled={currentStepIndex === 0}
                className="p-1 hover:bg-gray-700 rounded text-gray-300 disabled:opacity-30 transition-colors"
                title="Previous Step"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                </svg>
              </button>

              <span className="text-xs font-mono w-20 text-center text-gray-400">
                Step {currentStepIndex + 1} / {steps.length}
              </span>

              <button 
                onClick={() => setCurrentStepIndex(prev => Math.min(steps.length - 1, prev + 1))}
                disabled={currentStepIndex === steps.length - 1}
                className="p-1 hover:bg-gray-700 rounded text-gray-300 disabled:opacity-30 transition-colors"
                title="Next Step"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </button>

              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={currentStepIndex === steps.length - 1}
                className={`
                    p-1 rounded text-white disabled:opacity-30 transition-colors
                    ${isPlaying ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'}
                `}
                title={isPlaying ? "Pause" : "Auto Play"}
              >
                 {isPlaying ? (
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M5.75 3a.75.75 0 01.75.75v12.5a.75.75 0 01-1.5 0V3.75A.75.75 0 015.75 3zm8.5 0a.75.75 0 01.75.75v12.5a.75.75 0 01-1.5 0V3.75a.75.75 0 01.75-.75z" clipRule="evenodd" />
                   </svg>
                 ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                 )}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4 flex flex-col gap-4">
             {/* Step Explanation */}
            <div className="bg-gray-800 rounded p-3 border-l-4 border-indigo-500 shadow-sm shrink-0">
                <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-indigo-400 mb-1">{currentStep.operation}</h3>
                    <span className="text-[10px] text-gray-500 font-mono">STEP ID: {currentStep.stepId}</span>
                </div>
                <p className="text-gray-300 text-xs">{currentStep.description}</p>
                <p className="mt-2 text-gray-400 text-xs italic border-t border-gray-700 pt-1">
                    "{currentStep.explanation}"
                </p>
            </div>

            {/* Data Table */}
            <div className="rounded border border-gray-700 overflow-hidden bg-gray-900 shadow-inner flex-1 flex flex-col min-h-[200px]">
                <div className="bg-gray-800 px-4 py-1.5 border-b border-gray-700">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                        Result Set Preview ({resultData.length} rows)
                    </span>
                </div>
                <div className="overflow-auto flex-1">
                    {resultData.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 italic text-sm">
                            No data returned at this step (or empty result set).
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 z-10">
                                <tr>
                                    {dataColumns.map((col) => (
                                        <th key={col} className="px-4 py-2 bg-gray-800 text-[10px] font-medium text-gray-300 uppercase tracking-wider border-b border-gray-700 border-r border-gray-700 last:border-r-0 whitespace-nowrap shadow-sm">
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {resultData.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-gray-800 transition-colors">
                                        {dataColumns.map((col) => (
                                            <td key={`${idx}-${col}`} className="px-4 py-2 text-xs text-gray-300 border-r border-gray-800 last:border-r-0 whitespace-nowrap font-mono">
                                                {row[col] === null ? <span className="text-red-400 italic">NULL</span> : String(row[col])}
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
      </div>
    </div>
  );
};