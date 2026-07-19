import contactJson from '@/content/sections/contact.json';
import { ContactData } from '@/types';

export interface ContactCategory {
  id: string;
  label: string;
  color: string;
  links: {
    name: string;
    url: string;
    icon: string;
    description?: string;
  }[];
}

const contactContent = contactJson as ContactData & { contactCategories: ContactCategory[] };

export const contactData: ContactData = contactContent;
export const contactCategories: ContactCategory[] = contactContent.contactCategories;
