import { MetadataRoute } from 'next';
import { getAllProjectSlugs } from '@/data/projects';
import { getAllResearchSlugs } from '@/data/research';
import { getAllPatentSlugs } from '@/data/patents';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sailesh.dev';

  const staticRoutes = [
    { url: baseUrl, lastModified: new Date(), priority: 1.0 },
    { url: `${baseUrl}/projects`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/research`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/patents`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/gallery`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), priority: 0.7 },
  ];

  const projectRoutes = getAllProjectSlugs().map((slug) => ({
    url: `${baseUrl}/projects/${slug}`,
    lastModified: new Date(),
    priority: 0.8,
  }));

  const researchRoutes = getAllResearchSlugs().map((slug) => ({
    url: `${baseUrl}/research/${slug}`,
    lastModified: new Date(),
    priority: 0.7,
  }));

  const patentRoutes = getAllPatentSlugs().map((slug) => ({
    url: `${baseUrl}/patents/${slug}`,
    lastModified: new Date(),
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes, ...researchRoutes, ...patentRoutes];
}
