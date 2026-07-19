'use client';

import { useState, memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, ExternalLink } from 'lucide-react';
import { videos } from '@/data/videos';
import { VideoItem } from '@/types';
import { useInView } from '@/hooks/useInView';
import SectionHeader from '@/components/ui/SectionHeader';
import Container from '@/components/ui/Container';
import YouTubeVideoModal from '@/components/ui/YouTubeVideoModal';

const CinematicVideoCard = memo(function CinematicVideoCard({ video, index }: { video: VideoItem; index: number }) {
  const { ref, isInView } = useInView({ rootMargin: '-50px' });
  const [isHovered, setIsHovered] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);
  const handleOpen = useCallback(() => setIsPlayerOpen(true), []);
  const handleClose = useCallback(() => setIsPlayerOpen(false), []);

  const hasVideo = Boolean(video.youtubeUrl && video.youtubeUrl.trim());

  return (
    <>
      <motion.div
        ref={ref}
        className="group relative"
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: index * 0.15 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={`relative aspect-[16/9] overflow-hidden rounded-3xl border border-white/10 bg-void/70 shadow-2xl ${hasVideo ? 'cursor-pointer' : 'cursor-default'}`}
          onClick={hasVideo ? handleOpen : undefined}
        >
          <img
            src={video.thumbnail.src || '/images/techlance/Screenshot 2026-04-28 230510.png'}
            alt={video.title}
            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void/95 via-void/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-void/40 via-transparent to-void/20" />

          <div className="absolute left-4 top-4 rounded-full border border-neon-blue/20 bg-neon-blue/20 px-3 py-1.5 font-body text-[11px] uppercase tracking-[0.25em] text-neon-cyan backdrop-blur-sm">
            {video.category}
          </div>

          <div className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 font-body text-xs text-white backdrop-blur-sm">
            {video.duration || 'Coming Soon'}
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            {hasVideo ? (
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-xl transition-colors group-hover:bg-white/20">
                <Play size={36} className="ml-1 text-white" />
              </div>
            ) : (
              <div className="rounded-full border border-white/20 bg-void/70 px-4 py-2 font-body text-sm text-white/80 backdrop-blur-xl">
                Coming Soon
              </div>
            )}
          </div>

          <motion.div
            className="absolute bottom-0 left-0 right-0 p-6 lg:p-8"
            initial={{ y: 20, opacity: 0 }}
            animate={isHovered ? { y: 0, opacity: 1 } : { y: 10, opacity: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="mb-2 font-heading text-xl font-semibold text-white lg:text-2xl">{video.title}</h3>
            <p className="max-w-xl font-body text-sm text-void14 line-clamp-2">{video.description}</p>
          </motion.div>
        </div>
      </motion.div>

      {hasVideo && (
        <a
          href={video.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-2 text-sm text-neon-cyan transition-colors hover:text-white"
        >
          <ExternalLink size={14} />
          Watch on YouTube
        </a>
      )}

      <YouTubeVideoModal
        isOpen={isPlayerOpen}
        videoUrl={video.youtubeUrl}
        title={video.title}
        thumbnailUrl={video.thumbnail.src}
        onClose={handleClose}
      />
    </>
  );
});

export default function VideoShowcase() {
  return (
    <section id="videos" className="relative py-16 sm:py-20 overflow-hidden">
      <Container>
        <SectionHeader
          subtitle="Product Demos"
          title={<>Video <span className="text-gradient">Showcase</span></>}
          description="Cinematic product demonstrations and engineering walkthroughs that bring the technology to life."
        />

        {/* Featured Video - Large */}
        <div className="mb-8">
          <CinematicVideoCard video={videos[0]} index={0} />
        </div>

        {/* Secondary Videos - Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {videos.slice(1).map((video, i) => (
            <CinematicVideoCard key={video.id} video={video} index={i + 1} />
          ))}
        </div>
      </Container>
    </section>
  );
}
