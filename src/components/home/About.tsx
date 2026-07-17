'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useMessages } from '@/lib/i18n/useMessages';

interface AboutProps {
    content: string;
    title?: string;
}

export default function About({ content, title }: AboutProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.about;
    const [leadBlock, ...restBlocks] = content.trim().split(/\n\s*\n/);
    const remainingContent = restBlocks.join('\n\n');

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
        >
            <div className="mb-6">
                <span className="section-kicker mb-4">Research Profile</span>
                <h2 className="section-title mt-4 text-primary">{resolvedTitle}</h2>
            </div>

            {leadBlock && (
                <div className="paper-panel lead-panel max-w-4xl rounded-[1.5rem] px-6 py-6 sm:px-8 sm:py-7 mb-8">
                    <ReactMarkdown
                        components={{
                            p: ({ children }) => <p className="lead-markdown text-[1.12rem] sm:text-[1.18rem] leading-9 text-primary dark:text-primary-light">{children}</p>,
                            a: ({ ...props }) => (
                                <a
                                    {...props}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-accent font-medium underline decoration-accent/40 underline-offset-4 transition-colors duration-200 hover:text-accent-dark"
                                />
                            ),
                            strong: ({ children }) => <strong className="font-semibold text-primary dark:text-primary-light">{children}</strong>,
                            em: ({ children }) => <em className="italic text-neutral-600 dark:text-neutral-500">{children}</em>,
                        }}
                    >
                        {leadBlock}
                    </ReactMarkdown>
                </div>
            )}

            <div className="prose-editorial text-neutral-700 dark:text-neutral-600 leading-relaxed max-w-4xl">
                <ReactMarkdown
                    components={{
                        h1: ({ children }) => <h1 className="text-3xl font-serif font-bold text-primary mt-10 mb-4">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-2xl font-serif font-bold text-primary mt-10 mb-4 pb-2 scholar-rule">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-xl font-semibold text-primary mt-8 mb-3">{children}</h3>,
                        p: ({ children }) => <p className="mb-5 last:mb-0 text-[1.02rem] leading-8">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-inside mb-5 space-y-2 ml-4">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside mb-5 space-y-2 ml-4">{children}</ol>,
                        li: ({ children }) => <li className="mb-1">{children}</li>,
                        a: ({ ...props }) => (
                            <a
                                {...props}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent font-medium underline decoration-accent/40 underline-offset-4 transition-colors duration-200 hover:text-accent-dark"
                            />
                        ),
                        blockquote: ({ children }) => (
                            <blockquote className="border-l-2 border-accent/50 pl-5 italic my-6 text-neutral-600 dark:text-neutral-500">
                                {children}
                            </blockquote>
                        ),
                        strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                        em: ({ children }) => <em className="italic text-neutral-600 dark:text-neutral-500">{children}</em>,
                    }}
                >
                    {remainingContent}
                </ReactMarkdown>
            </div>
        </motion.section>
    );
}
