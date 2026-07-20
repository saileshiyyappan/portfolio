'use client';

import { memo } from 'react';
import {
  BookOpen,
  Boxes,
  Brain,
  Code2,
  FileText,
  FlaskConical,
  GitBranch,
  Github,
  Globe,
  Lightbulb,
  Linkedin,
  Mail,
  Search,
  Sparkles,
  TrendingUp,
  Twitter,
  Wrench,
  Wifi,
} from 'lucide-react';

const customIconMap: Record<string, React.ComponentType<{ size?: number | string; className?: string }>> = {
  cplusplus: ({ size = 16, className = '' }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor" aria-hidden="true">
      <path d="M8.8 7.2c-.4-.4-.9-.6-1.5-.6H4.8c-.7 0-1.3.3-1.7.8-.4.5-.5 1.2-.4 1.8l.7 4.6c.1.8.7 1.5 1.5 1.8.7.3 1.5.3 2.2-.1l.8-.4c.4-.2.7-.6.7-1.1 0-.5-.2-.9-.6-1.1-.3-.2-.7-.3-1.1-.3H7.1c-.5 0-.9-.3-1.1-.7l-.3-.5c-.2-.3-.2-.7 0-1l.5-.8c.2-.3.3-.7.2-1.1-.1-.4-.4-.8-.8-.9L8.8 7.2zM13.4 7.2c.4-.4.9-.6 1.5-.6h2.5c.7 0 1.3.3 1.7.8.4.5.5 1.2.4 1.8l-.7 4.6c-.1.8-.7 1.5-1.5 1.8-.7.3-1.5.3-2.2-.1l-.8-.4c-.4-.2-.7-.6-.7-1.1 0-.5.2-.9.6-1.1.3-.2.7-.3 1.1-.3h.6c.5 0 .9-.3 1.1-.7l.3-.5c.2-.3.2-.7 0-1l-.5-.8c-.2-.3-.3-.7-.2-1.1.1-.4.4-.8.8-.9l.3-.1z" />
    </svg>
  ),
  arduino: ({ size = 16, className = '' }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 3c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 3.2c2.7 0 4.8 2.2 4.8 4.8S14.7 15.8 12 15.8 7.2 13.6 7.2 11 9.3 6.2 12 6.2zm0 1.6c-1.8 0-3.2 1.4-3.2 3.2S10.2 14.2 12 14.2s3.2-1.4 3.2-3.2S13.8 7.8 12 7.8z" />
    </svg>
  ),
  platformio: ({ size = 16, className = '' }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2 4 6v6c0 4.8 3.2 8.9 8 10 4.8-1.1 8-5.2 8-10V6l-8-4Zm0 3.1 5.2 2.6v4.7c0 3.6-2.2 6.7-5.2 7.7-3-1-5.2-4.1-5.2-7.7V7.7L12 5.1Z" />
    </svg>
  ),
  vscode: ({ size = 16, className = '' }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.7 2.5 10.3 9.7 5.2 5.3 2.8 6.6l5.2 4.8-5.2 4.8 2.4 1.3 5.1-4.4 7.4 7.2 3.5-1.7V4.2l-3.5-1.7Zm0 4.2v10.6l-6.2-5.3 6.2-5.3Z" />
    </svg>
  ),
  ble: ({ size = 16, className = '' }) => <Wifi size={size} className={className} />, 
  esp32: ({ size = 16, className = '' }) => <Sparkles size={size} className={className} />,
  react: ({ size = 16, className = '' }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 5.1c-2.7 0-5.1 1.7-6.1 4.2-.3.5-.2 1.1.2 1.5.4.4 1 .5 1.5.2 1.1-.6 2.3-.9 3.5-.9 1.2 0 2.4.3 3.5.9.5.2 1.1.2 1.5-.2.4-.4.5-1 .2-1.5-1-2.5-3.4-4.2-6.1-4.2Zm0 7.9c-1.2 0-2.4-.3-3.5-.9-.5-.2-1.1-.2-1.5.2-.4.4-.5 1-.2 1.5 1 2.5 3.4 4.2 6.1 4.2 2.7 0 5.1-1.7 6.1-4.2.3-.5.2-1.1-.2-1.5-.4-.4-1-.5-1.5-.2-1.1.6-2.3.9-3.5.9Zm0-5.4c-2.4 0-4.4 1.3-5.4 3.3-.3.6-.2 1.3.2 1.8.4.5 1.1.8 1.8.8h7.2c.7 0 1.4-.3 1.8-.8.4-.5.5-1.2.2-1.8-1-2-3-3.3-5.4-3.3Z" />
    </svg>
  ),
  nextjs: ({ size = 16, className = '' }) => <Globe size={size} className={className} />,
  nodejs: ({ size = 16, className = '' }) => <Code2 size={size} className={className} />,
  typescript: ({ size = 16, className = '' }) => <Code2 size={size} className={className} />,
  javascript: ({ size = 16, className = '' }) => <Code2 size={size} className={className} />,
  python: ({ size = 16, className = '' }) => <Code2 size={size} className={className} />,
  firebase: ({ size = 16, className = '' }) => <Sparkles size={size} className={className} />,
  flask: ({ size = 16, className = '' }) => <FlaskConical size={size} className={className} />,
  docker: ({ size = 16, className = '' }) => <Boxes size={size} className={className} />,
  figma: ({ size = 16, className = '' }) => <Sparkles size={size} className={className} />,
  git: ({ size = 16, className = '' }) => <GitBranch size={size} className={className} />,
  github: ({ size = 16, className = '' }) => <Github size={size} className={className} />,
  linkedin: ({ size = 16, className = '' }) => <Linkedin size={size} className={className} />,
  twitter: ({ size = 16, className = '' }) => <Twitter size={size} className={className} />,
  mail: ({ size = 16, className = '' }) => <Mail size={size} className={className} />,
  openai: ({ size = 16, className = '' }) => <Brain size={size} className={className} />,
  'google-cloud': ({ size = 16, className = '' }) => <CloudIcon size={size} className={className} />, 
  gemini: ({ size = 16, className = '' }) => <Brain size={size} className={className} />,
  markdown: ({ size = 16, className = '' }) => <FileText size={size} className={className} />,
  filetext: ({ size = 16, className = '' }) => <FileText size={size} className={className} />,
  bookopen: ({ size = 16, className = '' }) => <BookOpen size={size} className={className} />,
  wrench: ({ size = 16, className = '' }) => <Wrench size={size} className={className} />,
  trendingup: ({ size = 16, className = '' }) => <TrendingUp size={size} className={className} />,
  search: ({ size = 16, className = '' }) => <Search size={size} className={className} />,
  lightbulb: ({ size = 16, className = '' }) => <Lightbulb size={size} className={className} />,
  boxes: ({ size = 16, className = '' }) => <Boxes size={size} className={className} />,
  fastapi: ({ size = 16, className = '' }) => <Code2 size={size} className={className} />,
  linux: ({ size = 16, className = '' }) => <Code2 size={size} className={className} />,
  wifi: ({ size = 16, className = '' }) => <Wifi size={size} className={className} />,
};

function CloudIcon({ size = 16, className = '' }: { size?: number | string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor" aria-hidden="true">
      <path d="M7 18c-2.2 0-4-1.8-4-4 0-1.8 1.2-3.3 2.9-3.8.5-2 2.3-3.5 4.4-3.5 2.1 0 3.9 1.3 4.5 3.2.8-.2 1.7-.1 2.4.2 1.4.7 2.3 2.1 2.3 3.7 0 2.2-1.8 4-4 4H7Z" />
    </svg>
  );
}

interface TechnologyLogoProps {
  name: string;
  size?: number;
  color?: string;
  label?: string;
}

const TechnologyLogo = memo(function TechnologyLogo({ name, size = 16, color = 'text-white', label }: TechnologyLogoProps) {
  const normalizedName = (name || '').trim().toLowerCase();
  const IconComponent = customIconMap[normalizedName];

  if (!IconComponent) {
    return null;
  }

  return (
    <span className={`inline-flex items-center justify-center ${color}`} title={label || name}>
      <IconComponent size={size} className="shrink-0" />
    </span>
  );
});

export default TechnologyLogo;
