'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
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
      variant="outline"
      size="icon"
    >
      <Sun className="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      {/* // TODO: change */}
      <span className="sr-only">
        {theme === 'dark' ? 'Включити світлу тему' : 'Включити темну тему'}
      </span>
    </Button>
  );
}

// return (
//   <div
//     className="cursor-pointer"
//     onClick={() => {
//       setTheme(theme === "dark" ? "light" : "dark");
//     }}
//   >
//     {`Toggle ${theme === "light" ? "dark" : "light"} mode`}
//   </div>
// );
