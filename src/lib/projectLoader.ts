import { readFileSync } from 'fs';
import { join } from 'path';
import { LinkItem, Project } from '@/types';
import projectRegistry from '@/content/projects/project_registry.json';
import projectOrder from '@/content/projects/project_order.json';

const jsonCache = new Map<string, unknown>();
const projectCache = new Map<string, Promise<Project | null>>();

function ensureArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function ensureStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item) => typeof item === 'string') as string[] : [];
}

function ensureTimeline(value: unknown): Project['timeline'] {
  const timeline = value as Partial<Project['timeline']> | undefined;
  return {
    startDate: timeline?.startDate || '',
    endDate: timeline?.endDate,
    milestones: ensureArray<{ date: string; title: string; description: string }>(timeline?.milestones).map((milestone) => ({
      date: milestone.date || '',
      title: milestone.title || '',
      description: milestone.description || '',
    })),
  };
}

function ensureMediaItem(value: unknown): Project['coverImage'] {
  const item = value as Partial<Project['coverImage']> | undefined;
  return {
    src: item?.src || '',
    caption: item?.caption,
    type: item?.type,
  };
}

function getProjectSlugsFromOrder(): string[] {
  const order = (projectOrder as Record<string, string[]>).projects;
  return Array.isArray(order) ? order.filter((slug) => typeof slug === 'string') : [];
}

function getProjectSlugsFromRegistry(): string[] {
  const registry = (projectRegistry as Record<string, string[]>).projects;
  return Array.isArray(registry) ? registry.filter((slug) => typeof slug === 'string') : [];
}

// Auto-discover project folders from registry or explicit order file.
export function getAllProjectSlugsFromRegistry(): string[] {
  const ordered = getProjectSlugsFromOrder();
  const registry = getProjectSlugsFromRegistry();
  if (ordered.length > 0) {
    return ordered;
  }
  return Array.from(new Set([...ordered, ...registry]));
}

async function loadJson<T>(filePath: string, fallback: T): Promise<T> {
  const cached = jsonCache.get(filePath);
  if (cached !== undefined) {
    return cached as T;
  }

  try {
    const raw = readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw) as T;
    jsonCache.set(filePath, parsed);
    return parsed;
  } catch {
    jsonCache.set(filePath, fallback);
    return fallback;
  }
}

// Load a single project from its content folder
export async function loadProjectFromCMS(slug: string): Promise<Project | null> {
  const cached = projectCache.get(slug);
  if (cached) {
    return cached;
  }

  const promise = (async () => {
    const projectData = await loadJson<Record<string, unknown>>(join(process.cwd(), 'src', 'content', 'projects', slug, 'project.json'), {});
    const galleryData = await loadJson<Record<string, unknown>>(join(process.cwd(), 'src', 'content', 'projects', slug, 'gallery.json'), {});
    const videosData = await loadJson<Record<string, unknown>>(join(process.cwd(), 'src', 'content', 'projects', slug, 'videos.json'), { videos: [] });

  const allGalleryImages = [
    ...ensureArray<unknown>(galleryData.galleryImages),
    ...ensureArray<unknown>(galleryData.architectureImages),
    ...ensureArray<unknown>(galleryData.flowcharts),
    ...ensureArray<unknown>(galleryData.screenshots),
    ...ensureArray<unknown>(galleryData.prototypeImages),
  ];

    const videos = ensureArray<Record<string, unknown>>(videosData.videos).map((v) => ({
      src: (v.youtubeUrl as string) || '',
      caption: (v.title as string) || '',
      type: 'video' as const,
    }));

    const baseProject = projectData as Partial<Project>;

    const normalizeMedia = (it: unknown): Project['galleryImages'][0] => {
      const item = it as Partial<Project['galleryImages'][0]> | undefined;
      return {
        src: (item?.src as string) || '',
        caption: (item?.caption as string) || '',
        type: (item?.type as any) || 'image',
      };
    };

    const project: Project = {
    id: (baseProject.id as string) || slug,
    slug: (baseProject.slug as string) || slug,
    title: (baseProject.title as string) || '',
    subtitle: (baseProject.subtitle as string) || '',
    category: (baseProject.category as string) || '',
    status: (baseProject.status as Project['status']) || 'archived',
    shortDescription: (baseProject.shortDescription as string) || '',
    fullDescription: (baseProject.fullDescription as string) || '',
    coverImage: ensureMediaItem(galleryData.coverImage) || ensureMediaItem(baseProject.coverImage),
    galleryImages: (() => {
      const fromGallery = allGalleryImages.length > 0 ? allGalleryImages.map(normalizeMedia) as Project['galleryImages'] : [];
      const fromBase = ensureArray<unknown>(baseProject.galleryImages).map(normalizeMedia) as Project['galleryImages'];
      const merged = fromGallery.length > 0 ? fromGallery : fromBase;
      // Only keep items that have a non-empty src string
      return merged.filter((m) => typeof m.src === 'string' && m.src.length > 0);
    })(),
    videos: videos.length > 0 ? videos : ensureArray<Project['videos'][0]>(baseProject.videos),
    technologies: ensureStringArray(baseProject.technologies),
    features: ensureStringArray(baseProject.features),
    roles: ensureStringArray(baseProject.roles),
    timeline: ensureTimeline(baseProject.timeline),
    links: ensureArray<LinkItem>(baseProject.links),
    metrics: ensureArray<Project['metrics'][0]>(baseProject.metrics),
    tags: ensureStringArray(baseProject.tags),
    color: (baseProject.color as string) || '',
  };

    return project;
  })();

  projectCache.set(slug, promise);
  return promise;
}

// Load all projects from CMS
export async function getAllProjectsFromCMS(): Promise<Project[]> {
  const slugs = getAllProjectSlugsFromRegistry();
  const projects = await Promise.all(slugs.map((slug) => loadProjectFromCMS(slug)));
  return projects.filter((p): p is Project => p !== null);
}

// Get a single project by slug from CMS
export async function getProjectBySlugFromCMS(slug: string): Promise<Project | null> {
  return loadProjectFromCMS(slug);
}

// Fallback: get all projects from hardcoded data (for static generation)
export function getAllProjectsStatic(): Project[] {
  // Return empty - pages should use CMS loader
  return [];
}
