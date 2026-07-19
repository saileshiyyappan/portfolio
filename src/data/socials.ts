import socialsJson from '@/content/data/socials.json';
import { SocialLink } from '@/types';

export const socialLinks: SocialLink[] = socialsJson as SocialLink[];

export function getSocialById(id: string): SocialLink | undefined {
  return socialLinks.find((s) => s.id === id);
}
