/**
 * Learning roadmap and task types
 */

export interface Roadmap {
    id: string;
    userId: string;
    title: string;
    description: string;
    milestones: Milestone[];
    progress: number; // 0-100
    createdAt: string;
    updatedAt: string;
}

export interface Milestone {
    id: string;
    title: string;
    description: string;
    tasks: Task[];
    completed: boolean;
    order: number;
    icon: string;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    type: TaskType;
    difficulty: Difficulty;
    estimatedTime: number; // minutes
    completed: boolean;
    completedAt?: string;
    blocks?: string[]; // Block types to pre-load
    hints?: string[];
    solution?: string;
    validationCriteria?: ValidationCriteria;
}

export type TaskType = 'tutorial' | 'challenge' | 'project' | 'quiz';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface ValidationCriteria {
    requiredBlocks?: string[]; // Must use these block types
    minBlocks?: number;
    maxBlocks?: number;
    mustConnect?: boolean; // Blocks must be connected
    outputMatches?: string; // Expected console output
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt: string;
}

export interface UserProgress {
    userId: string;
    roadmapId: string;
    completedTasks: string[];
    completedMilestones: string[];
    achievements: Achievement[];
    streak: number; // Days
    lastActivityDate: string;
    totalTimeSpent: number; // minutes
}
