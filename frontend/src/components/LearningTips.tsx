import { useState } from 'react';
import {
    X,
    Lightbulb,
    RotateCw,
    GitBranch,
    Globe,
    Printer,
    ChevronRight,
} from 'lucide-react';

interface LearningTipsProps {
    onClose: () => void;
}

interface Tip {
    id: string;
    title: string;
    icon: React.ReactNode;
    content: string;
    example: string;
    language: 'javascript' | 'python';
}

const TIPS: Tip[] = [
    {
        id: 'loops',
        title: 'How Loops Work',
        icon: <RotateCw size={16} />,
        content:
            'Loops repeat code blocks multiple times. A "for" loop runs a specific number of times, while a "while" loop runs until a condition is false.',
        example: `for (let i = 0; i < 5; i++) {
  console.log(i);
}`,
        language: 'javascript',
    },
    {
        id: 'conditionals',
        title: 'If/Else Statements',
        icon: <GitBranch size={16} />,
        content:
            'Conditional statements let your program make decisions. The code inside runs only if the condition is true.',
        example: `if (score >= 90) {
  grade = "A";
} else if (score >= 80) {
  grade = "B";
} else {
  grade = "C";
}`,
        language: 'javascript',
    },
    {
        id: 'python-print',
        title: 'Python print()',
        icon: <Printer size={16} />,
        content:
            'The print() function displays output to the console. You can print text, numbers, or variables.',
        example: `name = "Python"
print(f"Hello, {name}!")
print("Learning is fun!")`,
        language: 'python',
    },
    {
        id: 'api-calls',
        title: 'API Calls in JS',
        icon: <Globe size={16} />,
        content:
            "APIs let you fetch data from the internet. Use fetch() or axios to make HTTP requests and get data from servers.",
        example: `const response = await fetch(
  'https://api.example.com/data'
);
const data = await response.json();
console.log(data);`,
        language: 'javascript',
    },
];

export default function LearningTips({ onClose }: LearningTipsProps) {
    const [expandedTip, setExpandedTip] = useState<string | null>(null);

    return (
        <div className="fixed bottom-20 left-4 w-80 max-h-[60vh] rounded-xl glass-effect border border-white/10 shadow-2xl overflow-hidden z-40">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <Lightbulb size={18} className="text-neon-gold" />
                    <span className="font-semibold text-white">Learning Tips</span>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Tips List */}
            <div className="max-h-[calc(60vh-60px)] overflow-y-auto">
                {TIPS.map((tip) => (
                    <div key={tip.id} className="border-b border-white/5 last:border-b-0">
                        <button
                            onClick={() =>
                                setExpandedTip(expandedTip === tip.id ? null : tip.id)
                            }
                            className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/5 transition-colors"
                        >
                            <div
                                className={`p-2 rounded-lg ${tip.language === 'javascript'
                                        ? 'bg-neon-gold/20 text-neon-gold'
                                        : 'bg-success/20 text-success'
                                    }`}
                            >
                                {tip.icon}
                            </div>
                            <div className="flex-1">
                                <div className="text-sm font-medium text-white">
                                    {tip.title}
                                </div>
                                <div className="text-xs text-white/50">
                                    {tip.language === 'javascript' ? 'JavaScript' : 'Python'}
                                </div>
                            </div>
                            <ChevronRight
                                size={16}
                                className={`text-white/30 transition-transform ${expandedTip === tip.id ? 'rotate-90' : ''
                                    }`}
                            />
                        </button>

                        {/* Expanded Content */}
                        {expandedTip === tip.id && (
                            <div className="px-4 pb-4 animate-fadeIn">
                                <p className="text-sm text-white/70 mb-3">{tip.content}</p>
                                <div className="rounded-lg bg-void/50 p-3 font-mono text-xs overflow-x-auto">
                                    <pre className="text-neon-cyan">{tip.example}</pre>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-white/10 bg-void/30">
                <p className="text-xs text-white/40 text-center">
                    💡 Click a tip to see examples
                </p>
            </div>
        </div>
    );
}
