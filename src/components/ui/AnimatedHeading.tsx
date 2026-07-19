'use client';

import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations';

interface AnimatedHeadingProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  className?: string;
  delay?: number;
  split?: boolean;
}

export default function AnimatedHeading({
  children,
  as: Tag = 'h2',
  className = '',
  delay = 0,
  split = false,
}: AnimatedHeadingProps) {
  const { ref, isInView } = useInView({ rootMargin: '-80px' });

  if (!split) {
    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={fadeUp}
        transition={{ delay }}
      >
        <Tag className={className}>{children}</Tag>
      </motion.div>
    );
  }

  const text = typeof children === 'string' ? children : '';
  const words = text.split(' ');

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={staggerContainer}
    >
      <Tag className={className}>
        {words.map((word, i) => (
          <motion.span
            key={i}
            className="inline-block mr-[0.25em]"
            variants={staggerItem}
            transition={{ delay: delay + i * 0.05 }}
          >
            {word}
          </motion.span>
        ))}
      </Tag>
    </motion.div>
  );
}
