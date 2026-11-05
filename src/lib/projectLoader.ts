import { readFileSync } from 'fs';
import { join } from 'path';
import { LinkItem, Project, ProjectDocument } from '@/types';
import { resolveImageSrc, resolveMediaCaption, resolveMediaDescription } from '@/lib/media';
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

function ensureOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined;
}

function ensureDocuments(value: unknown): ProjectDocument[] {
  return ensureArray<Record<string, unknown>>(value)
    .filter((document) => typeof document.title === 'string' && typeof document.url === 'string')
    .map((document) => ({
      title: document.title as string,
      url: document.url as string,
      type: typeof document.type === 'string' ? document.type : undefined,
    }));
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
    src: resolveImageSrc(value) || '',
    caption: resolveMediaCaption(value),
    description: resolveMediaDescription(value),
    type: item?.type === 'video' ? 'video' : 'image',
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
    const documentsData = await loadJson<Record<string, unknown>>(join(process.cwd(), 'src', 'content', 'projects', slug, 'documents.json'), {});

    const baseProject = projectData as Partial<Project>;
    const documentsFromFile = Object.values(documentsData).flatMap((value) => ensureDocuments(value));
    const documents = ensureDocuments(baseProject.documents).length > 0
      ? ensureDocuments(baseProject.documents)
      : documentsFromFile;

const normalizeMedia = (it: unknown): Project['galleryImages'][0] => {
  const item = it as Partial<Project['galleryImages'][0]> | undefined;

  return {
    src: resolveImageSrc(it) || '',
    caption: resolveMediaCaption(it) || '',
    description: resolveMediaDescription(it),
    type: item?.type === 'video' ? 'video' : 'image',
  };
};

    const normalizeImageCollection = (key: string): Project['galleryImages'] => {
      const projectValue = (baseProject as Record<string, unknown>)[key];
      const values = Array.isArray(galleryData[key]) ? galleryData[key] : projectValue;
      return ensureArray<unknown>(values)
        .map(normalizeMedia)
        .filter((image) => Boolean(image.src));
    };

const normalizeVideo = (it: unknown): Project['videos'][0] => {
  const item = it as Record<string, unknown> | undefined;
  const thumbnail = ensureMediaItem(item?.thumbnail);

  return {
    src: typeof item?.src === 'string' ? item.src.trim() : '',
    caption: typeof item?.caption === 'string' ? item.caption : '',
    type: 'video',
    thumbnail: thumbnail.src ? thumbnail : undefined,
  };
};

    const videos = ensureArray<Record<string, unknown>>(videosData.videos).map((v) => {
      const thumbnail = ensureMediaItem(v.thumbnail);
      return {
        src: typeof v.youtubeUrl === 'string' ? v.youtubeUrl.trim() : '',
        caption: typeof v.title === 'string' ? v.title : '',
        type: 'video' as const,
        thumbnail: thumbnail.src ? thumbnail : undefined,
      };
    });

    const project: Project = {
    id: (baseProject.id as string) || slug,
    slug: (baseProject.slug as string) || slug,
    title: (baseProject.title as string) || '',
    subtitle: (baseProject.subtitle as string) || '',
    category: (baseProject.category as string) || '',
    status: (baseProject.status as Project['status']) || 'archived',
    year: ensureOptionalString(baseProject.year),
    shortDescription: (baseProject.shortDescription as string) || '',
    fullDescription: (baseProject.fullDescription as string) || '',
    problemStatement: ensureOptionalString(baseProject.problemStatement),
    solution: ensureOptionalString(baseProject.solution),
    architecture: ensureStringArray(baseProject.architecture),
    innovation: ensureStringArray(baseProject.innovation),
    futureWork: ensureStringArray(baseProject.futureWork),
    currentStatus: ensureOptionalString(baseProject.currentStatus),
    documents,
    coverImage: (() => {
      const galleryCover = ensureMediaItem(galleryData.coverImage);
      return galleryCover.src ? galleryCover : ensureMediaItem(baseProject.coverImage);
    })(),
    heroImage: (() => {
      const galleryHero = ensureMediaItem(galleryData.heroImage);
      if (galleryHero.src) return galleryHero;
      const baseHero = ensureMediaItem((baseProject as Record<string, unknown>).heroImage);
      return baseHero.src ? baseHero : undefined;
    })(),
    galleryImages: normalizeImageCollection('galleryImages'),
    architectureImages: normalizeImageCollection('architectureImages'),
    flowcharts: normalizeImageCollection('flowcharts'),
    screenshots: normalizeImageCollection('screenshots'),
    prototypeImages: normalizeImageCollection('prototypeImages'),
    videos: videos.length > 0
      ? videos
      : ensureArray<unknown>(baseProject.videos).map(normalizeVideo),
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
