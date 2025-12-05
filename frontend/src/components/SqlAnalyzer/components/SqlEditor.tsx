import React from 'react';

interface SqlEditorProps {
  value: string;
  onChange: (val: string) => void;
  onRun: () => void;
  isLoading: boolean;
}

export const SqlEditor: React.FC<SqlEditorProps> = ({ value, onChange, onRun, isLoading }) => {
  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700">
      <div className="bg-gray-900 px-4 py-2 border-b border-gray-700 flex justify-between items-center">
        <span className="text-sm font-semibold text-gray-300 font-mono">Input SQL Query</span>
        <div className="flex gap-2">
            <button
                onClick={() => onChange('')}
                className="text-xs text-gray-400 hover:text-white transition-colors"
                disabled={isLoading}
            >
                Clear
            </button>
        </div>
      </div>
      <div className="flex-1 relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full bg-[#1e1e1e] text-gray-300 font-mono p-4 resize-none focus:outline-none focus:ring-0 text-sm leading-6"
          placeholder="SELECT * FROM orders..."
          spellCheck={false}
        />
      </div>
      <div className="bg-gray-900 p-3 border-t border-gray-700 flex justify-end">
        <button
          onClick={onRun}
          disabled={isLoading || !value.trim()}
          className={`
            px-6 py-2 rounded-md font-semibold text-sm transition-all duration-200
            ${isLoading 
              ? 'bg-gray-600 cursor-not-allowed text-gray-400' 
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
            }
          `}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </span>
          ) : (
            'Run Analysis'
          )}
        </button>
      </div>
    </div>
  );
};