import { Project } from '@/types';
import { getAllProjectsFromCMS } from '@/lib/projectLoader';

// Projects are now loaded from /content/projects/* at build time.
// This file is kept as a re-export for backward compatibility.
// To add a new project:
//   1. Create /src/content/projects/<slug>/project.json
//   2. Create /src/content/projects/<slug>/gallery.json
//   3. Create /src/content/projects/<slug>/videos.json (optional)
//   4. Add <slug> to /src/content/projects/project_registry.json
//   5. Run build — project appears automatically

let cachedProjects: Project[] | null = null;

export async function getProjects(): Promise<Project[]> {
  if (cachedProjects) return cachedProjects;
  cachedProjects = await getAllProjectsFromCMS();
  return cachedProjects;
}

// Re-export for components that import directly
export { getAllProjectsFromCMS };

// Re-export slugs for sitemap
export { getAllProjectSlugsFromRegistry as getAllProjectSlugs } from '@/lib/projectLoader';
