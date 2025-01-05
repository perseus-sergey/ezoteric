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
      {theme === 'dark' ? <Sun /> : <Moon />}
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
