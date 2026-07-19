import timelineJson from '@/content/sections/timeline.json';
import { TimelineItem } from '@/types';

export const timelineEvents: TimelineItem[] = timelineJson as TimelineItem[];

export function getTimelineByProject(projectId: string): TimelineItem[] {
  return timelineEvents.filter((t) => t.relatedProjectIds?.includes(projectId));
}
