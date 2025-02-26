'use client';

import * as motion from 'motion/react-client';

import { useTheme } from 'next-themes';
import { THEME_SELECT } from '@/models/header.model';
import { ELanguage } from '@/models/language.model';
import { MoonStar, Sun } from 'lucide-react';

const { dark, light } = THEME_SELECT;

export default function ThemeToggle({
  lang,
  withCaption = false,
}: {
  lang: ELanguage;
  withCaption?: boolean;
}) {
  const { setTheme, theme } = useTheme();

  const isDark = theme === 'dark';
  const ariaLabel = isDark ? light.ariaLabel[lang] : dark.ariaLabel[lang];

  return (
    <motion.button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative flex items-center justify-center gap-4 p-4 opacity-80"
      aria-label={ariaLabel}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        key={theme} // Це змушує motion змінювати іконку плавно
        initial={{ opacity: 0, rotate: -90 }}
        animate={{ opacity: 1, rotate: 0 }}
        exit={{ opacity: 0, rotate: 90 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        {isDark ? (
          <Sun className="size-6 text-yellow-200" />
        ) : (
          <MoonStar fill="black" strokeWidth={0.7} />
        )}
      </motion.div>
      {withCaption
        ? theme === 'dark'
          ? light.caption[lang]
          : dark.caption[lang]
        : null}
      {!withCaption && <span className="sr-only">{ariaLabel}</span>}
    </motion.button>
  );
}
