'use client';

import { useEffect, useMemo, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, X } from 'lucide-react';

interface YouTubeVideoModalProps {
  isOpen: boolean;
  videoUrl?: string;
  title?: string;
  thumbnailUrl?: string;
  onClose: () => void;
}

function getYouTubeEmbedUrl(videoUrl?: string): string | null {
  const normalized = videoUrl?.trim() || '';
  if (!normalized) return null;

  const match = normalized.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/i);
  if (!match) return null;

  return `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0`;
}

export default function YouTubeVideoModal({
  isOpen,
  videoUrl,
  title,
  thumbnailUrl,
  onClose,
}: YouTubeVideoModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const embedUrl = useMemo(() => getYouTubeEmbedUrl(videoUrl), [videoUrl]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          className="fixed inset-0 z-[220] flex items-center justify-center bg-void/95 px-4 py-6 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(event) => {
            if (event.target === containerRef.current) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-void shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 bg-void/70 px-4 py-3 sm:px-6">
              <div>
                <p className="font-body text-[11px] uppercase tracking-[0.25em] text-neon-cyan">YouTube Demo</p>
                <h3 className="font-heading text-lg text-white">{title || 'Project Demo'}</h3>
              </div>
              <div className="flex items-center gap-2">
                {embedUrl && (
                  <a
                    href={videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-white transition-colors hover:bg-white/20"
                  >
                    <ExternalLink size={14} />
                    Open in YouTube
                  </a>
                )}
                <button
                  onClick={onClose}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition-colors hover:bg-white/20"
                  aria-label="Close player"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {embedUrl ? (
              <div className="aspect-video w-full bg-black">
                <iframe
                  src={embedUrl}
                  title={title || 'YouTube video'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-void to-void/80 px-8 py-16 text-center">
                <div className="rounded-full border border-white/10 bg-white/10 p-4">
                  <X size={24} className="text-white/80" />
                </div>
                <div>
                  <h4 className="font-heading text-2xl text-white">YouTube Demo Coming Soon</h4>
                  <p className="mt-2 max-w-md font-body text-sm text-void14">
                    This project has not been published yet. Once a YouTube URL is added to the JSON, it will appear here automatically.
                  </p>
                </div>
                {thumbnailUrl && (
                  <img src={thumbnailUrl} alt={title || 'Thumbnail'} className="h-44 w-full max-w-md rounded-2xl object-cover" />
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
