'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'none';
}

export default function AnimatedSection({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: AnimatedSectionProps) {
  const variants = {
    up: { initial: { opacity: 0, y: 32 }, animate: { opacity: 1, y: 0 } },
    left: { initial: { opacity: 0, x: -32 }, animate: { opacity: 1, x: 0 } },
    right: { initial: { opacity: 0, x: 32 }, animate: { opacity: 1, x: 0 } },
    none: { initial: { opacity: 0 }, animate: { opacity: 1 } },
  };

  return (
    <motion.div
      className={className}
      initial={variants[direction].initial}
      whileInView={variants[direction].animate}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
