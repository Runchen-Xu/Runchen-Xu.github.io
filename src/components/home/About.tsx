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

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="section-block"
    >
      <h2 className="section-heading">{resolvedTitle}</h2>
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
