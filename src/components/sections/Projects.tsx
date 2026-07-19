'use client';

import { useState, useEffect, memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Project } from '@/types';
import { useInView } from '@/hooks/useInView';
import { scrollRevealLeft, scrollRevealRight } from '@/lib/animations';
import SectionHeader from '@/components/ui/SectionHeader';
import Container from '@/components/ui/Container';
import ImageViewer from '@/components/ui/ImageViewer';

function StatusBadge({ status }: { status: Project['status'] }) {
  const statusConfig = {
    active: { color: 'bg-neon-green/20 text-neon-green', label: 'Active Development' },
    completed: { color: 'bg-neon-blue/20 text-neon-blue', label: 'Completed' },
    'in-development': { color: 'bg-neon-yellow/20 text-neon-yellow', label: 'In Development' },
    archived: { color: 'bg-void12 text-void14', label: 'Archived' },
  };
  const config = statusConfig[status] || statusConfig.archived;
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-body font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}

const ProjectShowcase = memo(function ProjectShowcase({ project, index }: { project: Project; index: number }) {
  const { ref, isInView } = useInView({ rootMargin: '-50px' });
  const images = Array.isArray(project.galleryImages) ? project.galleryImages : [];
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const isEven = index % 2 === 0;

  const openLightbox = useCallback((idx: number) => {
    if (!images || images.length === 0) return;
    const clamped = Math.max(0, Math.min(idx, images.length - 1));
    setLightboxIndex(clamped);
    setLightboxOpen(true);
  }, [images]);

  const nextImage = useCallback(() => {
    if (!images || images.length === 0) return;
    setLightboxIndex((prev) => (prev + 1) % images.length);
  }, [images]);

  const prevImage = useCallback(() => {
    if (!images || images.length === 0) return;
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images]);

  const lightboxItems = images.map((img) => ({
    src: img.src,
    caption: img.caption,
  }));

  // Keep activeImage within bounds if gallery changes
  useEffect(() => {
    if (!images || images.length === 0) {
      setActiveImage(0);
      return;
    }
    if (activeImage > images.length - 1) {
      setActiveImage(images.length - 1);
    }
  }, [images, activeImage]);

  return (
    <>
      <motion.div
        ref={ref}
        className="relative"
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={isEven ? scrollRevealLeft(0) : scrollRevealRight(0)}
      >
        {/* Large Showcase Card */}
        <div className="group relative glass rounded-3xl overflow-hidden">
          {/* Hero Image Section */}
          <div className={`grid grid-cols-1 lg:grid-cols-2 ${isEven ? '' : 'lg:grid-flow-dense'}`}>
            {/* Image Side */}
            <div className={`relative ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
              <motion.div
                className="relative aspect-[4/3] lg:aspect-auto lg:h-full min-h-[400px] cursor-pointer overflow-hidden"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.6 }}
                onClick={() => openLightbox(activeImage)}
              >
                {images && images.length > 0 ? (
                  <img
                    src={images[activeImage].src}
                    alt={images[activeImage].caption || ''}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-void11 text-void14 text-sm font-body">
                    No Image Available
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-void/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-void/40" />
                
                {/* Image Navigation Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.slice(0, 4).map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setActiveImage(Math.min(i, Math.max(0, images.length - 1))); }}
                      className={`w-2 h-2 rounded-full transition-all ${activeImage === i ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'}`}
                    />
                  ))}
                </div>

                {/* Expand Icon */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight size={16} className="text-white" />
                </div>
              </motion.div>
            </div>

            {/* Content Side */}
            <div className={`p-8 lg:p-12 flex flex-col justify-center ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
              {/* Category & Status */}
              <div className="flex items-center gap-3 mb-4">
                <span className={`inline-block font-body text-xs tracking-[0.2em] uppercase bg-gradient-to-r ${project.color} bg-clip-text text-transparent font-semibold`}>
                  {project.category}
                </span>
                <StatusBadge status={project.status} />
              </div>

              {/* Title */}
              <h3 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
                {project.title}
              </h3>

              {/* Description */}
              <p className="font-body text-void14 leading-relaxed mb-6 text-base">
                {project.shortDescription}
              </p>

              {/* Technology Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {project.technologies.slice(0, 6).map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 glass rounded-full font-body text-xs text-void14 border border-white/5"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 6 && (
                  <span className="px-3 py-1.5 font-body text-xs text-void12">
                    +{project.technologies.length - 6} more
                  </span>
                )}
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {project.metrics.slice(0, 4).map((metric) => (
                  <div key={metric.label} className="glass rounded-xl p-4">
                    <div className="font-heading font-bold text-xl text-gradient mb-1">{metric.value}</div>
                    <div className="font-body text-xs text-void13">{metric.label}</div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link
                href={`/projects/${project.slug}`}
                className="group/btn inline-flex items-center gap-3 px-8 py-4 bg-white text-void font-heading font-semibold rounded-full hover:bg-neon-cyan transition-colors w-fit"
              >
                View Case Study
                <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Image Viewer */}
      <ImageViewer
        isOpen={lightboxOpen}
        items={lightboxItems}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </>
  );
});

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) return;
        const data: Project[] = await response.json();
        setProjects(data);
      } catch {
        // fallback: empty
      }
    }
    load();
  }, []);

  return (
    <section id="projects" className="relative py-16 sm:py-20 overflow-hidden">
      <Container>
        <SectionHeader
          subtitle="Featured Work"
          title={<>Projects that <span className="text-gradient">Define</span> Engineering</>}
          description="A curated selection of engineering systems spanning wearable technology, AI platforms, and consumer hardware — each built with patent-worthy innovation and deployable outcomes."
        />

        <div className="space-y-16 md:space-y-20">
          {projects.map((project, i) => (
            <ProjectShowcase key={project.id} project={project} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
