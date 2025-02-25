'use client';

import { ReactNode, useEffect } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  animate,
} from 'motion/react';

interface IProps {
  children: ReactNode;
}

const COLORS_TOP = ['#13FFAA', '#1E67C6', '#CE84CF', '#DD335C'];

export default function ButtonBorderGlowing({ children }: IProps) {
  const color = useMotionValue(COLORS_TOP[0]);

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: 'easeInOut',
      duration: 10,
      repeat: Infinity,
      repeatType: 'mirror',
    });
  }, []);

  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`2px 4px 24px ${color}`;

  return (
    <motion.button
      style={{
        border,
        boxShadow,
      }}
      whileHover={{
        scale: 1.015,
      }}
      whileTap={{
        scale: 0.985,
      }}
      className="group relative font-georgia flex w-fit items-center gap-6 rounded-full bg-indigo-950/80 px-12 py-2 text-gray-50 transition-colors hover:bg-indigo-950"
    >
      {children}
    </motion.button>
  );
}
