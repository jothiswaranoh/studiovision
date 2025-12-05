import { Language } from '../data/blockDefinitions';

/**
 * User authentication and profile types
 */

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'user';
    onboardingComplete: boolean;
    learningProfile?: LearningProfile;
    roadmapId?: string;
    createdAt: string;
    lastLogin: string;
}

export interface LearningProfile {
    goals: LearningGoal[];
    experienceLevel: ExperienceLevel;
    preferredLanguages: Language[];
    learningStyle: LearningStyle;
    timeCommitment: TimeCommitment;
}

export type LearningGoal =
    | 'web-development'
    | 'data-science'
    | 'mobile-apps'
    | 'game-development'
    | 'automation'
    | 'ai-ml';

export type ExperienceLevel = 'beginner' | 'some' | 'intermediate' | 'advanced';

export type LearningStyle = 'visual' | 'hands-on' | 'theory' | 'project';

export type TimeCommitment = 'light' | 'moderate' | 'heavy' | 'intensive';

export interface AuthCredentials {
    email: string;
    password: string;
}

export interface SignupData extends AuthCredentials {
    name: string;
}

export interface AuthResponse {
    success: boolean;
    user?: User;
    error?: string;
}

export interface Session {
    userId: string;
    token: string;
    expiresAt: string;
}
