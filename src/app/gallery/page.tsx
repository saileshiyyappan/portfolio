import { Metadata } from 'next';
import { galleryImages } from '@/data/gallery';
import { generateSEO } from '@/lib/seo';
import GalleryGrid from '@/components/gallery/GalleryGrid';

export const metadata: Metadata = generateSEO({
  title: 'Gallery — Sailesh Iyyappan Jr.',
  description: 'A visual journey through prototypes, designs, systems, and the engineering process.',
});

export default function GalleryPage() {
  return (
    <main className="relative min-h-screen bg-void">
      <div className="pt-24 sm:pt-32 pb-20">
        <GalleryGrid images={galleryImages} />
      </div>
    </main>
  );
}
