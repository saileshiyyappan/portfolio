'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import portfolioIcons from '@/content/portfolio_icons.json';

interface PortfolioIconProps {
  name?: string;
  src?: string;
  type?: 'svg' | 'image';
  size?: number;
  className?: string;
  alt?: string;
  title?: string;
}

const defaultIcon = portfolioIcons.default as { type: 'svg' | 'image'; src: string };

export default function PortfolioIcon({
  name,
  src,
  type,
  size = 24,
  className = '',
  alt,
  title,
}: PortfolioIconProps) {
  const resolved = useMemo(() => {
    if (src) {
      return { type: type || 'image', src };
    }

    const entry = name ? (portfolioIcons as Record<string, { type?: string; src?: string }>)[name.toLowerCase()] : undefined;
    return entry || defaultIcon;
  }, [name, src, type]);

  const resolvedSrc = resolved.src || defaultIcon.src;
  const resolvedType = resolved.type || 'svg';

  if (resolvedType === 'svg') {
    return (
      <span className={`inline-flex items-center justify-center shrink-0 ${className}`} title={title || alt || name}>
        <Image
          src={resolvedSrc}
          alt={alt || name || 'Icon'}
          width={size}
          height={size}
          className="w-full h-full object-contain"
          unoptimized={resolvedSrc.startsWith('http')}
        />
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center justify-center shrink-0 ${className}`} title={title || alt || name}>
      <Image
        src={resolvedSrc}
        alt={alt || name || 'Icon'}
        width={size}
        height={size}
        className="object-contain"
        unoptimized={resolvedSrc.startsWith('http')}
      />
    </span>
  );
}
