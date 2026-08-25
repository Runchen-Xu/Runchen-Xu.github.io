'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useMessages } from '@/lib/i18n/useMessages';

export interface NewsItem {
  date: string;
  content: string;
  url?: string;
}

interface NewsProps {
  items: NewsItem[];
  title?: string;
  embedded?: boolean;
}

export default function News({ items, title, embedded = false }: NewsProps) {
  const messages = useMessages();
  const resolvedTitle = title || messages.home.news;

  const renderNewsContent = (item: NewsItem) => {
    const body = (
      <ReactMarkdown
        components={{
          p: ({ children }) => <>{children}</>,
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
    );

    if (item.url) {
      return (
        <a href={item.url} target="_blank" rel="noopener noreferrer">
          {body}
        </a>
      );
    }

    return body;
  };

  if (embedded) {
    return (
      <div className="home-news">
        <h2 className="home-news__heading">{resolvedTitle}</h2>
        <ul className="home-news__list">
          {items.map((item, index) => (
            <li key={`${item.date}-${index}`} className="home-news__item">
              <div className="home-news__date">{item.date}</div>
              <div className="home-news__content">{renderNewsContent(item)}</div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

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
              <td>{renderNewsContent(item)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.section>
  );
}
