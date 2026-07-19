'use client';

import ParticleField from '@/components/animations/ParticleField';
import FloatingShapes from '@/components/animations/FloatingShapes';
import CursorSpotlight from '@/components/animations/CursorSpotlight';

export default function Background() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Layer 1: Animated dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-void via-void2 to-void3" />

      {/* Layer 2: Moving grid pattern */}
      <div className="absolute inset-0 bg-grid opacity-50" />

      {/* Layer 3: Blurred glowing orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-neon-blue/10 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-neon-cyan/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon-teal/5 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '1s' }} />

      {/* Layer 4: Particle system */}
      <ParticleField />

      {/* Layer 5: Noise texture */}
      <div className="absolute inset-0 noise-overlay" />

      {/* Layer 6: Cursor spotlight */}
      <CursorSpotlight />

      {/* Floating geometric shapes */}
      <FloatingShapes />
    </div>
  );
}
