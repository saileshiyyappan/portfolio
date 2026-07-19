'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, className = '', size = 'xl' }, ref) => {
    const sizes = {
      sm: 'max-w-3xl',
      md: 'max-w-4xl',
      lg: 'max-w-5xl',
      xl: 'max-w-7xl',
      full: 'max-w-none',
    };

    return (
      <div ref={ref} className={cn('mx-auto px-6', sizes[size], className)}>
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';

export default Container;
