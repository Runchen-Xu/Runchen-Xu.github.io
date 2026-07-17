'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { CardPageConfig } from '@/types/page';

const markdownComponents = {
    p: ({ children }: React.ComponentProps<'p'>) => <p className="mb-3 last:mb-0">{children}</p>,
    ul: ({ children }: React.ComponentProps<'ul'>) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
    ol: ({ children }: React.ComponentProps<'ol'>) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
    li: ({ children }: React.ComponentProps<'li'>) => <li className="mb-1">{children}</li>,
    a: ({ ...props }) => (
        <a
            {...props}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent font-medium underline decoration-accent/40 underline-offset-4 transition-colors duration-200 hover:text-accent-dark"
        />
    ),
    blockquote: ({ children }: React.ComponentProps<'blockquote'>) => (
        <blockquote className="border-l-4 border-accent/50 pl-4 italic my-4 text-neutral-600 dark:text-neutral-500">
            {children}
        </blockquote>
    ),
    strong: ({ children }: React.ComponentProps<'strong'>) => <strong className="handwritten-strong text-primary">{children}</strong>,
    em: ({ children }: React.ComponentProps<'em'>) => <em className="italic">{children}</em>,
    code: ({ children }: React.ComponentProps<'code'>) => (
        <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[0.95em]">{children}</code>
    ),
};

export default function CardPage({ config, embedded = false }: { config: CardPageConfig; embedded?: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className={embedded ? "mb-6" : "mb-10"}>
                <span className="section-kicker mb-4">Academic Highlights</span>
                <h1 className="section-title text-primary">{config.title}</h1>
                {config.description && (
                    <div className={`${embedded ? "text-base" : "text-lg"} text-neutral-600 dark:text-neutral-500 max-w-3xl leading-8 mt-4`}>
                        <ReactMarkdown components={markdownComponents}>
                            {config.description}
                        </ReactMarkdown>
                    </div>
                )}
            </div>

            <div className="scholar-rule">
                {config.items.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className={`grid gap-3 border-b border-[rgba(107,91,78,0.14)] py-5 dark:border-[rgba(244,239,230,0.08)] ${item.date ? "md:grid-cols-[7rem_minmax(0,1fr)]" : ""}`}
                    >
                        {item.date ? (
                            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-accent pt-1">
                                {item.date}
                            </div>
                        ) : null}
                        <div>
                            <div className="mb-2 flex justify-between items-start gap-4">
                                <h3 className={`${embedded ? "text-lg" : "text-xl"} font-serif font-bold text-primary leading-tight`}>{item.title}</h3>
                            </div>
                            {item.subtitle && (
                                <p className={`${embedded ? "text-sm" : "text-base"} text-neutral-700 dark:text-neutral-400 font-medium mb-3`}>{item.subtitle}</p>
                            )}
                            {item.content && (
                                <div className={`${embedded ? "text-sm" : "text-base"} text-neutral-600 dark:text-neutral-500 leading-7`}>
                                    <ReactMarkdown components={markdownComponents}>
                                        {item.content}
                                    </ReactMarkdown>
                                </div>
                            )}
                            {item.tags && (
                                <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs uppercase tracking-[0.12em] text-neutral-500">
                                    {item.tags.map(tag => (
                                        <span key={tag}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
