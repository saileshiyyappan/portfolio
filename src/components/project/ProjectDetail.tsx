'use client';

import Image from 'next/image';
import { memo, useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ExternalLink, FileText, Cpu, Layers, Lightbulb, BarChart3, Clock, Users, CheckCircle2 } from 'lucide-react';
import { MediaItem, Project } from '@/types';
import Container from '@/components/ui/Container';
import { fadeUp } from '@/lib/animations';
import ImageViewer from '@/components/ui/ImageViewer';
import YouTubeVideoModal from '@/components/ui/YouTubeVideoModal';
import { resolveImageSrc } from '@/lib/media';

interface ProjectDetailProps {
  project: Project;
}

const StatusBadge = memo(function StatusBadge({ status }: { status: Project['status'] }) {
  const statusConfig = {
    active: { color: 'bg-neon-green/20 text-neon-green', label: 'Active Development' },
    completed: { color: 'bg-neon-blue/20 text-neon-blue', label: 'Completed' },
    'in-development': { color: 'bg-neon-yellow/20 text-neon-yellow', label: 'In Development' },
    archived: { color: 'bg-void12 text-void14', label: 'Archived' },
  };
  const s = statusConfig[status] || statusConfig.archived;
  return <span className={`px-3 py-1 rounded-full text-xs font-body ${s.color}`}>{s.label}</span>;
});

const GalleryImage = memo(function GalleryImage({ img, onClick }: { img: Project['galleryImages'][0]; onClick: () => void }) {
  const imageSrc = resolveImageSrc(img);
  if (!imageSrc) return null;

  return (
    <motion.div
      className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
    >
        <Image src={imageSrc} alt={img.caption || ''} fill sizes="(max-width: 768px) 100vw, 33vw" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" unoptimized={imageSrc.startsWith('http')} />
      <div className="absolute inset-0 bg-void/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <ArrowUpRight size={24} className="text-white" />
      </div>
      {img.caption && (
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-void/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="font-body text-xs text-white/80">{img.caption}</p>
        </div>
      )}
    </motion.div>
  );
});

const VideoCard = memo(function VideoCard({ video, onClick }: { video: Project['videos'][0]; onClick: () => void }) {
  const hasVideo = Boolean(video.src && video.src.trim());
  const thumbnailSrc = resolveImageSrc(video.thumbnail);

  return (
    <div
      className={`relative aspect-video overflow-hidden rounded-3xl border border-white/10 bg-void/70 shadow-2xl ${hasVideo ? 'cursor-pointer' : 'cursor-default'}`}
      onClick={hasVideo ? onClick : undefined}
    >
      {thumbnailSrc ? (
        <Image src={thumbnailSrc} alt={video.caption || ''} fill sizes="(max-width: 768px) 100vw, 50vw" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" unoptimized={thumbnailSrc.startsWith('http')} />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-void to-void/80 font-body text-sm text-void14">
          No Thumbnail Available
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-void/95 via-void/30 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center">
        {hasVideo ? (
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21" /></svg>
          </div>
        ) : (
          <div className="rounded-full border border-white/20 bg-void/70 px-4 py-2 font-body text-sm text-white/80 backdrop-blur-md">
            Coming Soon
          </div>
        )}
      </div>
      {video.caption && (
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="font-heading text-lg text-white">{video.caption}</p>
        </div>
      )}
    </div>
  );
});

const ImageSection = memo(function ImageSection({
  title,
  description,
  images,
  onOpen,
}: {
  title: string;
  description: string;
  images: MediaItem[];
  onOpen: (image: MediaItem) => void;
}) {
  if (images.length === 0) return null;

  return (
    <div className="mb-20">
      <h2 className="font-heading font-semibold text-2xl text-white mb-2">{title}</h2>
      <p className="font-body text-void14 mb-8">{description}</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <GalleryImage
            key={`${resolveImageSrc(image)}-${index}`}
            img={image}
            onClick={() => onOpen(image)}
          />
        ))}
      </div>
    </div>
  );
});

