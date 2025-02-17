'use client';

import dynamic from 'next/dynamic';

const ThemeToggleWrapped = dynamic(
  () => import('@/components/custom/theme-toggle'),
  {
    ssr: false,
  }
);

export default ThemeToggleWrapped;
