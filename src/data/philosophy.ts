

import philosophyJson from '@/content/sections/philosophy.json';

export type PhilosophyItem = {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
};

export const philosophyItems: PhilosophyItem[] = philosophyJson as PhilosophyItem[];
