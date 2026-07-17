'use client';

import { motion } from 'framer-motion';
import { useMessages } from '@/lib/i18n/useMessages';

export interface NewsItem {
    date: string;
    content: string;
    url?: string;
}

interface NewsProps {
    items: NewsItem[];
    title?: string;
}

export default function News({ items, title }: NewsProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.news;
    const usePanels = items.length <= 2;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            <div className="mb-6">
                <span className="section-kicker mb-4">Recent Activity</span>
                <h2 className="section-title mt-4 text-primary">{resolvedTitle}</h2>
            </div>
            {usePanels ? (
                <div className="space-y-4">
                    {items.map((item, index) => (
                        item.url ? (
                            <a
                                key={index}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="paper-panel group block rounded-[1.35rem] px-5 py-5 sm:px-6"
                            >
                                <div className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-accent">
                                    {item.date}
                                </div>
                                <p className="text-[1rem] leading-8 text-neutral-700 transition-colors duration-200 group-hover:text-accent dark:text-neutral-300">
                                    {item.content}
                                </p>
                            </a>
                        ) : (
                            <div key={index} className="paper-panel rounded-[1.35rem] px-5 py-5 sm:px-6">
                                <div className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-accent">
                                    {item.date}
                                </div>
                                <p className="text-[1rem] leading-8 text-neutral-700 dark:text-neutral-300">{item.content}</p>
                            </div>
                        )
                    ))}
                </div>
            ) : (
                <div className="relative ml-1 border-l border-[rgba(139,94,52,0.22)] pl-6 dark:border-[rgba(244,239,230,0.12)] space-y-5">
                    {items.map((item, index) => (
                        item.url ? (
                            <a
                                key={index}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative -left-[1.05rem] flex items-start gap-4 rounded-xl px-4 py-3 transition-colors duration-200 hover:bg-[rgba(139,94,52,0.06)] dark:hover:bg-[rgba(244,239,230,0.04)]"
                            >
                                <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-accent ring-4 ring-[rgba(243,239,229,0.9)] dark:ring-[rgba(20,24,30,0.9)]"></span>
                                <span className="mt-[0.1rem] w-18 flex-shrink-0 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">{item.date}</span>
                                <p className="text-[1rem] leading-7 text-neutral-700 transition-colors duration-200 group-hover:text-accent dark:text-neutral-300">
                                    {item.content}
                                </p>
                            </a>
                        ) : (
                            <div key={index} className="relative -left-[1.05rem] flex items-start gap-4 rounded-xl px-4 py-3">
                                <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-accent/70 ring-4 ring-[rgba(243,239,229,0.9)] dark:ring-[rgba(20,24,30,0.9)]"></span>
                                <span className="mt-[0.1rem] w-18 flex-shrink-0 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">{item.date}</span>
                                <p className="text-[1rem] leading-7 text-neutral-700 dark:text-neutral-300">{item.content}</p>
                            </div>
                        )
                    ))}
                </div>
            )}
        </motion.section>
    );
}
