import { GameLanguage, Level, Challenge, LanguageInfo } from '../types/games';

// Import README files statically
// Note: In a real implementation, you might use dynamic imports or fetch
// For now, we'll create a structure that can be populated

const ROADMAP_BASE = '/src/roadmap';

// Language metadata
export const LANGUAGE_INFO: Record<GameLanguage, Omit<LanguageInfo, 'completedLevels'>> = {
    html: {
        id: 'html',
        name: 'HTML',
        description: 'Learn to structure web pages with HTML',
        icon: '🌐',
        color: '#E34F26',
        totalLevels: 6,
    },
    css: {
        id: 'css',
        name: 'CSS',
        description: 'Style your web pages with CSS',
        icon: '🎨',
        color: '#1572B6',
        totalLevels: 6,
    },
    python: {
        id: 'python',
        name: 'Python',
        description: 'Master Python programming fundamentals',
        icon: '🐍',
        color: '#3776AB',
        totalLevels: 6,
    },
    ruby: {
        id: 'ruby',
        name: 'Ruby',
        description: 'Learn Ruby programming language',
        icon: '💎',
        color: '#CC342D',
        totalLevels: 6,
    },
    javascript: {
        id: 'javascript',
        name: 'JavaScript',
        description: 'Learn JavaScript programming',
        icon: '⚡',
        color: '#F7DF1E',
        totalLevels: 6,
    },
    linux: {
        id: 'linux',
        name: 'Linux',
        description: 'Master Linux command line',
        icon: '🐧',
        color: '#FCC624',
        totalLevels: 6,
    },
};

/**
 * Get levels for a specific language
 */
export function getLevelsForLanguage(language: GameLanguage): Level[] {
    const levels: Level[] = [
        { id: 'level1', name: 'Level 1', path: `level1`, completed: false, locked: false, order: 1 },
        { id: 'level2', name: 'Level 2', path: `level2`, completed: false, locked: true, order: 2 },
        { id: 'level3', name: 'Level 3', path: `level3`, completed: false, locked: true, order: 3 },
        { id: 'level4', name: 'Level 4', path: `level4`, completed: false, locked: true, order: 4 },
        { id: 'level5', name: 'Level 5', path: `level5`, completed: false, locked: true, order: 5 },
        { id: 'final_challenge', name: 'Final Challenge', path: `final_challenge`, completed: false, locked: true, order: 6 },
    ];

    return levels;
}

/**
 * Load README content for a specific challenge
 * In a real app, this would fetch from the file system or API
 */
export async function loadChallengeReadme(language: GameLanguage, levelId: string): Promise<string> {
    try {
        // Attempt to dynamically import the README
        const readmePath = `/src/roadmap/${language}/${levelId}/README.md`;

        // For now, we'll use fetch to load the file
        const response = await fetch(readmePath);
        if (response.ok) {
            return await response.text();
        }

        // Fallback content
        return `# ${LANGUAGE_INFO[language].name} - ${levelId}\n\nChallenge content loading...`;
    } catch (error) {
        console.error('Error loading README:', error);
        return `# Error Loading Challenge\n\nCould not load challenge content for ${language} - ${levelId}`;
    }
}

/**
 * Load starter code for a challenge
 */
export async function loadStarterCode(language: GameLanguage, levelId: string): Promise<string> {
    try {
        let fileName = '';
        switch (language) {
            case 'html':
                fileName = 'index.html';
                break;
            case 'css':
                fileName = 'style.css';
                break;
            case 'python':
                fileName = 'script.py';
                break;
            case 'ruby':
                fileName = 'script.rb';
                break;
            case 'javascript':
                fileName = 'script.js';
                break;
            case 'linux':
                fileName = 'commands.sh';
                break;
        }

        const codePath = `/src/roadmap/${language}/${levelId}/${fileName}`;
        const response = await fetch(codePath);

        if (response.ok) {
            return await response.text();
        }

        // Return default starter code based on language
        return getDefaultStarterCode(language);
    } catch (error) {
        console.error('Error loading starter code:', error);
        return getDefaultStarterCode(language);
    }
}

/**
 * Get default starter code for a language
 */
function getDefaultStarterCode(language: GameLanguage): string {
    const defaults: Record<GameLanguage, string> = {
        html: '<!DOCTYPE html>\n<html>\n<head>\n    <title>My Page</title>\n</head>\n<body>\n    <!-- Your code here -->\n</body>\n</html>',
        css: '/* Your CSS code here */\n\nbody {\n    margin: 0;\n    padding: 0;\n}',
        python: '# Your Python code here\n\ndef main():\n    pass\n\nif __name__ == "__main__":\n    main()',
        ruby: '# Your Ruby code here\n\ndef main\nend\n\nmain',
        javascript: '// Your JavaScript code here\n\nfunction main() {\n    \n}\n\nmain();',
        linux: '#!/bin/bash\n# Your Linux commands here\n',
    };

    return defaults[language] || '// Start coding...';
}

/**
 * Load complete challenge data
 */
export async function loadChallenge(language: GameLanguage, levelId: string): Promise<Challenge> {
    const [readmeContent, starterCode] = await Promise.all([
        loadChallengeReadme(language, levelId),
        loadStarterCode(language, levelId),
    ]);

    return {
        language,
        levelId,
        readmeContent,
        starterCode,
    };
}

/**
 * Get all available languages with progress
 */
export function getAvailableLanguages(progress: Record<string, any> = {}): LanguageInfo[] {
    return Object.values(LANGUAGE_INFO).map(lang => {
        const langProgress = progress[lang.id] || {};
        const completedLevels = Object.values(langProgress).filter((l: any) => l.completed).length;

        return {
            ...lang,
            completedLevels,
        };
    });
}
