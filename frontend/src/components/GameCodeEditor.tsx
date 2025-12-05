import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Loader2, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { GameLanguage, TestResult } from '../types/games';
import { executeCode, renderHTMLPreview } from '../services/codeRunner';

interface GameCodeEditorProps {
    language: GameLanguage;
    levelId: string;
    initialCode: string;
    onCodeChange: (code: string) => void;
    onSuccess: () => void;
}

export default function GameCodeEditor({
    language,
    levelId,
    initialCode,
    onCodeChange,
    onSuccess,
}: GameCodeEditorProps) {
    const [code, setCode] = useState(initialCode);
    const [isRunning, setIsRunning] = useState(false);
    const [testResult, setTestResult] = useState<TestResult | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    const handleCodeChange = (value: string | undefined) => {
        const newCode = value || '';
        setCode(newCode);
        onCodeChange(newCode);
    };

    const handleRun = async () => {
        setIsRunning(true);
        setTestResult(null);

        try {
            const result = await executeCode(language, code, levelId);
            setTestResult(result);

            if (result.passed) {
                // Show preview for HTML/CSS
                if (language === 'html' || language === 'css') {
                    setShowPreview(true);
                }
            }
        } catch (error) {
            console.error('Error running code:', error);
            setTestResult({
                passed: false,
                message: '❌ Error executing code',
                details: ['An unexpected error occurred'],
            });
        } finally {
            setIsRunning(false);
        }
    };

    const getEditorLanguage = () => {
        const languageMap: Record<GameLanguage, string> = {
            html: 'html',
            css: 'css',
            python: 'python',
            ruby: 'ruby',
            javascript: 'javascript',
            linux: 'shell',
        };
        return languageMap[language] || 'plaintext';
    };

    return (
        <div className="h-full flex flex-col bg-surface/30 backdrop-blur-sm">
            {/* Editor Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-void/50">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
                    <span className="text-white/80 font-medium text-sm">Code Editor</span>
                    <span className="text-white/40 text-xs">
                        {language.toUpperCase()}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {(language === 'html' || language === 'css') && (
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs transition-colors border border-white/10"
                        >
                            {showPreview ? 'Hide Preview' : 'Show Preview'}
                        </button>
                    )}
                    <button
                        onClick={handleRun}
                        disabled={isRunning}
                        className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-neon-cyan/20 hover:bg-neon-cyan/30 text-neon-cyan font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-neon-cyan/30"
                    >
                        {isRunning ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Running...
                            </>
                        ) : (
                            <>
                                <Play size={16} />
                                Run Tests
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1 overflow-hidden">
                {showPreview && (language === 'html' || language === 'css') ? (
                    <div className="h-full bg-white">
                        <iframe
                            srcDoc={renderHTMLPreview(code)}
                            className="w-full h-full border-0"
                            title="HTML Preview"
                            sandbox="allow-scripts"
                        />
                    </div>
                ) : (
                    <Editor
                        height="100%"
                        language={getEditorLanguage()}
                        value={code}
                        onChange={handleCodeChange}
                        theme="vs-dark"
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            lineNumbers: 'on',
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            tabSize: 2,
                            wordWrap: 'on',
                        }}
                    />
                )}
            </div>

            {/* Console Output */}
            <div className="border-t border-white/10 bg-void/80 p-4 max-h-64 overflow-y-auto scrollbar-thin">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-neon-purple" />
                    <span className="text-white/60 font-medium text-sm">Test Results</span>
                </div>

                {!testResult ? (
                    <p className="text-white/40 text-sm">
                        Click "Run Tests" to check your code...
                    </p>
                ) : (
                    <div className="space-y-3">
                        {/* Main Result */}
                        <div className={`flex items-start gap-3 p-3 rounded-lg ${testResult.passed
                                ? 'bg-green-500/10 border border-green-500/30'
                                : 'bg-yellow-500/10 border border-yellow-500/30'
                            }`}>
                            {testResult.passed ? (
                                <CheckCircle size={20} className="text-green-400 shrink-0 mt-0.5" />
                            ) : (
                                <XCircle size={20} className="text-yellow-400 shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1">
                                <p className={`font-medium ${testResult.passed ? 'text-green-400' : 'text-yellow-400'
                                    }`}>
                                    {testResult.message}
                                </p>
                            </div>
                        </div>

                        {/* Test Details */}
                        {testResult.details && testResult.details.length > 0 && (
                            <div className="space-y-1">
                                {testResult.details.map((detail, index) => (
                                    <div key={index} className="text-sm text-white/70 font-mono pl-3">
                                        {detail}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Output */}
                        {testResult.output && testResult.output.length > 0 && (
                            <div className="bg-black/30 rounded-lg p-3 border border-white/10">
                                <p className="text-xs text-white/40 mb-2">Output:</p>
                                {testResult.output.map((line, index) => (
                                    <div key={index} className="text-sm text-white/80 font-mono">
                                        {line}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Next Level Button */}
                        {testResult.passed && (
                            <button
                                onClick={onSuccess}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-semibold hover:shadow-lg hover:shadow-neon-cyan/30 transition-all duration-300"
                            >
                                <span>Next Level</span>
                                <ChevronRight size={20} />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
