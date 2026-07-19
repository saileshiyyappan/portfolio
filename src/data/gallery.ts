import galleryJson from '@/content/data/gallery.json';
import { GalleryItem } from '@/types';

export const galleryImages: GalleryItem[] = galleryJson as GalleryItem[];

export function getGalleryByProject(projectId: string): GalleryItem[] {
  return galleryImages.filter((g) => g.projectId === projectId);
}

export function getGalleryByCategory(category: string): GalleryItem[] {
  return galleryImages.filter((g) => g.category === category);
}

export function getGalleryCategories(): string[] {
  return Array.from(new Set(galleryImages.map((g) => g.category)));
}
