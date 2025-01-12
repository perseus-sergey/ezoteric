'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { THEME_SELECT } from '@/models/header.model';
import { ELanguage } from '@/models/language.model';
import { Moon, Sun } from 'lucide-react';

const { dark, light } = THEME_SELECT;

export default function ThemeToggle({
  lang,
  withCaption = false,
}: {
  lang: ELanguage;
  withCaption?: boolean;
}) {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      onClick={() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }}
      variant="ghost"
    >
      {theme === 'dark' ? <Sun /> : <Moon />}
      {withCaption
        ? theme === 'dark'
          ? light.caption[lang]
          : dark.caption[lang]
        : null}
      {!withCaption && (
        <span className="sr-only">
          {theme === 'dark' ? light.ariaLabel[lang] : dark.ariaLabel[lang]}
        </span>
      )}
    </Button>
  );
}
