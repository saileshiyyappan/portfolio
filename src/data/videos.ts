import videosJson from '@/content/data/videos.json';
import { VideoItem } from '@/types';

export const videos: VideoItem[] = videosJson as VideoItem[];

export function getVideosByProject(projectId: string): VideoItem[] {
  return videos.filter((v) => v.projectId === projectId);
}

export function getVideosByCategory(category: string): VideoItem[] {
  return videos.filter((v) => v.category === category);
}
