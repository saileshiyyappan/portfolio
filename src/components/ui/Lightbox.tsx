'use client';

import { useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { lightboxOverlay, lightboxContent } from '@/lib/animations';
import { useModal } from '@/context/ModalContext';

interface LightboxItem {
  src: string;
  caption?: string;
  category?: string;
}

interface LightboxProps {
  isOpen: boolean;
  items: LightboxItem[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const LightboxContent = memo(function LightboxContent({
  isOpen,
  items,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: LightboxProps) {
  const { openModal, closeModal } = useModal();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    },
    [onClose, onNext, onPrev]
  );

  useEffect(() => {
    if (isOpen) {
      openModal();
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      closeModal();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown, openModal, closeModal]);

  const currentItem = items[currentIndex];
  if (!currentItem) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] bg-void/95 backdrop-blur-xl flex items-center justify-center"
          variants={lightboxOverlay}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          {/* Close Button - top-right as required */}
          <button
            className="fixed top-4 right-4 z-[210] flex items-center gap-2 px-4 py-2.5 rounded-full glass hover:bg-white/10 transition-colors"
            onClick={(e) => { e.stopPropagation(); onClose(); }}
          >
            <X size={16} className="text-white" />
            <span className="font-body text-sm text-white hidden sm:inline">Close</span>
          </button>

          {/* Prev Button */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full glass flex items-center justify-center z-[210] hover:bg-white/10 transition-colors"
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
          >
            <ChevronLeft size={20} className="text-white" />
          </button>

          {/* Content */}
          <motion.div
            key={currentIndex}
            className="max-w-[85vw] max-h-[80vh]"
            variants={lightboxContent}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentItem.src}
              alt={currentItem.caption || ''}
              className="max-w-full max-h-[75vh] object-contain rounded-lg"
            />
            <div className="mt-4 text-center">
              {currentItem.category && (
                <span className="font-body text-xs text-neon-cyan uppercase tracking-wider">
                  {currentItem.category}
                </span>
              )}
              {currentItem.caption && (
                <p className="font-heading text-white text-lg mt-1">
                  {currentItem.caption}
                </p>
              )}
            </div>
          </motion.div>

          {/* Next Button */}
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full glass flex items-center justify-center z-[210] hover:bg-white/10 transition-colors"
            onClick={(e) => { e.stopPropagation(); onNext(); }}
          >
            <ChevronRight size={20} className="text-white" />
          </button>

          {/* Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-body text-sm text-void14 z-[210]">
            {currentIndex + 1} / {items.length}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default function Lightbox(props: LightboxProps) {
  return <LightboxContent {...props} />;
}
