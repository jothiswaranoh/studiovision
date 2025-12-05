// Game-related type definitions

export type GameLanguage = 'html' | 'css' | 'python' | 'ruby' | 'javascript' | 'linux';

export interface Level {
    id: string;
    name: string;
    path: string;
    completed: boolean;
    locked: boolean;
    order: number;
}

export interface Challenge {
    language: GameLanguage;
    levelId: string;
    readmeContent: string;
    starterCode: string;
    testFile?: string;
    checkScript?: string;
}

export interface LanguageInfo {
    id: GameLanguage;
    name: string;
    description: string;
    icon: string;
    color: string;
    totalLevels: number;
    completedLevels: number;
}

export interface GameProgress {
    [language: string]: {
        [levelId: string]: {
            completed: boolean;
            completedAt?: string;
            code?: string;
        };
    };
}

export interface TestResult {
    passed: boolean;
    message: string;
    details?: string[];
    output?: string[];
}
