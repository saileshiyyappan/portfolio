'use client';

import Image from 'next/image';
import { memo } from 'react';
import { resolveTechnologyBadge } from '@/data/techstack';

interface TechnologyBadgeProps {
  name?: string;
  src?: string;
  compact?: boolean;
  decorative?: boolean;
}

const TechnologyBadge = memo(function TechnologyBadge({ name, src, compact = false, decorative = false }: TechnologyBadgeProps) {
  const badgeSrc = src || (name ? resolveTechnologyBadge(name).src : '/assets/badges/default.svg');

  return (
    <span
      aria-hidden={decorative || undefined}
      className={`inline-flex shrink-0 overflow-hidden ${compact ? 'h-6 w-[116px]' : 'h-7 w-[150px]'} ${decorative ? 'pointer-events-none' : ''}`}
    >
      <Image
        src={badgeSrc}
        alt={decorative ? '' : name || 'Technology badge'}
        width={compact ? 116 : 150}
        height={compact ? 24 : 28}
        className="h-full w-full object-contain object-left"
        unoptimized
      />
    </span>
  );
});

export default TechnologyBadge;
