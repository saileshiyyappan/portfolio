'use client';

import { useEffect, useCallback, useRef, useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useModal } from '@/context/ModalContext';

interface ImageViewerItem {
  src: string;
  caption?: string;
  category?: string;
}

interface ImageViewerProps {
  isOpen: boolean;
  items: ImageViewerItem[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const ImageViewerContent = memo(function ImageViewerContent({
  isOpen,
  items,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: ImageViewerProps) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [touchStartX, setTouchStartX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { openModal, closeModal } = useModal();

  const currentItem = items[currentIndex];

  const resetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const rotateImage = useCallback(() => {
    setRotation((r) => (r + 90) % 360);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') { resetZoom(); onClose(); }
      if (e.key === 'ArrowRight') { resetZoom(); onNext(); }
      if (e.key === 'ArrowLeft') { resetZoom(); onPrev(); }
      if (e.key === '+' || e.key === '=') setScale((s) => Math.min(s + 0.25, 4));
      if (e.key === '-') setScale((s) => Math.max(s - 0.25, 0.5));
    },
    [onClose, onNext, onPrev, resetZoom]
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

  useEffect(() => {
    resetZoom();
    setRotation(0);
  }, [currentIndex, resetZoom]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    setScale((s) => Math.min(Math.max(s + delta, 0.5), 4));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsDragging(false);
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50 && scale <= 1) {
      if (diff > 0) onNext();
      else onPrev();
    }
  };

  const handleDoubleClick = () => {
    if (scale > 1) resetZoom();
    else setScale(2);
  };

  if (!currentItem) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          className="fixed inset-0 z-[200] bg-void/95 backdrop-blur-xl flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === containerRef.current) { resetZoom(); onClose(); }
          }}
        >
          {/* Top Bar - Close button top-right as required */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 z-[210] bg-void/40 backdrop-blur-md border-b border-white/5">
            <div className="flex items-center gap-3">
              <span className="font-body text-xs text-void12">
                {currentIndex + 1} / {items.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setScale((s) => Math.max(s - 0.25, 0.5))}
                className="w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
                aria-label="Zoom out"
              >
                <ZoomOut size={14} className="text-white" />
              </button>
              <span className="font-body text-xs text-void12 w-12 text-center">{Math.round(scale * 100)}%</span>
              <button
                onClick={() => setScale((s) => Math.min(s + 0.25, 4))}
                className="w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
                aria-label="Zoom in"
              >
                <ZoomIn size={14} className="text-white" />
              </button>
              <button
                onClick={rotateImage}
                className="w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
                aria-label="Rotate image"
              >
                <RotateCcw size={14} className="text-white" />
              </button>
              {/* Top-right close button */}
              <button
                onClick={() => { resetZoom(); onClose(); }}
                className="w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors ml-2"
                aria-label="Close viewer"
              >
                <X size={16} className="text-white" />
              </button>
            </div>
          </div>

          {/* Image Area */}
          <div className="flex-1 flex items-center justify-center relative overflow-hidden p-4">
            {/* Prev */}
            <button
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full glass flex items-center justify-center z-[210] hover:bg-white/10 transition-colors"
              onClick={(e) => { e.stopPropagation(); resetZoom(); onPrev(); }}
              aria-label="Previous image"
            >
              <ChevronLeft size={18} className="text-white" />
            </button>

            {/* Image */}
            <motion.div
              key={currentIndex}
              className="relative max-w-full max-h-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <img
                src={currentItem.src}
                alt={currentItem.caption || ''}
                className="max-w-[90vw] max-h-[75vh] object-contain rounded-lg cursor-grab active:cursor-grabbing select-none"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                }}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onDoubleClick={handleDoubleClick}
                draggable={false}
              />
            </motion.div>

            {/* Next */}
            <button
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full glass flex items-center justify-center z-[210] hover:bg-white/10 transition-colors"
              onClick={(e) => { e.stopPropagation(); resetZoom(); onNext(); }}
              aria-label="Next image"
            >
              <ChevronRight size={18} className="text-white" />
            </button>
          </div>

          {/* Bottom Bar */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 z-[210] bg-void/40 backdrop-blur-md border-t border-white/5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <div>
                {currentItem.category && (
                  <span className="font-body text-xs text-neon-cyan uppercase tracking-wider mr-2">
                    {currentItem.category}
                  </span>
                )}
                {currentItem.caption && (
                  <span className="font-body text-sm text-white">{currentItem.caption}</span>
                )}
              </div>
              <div className="font-body text-xs text-void12 hidden sm:block">
                Scroll to zoom · Drag to pan · Swipe to navigate · Double-click to zoom
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default function ImageViewer(props: ImageViewerProps) {
  return <ImageViewerContent {...props} />;
}
