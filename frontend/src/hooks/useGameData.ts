import { useState, useEffect, useCallback } from 'react';
import { GameLanguage, Level, Challenge, LanguageInfo } from '../types/games';
import {
    getAvailableLanguages,
    getLevelsForLanguage,
    loadChallenge,
} from '../services/gameLoader';

/**
 * Hook for loading and managing game data
 */
export function useGameData(progressData: Record<string, any> = {}) {
    const [languages, setLanguages] = useState<LanguageInfo[]>([]);
    const [selectedLanguage, setSelectedLanguage] = useState<GameLanguage | null>(null);
    const [levels, setLevels] = useState<Level[]>([]);
    const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load available languages on mount
    useEffect(() => {
        const availableLanguages = getAvailableLanguages(progressData);
        setLanguages(availableLanguages);
    }, [progressData]);

    /**
     * Select a language and load its levels
     */
    const selectLanguage = useCallback((language: GameLanguage) => {
        setSelectedLanguage(language);
        const languageLevels = getLevelsForLanguage(language);

        // Update locked status based on progress
        const updatedLevels = languageLevels.map((level, index) => {
            const isCompleted = progressData[language]?.[level.id]?.completed || false;
            const previousCompleted = index === 0 || progressData[language]?.[languageLevels[index - 1].id]?.completed || false;

            return {
                ...level,
                completed: isCompleted,
                locked: index > 0 && !previousCompleted,
            };
        });

        setLevels(updatedLevels);
        setCurrentChallenge(null);
    }, [progressData]);

    /**
     * Load a specific challenge
     */
    const loadChallengeData = useCallback(async (language: GameLanguage, levelId: string) => {
        setLoading(true);
        setError(null);

        try {
            const challenge = await loadChallenge(language, levelId);
            setCurrentChallenge(challenge);
        } catch (err) {
            console.error('Error loading challenge:', err);
            setError('Failed to load challenge. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Go back to language selection
     */
    const backToLanguages = useCallback(() => {
        setSelectedLanguage(null);
        setLevels([]);
        setCurrentChallenge(null);
    }, []);

    /**
     * Go back to level selection
     */
    const backToLevels = useCallback(() => {
        setCurrentChallenge(null);
    }, []);

    return {
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
    };
}
