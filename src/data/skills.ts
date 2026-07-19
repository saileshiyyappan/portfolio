import skillsJson from '@/content/sections/skills.json';
import { Skill } from '@/types';

export const skills: Skill[] = skillsJson as Skill[];

export function getSkillsByCategory(category: string): Skill[] {
  return skills.filter((s) => s.category === category);
}

export function getSkillCategories(): string[] {
  return Array.from(new Set(skills.map((s) => s.category).filter((c): c is string => typeof c === 'string')));
}
