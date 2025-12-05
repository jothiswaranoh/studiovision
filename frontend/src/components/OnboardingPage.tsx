import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Sparkles, Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { LearningProfile } from '../types/auth';
import showToast from './Toast';

type Step = 1 | 2 | 3;

export default function OnboardingPage() {
    const navigate = useNavigate();
    const { user, updateUser } = useAuth();
    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [loading, setLoading] = useState(false);

    // Form state
    const [skillLevel, setSkillLevel] = useState<'beginner' | 'some' | 'intermediate' | 'advanced'>('beginner');
    const [learningArea, setLearningArea] = useState<string[]>([]);
    const [hoursPerDay, setHoursPerDay] = useState<'light' | 'moderate' | 'heavy' | 'intensive'>('moderate');
    const [learningGoal, setLearningGoal] = useState<string[]>([]);

    const totalSteps = 3;
    const progress = (currentStep / totalSteps) * 100;

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep((currentStep + 1) as Step);
        } else {
            handleComplete();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((currentStep - 1) as Step);
        }
    };

    const handleSkip = () => {
        navigate('/');
    };

    const handleComplete = async () => {
        if (!user) return;

        setLoading(true);

        // Map selections to learning profile
        const goals = learningGoal.map(goal => {
            const mapping: Record<string, any> = {
                'frontend': 'web-development',
                'backend': 'web-development',
                'ai-ml': 'ai-ml',
                'fullstack': 'web-development',
                'visual': 'automation',
            };
            return mapping[goal] || 'web-development';
        });

        const languages = learningArea.map(area => {
            const mapping: Record<string, any> = {
                'javascript': 'javascript',
                'python': 'python',
                'frontend': 'javascript',
                'backend': 'javascript',
            };
            return mapping[area] || 'javascript';
        });

        const profile: LearningProfile = {
            goals: goals.length > 0 ? goals : ['web-development'],
            experienceLevel: skillLevel,
            preferredLanguages: languages.length > 0 ? languages : ['javascript'],
            learningStyle: 'visual',
            timeCommitment: hoursPerDay,
        };

        const result = await updateUser({
            learningProfile: profile,
            onboardingComplete: true,
        });

        setLoading(false);

        if (result.success) {
            showToast.success('Profile created! Generating your roadmap...');
            navigate('/roadmap');
        } else {
            showToast.error('Failed to save profile');
        }
    };

    const canProceed = () => {
        if (currentStep === 1) return true; // Skill level always has a default
        if (currentStep === 2) return learningArea.length > 0;
        if (currentStep === 3) return learningGoal.length > 0;
        return false;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0A0A0F] via-[#1A1A2E] to-[#0A0A0F] flex items-center justify-center p-4">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="w-full max-w-4xl relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-purple mb-4">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Let's Personalize Your Learning
                    </h1>
                    <p className="text-white/60">
                        Answer a few questions to get your custom roadmap
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-white/60">Step {currentStep} of {totalSteps}</span>
                        <span className="text-sm text-neon-cyan font-medium">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Content Card */}
                <div className="glass-effect border border-white/10 rounded-2xl p-8 shadow-2xl">
                    {/* Step 1: Skill Level */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white mb-6">
                                What is your current skill level?
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { value: 'beginner', label: 'Beginner', desc: 'Just starting out' },
                                    { value: 'some', label: 'Some Experience', desc: 'Know the basics' },
                                    { value: 'intermediate', label: 'Intermediate', desc: 'Built a few projects' },
                                    { value: 'advanced', label: 'Advanced', desc: 'Professional developer' },
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => setSkillLevel(option.value as any)}
                                        className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${skillLevel === option.value
                                                ? 'border-neon-cyan bg-neon-cyan/10 shadow-lg shadow-neon-cyan/20'
                                                : 'border-white/10 bg-white/5 hover:border-neon-cyan/50 hover:bg-white/10'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="text-lg font-semibold text-white">{option.label}</h3>
                                            {skillLevel === option.value && (
                                                <Check className="w-5 h-5 text-neon-cyan" />
                                            )}
                                        </div>
                                        <p className="text-sm text-white/60">{option.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Learning Area */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    Which area do you want to learn first?
                                </h2>
                                <p className="text-white/60 text-sm">Select one or more</p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[
                                    { value: 'javascript', label: 'JavaScript', icon: '🟨' },
                                    { value: 'python', label: 'Python', icon: '🐍' },
                                    { value: 'frontend', label: 'Frontend', icon: '🎨' },
                                    { value: 'backend', label: 'Backend', icon: '⚙️' },
                                    { value: 'ai-ml', label: 'AI / ML', icon: '🤖' },
                                    { value: 'data-structures', label: 'Data Structures', icon: '📊' },
                                    { value: 'fullstack', label: 'Fullstack', icon: '🚀' },
                                    { value: 'system-design', label: 'System Design', icon: '🏗️' },
                                    { value: 'visual', label: 'Visual Programming', icon: '🎯' },
                                ].map((option) => {
                                    const isSelected = learningArea.includes(option.value);
                                    return (
                                        <button
                                            key={option.value}
                                            onClick={() => {
                                                if (isSelected) {
                                                    setLearningArea(learningArea.filter(a => a !== option.value));
                                                } else {
                                                    setLearningArea([...learningArea, option.value]);
                                                }
                                            }}
                                            className={`p-4 rounded-xl border-2 transition-all duration-300 ${isSelected
                                                    ? 'border-neon-purple bg-neon-purple/10 shadow-lg shadow-neon-purple/20'
                                                    : 'border-white/10 bg-white/5 hover:border-neon-purple/50 hover:bg-white/10'
                                                }`}
                                        >
                                            <div className="text-3xl mb-2">{option.icon}</div>
                                            <div className="text-sm font-medium text-white">{option.label}</div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Learning Goal & Time */}
                    {currentStep === 3 && (
                        <div className="space-y-8">
                            {/* Learning Goal */}
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    What is your learning goal?
                                </h2>
                                <p className="text-white/60 text-sm mb-4">Select all that apply</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {[
                                        { value: 'frontend', label: 'Become a frontend developer' },
                                        { value: 'backend', label: 'Become a backend developer' },
                                        { value: 'fundamentals', label: 'Learn fundamentals' },
                                        { value: 'projects', label: 'Build projects' },
                                        { value: 'ai-basics', label: 'Learn AI basics' },
                                    ].map((option) => {
                                        const isSelected = learningGoal.includes(option.value);
                                        return (
                                            <button
                                                key={option.value}
                                                onClick={() => {
                                                    if (isSelected) {
                                                        setLearningGoal(learningGoal.filter(g => g !== option.value));
                                                    } else {
                                                        setLearningGoal([...learningGoal, option.value]);
                                                    }
                                                }}
                                                className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${isSelected
                                                        ? 'border-neon-gold bg-neon-gold/10'
                                                        : 'border-white/10 bg-white/5 hover:border-neon-gold/50'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${isSelected ? 'border-neon-gold bg-neon-gold' : 'border-white/30'
                                                        }`}>
                                                        {isSelected && <Check className="w-3 h-3 text-void" />}
                                                    </div>
                                                    <span className="text-sm text-white">{option.label}</span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Time Commitment */}
                            <div>
                                <h2 className="text-xl font-bold text-white mb-4">
                                    How many hours per day can you learn?
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {[
                                        { value: 'light', label: '1 hour' },
                                        { value: 'moderate', label: '2 hours' },
                                        { value: 'heavy', label: '3 hours' },
                                        { value: 'intensive', label: 'Weekend only' },
                                    ].map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => setHoursPerDay(option.value as any)}
                                            className={`p-4 rounded-lg border-2 transition-all duration-300 ${hoursPerDay === option.value
                                                    ? 'border-neon-cyan bg-neon-cyan/10'
                                                    : 'border-white/10 bg-white/5 hover:border-neon-cyan/50'
                                                }`}
                                        >
                                            <div className="text-sm font-medium text-white text-center">
                                                {option.label}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                        <div className="flex gap-3">
                            {currentStep > 1 && (
                                <button
                                    onClick={handleBack}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 text-white/80 hover:bg-white/5 transition-all"
                                >
                                    <ChevronLeft size={18} />
                                    Back
                                </button>
                            )}
                            <button
                                onClick={handleSkip}
                                className="px-4 py-2 rounded-lg text-white/60 hover:text-white/80 transition-all"
                            >
                                Skip for now
                            </button>
                        </div>

                        <button
                            onClick={handleNext}
                            disabled={!canProceed() || loading}
                            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-semibold hover:shadow-lg hover:shadow-neon-cyan/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                'Generating...'
                            ) : currentStep === totalSteps ? (
                                <>
                                    Complete
                                    <Check size={18} />
                                </>
                            ) : (
                                <>
                                    Continue
                                    <ChevronRight size={18} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
