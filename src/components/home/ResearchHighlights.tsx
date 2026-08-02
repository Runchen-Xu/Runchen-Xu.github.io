'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useMessages } from '@/lib/i18n/useMessages';

export interface ResearchCard {
  title: string;
  summary: string;
  image: string;
  tags?: string[];
}

interface ResearchHighlightsProps {
  cards: ResearchCard[];
}

export default function ResearchHighlights({ cards }: ResearchHighlightsProps) {
  const messages = useMessages();

  if (cards.length === 0) {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="section-block"
    >
      <h2 className="section-heading">{messages.home.research}</h2>

      <div className="research-cards" aria-label={messages.home.research}>
        {cards.map((card, index) => (
          <motion.article
            key={card.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="research-card"
          >
            <div className="research-card__media">
              <Image
                src={card.image}
                alt={card.title}
                width={224}
                height={224}
                className="research-card__image"
              />
            </div>

            <div className="research-card__content">
              <h3 className="research-card__title">{card.title}</h3>
              <p className="research-card__summary">
                <strong>TL;DR:</strong> {card.summary}
              </p>

              {card.tags?.length ? (
                <div className="research-card__tags">
                  {card.tags.map((tag) => (
                    <span key={tag} className="research-card__tag">
                      {tag}
                      <ArrowRight size={15} strokeWidth={2.1} />
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}