export default function ProjectDetail({ project }: ProjectDetailProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);
  const [videoIndex, setVideoIndex] = useState(0);

  const coverImageSrc = resolveImageSrc(project.coverImage) || resolveImageSrc(project.heroImage);
  const imageGroups = useMemo(() => {
    const uniqueImages = (images: MediaItem[] | undefined): MediaItem[] => {
      const seen = new Set<string>();
      return (images || []).filter((image) => {
        const src = resolveImageSrc(image);
        if (!src || seen.has(src)) return false;
        seen.add(src);
        return true;
      });
    };

    return [
      {
        id: 'gallery',
        title: 'Gallery',
        description: 'Architecture diagrams, prototypes, testing, and product photography.',
        images: uniqueImages(project.galleryImages),
      },
      {
        id: 'architecture',
        title: 'Architecture',
        description: 'System architecture diagrams and technical design views.',
        images: uniqueImages(project.architectureImages),
      },
      {
        id: 'flowcharts',
        title: 'Flowcharts / System Flow',
        description: 'Process flows, system logic, and engineering workflows.',
        images: uniqueImages(project.flowcharts),
      },
      {
        id: 'screenshots',
        title: 'Screenshots',
        description: 'Software interfaces, dashboards, and product screens.',
        images: uniqueImages(project.screenshots),
      },
      {
        id: 'prototype',
        title: 'Prototype / Development Images',
        description: 'Prototype builds, testing, and development documentation.',
        images: uniqueImages(project.prototypeImages),
      },
    ].filter((group) => group.images.length > 0);
  }, [
    project.architectureImages,
    project.flowcharts,
    project.galleryImages,
    project.prototypeImages,
    project.screenshots,
  ]);
  const allImages = useMemo(
    () => {
      const seen = new Set<string>();
      const images = [project.coverImage, ...imageGroups.flatMap((group) => group.images)];
      return images.filter((image) => {
        const src = resolveImageSrc(image);
        if (!src || seen.has(src)) return false;
        seen.add(src);
        return true;
      });
    },
    [imageGroups, project.coverImage]
  );

  const openLightbox = useCallback((idx: number) => {
    if (allImages.length === 0) return;
    setLightboxIndex(idx);
    setLightboxOpen(true);
  }, [allImages.length]);

  const openImage = useCallback((image: MediaItem) => {
    const src = resolveImageSrc(image);
    if (!src) return;
    const index = allImages.findIndex((item) => resolveImageSrc(item) === src);
    if (index >= 0) openLightbox(index);
  }, [allImages, openLightbox]);

  const nextImage = useCallback(() => {
    if (allImages.length > 0) setLightboxIndex((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);
  const prevImage = useCallback(() => {
    if (allImages.length > 0) setLightboxIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  const lightboxItems = allImages.map((img) => ({
    src: resolveImageSrc(img)!,
    caption: img.caption,
  }));

  return (
    <Container>
      <motion.div initial="hidden" animate="visible" variants={fadeUp}>
        {/* Hero */}
        <div className="relative rounded-3xl overflow-hidden mb-16">
          <div className="relative aspect-[21/9] lg:aspect-[3/1]">
            {coverImageSrc ? (
              <Image src={coverImageSrc} alt={project.title} fill sizes="100vw" className="w-full h-full object-cover" unoptimized={coverImageSrc.startsWith('http')} />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-void11 font-body text-sm text-void14">
                No Image Available
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-void/60 via-transparent to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
            <div className="flex items-center gap-3 mb-4">
              <span className={`inline-block font-body text-xs tracking-[0.2em] uppercase bg-gradient-to-r ${project.color} bg-clip-text text-transparent font-semibold`}>
                {project.category}
              </span>
              <StatusBadge status={project.status} />
            </div>
            <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-2">
              {project.title}
            </h1>
            <p className="font-body text-void14 text-lg max-w-2xl">{project.subtitle}</p>
          </div>
        </div>

        {/* Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          <div className="lg:col-span-2">
            <h2 className="font-heading font-semibold text-2xl text-white mb-6">Overview</h2>
            <p className="font-body text-void14 leading-relaxed text-lg mb-8">{project.fullDescription}</p>

            {/* Problem & Solution */}
            <div className="space-y-8">
              {project.problemStatement && <div className="glass rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-neon-red/10 flex items-center justify-center">
                    <BarChart3 size={20} className="text-neon-red" />
                  </div>
                  <h3 className="font-heading font-semibold text-xl text-white">Problem Statement</h3>
                </div>
                {project.problemStatement && (
                  <p className="font-body text-void14 leading-relaxed">{project.problemStatement}</p>
                )}
              </div>}
              {project.solution && <div className="glass rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-neon-green/10 flex items-center justify-center">
                    <CheckCircle2 size={20} className="text-neon-green" />
                  </div>
                  <h3 className="font-heading font-semibold text-xl text-white">Solution</h3>
                </div>
                {project.solution && (
                  <p className="font-body text-void14 leading-relaxed">{project.solution}</p>
                )}
              </div>}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Roles */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users size={16} className="text-neon-cyan" />
                <h3 className="font-heading font-medium text-white">Role</h3>
              </div>
              <div className="space-y-2">
                {project.roles.map((role) => (
                  <p key={role} className="font-body text-sm text-void14">{role}</p>
                ))}
              </div>
            </div>

            {/* Technologies */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Cpu size={16} className="text-neon-cyan" />
                <h3 className="font-heading font-medium text-white">Technologies</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span key={tech} className="px-3 py-1.5 glass rounded-full font-body text-xs text-void14 border border-white/5">{tech}</span>
                ))}
              </div>
            </div>

            {/* Metrics */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={16} className="text-neon-cyan" />
                <h3 className="font-heading font-medium text-white">Key Metrics</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {project.metrics.map((metric) => (
                  <div key={metric.label}>
                    <div className="font-heading font-bold text-xl text-gradient">{metric.value}</div>
                    <div className="font-body text-xs text-void13">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            {project.links.length > 0 && (
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ExternalLink size={16} className="text-neon-cyan" />
                  <h3 className="font-heading font-medium text-white">Links</h3>
                </div>
                <div className="space-y-3">
                  {project.links.map((link) => (
                    <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-void14 hover:text-white transition-colors font-body text-sm">
                      {link.label}
                      <ArrowUpRight size={12} />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Architecture & Innovation */}
        {(project.architecture?.length || project.innovation?.length) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {project.architecture?.length ? (
              <div className="glass rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-neon-blue/10 flex items-center justify-center">
                    <Layers size={20} className="text-neon-blue" />
                  </div>
                  <h3 className="font-heading font-semibold text-xl text-white">Architecture</h3>
                </div>
                <ul className="space-y-3">
                  {project.architecture.map((item, index) => (
                    <li key={`${item}-${index}`} className="flex items-start gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${project.color} mt-2 flex-shrink-0`} />
                      <span className="font-body text-void14 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {project.innovation?.length ? (
              <div className="glass rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-neon-purple/10 flex items-center justify-center">
                    <Lightbulb size={20} className="text-neon-purple" />
                  </div>
                  <h3 className="font-heading font-semibold text-xl text-white">Innovation Highlights</h3>
                </div>
                <ul className="space-y-3">
                  {project.innovation.map((item, index) => (
                    <li key={`${item}-${index}`} className="flex items-start gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${project.color} mt-2 flex-shrink-0`} />
                      <span className="font-body text-void14 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Image collections */}
        {imageGroups.map((group) => (
          <ImageSection
            key={group.id}
            title={group.title}
            description={group.description}
            images={group.images}
            onOpen={openImage}
          />
        ))}

        {/* Videos */}
        {project.videos && project.videos.length > 0 && (
          <div className="mb-20">
            <h2 className="font-heading font-semibold text-2xl text-white mb-2">Videos</h2>
            <p className="font-body text-void14 mb-8">Product demonstrations and engineering walkthroughs.</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {project.videos.map((video, i) => (
                <VideoCard key={`${video.src}-${i}`} video={video} onClick={() => { setVideoIndex(i); setVideoOpen(true); }} />
              ))}
            </div>
          </div>
        )}

        {/* Research & Documentation */}
        {project.documents && project.documents.length > 0 && (
        <div className="glass rounded-2xl p-8 mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-neon-teal/10 flex items-center justify-center">
              <FileText size={20} className="text-neon-teal" />
            </div>
            <h3 className="font-heading font-semibold text-xl text-white">Research & Documentation</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {project.documents.map((document, index) => (
              <a key={`${document.title}-${index}`} href={document.url} className="px-4 py-2 glass rounded-full font-body text-sm text-void14 border border-white/5 hover:text-white transition-colors">
                {document.title}
              </a>
            ))}
          </div>
        </div>
        )}

        {/* Current Status & Future */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="glass rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Clock size={20} className="text-neon-cyan" />
              <h3 className="font-heading font-semibold text-xl text-white">Current Status</h3>
            </div>
            <p className="font-body text-void14 leading-relaxed">
              {project.currentStatus || (project.status === 'completed'
                ? 'Project completed and deployed. Product is in active use with ongoing maintenance and documentation updates.'
                : project.status === 'active'
                ? 'Active development with regular feature releases, testing cycles, and user feedback integration. Continuous deployment pipeline operational.'
                : 'In development phase with prototyping, testing, and validation underway. Targeting deployment in the next quarter.')}
            </p>
          </div>
          {project.futureWork?.length ? <div className="glass rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb size={20} className="text-neon-purple" />
              <h3 className="font-heading font-semibold text-xl text-white">Future Development</h3>
            </div>
            <ul className="space-y-3">
              {project.futureWork.map((item, index) => (
                <li key={`${item}-${index}`} className="flex items-start gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${project.color} mt-2 flex-shrink-0`} />
                  <span className="font-body text-void14 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          : null}
        </div>

        {/* Timeline */}
        <div className="mb-20">
          <h2 className="font-heading font-semibold text-2xl text-white mb-8">Development Timeline</h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-white/10" />
            <div className="space-y-8">
              {project.timeline.milestones.map((milestone, i) => (
                <div key={`${milestone.date}-${i}`} className="relative pl-12">
                  <div className={`absolute left-2 top-2 w-5 h-5 rounded-full bg-gradient-to-r ${project.color} border-4 border-void`} />
                  <div className="glass rounded-xl p-6">
                    <span className="font-body text-xs text-neon-cyan uppercase tracking-wider">{milestone.date}</span>
                    <h4 className="font-heading font-medium text-white mt-1">{milestone.title}</h4>
                    <p className="font-body text-sm text-void14 mt-1">{milestone.description}</p>
                  </div>
                </div>
              ))}
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

      {/* YouTube Video Modal */}
      {project.videos && project.videos[videoIndex] && (
        <YouTubeVideoModal
          isOpen={videoOpen}
          videoUrl={project.videos[videoIndex].src}
          title={project.videos[videoIndex].caption}
          thumbnailUrl={resolveImageSrc(project.videos[videoIndex].thumbnail)}
          onClose={() => setVideoOpen(false)}
        />
      )}
    </Container>
  );
}
