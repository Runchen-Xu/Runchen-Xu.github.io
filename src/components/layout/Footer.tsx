'use client';

import { useLocaleStore } from '@/lib/stores/localeStore';
import { useMessages } from '@/lib/i18n/useMessages';

interface FooterProps {
  lastUpdated?: string;
  lastUpdatedByLocale?: Record<string, string | undefined>;
  defaultLocale?: string;
}

export default function Footer({ lastUpdated, lastUpdatedByLocale, defaultLocale = 'en' }: FooterProps) {
  const locale = useLocaleStore((state) => state.locale);
  const messages = useMessages();

  const resolvedLastUpdated =
    lastUpdatedByLocale?.[locale] ||
    (defaultLocale ? lastUpdatedByLocale?.[defaultLocale] : undefined) ||
    lastUpdated ||
    new Date().toLocaleDateString(locale || 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <footer className="border-t border-[rgba(139,94,52,0.16)] bg-transparent dark:border-[rgba(244,239,230,0.08)]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-neutral-500">
            {messages.footer.lastUpdated}: {resolvedLastUpdated}
          </p>
          <p className="text-[0.72rem] uppercase tracking-[0.14em] text-neutral-500 flex items-center">
            <a href="https://github.com/xyjoey/PRISM" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
              {messages.footer.builtWithPrism}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
