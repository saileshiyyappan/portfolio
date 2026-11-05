'use client';

import Image from 'next/image';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ZoomIn } from 'lucide-react';
import { galleryImages } from '@/data/gallery';
import { GalleryItem as GalleryItemType } from '@/types';
import timing from '@/content/timing.json';
import { useInView } from '@/hooks/useInView';
import SectionHeader from '@/components/ui/SectionHeader';
import Container from '@/components/ui/Container';
import ImageViewer from '@/components/ui/ImageViewer';

const SLOT_COUNT = 16;
const ROTATION_COUNT = 6;
const PACKING_GAP = 4;

interface GallerySlot {
  id: string;
  index: number;
  image: GalleryItemType;
}

interface PackedTile {
  slot: GallerySlot;
  left: number;
  top: number;
  width: number;
  height: number;
}

interface PackedLayout {
  tiles: PackedTile[];
  height: number;
}

function uniqueImages(images: GalleryItemType[]): GalleryItemType[] {
  const seen = new Set<string>();
  return images.filter((image) => {
    if (!image.src || seen.has(image.src)) return false;
    seen.add(image.src);
    return true;
  });
}

function shuffled<T>(items: T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function createInitialSlots(images: GalleryItemType[]): GallerySlot[] {
  return images.slice(0, SLOT_COUNT).map((image, index) => ({
    id: `gallery-slot-${String(index + 1).padStart(2, '0')}`,
    index,
    image,
  }));
}

function getFallbackAspect(image: GalleryItemType): number {
  switch (image.aspectRatio) {
    case 'portrait':
      return 0.7;
    case 'square':
      return 1;
    default:
      return 1.65;
  }
}

function getLogicalColumnCount(width: number): number {
  if (width >= 1100) return 12;
  if (width >= 700) return 9;
  if (width >= 460) return 6;
  return 3;
}

function getTileSpan(aspect: number, logicalColumns: number): number {
  if (aspect >= 1.35) return Math.min(logicalColumns, Math.ceil(logicalColumns / 2));
  return Math.min(3, logicalColumns);
}

function packSlots(
  slots: GallerySlot[],
  measuredAspects: Record<string, number>,
  width: number,
): PackedLayout {
  if (!width || slots.length === 0) return { tiles: [], height: 0 };

  const logicalColumns = getLogicalColumnCount(width);
  const unitWidth = (width - PACKING_GAP * (logicalColumns - 1)) / logicalColumns;
  const columnHeights = Array.from({ length: logicalColumns }, () => 0);
  const tiles: PackedTile[] = [];

  slots.forEach((slot) => {
    const aspect = measuredAspects[slot.image.src] || getFallbackAspect(slot.image);
    const span = getTileSpan(aspect, logicalColumns);
    const tileWidth = unitWidth * span + PACKING_GAP * (span - 1);
    const tileHeight = tileWidth / aspect;
    let bestStart = 0;
    let bestTop = Number.POSITIVE_INFINITY;
    let bestResultingHeight = Number.POSITIVE_INFINITY;

    for (let start = 0; start <= logicalColumns - span; start += 1) {
      const top = Math.max(...columnHeights.slice(start, start + span));
      const resultingHeight = Math.max(
        ...columnHeights,
        top + tileHeight + PACKING_GAP,
      );

      if (
        resultingHeight < bestResultingHeight ||
        (resultingHeight === bestResultingHeight && top < bestTop)
      ) {
        bestStart = start;
        bestTop = top;
        bestResultingHeight = resultingHeight;
      }
    }

    const left = bestStart * (unitWidth + PACKING_GAP);
    tiles.push({
      slot,
      left,
      top: bestTop,
      width: tileWidth,
      height: tileHeight,
    });

    for (let column = bestStart; column < bestStart + span; column += 1) {
      columnHeights[column] = bestTop + tileHeight + PACKING_GAP;
    }
  });

  return {
    tiles,
    height: Math.max(0, Math.max(...columnHeights) - PACKING_GAP),
  };
}

function preloadImage(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => {
      const finish = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
      if ('decode' in image) image.decode().then(finish).catch(finish);
      else finish();
    };
    image.onerror = () => reject(new Error(`Unable to preload gallery image: ${src}`));
    image.src = src;
  });
}

