import { useState } from 'react';
import {
    Sparkles,
    Wand2,
    ArrowRightLeft,
    MessageCircle,
    X,
} from 'lucide-react';
import { Language } from '../data/blockDefinitions';

interface FloatingActionsProps {
    language: Language;
    onConvert: () => void;
}

export default function FloatingActions({
    language,
    onConvert,
}: FloatingActionsProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const getConvertLabel = () => {
        if (language === 'javascript') return 'Convert to Python';
        if (language === 'python') return 'Convert to JavaScript';
        return 'Convert Code';
    };

    const actions = [
        {
            id: 'generate',
            icon: <Wand2 size={18} />,
            label: 'Generate Code',
            color: 'neon-purple',
            onClick: () => alert('Code generation triggered from diagram!'),
        },
        {
            id: 'explain',
            icon: <MessageCircle size={18} />,
            label: 'Explain Visually',
            color: 'neon-cyan',
            onClick: () => alert('Visual explanation mode activated!'),
        },
        {
            id: 'convert',
            icon: <ArrowRightLeft size={18} />,
            label: getConvertLabel(),
            color: 'neon-gold',
            onClick: onConvert,
        },
    ];

    return (
        <div className="fixed bottom-8 right-8 z-50">
            {/* Expanded Actions */}
            <div
                className={`flex flex-col-reverse gap-3 mb-3 transition-all duration-300 ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                    }`}
            >
                {actions.map((action) => (
                    <button
                        key={action.id}
                        onClick={action.onClick}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl glass-effect border border-white/10 hover:border-${action.color}/50 text-white shadow-lg hover:shadow-${action.color}/20 transition-all duration-300 hover:scale-105 group`}
                    >
                        <div
                            className={`text-${action.color} group-hover:scale-110 transition-transform`}
                        >
                            {action.icon}
                        </div>
                        <span className="text-sm font-medium">{action.label}</span>
                    </button>
                ))}
            </div>

            {/* Main FAB */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${isExpanded
                    ? 'bg-white/10 border border-white/20 rotate-45'
                    : 'bg-gradient-to-br from-neon-cyan via-neon-purple to-neon-pink shadow-neon-multi'
                    }`}
            >
                {isExpanded ? (
                    <X size={24} className="text-white" />
                ) : (
                    <Sparkles size={24} className="text-void" />
                )}
            </button>

            {/* Glow effect */}
            {!isExpanded && (
                <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-neon-cyan via-neon-purple to-neon-pink blur-xl opacity-50 animate-pulse" />
            )}
        </div>
    );
}
