import { Metadata } from 'next';
import { SEOData } from '@/types';

const DEFAULT_SEO: SEOData = {
  title: 'Sailesh Iyyappan Jr. — Founder & Systems Product Engineer',
  description:
    'Building Patent-Oriented Products, Intelligent Embedded Systems, AI Platforms, Research-Driven Technology and Real-World Engineering Solutions.',
  keywords: [
    'founder',
    'systems engineer',
    'embedded systems',
    'AI',
    'product engineer',
    'patents',
    'health-tech',
    'IoT',
    'wearable',
    'startup',
  ],
  ogImage: '/og-image.jpg',
  ogType: 'website',
  twitterCard: 'summary_large_image',
};

export function generateSEO(data?: Partial<SEOData>): Metadata {
  const merged = { ...DEFAULT_SEO, ...data };

  return {
    title: merged.title,
    description: merged.description,
    keywords: merged.keywords,
    openGraph: {
      title: merged.title,
      description: merged.description,
      type: merged.ogType,
      images: merged.ogImage ? [{ url: merged.ogImage }] : undefined,
    },
    twitter: {
      card: merged.twitterCard,
      title: merged.title,
      description: merged.description,
      images: merged.ogImage ? [merged.ogImage] : undefined,
    },
    alternates: merged.canonicalUrl
      ? { canonical: merged.canonicalUrl }
      : undefined,
  };
}

export function generateProjectSEO(
  title: string,
  description: string,
  slug: string,
  image?: string
): Metadata {
  return generateSEO({
    title: `${title} — Sailesh Iyyappan Jr.`,
    description,
    ogType: 'article',
    ogImage: image,
    canonicalUrl: `https://sailesh.dev/projects/${slug}`,
  });
}

export function generateResearchSEO(
  title: string,
  description: string,
  slug: string
): Metadata {
  return generateSEO({
    title: `${title} — Research`,
    description,
    ogType: 'article',
    canonicalUrl: `https://sailesh.dev/research/${slug}`,
  });
}

export function generatePatentSEO(
  title: string,
  description: string,
  slug: string
): Metadata {
  return generateSEO({
    title: `${title} — Patent`,
    description,
    ogType: 'article',
    canonicalUrl: `https://sailesh.dev/patents/${slug}`,
  });
}
