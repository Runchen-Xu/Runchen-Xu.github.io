'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import LanguageToggle from '@/components/ui/LanguageToggle';
import type { SiteConfig } from '@/lib/config';
import { useLocaleStore } from '@/lib/stores/localeStore';
import { useMessages } from '@/lib/i18n/useMessages';
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
  siteTitle,
  enableOnePageMode,
  i18n,
  itemsByLocale,
  siteTitleByLocale,
}: NavigationProps) {
  const pathname = usePathname();
  const locale = useLocaleStore((state) => state.locale);
  const [scrolled, setScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState('');
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const messages = useMessages();
  const navContainerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
    top: number;
    height: number;
  } | null>(null);
  const resolvedLocale = i18n.enabled ? locale : i18n.defaultLocale;

  const effectiveItems = useMemo(() => {
    return itemsByLocale?.[resolvedLocale] || itemsByLocale?.[i18n.defaultLocale] || items;
  }, [i18n.defaultLocale, items, itemsByLocale, resolvedLocale]);

  const effectiveSiteTitle = useMemo(() => {
    return siteTitleByLocale?.[resolvedLocale] || siteTitleByLocale?.[i18n.defaultLocale] || siteTitle;
  }, [i18n.defaultLocale, resolvedLocale, siteTitle, siteTitleByLocale]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const visibleSections = useRef(new Set<string>());

  useEffect(() => {
    if (enableOnePageMode) {
      setActiveHash(window.location.hash);
      const handleHashChange = () => setActiveHash(window.location.hash);
      window.addEventListener('hashchange', handleHashChange);

      visibleSections.current.clear();

      const observerCallback = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSections.current.add(entry.target.id);
          } else {
            visibleSections.current.delete(entry.target.id);
          }
        });

        const firstVisible = effectiveItems.find(
          (item) => item.type === 'page' && visibleSections.current.has(item.target)
        );
        if (firstVisible) {
          setActiveHash(firstVisible.target === 'about' ? '' : `#${firstVisible.target}`);
        }
      };

      const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0,
      };

      const observer = new IntersectionObserver(observerCallback, observerOptions);

      effectiveItems.forEach((item) => {
        if (item.type === 'page') {
          const element = document.getElementById(item.target);
          if (element) observer.observe(element);
        }
      });

      return () => {
        window.removeEventListener('hashchange', handleHashChange);
        observer.disconnect();
      };
    }
  }, [enableOnePageMode, effectiveItems]);

  const isDesktopItemActive = (item: SiteConfig['navigation'][number]) =>
    enableOnePageMode
      ? activeHash === `#${item.target}` || (!activeHash && item.target === 'about')
      : (item.href === '/'
        ? pathname === '/'
        : pathname.startsWith(item.href));

  const getDesktopItemHref = (item: SiteConfig['navigation'][number]) =>
    enableOnePageMode ? `/#${item.target}` : item.href;

  const activeItem = effectiveItems.find((item) => isDesktopItemActive(item)) ?? null;
  const activeHref = activeItem ? getDesktopItemHref(activeItem) : null;
  const indicatorHref = hoveredHref ?? activeHref;

  const measureIndicator = useCallback(() => {
    const container = navContainerRef.current;
    if (!container || !indicatorHref) {
      setIndicatorStyle(null);
      return;
    }
    const el = container.querySelector<HTMLElement>(
      `[data-nav-href="${CSS.escape(indicatorHref)}"]`
    );
    if (!el) {
      setIndicatorStyle(null);
      return;
    }
    setIndicatorStyle({
      left: el.offsetLeft,
      width: el.offsetWidth,
      top: el.offsetTop,
      height: el.offsetHeight,
    });
  }, [indicatorHref]);

  useEffect(() => {
    measureIndicator();
  }, [measureIndicator]);

  useEffect(() => {
    window.addEventListener('resize', measureIndicator);
    return () => window.removeEventListener('resize', measureIndicator);
  }, [measureIndicator]);

  return (
    <Disclosure as="nav" className="fixed top-0 left-0 right-0 z-50">
      {({ open }) => (
        <>
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
            className={cn(
              'transition-all duration-300 ease-out',
              scrolled
                ? 'nav-on-image border-b border-[rgba(107,91,78,0.12)] dark:border-[rgba(244,239,230,0.08)]'
                : 'bg-transparent'
            )}
          >
            <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
              <div className="flex justify-between items-center h-16 lg:h-[4.75rem]">
                <motion.div
                  className="flex-shrink-0"
                >
                  <Link
                    href="/"
                    className="text-[1.05rem] lg:text-[1.15rem] display-sans font-semibold uppercase tracking-[0.16em] text-primary hover:text-accent transition-colors duration-200"
                  >
                    {effectiveSiteTitle}
                  </Link>
                </motion.div>

                <div className="hidden lg:block">
                  <div className="ml-10 flex items-center space-x-4">
                    <div
                      ref={navContainerRef}
                      className="relative flex items-baseline space-x-1"
                      onMouseLeave={() => setHoveredHref(null)}
                    >
                      {indicatorStyle && (
                        <motion.div
                          className={cn(
                            'absolute pointer-events-none',
                            hoveredHref && hoveredHref !== activeHref
                              ? 'bg-[rgba(139,94,52,0.35)]'
                              : 'bg-accent'
                          )}
                          initial={false}
                          animate={{
                            left: indicatorStyle.left,
                            width: indicatorStyle.width,
                            top: indicatorStyle.top + indicatorStyle.height - 2,
                            height: 1,
                          }}
                          transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 28,
                          }}
                        />
                      )}
                      {effectiveItems.map((item) => {
                        const isActive = isDesktopItemActive(item);
                        const href = getDesktopItemHref(item);

                        return (
                          <Link
                            key={item.target}
                            href={href}
                            data-nav-href={href}
                            prefetch={true}
                            onClick={() => enableOnePageMode && setActiveHash(`#${item.target}`)}
                            onMouseEnter={() => setHoveredHref(href)}
                            className={cn(
                              'relative px-2 py-3 display-sans text-[0.76rem] font-semibold uppercase tracking-[0.16em] transition-colors duration-150',
                              isActive
                                ? 'text-primary'
                                : hoveredHref === href
                                  ? 'text-primary'
                                  : 'text-neutral-600'
                            )}
                          >
                            {item.title}
                          </Link>
                        );
                      })}
                    </div>
                    <LanguageToggle i18n={i18n} />
                    <ThemeToggle />
                  </div>
                </div>

                <div className="lg:hidden flex items-center space-x-2">
                  <LanguageToggle i18n={i18n} />
                  <ThemeToggle />
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-neutral-600 hover:text-primary hover:bg-neutral-100/70 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent transition-colors duration-200">
                    <span className="sr-only">{messages.navigation.openMainMenu}</span>
                    <motion.div
                      animate={{ rotate: open ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </motion.div>
                  </Disclosure.Button>
                </div>
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {open && (
              <Disclosure.Panel static>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="nav-on-image lg:hidden border-b border-[rgba(107,91,78,0.12)] dark:border-[rgba(244,239,230,0.08)]"
                >
                  <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {effectiveItems.map((item, index) => {
                      const isActive = enableOnePageMode
                        ? (item.href === '/' ? pathname === '/' && !activeHash : activeHash === `#${item.target}`)
                        : (item.href === '/'
                          ? pathname === '/'
                          : pathname.startsWith(item.href));

                      const href = enableOnePageMode
                        ? (item.href === '/' ? '/' : `/#${item.target}`)
                        : item.href;

                      return (
                        <motion.div
                          key={item.target}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Disclosure.Button
                            as={Link}
                            href={href}
                            prefetch={true}
                            onClick={() => enableOnePageMode && setActiveHash(item.href === '/' ? '' : `#${item.target}`)}
                            className={cn(
                              'block border-l-2 px-3 py-3 display-sans text-sm font-semibold uppercase tracking-[0.12em] transition-all duration-200',
                              isActive
                                ? 'text-primary border-accent'
                                : 'text-neutral-600 border-transparent hover:text-primary hover:border-[rgba(139,94,52,0.28)]'
                            )}
                          >
                            {item.title}
                          </Disclosure.Button>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </Disclosure.Panel>
            )}
          </AnimatePresence>
        </>
      )}
    </Disclosure>
  );
}
