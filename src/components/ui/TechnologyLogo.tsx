'use client';

import { memo } from 'react';
import AssetImage from '@/components/ui/AssetImage';

interface TechnologyLogoProps {
  name: string;
  image?: string;
  size?: number;
  className?: string;
  alt?: string;
  label?: string;
}

const TechnologyLogo = memo(function TechnologyLogo({
  name,
  image,
  size = 48,
  className = '',
  alt,
  label,
}: TechnologyLogoProps) {
  const resolvedImage = image || '/assets/logos/default-tech.svg';

  return (
    <span className={`inline-flex items-center justify-center shrink-0 ${className}`} title={label || name}>
      <AssetImage src={resolvedImage} alt={alt || name} size={size} className="shrink-0" />
    </span>
  );
});

export default TechnologyLogo;
