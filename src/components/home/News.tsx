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
      transition={{ duration: 0.45 }}
      className="section-block"
    >
      <h2 className="section-heading">{resolvedTitle}</h2>
      <table className="news-table">
        <tbody>
          {items.map((item, index) => (
            <tr key={`${item.date}-${index}`}>
              <th scope="row">{item.date}</th>
              <td>
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.content}
                  </a>
                ) : (
                  item.content
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.section>
  );
}
