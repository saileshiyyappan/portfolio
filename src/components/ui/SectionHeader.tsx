'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { fadeUp } from '@/lib/animations';

interface SectionHeaderProps {
  subtitle: string;
  title: React.ReactNode;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

const SectionHeader = memo(function SectionHeader({
  subtitle,
  title,
  description,
  align = 'center',
  className = '',
}: SectionHeaderProps) {
  const { ref, isInView } = useInView({ rootMargin: '-50px' });

  const alignClass = align === 'center' ? 'text-center' : 'text-left';

  return (
    <motion.div
      ref={ref}
      className={`mb-10 sm:mb-12 ${alignClass} ${className}`}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeUp}
    >
      <span className="font-body text-xs text-neon-cyan tracking-[0.3em] uppercase mb-3 block">
        {subtitle}
      </span>
      <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-white mb-4">
        {title}
      </h2>
      {description && (
        <p className="font-body text-void14 text-base max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
});

export default SectionHeader;
