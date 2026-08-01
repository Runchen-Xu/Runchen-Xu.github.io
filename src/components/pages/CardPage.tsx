'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { CardPageConfig } from '@/types/page';

export default function CardPage({ config, embedded = false }: { config: CardPageConfig; embedded?: boolean }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className={embedded ? '' : 'site-page site-page--inner'}
    >
      <h1 className="page-title">
        <strong>{config.title.split(' ')[0]}</strong>
        {config.title.includes(' ') ? ` ${config.title.split(' ').slice(1).join(' ')}` : ''}
      </h1>
      {config.description ? (
        <p className="page-intro">{config.description}</p>
      ) : null}

      <div className="timeline-list">
        {config.items.map((item, index) => (
          <motion.article
            key={`${item.title}-${index}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.04 }}
            className="timeline-item"
          >
            <div className="timeline-item__date">{item.date}</div>
            <div>
              <div className="timeline-item__title">{item.title}</div>
              {item.subtitle ? <div className="timeline-item__subtitle">{item.subtitle}</div> : null}
              {item.content ? (
                <div className="timeline-item__body">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-0">{children}</p>,
                      a: ({ ...props }) => (
                        <a
                          {...props}
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      ),
                    }}
                  >
                    {item.content}
                  </ReactMarkdown>
                </div>
              ) : null}
              {item.tags?.length ? (
                <div className="timeline-item__tags">{item.tags.join(' · ')}</div>
              ) : null}
            </div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}
