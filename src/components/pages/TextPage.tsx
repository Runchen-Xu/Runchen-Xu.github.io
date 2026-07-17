'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { TextPageConfig } from '@/types/page';

interface TextPageProps {
    config: TextPageConfig;
    content: string;
    embedded?: boolean;
}

export default function TextPage({ config, content, embedded = false }: TextPageProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={embedded ? "" : "max-w-4xl mx-auto"}
        >
            <div className={embedded ? "mb-6" : "mb-10"}>
                <span className="section-kicker mb-4">Academic Record</span>
                <h1 className={`${embedded ? "section-title text-primary" : "section-title text-primary"}`}>{config.title}</h1>
            </div>
            {config.description && (
                <p className={`${embedded ? "text-base" : "text-lg"} text-neutral-600 dark:text-neutral-500 mb-8 max-w-3xl leading-8`}>
                    {config.description}
                </p>
            )}
            <div className="prose-editorial text-neutral-700 dark:text-neutral-600 leading-relaxed">
                <ReactMarkdown
                    components={{
                        h1: ({ children }) => <h1 className="font-handwritten text-[2.3rem] font-bold text-primary mt-10 mb-4 leading-none">{children}</h1>,
                        h2: ({ children }) => <h2 className="font-handwritten text-[2rem] font-bold text-primary mt-10 mb-4 pb-2 scholar-rule leading-none">{children}</h2>,
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
                        strong: ({ children }) => <strong className="handwritten-strong text-primary">{children}</strong>,
                        em: ({ children }) => <em className="italic text-neutral-600 dark:text-neutral-500">{children}</em>,
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </motion.div>
    );
}