const GalleryItem = memo(function GalleryItem({
  tile,
  onClick,
  onImageLoad,
}: {
  tile: PackedTile;
  onClick: (index: number) => void;
  onImageLoad: (src: string, width: number, height: number) => void;
}) {
  const { slot } = tile;

  return (
    <button
      type="button"
      className="group absolute overflow-hidden rounded-2xl text-left"
      style={{ left: tile.left, top: tile.top, width: tile.width, height: tile.height }}
      onClick={() => onClick(slot.index)}
      aria-label={`Open ${slot.image.caption}`}
    >
      <Image
        src={slot.image.src}
        alt={slot.image.caption}
        fill
        sizes="(max-width: 460px) 92vw, (max-width: 700px) 46vw, (max-width: 1100px) 30vw, 24vw"
        className="block h-full w-full object-contain"
        unoptimized={slot.image.src.startsWith('http')}
        onLoad={(event) => {
          const image = event.currentTarget;
          onImageLoad(slot.image.src, image.naturalWidth, image.naturalHeight);
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-void/85 via-void/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="flex h-10 w-10 items-center justify-center rounded-full glass">
          <ZoomIn size={17} className="text-white" />
        </div>
      </div>
      <p className="absolute bottom-3 left-3 right-3 translate-y-2 font-heading text-xs text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        {slot.image.caption}
      </p>
    </button>
  );
});

export default function Gallery() {
  const { ref, isInView } = useInView({ rootMargin: '-100px' });
  const sourceImages = useMemo(() => uniqueImages(galleryImages), []);
  const [slots, setSlots] = useState<GallerySlot[]>(() => createInitialSlots(sourceImages));
  const [measuredAspects, setMeasuredAspects] = useState<Record<string, number>>({});
  const [containerWidth, setContainerWidth] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const packingRef = useRef<HTMLDivElement>(null);
  const slotsRef = useRef(slots);
  const recentlyChangedRef = useRef<number[]>([]);
  const rotationInProgressRef = useRef(false);

  useEffect(() => {
    slotsRef.current = slots;
  }, [slots]);

  useEffect(() => {
    const element = packingRef.current;
    if (!element) return;

    const updateWidth = () => {
      const nextWidth = Math.round(element.getBoundingClientRect().width);
      setContainerWidth((currentWidth) => currentWidth === nextWidth ? currentWidth : nextWidth);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const intervalSeconds = Number(timing.galleryImageInterval);
    if (
      !isInView ||
      lightboxOpen ||
      sourceImages.length <= SLOT_COUNT ||
      !Number.isFinite(intervalSeconds) ||
      intervalSeconds <= 0
    ) {
      return;
    }

    const rotateSlots = async () => {
      if (rotationInProgressRef.current) return;
      rotationInProgressRef.current = true;

      try {
        const currentSlots = slotsRef.current;
        const lockedSlots = new Set(recentlyChangedRef.current);
        const eligibleSlots = currentSlots
          .map((slot) => slot.index)
          .filter((index) => !lockedSlots.has(index));
        const selectedSlots = shuffled(eligibleSlots).slice(0, Math.min(ROTATION_COUNT, eligibleSlots.length));
        const visibleSources = new Set(currentSlots.map((slot) => slot.image.src));
        const replacementSources = new Set<string>();
        const replacements = selectedSlots.map((slotIndex) => {
          const candidates = shuffled(sourceImages).filter(
            (image) => !visibleSources.has(image.src) && !replacementSources.has(image.src)
          );
          const replacement = candidates[0];
          if (replacement) replacementSources.add(replacement.src);
          return { slotIndex, replacement };
        }).filter(
          (entry): entry is { slotIndex: number; replacement: GalleryItemType } => Boolean(entry.replacement)
        );

        if (replacements.length === 0) return;

        const readyReplacements = await Promise.all(
          replacements.map(async (entry) => {
            try {
              const dimensions = await preloadImage(entry.replacement.src);
              return {
                ...entry,
                aspect: dimensions.width / dimensions.height,
              };
            } catch {
              return null;
            }
          })
        );
        const ready = readyReplacements.filter(
          (entry): entry is { slotIndex: number; replacement: GalleryItemType; aspect: number } => Boolean(entry)
        );

        if (ready.length === 0) return;

        const readyBySlot = new Map(ready.map((entry) => [entry.slotIndex, entry.replacement]));
        const changedSlots = ready.map((entry) => entry.slotIndex);
        setSlots((current) => current.map((slot) => {
          const replacement = readyBySlot.get(slot.index);
          return replacement ? { ...slot, image: replacement } : slot;
        }));
        setMeasuredAspects((current) => {
          const next = { ...current };
          ready.forEach((entry) => { next[entry.replacement.src] = entry.aspect; });
          return next;
        });
        recentlyChangedRef.current = changedSlots;
      } finally {
        rotationInProgressRef.current = false;
      }
    };

    const interval = window.setInterval(() => void rotateSlots(), intervalSeconds * 1000);
    return () => window.clearInterval(interval);
  }, [isInView, lightboxOpen, sourceImages]);

  const packedLayout = useMemo(
    () => packSlots(slots, measuredAspects, containerWidth),
    [slots, measuredAspects, containerWidth]
  );

  const handleImageLoad = useCallback((src: string, width: number, height: number) => {
    if (!width || !height) return;
    const aspect = width / height;
    setMeasuredAspects((current) => current[src] === aspect ? current : { ...current, [src]: aspect });
  }, []);

  const lightboxItems = slots.map((slot) => ({
    src: slot.image.src,
    caption: slot.image.caption,
  }));

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const nextImage = useCallback(() => {
    setLightboxIndex((current) => (current + 1) % SLOT_COUNT);
  }, []);

  const prevImage = useCallback(() => {
    setLightboxIndex((current) => (current - 1 + SLOT_COUNT) % SLOT_COUNT);
  }, []);

  return (
    <section id="gallery" className="relative overflow-hidden py-12 sm:py-16">
      <Container ref={ref} size="full">
        <div className="mx-auto w-[92%] max-w-[1500px]">
          <SectionHeader
            subtitle="Visual Archive"
            title={<>Engineering <span className="text-gradient">Gallery</span></>}
            description="A compact visual archive of prototypes, designs, systems, and the engineering process."
          />

          <div
            ref={packingRef}
            className="relative w-full"
            style={{ height: packedLayout.height || undefined }}
          >
            {packedLayout.tiles.map((tile) => (
              <GalleryItem
                key={tile.slot.id}
                tile={tile}
                onClick={openLightbox}
                onImageLoad={handleImageLoad}
              />
            ))}
          </div>
        </div>
      </Container>

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
