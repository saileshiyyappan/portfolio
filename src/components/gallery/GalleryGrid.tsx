'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, Grid3X3, LayoutGrid, Image as ImageIcon, Maximize2 } from 'lucide-react';
import { GalleryItem } from '@/types';
import { useInView } from '@/hooks/useInView';
import Container from '@/components/ui/Container';
import SectionHeader from '@/components/ui/SectionHeader';
import Lightbox from '@/components/ui/Lightbox';

type LayoutMode = 'masonry' | 'grid' | 'featured';

interface GalleryGridProps {
  images: GalleryItem[];
}

export default function GalleryGrid({ images }: GalleryGridProps) {
  const { ref, isInView } = useInView({ rootMargin: '-100px' });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [filter, setFilter] = useState('All');
  const [layout, setLayout] = useState<LayoutMode>('masonry');

  const categories = ['All', ...Array.from(new Set(images.map((img) => img.category)))];
  const filteredImages = filter === 'All' ? images : images.filter((img) => img.category === filter);

  const openLightbox = (idx: number) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  const nextImage = () => setLightboxIndex((prev) => (prev + 1) % filteredImages.length);
  const prevImage = () => setLightboxIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);

  const lightboxItems = filteredImages.map((img) => ({
    src: img.src,
    caption: img.caption,
    category: img.category,
  }));

  const getAspectClass = (ratio?: string) => {
    switch (ratio) {
      case 'portrait': return 'aspect-[3/4]';
      case 'square': return 'aspect-square';
      case 'landscape': return 'aspect-[4/3]';
      default: return 'aspect-[4/3]';
    }
  };

  return (
    <Container ref={ref}>
      <SectionHeader
        subtitle="Visual Archive"
        title={<>Engineering <span className="text-gradient">Gallery</span></>}
        description="Prototypes, designs, system architectures, and the engineering process captured in high resolution."
      />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
        {/* Filter Tabs */}
        <motion.div
          className="flex flex-wrap gap-3"
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

        {/* Layout Toggle */}
        <motion.div
          className="flex gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {[
            { mode: 'masonry' as LayoutMode, icon: Grid3X3, label: 'Masonry' },
            { mode: 'grid' as LayoutMode, icon: LayoutGrid, label: 'Grid' },
            { mode: 'featured' as LayoutMode, icon: ImageIcon, label: 'Featured' },
          ].map(({ mode, icon: Icon, label }) => (
            <button
              key={mode}
              onClick={() => setLayout(mode)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                layout === mode ? 'bg-white text-void' : 'glass text-void14 hover:bg-white/10'
              }`}
              title={label}
            >
              <Icon size={16} />
            </button>
          ))}
        </motion.div>
      </div>

      {/* Gallery Grid */}
      <AnimatePresence mode="wait">
        {layout === 'masonry' && (
          <motion.div
            key="masonry"
            className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filteredImages.map((img, i) => (
              <motion.div
                key={`${img.id}-${i}`}
                className="break-inside-avoid relative group cursor-pointer rounded-xl overflow-hidden"
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                onClick={() => openLightbox(i)}
              >
                <div className={`relative ${getAspectClass(img.aspectRatio)}`}>
                  <img
                    src={img.src}
                    alt={img.caption}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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
            ))}
          </motion.div>
        )}

        {layout === 'grid' && (
          <motion.div
            key="grid"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filteredImages.map((img, i) => (
              <motion.div
                key={`${img.id}-${i}`}
                className="relative group cursor-pointer rounded-xl overflow-hidden aspect-square"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                onClick={() => openLightbox(i)}
              >
                <img
                  src={img.src}
                  alt={img.caption}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-void/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-12 h-12 rounded-full glass flex items-center justify-center">
                    <Maximize2 size={20} className="text-white" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="font-body text-xs text-neon-cyan uppercase tracking-wider">{img.category}</span>
                  <p className="font-heading text-white text-sm mt-1">{img.caption}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {layout === 'featured' && (
          <motion.div
            key="featured"
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Featured Image - Large */}
            {filteredImages[0] && (
              <motion.div
                className="relative group cursor-pointer rounded-2xl overflow-hidden aspect-[21/9]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onClick={() => openLightbox(0)}
              >
                <img
                  src={filteredImages[0].src}
                  alt={filteredImages[0].caption}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-void/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="font-body text-xs text-neon-cyan uppercase tracking-wider">{filteredImages[0].category}</span>
                  <p className="font-heading text-white text-xl mt-1">{filteredImages[0].caption}</p>
                </div>
              </motion.div>
            )}
            {/* Secondary Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredImages.slice(1).map((img, i) => (
                <motion.div
                  key={`${img.id}-${i}`}
                  className="relative group cursor-pointer rounded-xl overflow-hidden aspect-[4/3]"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  onClick={() => openLightbox(i + 1)}
                >
                  <img
                    src={img.src}
                    alt={img.caption}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-void/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="font-body text-xs text-neon-cyan uppercase tracking-wider">{img.category}</span>
                    <p className="font-heading text-white text-xs mt-1">{img.caption}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Lightbox
        isOpen={lightboxOpen}
        items={lightboxItems}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </Container>
  );
}
