import React from 'react';
import { AnalysisResult } from '../types';

interface SchemaViewerProps {
  analysis: AnalysisResult;
}

export const SchemaViewer: React.FC<SchemaViewerProps> = ({ analysis }) => {
  // Defensive checks
  const relationships = analysis.relationships || [];
  const involvedTables = analysis.involvedTables || [];

  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
        <div className="bg-gray-900 px-4 py-3 border-b border-gray-700">
            <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Schema & Relationships</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Relationships Section */}
            {relationships.length > 0 && (
                 <div className="mb-6">
                    <h3 className="text-xs font-semibold text-indigo-400 uppercase mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                        Detected Joins
                    </h3>
                    <div className="space-y-2">
                        {relationships.map((rel, idx) => (
                            <div key={idx} className="bg-gray-900/50 p-2 rounded border border-gray-700 text-sm flex items-center justify-between group hover:border-indigo-500 transition-colors">
                                <div className="flex items-center gap-2 text-gray-300">
                                    <span className="font-mono text-indigo-300">{rel.sourceTable}.{rel.sourceColumn}</span>
                                    <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                                    <span className="font-mono text-indigo-300">{rel.targetTable}.{rel.targetColumn}</span>
                                </div>
                                <span className="text-[10px] uppercase bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded border border-gray-700">
                                    {rel.type || 'JOIN'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tables Grid */}
            <div>
                 <h3 className="text-xs font-semibold text-indigo-400 uppercase mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
                    Involved Tables
                </h3>
                <div className="grid grid-cols-1 gap-4">
                    {involvedTables.map((table) => {
                        const columns = table.columns || [];
                        return (
                            <div key={table.tableName} className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden flex flex-col hover:shadow-lg hover:shadow-indigo-500/10 transition-shadow">
                                <div className="bg-gray-800/80 px-3 py-2 border-b border-gray-700 flex justify-between items-center">
                                    <span className="font-bold text-sm text-gray-200 font-mono">{table.tableName}</span>
                                    <span className="text-[10px] bg-gray-700 text-gray-400 px-1.5 rounded">{columns.length} cols</span>
                                </div>
                                <div className="p-2 space-y-1">
                                    {columns.map((col) => (
                                        <div key={col.name} className="flex justify-between items-center text-xs px-2 py-1 rounded hover:bg-gray-800 cursor-default">
                                            <div className="flex items-center gap-2">
                                                {col.isPrimaryKey && (
                                                    <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
                                                )}
                                                {col.isForeignKey && (
                                                    <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                                                )}
                                                <span className={`${col.isPrimaryKey ? 'text-yellow-100 font-bold' : 'text-gray-400'}`}>
                                                    {col.name}
                                                </span>
                                            </div>
                                            <span className="text-gray-600 font-mono text-[10px]">{col.type}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    </div>
  );
};