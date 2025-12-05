import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ReadmeViewerProps {
    content: string;
}

export default function ReadmeViewer({ content }: ReadmeViewerProps) {
    return (
        <div className="h-full overflow-y-auto scrollbar-thin bg-surface/30 backdrop-blur-sm">
            <div className="prose prose-invert max-w-none p-6">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        h1: ({ children }) => (
                            <h1 className="text-3xl font-orbitron font-bold text-white mb-4 flex items-center gap-3">
                                <span className="w-1 h-8 bg-gradient-to-b from-neon-cyan to-neon-purple rounded-full" />
                                {children}
                            </h1>
                        ),
                        h2: ({ children }) => (
                            <h2 className="text-2xl font-orbitron font-semibold text-white/90 mt-6 mb-3">
                                {children}
                            </h2>
                        ),
                        h3: ({ children }) => (
                            <h3 className="text-xl font-semibold text-white/80 mt-4 mb-2">
                                {children}
                            </h3>
                        ),
                        p: ({ children }) => (
                            <p className="text-white/70 leading-relaxed mb-4">
                                {children}
                            </p>
                        ),
                        strong: ({ children }) => (
                            <strong className="text-neon-cyan font-semibold">
                                {children}
                            </strong>
                        ),
                        code: ({ inline, children, ...props }: any) => {
                            if (inline) {
                                return (
                                    <code className="px-1.5 py-0.5 rounded bg-white/10 text-neon-cyan text-sm font-mono border border-white/10">
                                        {children}
                                    </code>
                                );
                            }
                            return (
                                <code
                                    className="block p-4 rounded-lg bg-void/80 text-white/90 text-sm font-mono overflow-x-auto border border-white/10"
                                    {...props}
                                >
                                    {children}
                                </code>
                            );
                        },
                        pre: ({ children }) => (
                            <pre className="mb-4 rounded-lg overflow-hidden">
                                {children}
                            </pre>
                        ),
                        ul: ({ children }) => (
                            <ul className="list-disc list-inside text-white/70 mb-4 space-y-2">
                                {children}
                            </ul>
                        ),
                        ol: ({ children }) => (
                            <ol className="list-decimal list-inside text-white/70 mb-4 space-y-2">
                                {children}
                            </ol>
                        ),
                        li: ({ children }) => (
                            <li className="ml-4">
                                {children}
                            </li>
                        ),
                        blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-neon-purple pl-4 italic text-white/60 my-4">
                                {children}
                            </blockquote>
                        ),
                        a: ({ href, children }) => (
                            <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-neon-cyan hover:text-neon-purple transition-colors underline"
                            >
                                {children}
                            </a>
                        ),
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </div>
    );
}
