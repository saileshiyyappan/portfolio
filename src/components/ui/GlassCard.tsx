'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  gradient?: string;
}

export default function GlassCard({
  children,
  className = '',
  hover = true,
  glow = false,
  gradient,
}: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        'relative rounded-2xl p-6 overflow-hidden',
        'glass',
        hover && 'hover:bg-white/[0.05] transition-colors duration-500',
        glow && 'hover:shadow-[0_0_40px_rgba(59,130,246,0.1)]',
        className
      )}
      whileHover={hover ? { y: -5 } : undefined}
      transition={{ duration: 0.3 }}
    >
      {gradient && (
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 hover:opacity-[0.03] transition-opacity duration-500`}
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
