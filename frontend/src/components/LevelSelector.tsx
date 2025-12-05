import { Level } from '../types/games';
import { Lock, CheckCircle, Play, ArrowLeft, Trophy } from 'lucide-react';
import { LANGUAGE_INFO } from '../services/gameLoader';
import { GameLanguage } from '../types/games';

interface LevelSelectorProps {
    language: GameLanguage;
    levels: Level[];
    onSelectLevel: (levelId: string) => void;
    onBack: () => void;
}

export default function LevelSelector({ language, levels, onSelectLevel, onBack }: LevelSelectorProps) {
    const langInfo = LANGUAGE_INFO[language];
    const completedCount = levels.filter(l => l.completed).length;
    const progressPercent = (completedCount / levels.length) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-void via-surface to-void p-8">
            {/* Header */}
            <div className="max-w-4xl mx-auto mb-8">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-white/60 hover:text-neon-cyan transition-colors mb-6 group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Languages</span>
                </button>

                <div className="flex items-center gap-4 mb-4">
                    <div
                        className="text-6xl w-20 h-20 flex items-center justify-center rounded-2xl bg-surface/50 backdrop-blur-sm border border-white/10"
                        style={{ color: langInfo.color }}
                    >
                        {langInfo.icon}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-4xl font-orbitron font-bold text-white mb-2">
                            {langInfo.name} Challenges
                        </h1>
                        <p className="text-white/60">
                            {langInfo.description}
                        </p>
                    </div>
                </div>

                {/* Overall Progress */}
                <div className="bg-surface/30 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-white/60 text-sm">Overall Progress</span>
                        <span className="text-white font-semibold">
                            {completedCount} / {levels.length} Completed
                        </span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Levels Grid */}
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                {levels.map((level, index) => {
                    const isFinalChallenge = level.id === 'final_challenge';

                    return (
                        <button
                            key={level.id}
                            onClick={() => !level.locked && onSelectLevel(level.id)}
                            disabled={level.locked}
                            className={`group relative bg-surface/50 backdrop-blur-sm border rounded-xl p-6 text-left transition-all duration-300 ${level.locked
                                    ? 'border-white/5 opacity-50 cursor-not-allowed'
                                    : 'border-white/10 hover:border-neon-cyan/50 hover:bg-surface/80 hover:scale-105 hover:shadow-lg hover:shadow-neon-cyan/20'
                                } ${isFinalChallenge ? 'md:col-span-2' : ''}`}
                        >
                            {/* Level Number Badge */}
                            <div className="flex items-start gap-4 mb-4">
                                <div
                                    className={`w-12 h-12 rounded-lg flex items-center justify-center font-orbitron font-bold text-lg ${level.completed
                                            ? 'bg-neon-cyan/20 text-neon-cyan'
                                            : level.locked
                                                ? 'bg-white/5 text-white/30'
                                                : 'bg-white/10 text-white/60 group-hover:bg-neon-cyan/10 group-hover:text-neon-cyan'
                                        }`}
                                >
                                    {level.completed ? (
                                        <CheckCircle size={24} />
                                    ) : level.locked ? (
                                        <Lock size={20} />
                                    ) : isFinalChallenge ? (
                                        <Trophy size={24} />
                                    ) : (
                                        index + 1
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-xl font-orbitron font-semibold text-white mb-1">
                                        {level.name}
                                    </h3>
                                    <p className="text-sm text-white/50">
                                        {level.completed
                                            ? '✅ Completed'
                                            : level.locked
                                                ? '🔒 Locked - Complete previous levels'
                                                : '▶️ Ready to start'}
                                    </p>
                                </div>

                                {!level.locked && !level.completed && (
                                    <Play
                                        size={20}
                                        className="text-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity"
                                    />
                                )}
                            </div>

                            {/* Hover Effect */}
                            {!level.locked && (
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-neon-cyan/0 to-neon-purple/0 group-hover:from-neon-cyan/5 group-hover:to-neon-purple/5 transition-all duration-300 pointer-events-none" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
