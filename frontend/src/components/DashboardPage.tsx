
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Code2, Database, Map, Gamepad2, Trophy,
    Flame, Clock, ArrowRight, Github
} from 'lucide-react';

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();

    const MENU_ITEMS = [
        {
            title: 'Code Studio',
            description: 'Interactive Drag & Drop IDE. Build logic vertically.',
            icon: Code2,
            color: 'blue',
            path: '/studio',
            category: 'IDE'
        },
        {
            title: 'SQL Vision',
            description: 'Analyze, Visualize & Simulate SQL Executions.',
            icon: Database,
            color: 'emerald',
            path: '/studio?mode=databases', // We will handle this query param
            category: 'ANALYZER'
        },
        {
            title: 'Learning Path',
            description: 'Your personalized roadmap to mastery.',
            icon: Map,
            color: 'purple',
            path: '/roadmap',
            category: 'LEARNING'
        },
        {
            title: 'Arcade',
            description: 'Mini-games to reinforce coding concepts.',
            icon: Gamepad2,
            color: 'orange',
            path: '/games',
            category: 'PRACTICE'
        }
    ];

    return (
        <div className="min-h-screen bg-[#0B1120] text-slate-200 font-sans selection:bg-blue-500/30">
            {/* Header */}
            <header className="h-16 border-b border-white/5 bg-slate-900/50 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
                        <Code2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                        StudioVision
                    </span>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20">
                        <Flame className="w-4 h-4 text-orange-500 fill-orange-500/50" />
                        <span className="text-xs font-bold text-orange-400">12 Day Streak</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 border-2 border-slate-900 ring-2 ring-white/10" />
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-8 py-12">

                {/* Hero Section */}
                <div className="mb-16 relative">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-white to-slate-500 bg-clip-text text-transparent">
                        Welcome back, Creator.
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mb-8 leading-relaxed">
                        Your journey continues. You have <span className="text-white font-semibold">3 pending challenges</span> and your SQL proficiency has increased by <span className="text-emerald-400 font-semibold">+15%</span> this week.
                    </p>

                    {/* Quick Actions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                        {MENU_ITEMS.map((item) => (
                            <div
                                key={item.title}
                                onClick={() => navigate(item.path)}
                                className={`
                  group relative p-6 rounded-2xl border border-white/5 bg-slate-900/50 hover:bg-slate-800/80 
                  backdrop-blur-sm transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-2xl
                  hover:shadow-${item.color}-500/10
                `}
                            >
                                <div className={`
                  mb-4 w-12 h-12 rounded-xl flex items-center justify-center
                  bg-${item.color}-500/10 text-${item.color}-400 group-hover:scale-110 transition-transform duration-300
                `}>
                                    <item.icon className="w-6 h-6" />
                                </div>

                                <div className="text-[10px] font-bold tracking-widest text-slate-500 mb-2 uppercase">
                                    {item.category}
                                </div>

                                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-${item.color}-400 transition-colors">
                                    {item.title}
                                </h3>

                                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                                    {item.description}
                                </p>

                                <div className={`
                  flex items-center gap-2 text-xs font-bold text-${item.color}-400 
                  opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300
                `}>
                                    <span>Launch</span>
                                    <ArrowRight className="w-3 h-3" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats & Progress */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Recent Activity */}
                    <div className="lg:col-span-2 p-8 rounded-2xl border border-white/5 bg-slate-900/30 backdrop-blur-sm">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-400" />
                            Recent Activity
                        </h2>

                        <div className="space-y-4">
                            {[
                                { title: 'Optimized Inner Join Query', type: 'SQL', date: '2 hours ago', xp: '+50 XP' },
                                { title: 'Completed "Python Loop" Challenge', type: 'CODE', date: 'Yesterday', xp: '+100 XP' },
                                { title: 'Debugged "Missing Where Clause"', type: 'PRACTICE', date: '2 days ago', xp: '+30 XP' }
                            ].map((act, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`
                        w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs
                        ${act.type === 'SQL' ? 'bg-emerald-500/20 text-emerald-400' :
                                                act.type === 'CODE' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'}
                      `}>
                                            {act.type}
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-slate-200">{act.title}</h4>
                                            <span className="text-xs text-slate-500">{act.date}</span>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">{act.xp}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Gamification Stats */}
                    <div className="p-8 rounded-2xl border border-white/5 bg-gradient-to-br from-slate-900/80 to-blue-900/10 backdrop-blur-sm">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-yellow-400" />
                            Your Rank
                        </h2>

                        <div className="flex flex-col items-center mb-8">
                            <div className="w-24 h-24 rounded-full border-4 border-yellow-500/20 flex items-center justify-center mb-3 relative">
                                <Trophy className="w-10 h-10 text-yellow-400" />
                                <div className="absolute -bottom-2 bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    LEVEL 5
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-white">Code Artisan</h3>
                            <p className="text-sm text-slate-400">Top 5% of Learners</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-400">Next Level</span>
                                    <span className="text-white font-bold">2,450 / 3,000 XP</span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-[80%]" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-4">
                                <div className="bg-slate-950/50 p-3 rounded-lg text-center">
                                    <div className="text-lg font-bold text-white">12</div>
                                    <div className="text-[10px] text-slate-500 uppercase">Badges</div>
                                </div>
                                <div className="bg-slate-950/50 p-3 rounded-lg text-center">
                                    <div className="text-lg font-bold text-white">45</div>
                                    <div className="text-[10px] text-slate-500 uppercase">Problems</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
