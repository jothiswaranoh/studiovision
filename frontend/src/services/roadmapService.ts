import { Roadmap, Milestone, UserProgress } from '../types/roadmap';
import { LearningProfile } from '../types/auth';

/**
 * Roadmap Service
 * Generates personalized learning roadmaps based on user profile
 */

const STORAGE_KEYS = {
    ROADMAPS: 'visual_ide_roadmaps',
    PROGRESS: 'visual_ide_progress',
};

// Generate unique ID
function generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate roadmap based on learning profile
 */
export async function generateRoadmap(userId: string, profile: LearningProfile): Promise<Roadmap> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const milestones: Milestone[] = [];

    // Milestone 1: Getting Started
    milestones.push({
        id: generateId(),
        title: '🚀 Getting Started',
        description: 'Learn the basics and set up your environment',
        order: 1,
        completed: false,
        icon: '🚀',
        tasks: [
            {
                id: generateId(),
                title: 'Welcome to Visual Programming',
                description: 'Learn how to use the visual IDE and create your first program',
                type: 'tutorial',
                difficulty: 'easy',
                estimatedTime: 15,
                completed: false,
                blocks: ['start', 'print'],
                hints: [
                    'Drag blocks from the sidebar to the canvas',
                    'Connect blocks to create a flow',
                    'Click Run to execute your program',
                ],
            },
            {
                id: generateId(),
                title: 'Understanding Variables',
                description: 'Learn how to store and use data in your programs',
                type: 'tutorial',
                difficulty: 'easy',
                estimatedTime: 20,
                completed: false,
                blocks: ['variable', 'print'],
                hints: [
                    'Variables store values that can change',
                    'Give your variables meaningful names',
                    'Use print to see variable values',
                ],
            },
            {
                id: generateId(),
                title: 'Your First Challenge',
                description: 'Create a program that greets the user by name',
                type: 'challenge',
                difficulty: 'easy',
                estimatedTime: 15,
                completed: false,
                validationCriteria: {
                    requiredBlocks: ['variable', 'print'],
                    minBlocks: 2,
                    mustConnect: true,
                },
            },
        ],
    });

    // Milestone 2: Control Flow
    if (profile.experienceLevel !== 'beginner') {
        milestones.push({
            id: generateId(),
            title: '🔀 Control Flow',
            description: 'Master conditions and loops',
            order: 2,
            completed: false,
            icon: '🔀',
            tasks: [
                {
                    id: generateId(),
                    title: 'If-Else Statements',
                    description: 'Learn how to make decisions in your code',
                    type: 'tutorial',
                    difficulty: 'medium',
                    estimatedTime: 25,
                    completed: false,
                    blocks: ['if', 'else', 'variable'],
                },
                {
                    id: generateId(),
                    title: 'Loops and Iteration',
                    description: 'Repeat actions efficiently with loops',
                    type: 'tutorial',
                    difficulty: 'medium',
                    estimatedTime: 30,
                    completed: false,
                    blocks: ['for', 'while', 'print'],
                },
                {
                    id: generateId(),
                    title: 'Build a Number Guessing Game',
                    description: 'Combine conditions and loops to create an interactive game',
                    type: 'project',
                    difficulty: 'medium',
                    estimatedTime: 45,
                    completed: false,
                    validationCriteria: {
                        requiredBlocks: ['if', 'while', 'variable'],
                        minBlocks: 5,
                    },
                },
            ],
        });
    }

    // Milestone 3: Functions
    milestones.push({
        id: generateId(),
        title: '⚡ Functions & Modularity',
        description: 'Write reusable code with functions',
        order: 3,
        completed: false,
        icon: '⚡',
        tasks: [
            {
                id: generateId(),
                title: 'Creating Functions',
                description: 'Learn to organize code into reusable functions',
                type: 'tutorial',
                difficulty: profile.experienceLevel === 'beginner' ? 'medium' : 'easy',
                estimatedTime: 30,
                completed: false,
                blocks: ['function', 'return'],
            },
            {
                id: generateId(),
                title: 'Function Parameters',
                description: 'Pass data to functions and get results back',
                type: 'tutorial',
                difficulty: 'medium',
                estimatedTime: 25,
                completed: false,
                blocks: ['function', 'parameter', 'return'],
            },
            {
                id: generateId(),
                title: 'Build a Calculator',
                description: 'Create a calculator using functions',
                type: 'project',
                difficulty: 'medium',
                estimatedTime: 60,
                completed: false,
                validationCriteria: {
                    requiredBlocks: ['function'],
                    minBlocks: 4,
                },
            },
        ],
    });

    // Milestone 4: Data Structures (if intermediate+)
    if (profile.experienceLevel === 'intermediate' || profile.experienceLevel === 'advanced') {
        milestones.push({
            id: generateId(),
            title: '📊 Data Structures',
            description: 'Work with arrays, objects, and collections',
            order: 4,
            completed: false,
            icon: '📊',
            tasks: [
                {
                    id: generateId(),
                    title: 'Arrays and Lists',
                    description: 'Store and manipulate collections of data',
                    type: 'tutorial',
                    difficulty: 'medium',
                    estimatedTime: 35,
                    completed: false,
                    blocks: ['array', 'for'],
                },
                {
                    id: generateId(),
                    title: 'Objects and Dictionaries',
                    description: 'Organize data with key-value pairs',
                    type: 'tutorial',
                    difficulty: 'medium',
                    estimatedTime: 30,
                    completed: false,
                    blocks: ['object', 'variable'],
                },
                {
                    id: generateId(),
                    title: 'Build a Todo List',
                    description: 'Create a todo list manager using arrays',
                    type: 'project',
                    difficulty: 'hard',
                    estimatedTime: 90,
                    completed: false,
                },
            ],
        });
    }

    // Milestone 5: Final Project
    milestones.push({
        id: generateId(),
        title: '🎯 Capstone Project',
        description: 'Build a complete application',
        order: milestones.length + 1,
        completed: false,
        icon: '🎯',
        tasks: [
            {
                id: generateId(),
                title: 'Plan Your Project',
                description: 'Design and plan your final project',
                type: 'tutorial',
                difficulty: 'easy',
                estimatedTime: 30,
                completed: false,
            },
            {
                id: generateId(),
                title: 'Build Your Application',
                description: 'Implement your project using everything you\'ve learned',
                type: 'project',
                difficulty: 'hard',
                estimatedTime: 180,
                completed: false,
                validationCriteria: {
                    minBlocks: 10,
                    mustConnect: true,
                },
            },
            {
                id: generateId(),
                title: 'Share Your Work',
                description: 'Export and share your completed project',
                type: 'tutorial',
                difficulty: 'easy',
                estimatedTime: 15,
                completed: false,
            },
        ],
    });

    const roadmap: Roadmap = {
        id: generateId(),
        userId,
        title: `${profile.experienceLevel.charAt(0).toUpperCase() + profile.experienceLevel.slice(1)} Learning Path`,
        description: `Personalized roadmap for ${profile.goals.join(', ')}`,
        milestones,
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    // Save roadmap
    saveRoadmap(roadmap);

    // Initialize progress
    const progress: UserProgress = {
        userId,
        roadmapId: roadmap.id,
        completedTasks: [],
        completedMilestones: [],
        achievements: [],
        streak: 0,
        lastActivityDate: new Date().toISOString(),
        totalTimeSpent: 0,
    };
    saveProgress(progress);

    return roadmap;
}

