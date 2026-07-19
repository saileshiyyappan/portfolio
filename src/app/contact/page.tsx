import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import Contact from '@/components/sections/Contact';
import Navigation from '@/components/layout/Navigation';

export const metadata: Metadata = generateSEO({
  title: 'Contact — Sailesh Iyyappan Jr.',
  description: 'Open to research collaborations, product development partnerships, and engineering advisory roles.',
});

export default function ContactPage() {
  return (
    <main className="relative min-h-screen bg-void">
      <Navigation />
      <div className="pt-24 sm:pt-32 pb-20">
        <Contact />
      </div>
    </main>
  );
}
