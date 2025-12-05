import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronRight,
    Clock,
    CheckCircle2,
    Circle,
    Trophy,
    Target,
    Zap,
    ArrowRight,
    Loader2,
    Sparkles,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Roadmap, Task } from '../types/roadmap';
import { generateRoadmap, getRoadmap, getProgress } from '../services/roadmapService';
import showToast from './Toast';

export default function RoadmapPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null);

    useEffect(() => {
        loadRoadmap();
    }, [user]);

    const loadRoadmap = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setLoading(true);

        // Check if roadmap exists
        let existingRoadmap = getRoadmap(user.id);

        if (!existingRoadmap && user.learningProfile) {
            // Generate new roadmap
            existingRoadmap = await generateRoadmap(user.id, user.learningProfile);
            showToast.success('Your personalized roadmap is ready!');
        }

        setRoadmap(existingRoadmap);

        // Auto-expand first incomplete milestone
        if (existingRoadmap) {
            const firstIncomplete = existingRoadmap.milestones.find(m => !m.completed);
            if (firstIncomplete) {
                setExpandedMilestone(firstIncomplete.id);
            }
        }

        setLoading(false);
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return 'text-green-400 bg-green-400/10 border-green-400/30';
            case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
            case 'hard': return 'text-red-400 bg-red-400/10 border-red-400/30';
            default: return 'text-white/60 bg-white/10 border-white/30';
        }
    };

    const getTaskIcon = (type: string) => {
        switch (type) {
            case 'tutorial': return '📖';
            case 'challenge': return '⚔️';
            case 'project': return '🚀';
            case 'quiz': return '❓';
            default: return '📝';
        }
    };

    const handleStartTask = (task: Task) => {
        showToast.success(`Starting: ${task.title}`);
        navigate('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0A0A0F] via-[#1A1A2E] to-[#0A0A0F] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-neon-cyan animate-spin mx-auto mb-4" />
                    <p className="text-white/60">Generating your roadmap...</p>
                </div>
            </div>
        );
    }

    if (!roadmap) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0A0A0F] via-[#1A1A2E] to-[#0A0A0F] flex items-center justify-center p-4">
                <div className="text-center">
                    <p className="text-white/60 mb-4">No roadmap found</p>
                    <button
                        onClick={() => navigate('/onboarding')}
                        className="px-6 py-3 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-semibold"
                    >
                        Complete Onboarding
                    </button>
                </div>
            </div>
        );
    }

    const progress = getProgress(user!.id);
    const nextTask = roadmap.milestones
        .flatMap(m => m.tasks)
        .find(t => !t.completed);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0A0A0F] via-[#1A1A2E] to-[#0A0A0F]">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative z-10">
                {/* Header */}
                <div className="border-b border-white/10 bg-surface/50 backdrop-blur-xl">
                    <div className="max-w-7xl mx-auto px-6 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                                    <Sparkles className="w-8 h-8 text-neon-cyan" />
                                    {roadmap.title}
                                </h1>
                                <p className="text-white/60">{roadmap.description}</p>
                            </div>
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-semibold hover:shadow-lg hover:shadow-neon-cyan/50 transition-all duration-300"
                            >
                                Enter Visual IDE
                                <ArrowRight size={18} />
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-white/60">Overall Progress</span>
                                <span className="text-sm text-neon-cyan font-medium">{roadmap.progress}%</span>
                            </div>
                            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple transition-all duration-500"
                                    style={{ width: `${roadmap.progress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content - Roadmap */}
                        <div className="lg:col-span-2 space-y-6">
                            {roadmap.milestones.map((milestone) => {
                                const isExpanded = expandedMilestone === milestone.id;
                                const completedTasks = milestone.tasks.filter(t => t.completed).length;
                                const totalTasks = milestone.tasks.length;
                                const milestoneProgress = Math.round((completedTasks / totalTasks) * 100);

                                return (
                                    <div
                                        key={milestone.id}
                                        className="glass-effect border border-white/10 rounded-2xl overflow-hidden"
                                    >
                                        {/* Milestone Header */}
                                        <button
                                            onClick={() => setExpandedMilestone(isExpanded ? null : milestone.id)}
                                            className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-all"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="text-4xl">{milestone.icon}</div>
                                                <div className="text-left">
                                                    <h3 className="text-xl font-bold text-white mb-1">
                                                        {milestone.title}
                                                    </h3>
                                                    <p className="text-sm text-white/60">{milestone.description}</p>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <span className="text-xs text-white/40">
                                                            {completedTasks} / {totalTasks} tasks
                                                        </span>
                                                        <div className="h-1 w-24 bg-white/10 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-neon-cyan"
                                                                style={{ width: `${milestoneProgress}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <ChevronRight
                                                className={`w-6 h-6 text-white/40 transition-transform ${isExpanded ? 'rotate-90' : ''
                                                    }`}
                                            />
                                        </button>

                                        {/* Tasks */}
                                        {isExpanded && (
                                            <div className="border-t border-white/10 p-4 space-y-3">
                                                {milestone.tasks.map((task) => (
                                                    <div
                                                        key={task.id}
                                                        className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-neon-cyan/30 transition-all"
                                                    >
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-3 mb-2">
                                                                    <span className="text-2xl">{getTaskIcon(task.type)}</span>
                                                                    <h4 className="text-lg font-semibold text-white">
                                                                        {task.title}
                                                                    </h4>
                                                                    {task.completed && (
                                                                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                                                                    )}
                                                                </div>
                                                                <p className="text-sm text-white/60 mb-3">
                                                                    {task.description}
                                                                </p>
                                                                <div className="flex items-center gap-3 flex-wrap">
                                                                    <span className={`px-2 py-1 rounded text-xs border ${getDifficultyColor(task.difficulty)}`}>
                                                                        {task.difficulty}
                                                                    </span>
                                                                    <span className="flex items-center gap-1 text-xs text-white/60">
                                                                        <Clock size={12} />
                                                                        {task.estimatedTime} min
                                                                    </span>
                                                                    <span className="px-2 py-1 rounded text-xs bg-white/10 text-white/60">
                                                                        {task.type}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => handleStartTask(task)}
                                                                disabled={task.completed}
                                                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${task.completed
                                                                    ? 'bg-green-500/20 text-green-400 cursor-default'
                                                                    : 'bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan hover:text-void'
                                                                    }`}
                                                            >
                                                                {task.completed ? 'Completed' : 'Start'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Next Up Card */}
                            {nextTask && (
                                <div className="glass-effect border border-neon-cyan/30 rounded-2xl p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Target className="w-5 h-5 text-neon-cyan" />
                                        <h3 className="text-lg font-bold text-white">Recommended Next</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">{getTaskIcon(nextTask.type)}</span>
                                            <p className="text-white font-medium">{nextTask.title}</p>
                                        </div>
                                        <p className="text-sm text-white/60">{nextTask.description}</p>
                                        <button
                                            onClick={() => handleStartTask(nextTask)}
                                            className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-semibold hover:shadow-lg hover:shadow-neon-cyan/50 transition-all"
                                        >
                                            Start Now
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Stats Card */}
                            {progress && (
                                <div className="glass-effect border border-white/10 rounded-2xl p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Trophy className="w-5 h-5 text-neon-gold" />
                                        <h3 className="text-lg font-bold text-white">Your Progress</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-white/60">Tasks Completed</span>
                                            <span className="text-white font-bold">{progress.completedTasks.length}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-white/60">Current Streak</span>
                                            <span className="text-neon-gold font-bold">{progress.streak} days 🔥</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-white/60">Time Spent</span>
                                            <span className="text-white font-bold">{Math.round(progress.totalTimeSpent / 60)}h</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Weekly Plan */}
                            <div className="glass-effect border border-white/10 rounded-2xl p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Zap className="w-5 h-5 text-neon-purple" />
                                    <h3 className="text-lg font-bold text-white">This Week's Plan</h3>
                                </div>
                                <div className="space-y-2">
                                    {roadmap.milestones
                                        .flatMap(m => m.tasks)
                                        .filter(t => !t.completed)
                                        .slice(0, 3)
                                        .map((task) => (
                                            <div key={task.id} className="flex items-center gap-3 text-sm">
                                                <Circle className="w-4 h-4 text-white/40" />
                                                <span className="text-white/80">{task.title}</span>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
