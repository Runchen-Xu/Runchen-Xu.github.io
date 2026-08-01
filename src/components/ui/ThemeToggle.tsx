'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useThemeStore, resolveTheme } from '@/lib/stores/themeStore';
import { useMessages } from '@/lib/i18n/useMessages';

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);
  const messages = useMessages();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="site-theme-toggle">
        <div className="h-4 w-4 rounded-full bg-neutral-300 animate-pulse" />
      </div>
    );
  }

  const effectiveTheme = resolveTheme(theme);
  const nextThemeLabel = effectiveTheme === 'dark' ? messages.theme.light : messages.theme.dark;

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => toggleTheme()}
        className="site-theme-toggle transition-colors duration-200 focus:outline-none"
        title={`${messages.theme.currentTheme}: ${effectiveTheme}. ${nextThemeLabel}.`}
      >
        <motion.div
          key={effectiveTheme}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {effectiveTheme === 'dark' ? (
            <MoonIcon className="h-4 w-4" />
          ) : (
            <SunIcon className="h-4 w-4" />
          )}
        </motion.div>
      </motion.button>
    </div>
  );
}

export function ThemeToggleDropdown() {
  const { theme, setTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messages = useMessages();
  const themes = [
    {
      value: 'light' as const,
      label: messages.theme.light,
      icon: <SunIcon className="h-4 w-4" />,
    },
    {
      value: 'dark' as const,
      label: messages.theme.dark,
      icon: <MoonIcon className="h-4 w-4" />,
    },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="site-theme-toggle">
        <div className="h-4 w-4 rounded-full bg-neutral-300 animate-pulse" />
      </div>
    );
  }

  const effectiveTheme = resolveTheme(theme);
  const currentTheme = themes.find((t) => t.value === effectiveTheme) || themes[0];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setIsOpen(!isOpen)}
        className="site-theme-toggle transition-colors duration-200 focus:outline-none"
        title={`${messages.theme.currentTheme}: ${currentTheme.label}`}
      >
        <motion.div
          key={effectiveTheme}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {currentTheme.icon}
        </motion.div>
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="absolute right-0 mt-2 w-32 rounded-md border shadow-sm z-50 bg-background"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="py-1">
            {themes.map((themeOption) => (
              <button
                key={themeOption.value}
                onClick={() => {
                  setTheme(themeOption.value);
                  setIsOpen(false);
                }}
                className={`flex items-center w-full px-3 py-2 text-sm transition-colors duration-200 ${effectiveTheme === themeOption.value ? 'text-accent bg-accent/10' : 'text-foreground'}`}
              >
                <span className="mr-2">{themeOption.icon}</span>
                {themeOption.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
