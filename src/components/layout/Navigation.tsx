'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import LanguageToggle from '@/components/ui/LanguageToggle';
import type { SiteConfig } from '@/lib/config';
import { useLocaleStore } from '@/lib/stores/localeStore';
import type { I18nRuntimeConfig } from '@/types/i18n';

interface NavigationProps {
  items: SiteConfig['navigation'];
  siteTitle: string;
  enableOnePageMode?: boolean;
  i18n: I18nRuntimeConfig;
  itemsByLocale?: Record<string, SiteConfig['navigation']>;
  siteTitleByLocale?: Record<string, string>;
}

export default function Navigation({
  items,
  enableOnePageMode,
  i18n,
  itemsByLocale,
}: NavigationProps) {
  const pathname = usePathname();
  const locale = useLocaleStore((state) => state.locale);
  const [mobileOpen, setMobileOpen] = useState(false);
  const resolvedLocale = i18n.enabled ? locale : i18n.defaultLocale;

  const effectiveItems = useMemo(() => {
    return itemsByLocale?.[resolvedLocale] || itemsByLocale?.[i18n.defaultLocale] || items;
  }, [i18n.defaultLocale, items, itemsByLocale, resolvedLocale]);

  const isItemActive = (item: SiteConfig['navigation'][number]) => {
    if (enableOnePageMode) {
      return pathname === '/' && item.target === 'about';
    }

    return item.href === '/'
      ? pathname === '/'
      : pathname.startsWith(item.href);
  };

  const getHref = (item: SiteConfig['navigation'][number]) =>
    enableOnePageMode ? `/#${item.target}` : item.href;

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="site-nav"
    >
      <div className="site-nav__inner">
        <div className="site-nav__desktop">
          {effectiveItems.map((item) => (
            <Link
              key={item.target}
              href={getHref(item)}
              prefetch={true}
              className={`site-nav__link ${isItemActive(item) ? 'is-active' : ''}`}
            >
              {item.title}
            </Link>
          ))}
          {i18n.enabled && i18n.switcher ? <LanguageToggle i18n={i18n} /> : null}
          <ThemeToggle />
        </div>

        <div className="site-nav__mobile-controls">
          {i18n.enabled && i18n.switcher ? <LanguageToggle i18n={i18n} /> : null}
          <ThemeToggle />
          <button
            type="button"
            className="site-nav__mobile-button"
            aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="site-nav__mobile-panel"
          >
            <div className="site-nav__mobile-panel-inner">
              {effectiveItems.map((item) => (
                <Link
                  key={item.target}
                  href={getHref(item)}
                  prefetch={true}
                  className={`site-nav__link ${isItemActive(item) ? 'is-active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
