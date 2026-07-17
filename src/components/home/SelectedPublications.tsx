'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Publication } from '@/types/publication';
import { useMessages } from '@/lib/i18n/useMessages';
import FormattedBibTeXText from '@/components/publications/FormattedBibTeXText';

interface SelectedPublicationsProps {
    publications: Publication[];
    title?: string;
    enableOnePageMode?: boolean;
}

function formatVenueAndYear(pub: Publication): string {
    const venue = pub.journal || pub.conference || '';
    if (!venue) {
        return pub.year ? String(pub.year) : '';
    }

    return pub.year && !venue.includes(String(pub.year))
        ? `${venue} ${pub.year}`
        : venue;
}

export default function SelectedPublications({ publications, title, enableOnePageMode = false }: SelectedPublicationsProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.selectedPublications;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className="flex items-end justify-between gap-4 mb-6">
                <div>
                    <span className="section-kicker mb-4">Research Archive</span>
                    <h2 className="section-title mt-4 text-primary">{resolvedTitle}</h2>
                </div>
                <Link
                    href={enableOnePageMode ? "/#publications" : "/publications"}
                    prefetch={true}
                    className="shrink-0 text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-accent transition-colors duration-200 hover:text-accent-dark"
                >
                    {messages.home.viewAll}
                </Link>
            </div>
            <div className="scholar-rule">
                {publications.map((pub, index) => (
                    <motion.div
                        key={pub.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className="grid gap-3 md:grid-cols-[5.5rem_minmax(0,1fr)] py-5 border-b border-[rgba(139,94,52,0.15)] dark:border-[rgba(244,239,230,0.08)]"
                    >
                        <div className="text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-accent/80 pt-1">
                            {pub.year}
                        </div>
                        <div>
                            <h3 className="font-serif text-[1.18rem] font-bold text-primary mb-2 leading-tight">
                                <FormattedBibTeXText nodes={pub.titleNodes} fallback={pub.title} />
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-500 mb-2 leading-7">
                                {pub.authors.map((author, idx) => (
                                    <span key={idx}>
                                        <span className={`${author.isHighlighted ? 'font-semibold text-accent' : ''} ${author.isCoAuthor ? `underline underline-offset-4 ${author.isHighlighted ? 'decoration-accent' : 'decoration-neutral-400'}` : ''}`}>
                                            {author.name}
                                        </span>
                                        {author.isCorresponding && (
                                            <sup className={`ml-0 ${author.isHighlighted ? 'text-accent' : 'text-neutral-600 dark:text-neutral-500'}`}>†</sup>
                                        )}
                                        {idx < pub.authors.length - 1 && ', '}
                                    </span>
                                ))}
                            </p>
                            <p className="text-[0.92rem] text-neutral-700 dark:text-neutral-400 mb-2">
                                {formatVenueAndYear(pub)}
                            </p>
                            {pub.description && (
                                <p className="text-sm text-neutral-500 dark:text-neutral-500 leading-7">
                                    {pub.description}
                                </p>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}
