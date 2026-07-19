// ==================== BASE TYPES ====================

export interface MediaItem {
  src: string;
  caption?: string;
  type?: 'image' | 'video' | 'document' | 'pdf';
}

export interface LinkItem {
  label: string;
  url: string;
  icon?: string;
}

export interface MetricItem {
  label: string;
  value: string;
}

// ==================== PROJECT ====================

export type ProjectStatus = 'active' | 'completed' | 'in-development' | 'archived';

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  status: ProjectStatus;
  shortDescription: string;
  fullDescription: string;
  coverImage: MediaItem;
  galleryImages: MediaItem[];
  videos: MediaItem[];
  technologies: string[];
  features: string[];
  roles: string[];
  timeline: {
    startDate: string;
    endDate?: string;
    milestones: { date: string; title: string; description: string }[];
  };
  links: LinkItem[];
  metrics: MetricItem[];
  tags: string[];
  color: string;
}

// ==================== RESEARCH ====================

export type PublicationStatus = 'published' | 'under-review' | 'in-preparation' | 'accepted';

export interface ResearchPaper {
  id: string;
  slug: string;
  title: string;
  abstract: string;
  authors: string[];
  publicationStatus: PublicationStatus;
  journalOrConference?: string;
  publicationDate?: string;
  keywords: string[];
  paperLink?: string;
  pdfLink?: string;
  doi?: string;
  researchImages: MediaItem[];
  citations?: number;
}

// ==================== PATENT ====================

export type PatentStatus = 'filed' | 'pending' | 'granted' | 'published' | 'in-preparation';

export interface Patent {
  id: string;
  slug: string;
  title: string;
  status: PatentStatus;
  inventors: string[];
  description: string;
  filingDate: string;
  grantDate?: string;
  patentNumber?: string;
  applicationNumber?: string;
  jurisdiction?: string;
  documents: MediaItem[];
  images: MediaItem[];
  relatedProjects?: string[];
  claims?: string[];
}

// ==================== ACHIEVEMENT ====================

export interface Achievement {
  id: string;
  title: string;
  value: string;
  description: string;
  icon: string;
  color: string;
  date?: string;
  category?: string;
}

// ==================== SKILL ====================

export interface Skill {
  id: string;
  title: string;
  level: number;
  description: string;
  icon: string;
  color: string;
  category?: string;
  technologies?: string[];
}

// ==================== TIMELINE ====================

export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  relatedProjectIds?: string[];
}

// ==================== GALLERY ====================

export interface GalleryItem {
  id: string;
  src: string;
  caption: string;
  category: string;
  projectId?: string;
  date?: string;
  aspectRatio?: 'portrait' | 'square' | 'landscape';
}

// ==================== SOCIAL ====================

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string;
  color: string;
  hoverColor: string;
  glowColor: string;
}

// ==================== VIDEO ====================

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: MediaItem;
  duration: string;
  category: string;
  projectId?: string;
  youtubeUrl?: string;
}

// ==================== SEO ====================

export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  canonicalUrl?: string;
  structuredData?: Record<string, unknown>;
}

// ==================== NAVIGATION ====================

export interface NavLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

// ==================== HERO ====================

export interface HeroData {
  name: string;
  tagline: string;
  subtitle: string;
  description: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
}

// ==================== ABOUT ====================

export interface AboutFocusArea {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface AboutData {
  title: string;
  subtitle: string;
  description: string;
  focusAreas: AboutFocusArea[];
  stats: MetricItem[];
}

// ==================== CONTACT ====================

export interface ContactData {
  title: string;
  subtitle: string;
  description: string;
  socials: SocialLink[];
  location: string;
  availability: string;
  email?: string;
}
