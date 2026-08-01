'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import {
  EnvelopeIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/solid';
import { Github, Linkedin } from 'lucide-react';
import type { SiteConfig } from '@/lib/config';

const OrcidIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z" />
  </svg>
);

interface ProfileProps {
  author: SiteConfig['author'];
  social: SiteConfig['social'];
  bioContent: string;
}

function splitName(name: string): { lead: string; rest: string } {
  const trimmed = name.trim();
  const [first, ...remaining] = trimmed.split(/\s+/);

  return {
    lead: first || trimmed,
    rest: remaining.join(' '),
  };
}

export default function Profile({ author, social, bioContent }: ProfileProps) {
  const { lead, rest } = splitName(author.name);

  const socialLinks = [
    ...(social.email ? [{
      name: 'Email',
      href: `mailto:${social.email}`,
      icon: EnvelopeIcon,
    }] : []),
    ...(social.google_scholar ? [{
      name: 'Google Scholar',
      href: social.google_scholar,
      icon: AcademicCapIcon,
    }] : []),
    ...(social.orcid ? [{
      name: 'ORCID',
      href: social.orcid,
      icon: OrcidIcon,
    }] : []),
    ...(social.github ? [{
      name: 'GitHub',
      href: social.github,
      icon: Github,
    }] : []),
    ...(social.linkedin ? [{
      name: 'LinkedIn',
      href: social.linkedin,
      icon: Linkedin,
    }] : []),
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="home-intro"
    >
      <div className="home-intro__header">
        <h1 className="home-intro__title">
          <strong>{lead}</strong>
          {rest ? ` ${rest}` : ''}
        </h1>
        <a
          href={social.location_url || 'https://www.auckland.ac.nz/'}
          target="_blank"
          rel="noopener noreferrer"
          className="home-intro__institution"
        >
          {author.institution}
        </a>
      </div>

      <div className="home-intro__grid">
        <div>
          <div className="home-intro__body">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p>{children}</p>,
                a: ({ ...props }) => (
                  <a
                    {...props}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                ),
              }}
            >
              {bioContent}
            </ReactMarkdown>
          </div>

          <div className="home-social" aria-label="Social links">
            {socialLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.name}
                  aria-label={link.name}
                >
                  <IconComponent className="h-10 w-10" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="home-intro__image-shell">
          <div className="home-intro__image-frame">
            <Image
              src={author.avatar}
              alt={author.name}
              width={640}
              height={640}
              className="home-intro__image"
              priority
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
