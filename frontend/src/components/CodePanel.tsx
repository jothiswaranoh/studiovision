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
  Edit,
  EyeOff,
  PanelRight,
  PanelRightClose,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { Language } from '../data/blockDefinitions';
import { CanvasBlock } from '../hooks/useBlocks';
import { explainCode, optimizeCode, convertCode, AIResponse } from '../services/aiService';
import { useCodeParser } from '../hooks/useCodeParser';
import showToast from './Toast';

interface CodePanelProps {
  code: string;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onCodeChange?: (code: string) => void;
  onBlockValueChange?: (blockId: string, key: string, value: string) => void;
  consoleOutput: string[];
  onCodeLineHover: (line: number | null) => void;
  blocks: CanvasBlock[];
  blockCodeMap: Map<string, { start: number; end: number }>;
  highlightedBlockId: string | null;
  width?: number;
  onResize?: (e: React.MouseEvent) => void;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

type Tab = 'code' | 'ai' | 'console' | 'preview';
type EditorMode = 'edit' | 'view';

const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'c', label: 'C' },
  { value: 'cpp', label: 'C++' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'sql', label: 'SQL' },
];

export default function CodePanel({
  code,
  language,
  onLanguageChange,
  onCodeChange,
  onBlockValueChange,
  consoleOutput,
  onCodeLineHover,
  blocks,
  blockCodeMap,
  highlightedBlockId,
  width = 400,
  onResize,
  isOpen = true,
  onToggle,
}: CodePanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('code');
  const [editorMode, setEditorMode] = useState<EditorMode>('view');
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [localCode, setLocalCode] = useState(code);
  const [isSyncing, setIsSyncing] = useState(false);
  const editorRef = useRef<any>(null);
  const decorationsRef = useRef<string[]>([]);

  // Parse code for block updates
  const parseResult = useCodeParser(localCode, blocks, blockCodeMap, language);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'code', label: 'Code', icon: <Code size={14} /> },
    { id: 'ai', label: 'AI Assistant', icon: <Sparkles size={14} /> },
    { id: 'console', label: 'Console', icon: <Terminal size={14} /> },
    { id: 'preview', label: 'Preview', icon: <Eye size={14} /> },
  ];

  // Update local code when prop changes (but not during editing)
  useEffect(() => {
    if (editorMode === 'view') {
      setLocalCode(code);
    }
  }, [code, editorMode]);

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
        'editorWidget.background': '#1A1A2E',
        'editorSuggestWidget.background': '#1A1A2E',
        'editorSuggestWidget.border': '#00FFFF33',
      },
    });

    monaco.editor.setTheme('neon-dark');

    // Handle line hover for block highlighting
    editor.onMouseMove((e: any) => {
      if (e.target.position && editorMode === 'view') {
        onCodeLineHover(e.target.position.lineNumber);
      }
    });

    editor.onMouseLeave(() => {
      if (editorMode === 'view') {
        onCodeLineHover(null);
      }
    });

    // Handle editor changes in edit mode
    editor.onDidChangeModelContent(() => {
      if (editorMode === 'edit') {
        const newCode = editor.getValue();
        setLocalCode(newCode);
      }
    });
  };

  // Highlight code range when block is highlighted in view mode
  useEffect(() => {
    if (editorRef.current && highlightedBlockId && editorMode === 'view') {
      const range = blockCodeMap.get(highlightedBlockId);
      if (range) {
        // Clear previous decorations
        if (decorationsRef.current.length > 0) {
          editorRef.current.deltaDecorations(decorationsRef.current, []);
        }

        // Add new decoration
        const newDecorations = editorRef.current.deltaDecorations(
          [],
          [
            {
              range: {
                startLineNumber: range.start + 1,
                startColumn: 1,
                endLineNumber: range.end + 1,
                endColumn: 1000,
              },
              options: {
                isWholeLine: true,
                className: 'highlighted-code-line',
                glyphMarginClassName: 'highlighted-code-glyph',
                inlineClassName: 'highlighted-code-inline',
              },
            },
          ]
        );
        decorationsRef.current = newDecorations;

        // Reveal the highlighted line
        editorRef.current.revealLineInCenter(range.start + 1);
      }
    } else if (editorRef.current && !highlightedBlockId) {
      // Clear decorations when nothing is highlighted
      if (decorationsRef.current.length > 0) {
        editorRef.current.deltaDecorations(decorationsRef.current, []);
        decorationsRef.current = [];
      }
    }
  }, [highlightedBlockId, blockCodeMap, editorMode]);

  // AI Actions
  const handleExplain = async () => {
    setIsAiLoading(true);
    setActiveTab('ai');
    try {
      const response = await explainCode(localCode, language as any);
      setAiResponse(response);
    } catch (error) {
      setAiResponse({ content: 'Failed to get explanation from AI service', type: 'error' });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleOptimize = async () => {
    setIsAiLoading(true);
    setActiveTab('ai');
    try {
      const response = await optimizeCode(localCode, language as any);
      setAiResponse(response);

      // If optimization includes code, offer to apply it
      if (response.code) {
        showToast.success('Code optimized! Review in AI tab');
      }
    } catch (error) {
      setAiResponse({ content: 'Failed to optimize code', type: 'error' });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleConvert = async () => {
    setIsAiLoading(true);
    setActiveTab('ai');
    const toLang = language === 'javascript' ? 'python' : 'javascript';
    try {
      const response = await convertCode(localCode, language as any, toLang);
      setAiResponse(response);

      if (response.code) {
        showToast.success(`Converted to ${toLang}! Review in AI tab`);
      }
    } catch (error) {
      setAiResponse({ content: 'Failed to convert code', type: 'error' });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(localCode);
    setCopied(true);
    showToast.success('Code copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleEditorMode = () => {
    const newMode = editorMode === 'edit' ? 'view' : 'edit';
    setEditorMode(newMode);

    if (newMode === 'view') {
      // Switching to view mode - apply changes
      if (localCode !== code) {
        onCodeChange?.(localCode);
        showToast.info('Code changes applied');
      }
      if (editorRef.current) {
        editorRef.current.updateOptions({ readOnly: true });
      }
    } else {
      // Switching to edit mode
      if (editorRef.current) {
        editorRef.current.updateOptions({ readOnly: false });
      }
      showToast.info('Edit mode enabled - modify code freely');
    }
  };

  const handleTogglePanel = () => {
    onToggle?.(!isOpen);
  };

  // Sync code changes to blocks
  const handleSyncToBlocks = () => {
    if (!onBlockValueChange || !parseResult.hasChanges) return;

    setIsSyncing(true);

    try {
      // Apply all updates
      parseResult.updates.forEach(update => {
        onBlockValueChange(update.blockId, update.key, update.value);
      });

      showToast.success(
        `Synced ${parseResult.updates.length} block${parseResult.updates.length > 1 ? 's' : ''} to canvas`
      );

      // Update the main code
      onCodeChange?.(localCode);

    } catch (error) {
      showToast.error('Failed to sync changes to blocks');
    } finally {
      setIsSyncing(false);
    }
  };

  // Apply AI-generated code
  const handleApplyAiCode = () => {
    if (aiResponse?.code) {
      setLocalCode(aiResponse.code);
      onCodeChange?.(aiResponse.code);
      setEditorMode('view');
      showToast.success('AI code applied successfully');
    }
  };

  // When panel is closed
  if (!isOpen) {
    return (
      <div className="relative">
        <button
          onClick={handleTogglePanel}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-50 p-2 bg-surface border border-white/10 border-l-0 rounded-r-md text-white/60 hover:text-neon-cyan hover:bg-surface/80 transition-all backdrop-blur-sm shadow-lg"
          title="Open code panel"
        >
          <PanelRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <div
      className="bg-surface border-l border-white/10 flex flex-col relative"
      style={{ width }}
    >
      {/* Resize Handle */}
      {onResize && (
        <div
          onMouseDown={onResize}
          className="absolute left-0 top-0 h-full w-1 cursor-ew-resize bg-white/5 hover:bg-neon-cyan/40 transition z-50"
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10 bg-surface/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="appearance-none bg-white/5 border border-white/10 text-white text-sm rounded-md pl-3 pr-8 py-1.5 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all cursor-pointer hover:bg-white/10"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value} className="bg-[#1A1A2E] text-white">
                  {lang.label}
                </option>
              ))}
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <button
            onClick={handleToggleEditorMode}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${editorMode === 'edit'
                ? 'bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/30'
                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            title={editorMode === 'edit' ? 'Switch to View Mode' : 'Switch to Edit Mode'}
          >
            {editorMode === 'edit' ? <Edit size={12} /> : <EyeOff size={12} />}
            {editorMode === 'edit' ? 'Editing' : 'Viewing'}
          </button>

          {editorMode === 'edit' && parseResult.hasChanges && (
            <button
              onClick={handleSyncToBlocks}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-neon-purple/20 text-neon-purple hover:bg-neon-purple/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Sync code changes to canvas blocks"
            >
              <RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} />
              Sync ({parseResult.updates.length})
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="p-1.5 rounded-md text-white/50 hover:text-neon-cyan hover:bg-white/5 transition-all duration-200"
            title="Copy code to clipboard"
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>

          <button
            onClick={handleTogglePanel}
            className="p-1.5 rounded-md text-white/50 hover:text-neon-cyan hover:bg-white/5 transition-all duration-200"
            title="Collapse panel"
          >
            <PanelRightClose size={14} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 bg-surface/30">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-all duration-200 relative ${activeTab === tab.id ? 'text-neon-cyan' : 'text-white/50 hover:text-white/80'
              }`}
          >
            {tab.icon}
            {tab.label}
            {tab.id === 'console' && consoleOutput.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-neon-cyan/20 text-neon-cyan text-[10px] rounded-full">
                {consoleOutput.length}
              </span>
            )}
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
          <div className="h-full relative">
            {editorMode === 'edit' && (
              <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                <div className="px-2 py-1 bg-neon-cyan/20 text-neon-cyan text-xs font-medium rounded-md flex items-center gap-1">
                  <Edit size={10} />
                  Editing Mode
                </div>
                {parseResult.hasChanges && (
                  <div className="px-2 py-1 bg-warning/20 text-warning text-xs font-medium rounded-md flex items-center gap-1">
                    <AlertCircle size={10} />
                    Unsaved Changes
                  </div>
                )}
              </div>
            )}
            <Editor
              height="100%"
              language={language === 'cpp' ? 'cpp' : language === 'c' ? 'c' : language}
              value={localCode}
              onMount={handleEditorMount}
              options={{
                readOnly: editorMode === 'view',
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                padding: { top: 16, bottom: 16 },
                renderLineHighlight: 'all',
                cursorBlinking: 'smooth',
                smoothScrolling: true,
                automaticLayout: true,
                folding: true,
                lineDecorationsWidth: 10,
                scrollbar: {
                  vertical: 'visible',
                  horizontal: 'visible',
                  useShadows: false,
                },
                contextmenu: true,
                formatOnPaste: true,
                formatOnType: true,
                suggestOnTriggerCharacters: true,
                acceptSuggestionOnEnter: 'on',
                tabCompletion: 'on',
                wordBasedSuggestions: 'currentDocument',
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
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neon-purple/20 text-neon-purple text-xs font-medium hover:bg-neon-purple/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageSquare size={14} />
                Explain Code
              </button>
              <button
                onClick={handleOptimize}
                disabled={isAiLoading}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neon-cyan/20 text-neon-cyan text-xs font-medium hover:bg-neon-cyan/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Wand2 size={14} />
                Optimize
              </button>
              <button
                onClick={handleConvert}
                disabled={isAiLoading}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neon-gold/20 text-neon-gold text-xs font-medium hover:bg-neon-gold/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowRightLeft size={14} />
                Convert to {language === 'javascript' ? 'Python' : 'JavaScript'}
              </button>
            </div>

            {/* AI Response */}
            <div className="flex-1 overflow-y-auto p-4">
              {isAiLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-white/50">
                  <Loader2 size={32} className="animate-spin mb-3 text-neon-cyan" />
                  <span className="text-sm">Analyzing your code...</span>
                  <span className="text-xs text-white/30 mt-1">This may take a moment</span>
                </div>
              ) : aiResponse ? (
                <div className="space-y-4">
                  <div
                    className="prose prose-invert prose-sm max-w-none text-white/80 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: aiResponse.content
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-neon-cyan font-semibold">$1</strong>')
                        .replace(/`([^`]+)`/g, '<code class="bg-white/10 px-1.5 py-0.5 rounded text-neon-gold font-mono text-xs">$1</code>')
                        .replace(/• /g, '<br/>• ')
                        .replace(/\n\n/g, '<br/><br/>')
                        .replace(/\n/g, '<br/>'),
                    }}
                  />
                  {aiResponse.code && (
                    <div className="mt-4 border border-white/10 rounded-lg overflow-hidden">
                      <div className="bg-white/5 px-3 py-2 flex items-center justify-between border-b border-white/10">
                        <span className="text-xs text-white/60 font-medium">Generated Code</span>
                        <button
                          onClick={handleApplyAiCode}
                          className="px-2 py-1 text-xs bg-neon-cyan/20 text-neon-cyan rounded hover:bg-neon-cyan/30 transition-all"
                        >
                          Apply Code
                        </button>
                      </div>
                      <pre className="p-3 bg-black/20 text-xs overflow-x-auto">
                        <code className="text-white/80">{aiResponse.code}</code>
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Sparkles size={40} className="text-neon-purple/50 mb-3" />
                  <p className="text-white/50 text-sm font-medium">
                    AI-Powered Code Assistant
                  </p>
                  <p className="text-white/30 text-xs mt-2 max-w-xs">
                    Get explanations, optimizations, and language conversions powered by AI
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Console Tab */}
        {activeTab === 'console' && (
          <div className="h-full overflow-y-auto p-4 font-mono text-sm bg-black/20">
            {consoleOutput.length > 0 ? (
              <div className="space-y-1">
                {consoleOutput.map((line, index) => (
                  <div
                    key={index}
                    className={`py-0.5 ${line.startsWith('▶')
                        ? 'text-neon-cyan font-medium'
                        : line.startsWith('✅')
                          ? 'text-green-400'
                          : line.startsWith('❌')
                            ? 'text-red-400'
                            : line.startsWith('>')
                              ? 'text-yellow-300'
                              : line.startsWith('---')
                                ? 'text-white/30 border-t border-white/10 pt-2 mt-2'
                                : 'text-white/70'
                      }`}
                  >
                    {line}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Terminal size={40} className="text-white/20 mb-3" />
                <p className="text-white/40 text-sm font-medium">
                  Console Output
                </p>
                <p className="text-white/30 text-xs mt-2 max-w-xs">
                  Execution results and logs will appear here when you run your code
                </p>
              </div>
            )}
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-white/10 bg-surface/30">
              <h4 className="text-white/80 text-sm font-semibold mb-1">Live Preview</h4>
              <p className="text-white/40 text-xs">
                View real-time output of your code execution
              </p>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <div className="border border-white/10 rounded-lg p-6 min-h-[200px] bg-black/20">
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Eye size={32} className="text-white/20 mb-3" />
                  <p className="text-white/40 text-sm font-medium">
                    Visual Preview
                  </p>
                  <p className="text-white/30 text-xs mt-2 max-w-xs">
                    Real-time preview for UI components and DOM manipulation
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-white/10 bg-surface/30 flex items-center justify-between text-xs text-white/40">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan"></span>
            {blocks.length} blocks
          </span>
          <span>{localCode.split('\n').length} lines</span>
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${editorMode === 'edit' ? 'bg-neon-cyan/20 text-neon-cyan' : 'bg-white/5 text-white/60'
              }`}
          >
            {editorMode === 'edit' ? '✏️ Editing' : '👁️ Viewing'}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span>Ctrl+S to save</span>
          {editorMode === 'view' && <span>Double-click to edit</span>}
        </div>
      </div>
    </div>
  );
}