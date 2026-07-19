import achievementsJson from '@/content/sections/achievements.json';
import { Achievement } from '@/types';

export const achievements: Achievement[] = achievementsJson as Achievement[];

export function getAchievementsByCategory(category: string): Achievement[] {
  return achievements.filter((a) => a.category === category);
}
