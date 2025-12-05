import { LanguageInfo } from '../types/games';
import { Code2, Trophy, Lock } from 'lucide-react';

interface LanguageSelectorProps {
    languages: LanguageInfo[];
    onSelectLanguage: (languageId: string) => void;
}

export default function LanguageSelector({ languages, onSelectLanguage }: LanguageSelectorProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-void via-surface to-void p-8">
            {/* Header */}
            <div className="max-w-6xl mx-auto mb-12">
                <div className="flex items-center gap-4 mb-4">
                    <Trophy className="text-neon-cyan" size={48} />
                    <h1 className="text-5xl font-orbitron font-bold text-white">
                        Coding Challenges
                    </h1>
                </div>
                <p className="text-white/60 text-lg ml-16">
                    Choose a language and start your coding journey! Complete challenges, level up your skills.
                </p>
            </div>

            {/* Language Grid */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {languages.map((lang) => {
                    const progressPercent = (lang.completedLevels / lang.totalLevels) * 100;
                    const isStarted = lang.completedLevels > 0;

                    return (
                        <button
                            key={lang.id}
                            onClick={() => onSelectLanguage(lang.id)}
                            className="group relative bg-surface/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-neon-cyan/50 hover:bg-surface/80 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-neon-cyan/20"
                        >
                            {/* Icon and Title */}
                            <div className="flex items-start gap-4 mb-4">
                                <div
                                    className="text-5xl w-16 h-16 flex items-center justify-center rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors"
                                    style={{ color: lang.color }}
                                >
                                    {lang.icon}
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="text-2xl font-orbitron font-bold text-white mb-1">
                                        {lang.name}
                                    </h3>
                                    <p className="text-white/50 text-sm">
                                        {lang.description}
                                    </p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-3">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs text-white/40">Progress</span>
                                    <span className="text-xs font-semibold text-white/60">
                                        {lang.completedLevels} / {lang.totalLevels}
                                    </span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple transition-all duration-500"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div className="flex items-center gap-2">
                                {isStarted ? (
                                    <>
                                        <Code2 size={14} className="text-neon-cyan" />
                                        <span className="text-xs text-neon-cyan font-medium">
                                            In Progress
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <Lock size={14} className="text-white/40" />
                                        <span className="text-xs text-white/40 font-medium">
                                            Not Started
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Hover Effect Gradient */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neon-cyan/0 to-neon-purple/0 group-hover:from-neon-cyan/5 group-hover:to-neon-purple/5 transition-all duration-300 pointer-events-none" />
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
