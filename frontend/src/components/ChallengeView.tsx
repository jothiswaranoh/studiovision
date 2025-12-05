import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import ReadmeViewer from './ReadmeViewer';
import GameCodeEditor from './GameCodeEditor';
import { Challenge } from '../types/games';

interface ChallengeViewProps {
    challenge: Challenge;
    savedCode?: string;
    onBack: () => void;
    onCodeChange: (code: string) => void;
    onLevelComplete: () => void;
}

export default function ChallengeView({
    challenge,
    savedCode,
    onBack,
    onCodeChange,
    onLevelComplete,
}: ChallengeViewProps) {
    const [leftWidth, setLeftWidth] = useState(50); // Percentage
    const [isResizing, setIsResizing] = useState(false);

    const initialCode = savedCode || challenge.starterCode;

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing) return;

            const container = document.getElementById('challenge-container');
            if (!container) return;

            const containerRect = container.getBoundingClientRect();
            const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

            // Constrain between 30% and 70%
            setLeftWidth(Math.min(Math.max(newWidth, 30), 70));
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    return (
        <div className="h-screen bg-gradient-to-br from-void via-surface to-void flex flex-col">
            {/* Header */}
            <div className="bg-surface/50 backdrop-blur-sm border-b border-white/10 px-6 py-4">
                <div className="flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-white/60 hover:text-neon-cyan transition-colors group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Levels</span>
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="px-3 py-1 rounded-full bg-neon-cyan/20 border border-neon-cyan/30 text-neon-cyan text-xs font-medium">
                            {challenge.language.toUpperCase()}
                        </div>
                        <h1 className="text-xl font-orbitron font-semibold text-white">
                            {challenge.levelId.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </h1>
                    </div>

                    <div className="w-32" /> {/* Spacer for centering */}
                </div>
            </div>

            {/* Split Pane Container */}
            <div id="challenge-container" className="flex-1 flex overflow-hidden">
                {/* Left Pane - README */}
                <div
                    className="border-r border-white/10 flex flex-col"
                    style={{ width: `${leftWidth}%` }}
                >
                    <div className="bg-void/50 px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <BookOpen size={16} className="text-neon-purple" />
                        <span className="text-white/80 font-medium text-sm">Challenge Instructions</span>
                    </div>
                    <ReadmeViewer content={challenge.readmeContent} />
                </div>

                {/* Resize Handle */}
                <div
                    onMouseDown={() => setIsResizing(true)}
                    className="w-1 bg-white/5 hover:bg-neon-cyan/40 cursor-ew-resize transition-colors relative group"
                >
                    <div className="absolute inset-y-0 -left-1 -right-1" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-12 bg-neon-cyan/0 group-hover:bg-neon-cyan/60 rounded-full transition-colors" />
                </div>

                {/* Right Pane - Code Editor */}
                <div
                    className="flex flex-col"
                    style={{ width: `${100 - leftWidth}%` }}
                >
                    <GameCodeEditor
                        language={challenge.language}
                        levelId={challenge.levelId}
                        initialCode={initialCode}
                        onCodeChange={onCodeChange}
                        onSuccess={onLevelComplete}
                    />
                </div>
            </div>
        </div>
    );
}
