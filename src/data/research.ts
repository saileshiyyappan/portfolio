import researchJson from '@/content/data/research.json';
import { ResearchPaper } from '@/types';

export const researchPapers: ResearchPaper[] = researchJson as ResearchPaper[];

export function getResearchBySlug(slug: string): ResearchPaper | undefined {
  return researchPapers.find((r) => r.slug === slug);
}

export function getAllResearchSlugs(): string[] {
  return researchPapers.map((r) => r.slug);
}

export function getResearchByStatus(status: ResearchPaper['publicationStatus']): ResearchPaper[] {
  return researchPapers.filter((r) => r.publicationStatus === status);
}

export function getResearchByKeyword(keyword: string): ResearchPaper[] {
  return researchPapers.filter((r) => r.keywords.includes(keyword));
}
