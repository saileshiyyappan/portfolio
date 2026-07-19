'use client';

import { useEffect, useRef } from 'react';

export default function CursorSpotlight() {
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!spotlightRef.current) return;
      spotlightRef.current.style.left = `${e.clientX - 200}px`;
      spotlightRef.current.style.top = `${e.clientY - 200}px`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={spotlightRef}
      className="fixed w-[400px] h-[400px] rounded-full pointer-events-none z-[1]"
      style={{
        background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)',
        transform: 'translateZ(0)',
      }}
    />
  );
}
