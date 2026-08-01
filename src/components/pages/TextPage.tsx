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

      <div className="content-markdown">
        <ReactMarkdown
          components={{
            a: ({ ...props }) => (
              <a
                {...props}
                target="_blank"
                rel="noopener noreferrer"
              />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </motion.section>
  );
}
