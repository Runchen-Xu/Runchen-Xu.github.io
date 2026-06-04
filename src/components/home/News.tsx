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

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">{resolvedTitle}</h2>
            <div className="space-y-3">
                {items.map((item, index) => (
                    item.url ? (
                        <a
                            key={index}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-start space-x-3 rounded-lg px-1 py-1 transition-colors duration-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
                        >
                            <span className="text-xs text-neutral-500 mt-1 w-16 flex-shrink-0">{item.date}</span>
                            <p className="text-sm text-neutral-700 dark:text-neutral-300 transition-colors duration-200 group-hover:text-accent">
                                {item.content}
                            </p>
                        </a>
                    ) : (
                        <div key={index} className="flex items-start space-x-3">
                            <span className="text-xs text-neutral-500 mt-1 w-16 flex-shrink-0">{item.date}</span>
                            <p className="text-sm text-neutral-700 dark:text-neutral-300">{item.content}</p>
                        </div>
                    )
                ))}
            </div>
        </motion.section>
    );
}
