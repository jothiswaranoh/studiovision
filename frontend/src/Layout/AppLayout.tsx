import { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import CodePanel from '../components/CodePanel';
import FloatingActions from '../components/FloatingActions';
import LearningTips from '../components/LearningTips';

interface AppLayoutProps {
    // Layout State
    isCategorySelectorOpen: boolean;
    isBlockLibraryOpen: boolean;
    isCodePanelOpen: boolean;
    showLearningTips: boolean;

    // UI Functions
    onToggleCategorySelector: () => void;
    onToggleBlockLibrary: () => void;
    onToggleCodePanel: () => void;
    onToggleLearningTips: () => void;

    // Canvas Content
    canvasContent: ReactNode;

    // Code Panel Props (we'll extract these later)
    codePanelProps?: any;

    // Navbar Props
    projectName: string;
    onRun: () => void;
    isRunning: boolean;
    canUndo: boolean;
    canRedo: boolean;
}

export default function AppLayout({
    isCategorySelectorOpen,
    isBlockLibraryOpen,
    isCodePanelOpen,
    showLearningTips,
    onToggleCategorySelector,
    onToggleBlockLibrary,
    onToggleCodePanel,
    onToggleLearningTips,
    canvasContent,
    codePanelProps,
    projectName,
    onRun,
    isRunning,
    canUndo,
    canRedo,
}: AppLayoutProps) {
    return (
        <div className="h-screen flex flex-col bg-void text-white overflow-hidden">
            <Navbar
                projectName={projectName}
                onRun={onRun}
                isRunning={isRunning}
                canUndo={canUndo}
                canRedo={canRedo}
            />

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar Toggle Buttons */}
                {!isCategorySelectorOpen && (
                    <button
                        onClick={onToggleCategorySelector}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-50 p-2 bg-surface border border-white/10 rounded-r-md text-white/60 hover:text-neon-cyan hover:bg-surface/80 transition-all backdrop-blur-sm"
                        title="Open categories"
                    >
                        <ChevronRight size={16} />
                    </button>
                )}

                {!isBlockLibraryOpen && (
                    <button
                        onClick={onToggleBlockLibrary}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-50 p-2 bg-void/80 border border-white/10 border-r-0 rounded-l-md text-white/60 hover:text-neon-cyan hover:bg-void transition-all backdrop-blur-sm"
                        title="Open block library"
                    >
                        <ChevronLeft size={16} />
                    </button>
                )}

                {/* Main Content */}
                {canvasContent}

                {/* Code Panel */}
                {codePanelProps && (
                    <CodePanel
                        {...codePanelProps}
                        isOpen={isCodePanelOpen}
                        onToggle={onToggleCodePanel}
                    />
                )}
            </div>

            <FloatingActions
                language={codePanelProps?.language}
                onConvert={() => { }}
            />

            {showLearningTips && (
                <LearningTips onClose={onToggleLearningTips} />
            )}

            <button
                onClick={onToggleLearningTips}
                className="fixed bottom-4 left-4 px-4 py-2 rounded-lg glass-effect text-neon-cyan text-sm font-medium hover:bg-neon-cyan/10 transition-all duration-300 z-40"
            >
                {showLearningTips ? '✕ Hide Tips' : '💡 Learning Tips'}
            </button>
        </div>
    );
}