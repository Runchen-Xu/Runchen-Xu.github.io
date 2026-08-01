'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Publication } from '@/types/publication';
import { PublicationPageConfig } from '@/types/page';
import FormattedBibTeXText from './FormattedBibTeXText';

interface PublicationsListProps {
  config: PublicationPageConfig;
  publications: Publication[];
  embedded?: boolean;
}

function formatVenueAndYear(pub: Publication): string {
  const venue = pub.journal || pub.conference || '';
  if (!venue) return pub.year ? String(pub.year) : '';

  return pub.year && !venue.includes(String(pub.year))
    ? `${venue}, ${pub.year}`
    : venue;
}

function getVenueBadge(pub: Publication): string | null {
  const venue = pub.conference || pub.journal || '';
  const normalizedVenue = venue.toLowerCase();

  if (normalizedVenue.includes('internet of things journal')) {
    return 'IoTJ';
  }

  if (normalizedVenue.includes('global communications conference')) {
    return 'Globecom';
  }

  if (normalizedVenue.includes('personal, indoor and mobile radio communications')) {
    return 'PIMRC';
  }

  if (normalizedVenue.includes('ecml pkdd')) {
    return 'ECML PKDD';
  }

  const parenthetical = venue.match(/\(([^)]+)\)/);
  if (parenthetical?.[1]) {
    return parenthetical[1];
  }

  const leadingCaps = venue.match(/[A-Z]{2,}(?:\s+[A-Z]{2,})*/);
  return leadingCaps?.[0] || null;
}

function renderAuthorList(publication: Publication) {
  return publication.authors.map((author, index) => (
    <span key={`${author.name}-${index}`}>
      <span className={author.isHighlighted ? 'is-highlighted' : undefined}>
        {author.name}
      </span>
      {author.isCorresponding ? <sup>†</sup> : null}
      {index < publication.authors.length - 1 && ', '}
    </span>
  ));
}

function renderLinks(pub: Publication) {
  const links = [
    pub.arxivId ? { label: 'arXiv', href: `https://arxiv.org/abs/${pub.arxivId}` } : null,
    pub.pdfUrl ? { label: 'PDF', href: pub.pdfUrl } : null,
    pub.code ? { label: 'Code', href: pub.code } : null,
    pub.url ? { label: 'Link', href: pub.url } : null,
    pub.doi ? { label: 'DOI', href: `https://doi.org/${pub.doi}` } : null,
  ].filter(Boolean) as Array<{ label: string; href: string }>;

  if (links.length === 0) {
    return null;
  }

  return (
    <div className="pub-links">
      {links.map((link) => (
        <a
          key={`${pub.id}-${link.label}`}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="pub-links__button"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}

export default function PublicationsList({ config, publications, embedded = false }: PublicationsListProps) {
  const sortedPublications = [...publications].sort((a, b) => b.year - a.year);
  const grouped = sortedPublications.reduce<Record<number, Publication[]>>((acc, publication) => {
    if (!acc[publication.year]) {
      acc[publication.year] = [];
    }
    acc[publication.year].push(publication);
    return acc;
  }, {});

  const years = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a);

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
      {config.description ? <p className="page-intro">{config.description}</p> : null}

      {years.map((year) => (
        <section key={year}>
          <h2 className="pub-year-heading">{year}</h2>
          <ol className="pub-list">
            {grouped[year].map((pub, index) => {
              const badge = getVenueBadge(pub);
              return (
                <motion.li
                  key={pub.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                >
                  <article className="pub-entry">
                    <div className="pub-entry__media">
                      {badge ? <span className="pub-entry__badge">{badge}</span> : null}
                      {pub.preview ? (
                        <div className="pub-entry__preview">
                          <Image
                            src={`/papers/${pub.preview}`}
                            alt={pub.title}
                            width={560}
                            height={280}
                          />
                        </div>
                      ) : null}
                    </div>

                    <div className="pub-entry__content">
                      <h3 className="pub-entry__title">
                        <FormattedBibTeXText nodes={pub.titleNodes} fallback={pub.title} />
                      </h3>
                      <p className="pub-entry__authors">{renderAuthorList(pub)}</p>
                      <p className="pub-entry__meta">{formatVenueAndYear(pub)}</p>
                      {pub.description ? (
                        <p className="pub-entry__summary">{pub.description}</p>
                      ) : null}
                      {renderLinks(pub)}
                    </div>
                  </article>
                </motion.li>
              );
            })}
          </ol>
        </section>
      ))}
    </motion.section>
  );
}
