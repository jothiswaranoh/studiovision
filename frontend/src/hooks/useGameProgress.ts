import { useState, useEffect, useCallback } from 'react';
import { GameProgress, GameLanguage } from '../types/games';

const STORAGE_KEY = 'code_playground_game_progress';

/**
 * Hook for managing game progress with localStorage persistence
 */
export function useGameProgress() {
    const [progress, setProgress] = useState<GameProgress>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.error('Error loading game progress:', error);
            return {};
        }
    });

    // Save progress to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        } catch (error) {
            console.error('Error saving game progress:', error);
        }
    }, [progress]);

    /**
     * Mark a level as completed
     */
    const completeLevel = useCallback((language: GameLanguage, levelId: string, code?: string) => {
        setProgress(prev => ({
            ...prev,
            [language]: {
                ...prev[language],
                [levelId]: {
                    completed: true,
                    completedAt: new Date().toISOString(),
                    code,
                },
            },
        }));
    }, []);

    /**
     * Save code for a level without marking as completed
     */
    const saveCode = useCallback((language: GameLanguage, levelId: string, code: string) => {
        setProgress(prev => ({
            ...prev,
            [language]: {
                ...prev[language],
                [levelId]: {
                    ...(prev[language]?.[levelId] || { completed: false }),
                    code,
                },
            },
        }));
    }, []);

    /**
     * Check if a level is completed
     */
    const isLevelCompleted = useCallback((language: GameLanguage, levelId: string): boolean => {
        return progress[language]?.[levelId]?.completed || false;
    }, [progress]);

    /**
     * Get saved code for a level
     */
    const getSavedCode = useCallback((language: GameLanguage, levelId: string): string | undefined => {
        return progress[language]?.[levelId]?.code;
    }, [progress]);

    /**
     * Get completion count for a language
     */
    const getCompletionCount = useCallback((language: GameLanguage): number => {
        const langProgress = progress[language] || {};
        return Object.values(langProgress).filter(level => level.completed).length;
    }, [progress]);

    /**
     * Get overall progress statistics
     */
    const getStats = useCallback(() => {
        const languages = Object.keys(progress);
        const totalCompleted = languages.reduce((sum, lang) => {
            return sum + getCompletionCount(lang as GameLanguage);
        }, 0);

        return {
            languagesStarted: languages.length,
            totalCompleted,
            progress,
        };
    }, [progress, getCompletionCount]);

    /**
     * Reset all progress
     */
    const resetProgress = useCallback(() => {
        setProgress({});
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    /**
     * Reset progress for a specific language
     */
    const resetLanguage = useCallback((language: GameLanguage) => {
        setProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[language];
            return newProgress;
        });
    }, []);

    return {
        progress,
        completeLevel,
        saveCode,
        isLevelCompleted,
        getSavedCode,
        getCompletionCount,
        getStats,
        resetProgress,
        resetLanguage,
    };
}
