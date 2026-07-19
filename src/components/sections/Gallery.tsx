'use client';

import { useState, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn } from 'lucide-react';
import { galleryImages } from '@/data/gallery';
import { useInView } from '@/hooks/useInView';
import SectionHeader from '@/components/ui/SectionHeader';
import Container from '@/components/ui/Container';
import ImageViewer from '@/components/ui/ImageViewer';

const GalleryItem = memo(function GalleryItem({
  img,
  index,
  onClick,
}: {
  img: (typeof galleryImages)[0];
  index: number;
  onClick: () => void;
}) {
  const aspect = index % 3 === 0 ? 'aspect-[4/5]' : index % 3 === 1 ? 'aspect-square' : 'aspect-[3/4]';

  return (
    <motion.div
      className="break-inside-avoid relative group cursor-pointer rounded-xl overflow-hidden"
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={onClick}
    >
      <div className={`relative ${aspect}`}>
        <img
          src={img.src}
          alt={img.caption}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-void/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="w-12 h-12 rounded-full glass flex items-center justify-center">
            <ZoomIn size={20} className="text-white" />
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <span className="font-body text-xs text-neon-cyan uppercase tracking-wider">{img.category}</span>
          <p className="font-heading text-white text-sm mt-1">{img.caption}</p>
        </div>
      </div>
    </motion.div>
  );
});

export default function Gallery() {
  const { ref, isInView } = useInView({ rootMargin: '-100px' });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [filter, setFilter] = useState('All');

  const categories = ['All', ...Array.from(new Set(galleryImages.map((img) => img.category)))];
  const filteredImages = filter === 'All' ? galleryImages : galleryImages.filter((img) => img.category === filter);

  const openLightbox = useCallback((idx: number) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  }, []);

  const nextImage = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % filteredImages.length);
  }, [filteredImages.length]);

  const prevImage = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  }, [filteredImages.length]);

  const lightboxItems = filteredImages.map((img) => ({
    src: img.src,
    caption: img.caption,
    category: img.category,
  }));

  return (
    <section id="gallery" className="relative py-16 sm:py-20 overflow-hidden">
      <Container ref={ref}>
        <SectionHeader
          subtitle="Visual Archive"
          title={<>Engineering <span className="text-gradient">Gallery</span></>}
          description="A visual journey through prototypes, designs, systems, and the engineering process."
        />

        {/* Filter Tabs */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full font-body text-sm transition-all ${
                filter === cat
                  ? 'bg-white text-void font-semibold'
                  : 'glass text-void14 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Masonry Grid */}
        <motion.div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4" layout>
          <AnimatePresence mode="popLayout">
            {filteredImages.map((img, i) => (
              <GalleryItem key={`${img.id}-${i}`} img={img} index={i} onClick={() => openLightbox(i)} />
            ))}
          </AnimatePresence>
        </motion.div>
      </Container>

      {/* Single Image Viewer - only one close button */}
      <ImageViewer
        isOpen={lightboxOpen}
        items={lightboxItems}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </section>
  );
}