/**
 * Get roadmap for user
 */
export function getRoadmap(userId: string): Roadmap | null {
    const roadmaps = getAllRoadmaps();
    return roadmaps.find(r => r.userId === userId) || null;
}

/**
 * Get user progress
 */
export function getProgress(userId: string): UserProgress | null {
    const allProgress = getAllProgress();
    return allProgress.find(p => p.userId === userId) || null;
}

/**
 * Complete a task
 */
export function completeTask(userId: string, taskId: string): void {
    const progress = getProgress(userId);
    if (!progress) return;

    if (!progress.completedTasks.includes(taskId)) {
        progress.completedTasks.push(taskId);
        progress.lastActivityDate = new Date().toISOString();
        saveProgress(progress);

        // Update roadmap progress
        const roadmap = getRoadmap(userId);
        if (roadmap) {
            updateRoadmapProgress(roadmap);
        }
    }
}

/**
 * Update roadmap progress percentage
 */
function updateRoadmapProgress(roadmap: Roadmap): void {
    const totalTasks = roadmap.milestones.reduce((sum, m) => sum + m.tasks.length, 0);
    const completedTasks = roadmap.milestones.reduce(
        (sum, m) => sum + m.tasks.filter(t => t.completed).length,
        0
    );
    roadmap.progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    roadmap.updatedAt = new Date().toISOString();
    saveRoadmap(roadmap);
}

// Storage helpers
function getAllRoadmaps(): Roadmap[] {
    const json = localStorage.getItem(STORAGE_KEYS.ROADMAPS);
    return json ? JSON.parse(json) : [];
}

function saveRoadmap(roadmap: Roadmap): void {
    const roadmaps = getAllRoadmaps();
    const index = roadmaps.findIndex(r => r.id === roadmap.id);
    if (index >= 0) {
        roadmaps[index] = roadmap;
    } else {
        roadmaps.push(roadmap);
    }
    localStorage.setItem(STORAGE_KEYS.ROADMAPS, JSON.stringify(roadmaps));
}

function getAllProgress(): UserProgress[] {
    const json = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return json ? JSON.parse(json) : [];
}

function saveProgress(progress: UserProgress): void {
    const allProgress = getAllProgress();
    const index = allProgress.findIndex(p => p.userId === progress.userId);
    if (index >= 0) {
        allProgress[index] = progress;
    } else {
        allProgress.push(progress);
    }
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(allProgress));
}
