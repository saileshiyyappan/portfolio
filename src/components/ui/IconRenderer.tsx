'use client';

import PortfolioIcon from '@/components/ui/PortfolioIcon';

interface IconRendererProps {
  name: string;
  size?: number;
  className?: string;
}

export default function IconRenderer({ name, size = 24, className = '' }: IconRendererProps) {
  return <PortfolioIcon name={name} size={size} className={className} alt={name} />;
}

export function getIcon(name: string) {
  return name;
}
