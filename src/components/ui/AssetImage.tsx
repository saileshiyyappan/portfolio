'use client';

import Image from 'next/image';
import { useState } from 'react';

interface AssetImageProps {
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  rounded?: boolean;
  title?: string;
}

const defaultSrc = '/assets/logos/default-tech.svg';

export default function AssetImage({
  src,
  alt = 'Technology asset',
  size = 48,
  className = '',
  fill = false,
  priority = false,
  rounded = true,
  title,
}: AssetImageProps) {
  const [imgSrc, setImgSrc] = useState(src || defaultSrc);
  const resolvedSrc = imgSrc || defaultSrc;

  if (fill) {
    return (
      <div className={`relative overflow-hidden ${rounded ? 'rounded-full' : 'rounded-lg'} ${className}`}>
        <Image
          src={resolvedSrc}
          alt={alt}
          fill
          sizes="64px"
          priority={priority}
          onError={() => setImgSrc(defaultSrc)}
          className="object-contain"
          unoptimized={resolvedSrc.startsWith('http')}
        />
      </div>
    );
  }

  return (
    <div className={`relative inline-flex items-center justify-center overflow-hidden ${rounded ? 'rounded-full' : 'rounded-lg'} ${className}`}>
      <Image
        src={resolvedSrc}
        alt={alt}
        width={size}
        height={size}
        priority={priority}
        onError={() => setImgSrc(defaultSrc)}
        className="object-contain"
        unoptimized={resolvedSrc.startsWith('http')}
        title={title}
      />
    </div>
  );
}
