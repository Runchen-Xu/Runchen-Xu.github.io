'use client';

import { motion } from 'framer-motion';
import { useMessages } from '@/lib/i18n/useMessages';

export interface NewsItem {
  date: string;
  content?: string;
  url?: string;
  link_text?: string;
  before_link?: string;
  after_link?: string;
}

const newsSymbols = ['✦', '◇', '✧', '◈', '✳', '⊹'];

function getNewsSymbol(item: NewsItem): string {
  const key = `${item.date}-${item.content}`;
  const hash = Array.from(key).reduce((value, character) => (
    (value * 31 + character.charCodeAt(0)) >>> 0
  ), 0);

  return newsSymbols[hash % newsSymbols.length];
}

function renderNewsContent(item: NewsItem) {
  if (item.url && item.link_text) {
    const link = (
      <a href={item.url} target="_blank" rel="noopener noreferrer">
        {item.link_text}
      </a>
    );

    if (item.before_link !== undefined || item.after_link !== undefined) {
      return <>{item.before_link}{link}{item.after_link}</>;
    }

    return <>{link}: {item.content}</>;
  }

  if (item.url) {
    return (
      <a href={item.url} target="_blank" rel="noopener noreferrer">
        {item.content}
      </a>
    );
  }

  return item.content;
}

interface NewsProps {
  items: NewsItem[];
  title?: string;
  embedded?: boolean;
}

export default function News({ items, title, embedded = false }: NewsProps) {
  const messages = useMessages();
  const resolvedTitle = title || messages.home.news;

  if (embedded) {
    return (
      <div className="home-news">
        <h2 className="home-news__heading">{resolvedTitle}</h2>
        <ul className="home-news__list">
          {items.map((item, index) => (
            <li key={`${item.date}-${index}`} className="home-news__item">
              <div className="home-news__date">{item.date}</div>
              <div className="home-news__content">
                <span className="news-symbol" aria-hidden="true">{getNewsSymbol(item)}</span>
                {renderNewsContent(item)}
              </div>
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
              <td>
                <span className="news-symbol" aria-hidden="true">{getNewsSymbol(item)}</span>
                {renderNewsContent(item)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.section>
  );
}
