import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameProgress } from '../hooks/useGameProgress';
import { useGameData } from '../hooks/useGameData';
import LanguageSelector from './LanguageSelector';
import LevelSelector from './LevelSelector';
import ChallengeView from './ChallengeView';
import { GameLanguage } from '../types/games';
import { Loader2 } from 'lucide-react';

export default function GamesPage() {
    const { language: languageParam, level: levelParam } = useParams<{
        language?: string;
        level?: string;
    }>();
    const navigate = useNavigate();

    const {
        progress,
        completeLevel,
        saveCode,
        getSavedCode,
    } = useGameProgress();

    const {
        languages,
        selectedLanguage,
        levels,
        currentChallenge,
        loading,
        error,
        selectLanguage,
        loadChallengeData,
        backToLanguages,
        backToLevels,
    } = useGameData(progress);

    // Handle URL parameters
    useEffect(() => {
        if (languageParam && !selectedLanguage) {
            selectLanguage(languageParam as GameLanguage);
        }
    }, [languageParam, selectedLanguage, selectLanguage]);

    useEffect(() => {
        if (languageParam && levelParam && !currentChallenge) {
            loadChallengeData(languageParam as GameLanguage, levelParam);
        }
    }, [languageParam, levelParam, currentChallenge, loadChallengeData]);

    // Handlers
    const handleSelectLanguage = (languageId: string) => {
        selectLanguage(languageId as GameLanguage);
        navigate(`/games/${languageId}`);
    };

    const handleSelectLevel = (levelId: string) => {
        if (selectedLanguage) {
            loadChallengeData(selectedLanguage, levelId);
            navigate(`/games/${selectedLanguage}/${levelId}`);
        }
    };

    const handleBackToLanguages = () => {
        backToLanguages();
        navigate('/games');
    };

    const handleBackToLevels = () => {
        backToLevels();
        if (selectedLanguage) {
            navigate(`/games/${selectedLanguage}`);
        }
    };

    const handleCodeChange = (code: string) => {
        if (selectedLanguage && currentChallenge) {
            saveCode(selectedLanguage, currentChallenge.levelId, code);
        }
    };

    const handleLevelComplete = () => {
        if (!selectedLanguage || !currentChallenge) return;

        const savedCode = getSavedCode(selectedLanguage, currentChallenge.levelId);
        completeLevel(selectedLanguage, currentChallenge.levelId, savedCode);

        // Find next level
        const currentLevelIndex = levels.findIndex(l => l.id === currentChallenge.levelId);
        const nextLevel = levels[currentLevelIndex + 1];

        if (nextLevel) {
            // Navigate to next level
            setTimeout(() => {
                handleSelectLevel(nextLevel.id);
            }, 1500);
        } else {
            // All levels completed, go back to level selector
            setTimeout(() => {
                handleBackToLevels();
            }, 1500);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-void via-surface to-void flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 size={48} className="text-neon-cyan animate-spin" />
                    <p className="text-white/60">Loading challenge...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-void via-surface to-void flex items-center justify-center">
                <div className="bg-surface/50 backdrop-blur-sm border border-red-500/30 rounded-xl p-8 max-w-md">
                    <p className="text-red-400 text-center mb-4">{error}</p>
                    <button
                        onClick={handleBackToLanguages}
                        className="w-full px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                        Back to Languages
                    </button>
                </div>
            </div>
        );
    }

    // Render appropriate view based on state
    if (currentChallenge) {
        const savedCode = getSavedCode(currentChallenge.language, currentChallenge.levelId);
        return (
            <ChallengeView
                challenge={currentChallenge}
                savedCode={savedCode}
                onBack={handleBackToLevels}
                onCodeChange={handleCodeChange}
                onLevelComplete={handleLevelComplete}
            />
        );
    }

    if (selectedLanguage && levels.length > 0) {
        return (
            <LevelSelector
                language={selectedLanguage}
                levels={levels}
                onSelectLevel={handleSelectLevel}
                onBack={handleBackToLanguages}
            />
        );
    }

    return (
        <LanguageSelector
            languages={languages}
            onSelectLanguage={handleSelectLanguage}
        />
    );
}
