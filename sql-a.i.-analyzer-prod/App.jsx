import React, { useState, useEffect } from 'react';
import { Cpu, Code, Play, Layout, AlertCircle, Key, FunctionSquare, Server, Globe } from 'lucide-react';
import { analyzeSql } from './services/geminiService.js';
import { generateSqlFromFlow } from './services/sqlGenerator.js';
import { VisualizerCanvas } from './components/VisualizerCanvas.jsx';
import { DataPanel } from './components/DataPanel.jsx';
import { ExecutionOrder } from './components/ExecutionOrder.jsx';
import { DEFAULT_QUERY } from './constants.js';
import { mockDb } from './data/mockDb.js';

const App = () => {
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [apiKey, setApiKey] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [data, setData] = useState(null);
  const [visualFlow, setVisualFlow] = useState(undefined);
  const [error, setError] = useState(null);
  const [useBackend, setUseBackend] = useState(false);

  const getEnvKey = () => {
    try { return (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : undefined; } 
    catch { return undefined; }
  };
  const envKey = getEnvKey();
  const effectiveKey = apiKey || envKey;

  // Sync initial flow from analysis result
  useEffect(() => {
    if (data && data.visualFlow) {
        setVisualFlow(data.visualFlow);
    }
  }, [data]);

  const handleAnalyze = async () => {
    if (!effectiveKey) {
        setError("Please enter a Gemini API Key.");
        return;
    }
    setIsAnalyzing(true);
    setError(null);
    try {
        const result = await analyzeSql(query, effectiveKey, useBackend);
        setData(result);
    } catch (e) {
        setError(e.message);
    } finally {
        setIsAnalyzing(false);
    }
  };

  const handleFlowChange = (newFlow) => {
    setVisualFlow(newFlow);
    // Reverse engineer SQL
    const newSql = generateSqlFromFlow(newFlow);
    if (newSql) {
        setQuery(newSql);
    }
  };

  return (
    <div className="h-screen w-full bg-slate-950 text-slate-200 font-sans overflow-hidden flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/50 backdrop-blur flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-500/20">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            SQL Vision
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
          {/* Mode Toggle */}
          <div className="flex bg-slate-900 border border-slate-700 rounded-lg p-0.5">
             <button 
               onClick={() => setUseBackend(false)}
               className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-2 ${!useBackend ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
             >
                <Globe className="w-3 h-3" />
                Serverless
             </button>
             <button 
               onClick={() => setUseBackend(true)}
               className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-2 ${useBackend ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
             >
                <Server className="w-3 h-3" />
                FastAPI
             </button>
          </div>

          <div className="w-px h-6 bg-slate-800" />

          <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 w-64 transition-colors focus-within:border-blue-500">
            <Key className="w-4 h-4 text-slate-500 mr-2" />
            <input 
              type="password" 
              placeholder={envKey ? "API Key loaded from env" : "Enter Gemini API Key"}
              className="bg-transparent border-none outline-none text-xs w-full text-slate-200 placeholder-slate-500"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar: Input & Stats */}
        <div className="w-[400px] border-r border-slate-800 bg-slate-900/30 flex flex-col shrink-0 z-10">
          <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
            {/* Input Section */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden flex flex-col flex-1 min-h-[250px]">
                <div className="px-4 py-3 border-b border-slate-700/50 bg-slate-900/30 flex items-center gap-2">
                    <Code className="w-4 h-4 text-blue-400" />
                    <h3 className="text-sm font-semibold text-slate-200">SQL Query Input</h3>
                </div>
                <textarea 
                    className="flex-1 w-full bg-slate-950/50 p-4 font-mono text-xs text-blue-200 border-none focus:ring-0 outline-none resize-none leading-relaxed custom-scrollbar"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="SELECT * FROM orders..."
                    spellCheck={false}
                />
            </div>

            {/* Actions */}
            <button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing} 
                className={`
                    px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2
                    ${isAnalyzing ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'}
                `}
            >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    Analyze SQL
                  </>
                )}
            </button>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-start gap-2 shrink-0 animate-pulse">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Insights & Execution Order */}
            {data && (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden shrink-0 flex flex-col max-h-[400px]">
                 <div className="px-4 py-3 border-b border-slate-700/50 bg-slate-900/30 flex items-center gap-2">
                    <Layout className="w-4 h-4 text-blue-400" />
                    <h3 className="text-sm font-semibold text-slate-200">Insights</h3>
                </div>
                <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar">
                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                        <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Summary</p>
                        <p className="text-sm text-slate-200 leading-snug">{data.summary}</p>
                    </div>
                    
                    <ExecutionOrder query={query} />

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-800/50 p-2 rounded border border-slate-700/50">
                            <div className="flex items-center gap-2 mb-1">
                                <FunctionSquare className="w-3 h-3 text-emerald-400" />
                                <span className="text-xs text-slate-400">Functions</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {data.functions.map(f => (
                                <span key={f} className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">{f}</span>
                                ))}
                            </div>
                        </div>
                        <div className="bg-slate-800/50 p-2 rounded border border-slate-700/50">
                            <div className="flex items-center gap-2 mb-1">
                                <Cpu className="w-3 h-3 text-orange-400" />
                                <span className="text-xs text-slate-400">Complexity</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-1.5 flex-1 bg-slate-700 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-orange-500 rounded-full" 
                                    style={{ width: `${(data.complexityScore || 0) * 10}%` }}
                                />
                                </div>
                                <span className="text-xs font-bold text-orange-400">{data.complexityScore}/10</span>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Area: Visualization Canvas & Data */}
        <div className="flex-1 flex flex-col relative bg-[#0B1120]">
            <div className="flex-1 relative overflow-hidden">
                <VisualizerCanvas 
                    visualFlow={visualFlow}
                    isLoading={isAnalyzing}
                    onFlowChange={handleFlowChange}
                    mockDb={mockDb}
                />
            </div>
            {/* Bottom Data Panel */}
            {data && data.executionPlan && data.executionPlan.length > 0 && (
                <DataPanel plan={data.executionPlan} />
            )}
        </div>
      </div>
    </div>
  );
};

export default App;