import patentsJson from '@/content/data/patents.json';
import { Patent } from '@/types';

export const patents: Patent[] = patentsJson as unknown as Patent[];

export function getPatentBySlug(slug: string): Patent | undefined {
  return patents.find((p) => p.slug === slug);
}

export function getAllPatentSlugs(): string[] {
  return patents.map((p) => p.slug);
}

export function getPatentsByStatus(status: Patent['status']): Patent[] {
  return patents.filter((p) => p.status === status);
}

export function getPatentsByProject(projectId: string): Patent[] {
  return patents.filter((p) => p.relatedProjects?.includes(projectId));
}
