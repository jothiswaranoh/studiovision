import { useState, useRef, useEffect } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import {
  Code,
  MessageSquare,
  Terminal,
  Eye,
  Sparkles,
  Wand2,
  ArrowRightLeft,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';
import { Language } from '../hooks/useCodeGeneration';
import { CanvasBlock } from '../hooks/useBlocks';
import { explainCode, optimizeCode, convertCode, AIResponse } from '../services/aiService';

interface CodePanelProps {
  code: string;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  consoleOutput: string[];
  onCodeLineHover: (line: number | null) => void;
  blocks: CanvasBlock[];
  blockCodeMap: Map<string, { start: number; end: number }>;
  highlightedBlockId: string | null;
}

type Tab = 'code' | 'ai' | 'console' | 'preview';

export default function CodePanel({
  code,
  language,
  onLanguageChange,
  consoleOutput,
  onCodeLineHover,
  blocks,
  blockCodeMap,
  highlightedBlockId,
}: CodePanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('code');
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const editorRef = useRef<any>(null);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'code', label: 'Code', icon: <Code size={14} /> },
    { id: 'ai', label: 'AI Assistant', icon: <Sparkles size={14} /> },
    { id: 'console', label: 'Console', icon: <Terminal size={14} /> },
    { id: 'preview', label: 'Preview', icon: <Eye size={14} /> },
  ];

  // Monaco editor setup
  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Define custom neon theme
    monaco.editor.defineTheme('neon-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955' },
        { token: 'keyword', foreground: '00FFFF' },
        { token: 'string', foreground: 'FFD700' },
        { token: 'number', foreground: 'FF1493' },
        { token: 'function', foreground: '8A2BE2' },
        { token: 'variable', foreground: 'E2E8F0' },
        { token: 'type', foreground: '00FF85' },
      ],
      colors: {
        'editor.background': '#0A0A0F',
        'editor.foreground': '#E2E8F0',
        'editor.lineHighlightBackground': '#1A1A2E',
        'editorCursor.foreground': '#00FFFF',
        'editor.selectionBackground': '#00FFFF33',
        'editorLineNumber.foreground': '#64748B',
        'editorLineNumber.activeForeground': '#00FFFF',
        'editorGutter.background': '#0A0A0F',
      },
    });

    monaco.editor.setTheme('neon-dark');

    // Handle line hover for block highlighting
    editor.onMouseMove((e: any) => {
      if (e.target.position) {
        onCodeLineHover(e.target.position.lineNumber);
      }
    });

    editor.onMouseLeave(() => {
      onCodeLineHover(null);
    });
  };

  // Highlight code range when block is highlighted
  useEffect(() => {
    if (editorRef.current && highlightedBlockId) {
      const range = blockCodeMap.get(highlightedBlockId);
      if (range) {
        editorRef.current.setSelection({
          startLineNumber: range.start + 1,
          startColumn: 1,
          endLineNumber: range.end + 1,
          endColumn: 1000,
        });
        editorRef.current.revealLineInCenter(range.start + 1);
      }
    }
  }, [highlightedBlockId, blockCodeMap]);

  // AI Actions
  const handleExplain = async () => {
    setIsAiLoading(true);
    setActiveTab('ai');
    try {
      const response = await explainCode(code, language);
      setAiResponse(response);
    } catch (error) {
      setAiResponse({ content: 'Failed to get explanation', type: 'error' });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleOptimize = async () => {
    setIsAiLoading(true);
    setActiveTab('ai');
    try {
      const response = await optimizeCode(code, language);
      setAiResponse(response);
    } catch (error) {
      setAiResponse({ content: 'Failed to optimize', type: 'error' });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleConvert = async () => {
    setIsAiLoading(true);
    setActiveTab('ai');
    const toLang = language === 'javascript' ? 'python' : 'javascript';
    try {
      const response = await convertCode(code, language, toLang);
      setAiResponse(response);
    } catch (error) {
      setAiResponse({ content: 'Failed to convert', type: 'error' });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-[400px] min-w-[350px] max-w-[500px] bg-surface border-l border-white/10 flex flex-col">
      {/* Language Toggle */}
      <div className="flex items-center justify-between p-2 border-b border-white/10">
        <div className="flex bg-void/50 rounded-lg p-1">
          <button
            onClick={() => onLanguageChange('javascript')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${language === 'javascript'
              ? 'bg-neon-gold/20 text-neon-gold'
              : 'text-white/50 hover:text-white/80'
              }`}
          >
            JavaScript
          </button>
          <button
            onClick={() => onLanguageChange('python')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${language === 'python'
              ? 'bg-success/20 text-success'
              : 'text-white/50 hover:text-white/80'
              }`}
          >
            Python
          </button>
        </div>

        <button
          onClick={handleCopyCode}
          className="p-1.5 rounded-md text-white/50 hover:text-neon-cyan hover:bg-white/5 transition-all duration-200"
          title="Copy Code"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-all duration-200 relative ${activeTab === tab.id
              ? 'text-neon-cyan'
              : 'text-white/50 hover:text-white/80'
              }`}
          >
            {tab.icon}
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-neon-cyan to-neon-purple" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {/* Code Tab */}
        {activeTab === 'code' && (
          <div className="h-full">
            <Editor
              height="100%"
              language={language === 'javascript' ? 'javascript' : 'python'}
              value={code}
              onMount={handleEditorMount}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: "'JetBrains Mono', monospace",
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                padding: { top: 16, bottom: 16 },
                renderLineHighlight: 'all',
                cursorBlinking: 'smooth',
                smoothScrolling: true,
              }}
            />
          </div>
        )}

        {/* AI Assistant Tab */}
        {activeTab === 'ai' && (
          <div className="h-full flex flex-col">
            {/* AI Actions */}
            <div className="flex flex-wrap gap-2 p-4 border-b border-white/10">
              <button
                onClick={handleExplain}
                disabled={isAiLoading}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neon-purple/20 text-neon-purple text-xs font-medium hover:bg-neon-purple/30 transition-all duration-200 disabled:opacity-50"
              >
                <MessageSquare size={14} />
                Explain Code
              </button>
              <button
                onClick={handleOptimize}
                disabled={isAiLoading}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neon-cyan/20 text-neon-cyan text-xs font-medium hover:bg-neon-cyan/30 transition-all duration-200 disabled:opacity-50"
              >
                <Wand2 size={14} />
                Optimize
              </button>
              <button
                onClick={handleConvert}
                disabled={isAiLoading}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neon-gold/20 text-neon-gold text-xs font-medium hover:bg-neon-gold/30 transition-all duration-200 disabled:opacity-50"
              >
                <ArrowRightLeft size={14} />
                Convert {language === 'javascript' ? 'to Python' : 'to JS'}
              </button>
            </div>

            {/* AI Response */}
            <div className="flex-1 overflow-y-auto p-4">
              {isAiLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-white/50">
                  <Loader2 size={32} className="animate-spin mb-2 text-neon-cyan" />
                  <span className="text-sm">Analyzing...</span>
                </div>
              ) : aiResponse ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  <div
                    className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: aiResponse.content
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-neon-cyan">$1</strong>')
                        .replace(/`([^`]+)`/g, '<code class="bg-white/10 px-1 rounded text-neon-gold">$1</code>')
                        .replace(/• /g, '<br/>• ')
                        .replace(/\n/g, '<br/>')
                    }}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Sparkles size={40} className="text-neon-purple/50 mb-3" />
                  <p className="text-white/50 text-sm">
                    Click an action above to get AI assistance
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Console Tab */}
        {activeTab === 'console' && (
          <div className="h-full overflow-y-auto p-4 font-mono text-sm">
            {consoleOutput.length > 0 ? (
              consoleOutput.map((line, index) => (
                <div
                  key={index}
                  className={`py-0.5 ${line.startsWith('▶')
                    ? 'text-neon-cyan'
                    : line.startsWith('✅')
                      ? 'text-success'
                      : line.startsWith('❌')
                        ? 'text-error'
                        : line.startsWith('>')
                          ? 'text-neon-gold'
                          : line.startsWith('---')
                            ? 'text-white/30'
                            : 'text-white/70'
                    }`}
                >
                  {line}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Terminal size={40} className="text-white/20 mb-3" />
                <p className="text-white/40 text-sm">
                  Console output will appear here
                </p>
                <p className="text-white/30 text-xs mt-1">
                  Click "Run" to execute your code
                </p>
              </div>
            )}
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Eye size={48} className="text-white/20 mx-auto mb-3" />
              <p className="text-white/40 text-sm">
                Live preview for React components
              </p>
              <p className="text-white/30 text-xs mt-1">
                Coming soon...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Block Count Footer */}
      <div className="p-2 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
        <span>{blocks.length} blocks</span>
        <span>{code.split('\n').length} lines</span>
      </div>
    </div>
  );
}
