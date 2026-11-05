'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { heroData } from '@/data/hero';
import resume from '@/content/resume.json';
import profilePic from '@/content/profile_pic.json';

export default function Hero() {
  const [profileImageAvailable, setProfileImageAvailable] = useState(true);
  const [isProfilePreviewOpen, setIsProfilePreviewOpen] = useState(false);
  const profileImage = typeof (profilePic as { image?: unknown }).image === 'string'
    ? profilePic.image.trim()
    : '';
  const profileImageAlt = typeof (profilePic as { alt?: unknown }).alt === 'string'
    ? profilePic.alt
    : 'Sailesh Iyyappan Jr.';

  useEffect(() => {
    if (!isProfilePreviewOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsProfilePreviewOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isProfilePreviewOpen]);

  return (
    <section
      id="hero"
      className="relative min-h-[calc(100vh-var(--navbar-height))] flex items-start justify-center pt-[var(--navbar-height)] pb-2"
    >
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Availability Badge */}
        <motion.div
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green" />
          </span>
          <span className="text-xs font-body text-void14 tracking-wide">
            Available for Research, Collaboration & Product Development
          </span>
        </motion.div>

        {/* Profile Image Placeholder */}
        <motion.div
          className="relative mx-auto mb-5 w-32 h-32 sm:w-40 sm:h-40"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-neon-blue/20 to-neon-cyan/10 animate-pulse-slow" />
          <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-neon-blue/30 via-neon-cyan/20 to-neon-teal/10 blur-sm" />
          <div className="relative w-full h-full rounded-full glass border border-white/10 flex items-center justify-center overflow-hidden">
            {profileImageAvailable && profileImage ? (
              <img
                src={profileImage}
                alt={profileImageAlt}
                className="w-full h-full object-cover cursor-zoom-in"
                role="button"
                tabIndex={0}
                aria-label="View profile picture"
                onClick={() => setIsProfilePreviewOpen(true)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setIsProfilePreviewOpen(true);
                  }
                }}
                onError={() => setProfileImageAvailable(false)}
              />
            ) : (
              <span className="font-heading font-bold text-3xl sm:text-4xl text-white/60">SAILESH IYYAPPAN.JR</span>
            )}
          </div>
        </motion.div>

        {isProfilePreviewOpen && (
          <div
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/65 p-4"
            onClick={() => setIsProfilePreviewOpen(false)}
          >
            <div
              className="relative h-[min(85vh,640px)] w-[min(92vw,640px)]"
              role="dialog"
              aria-modal="true"
              aria-label="Profile picture preview"
            >
              <button
                type="button"
                className="absolute right-2 top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-3xl leading-none text-white hover:bg-black/90"
                aria-label="Close profile picture preview"
                onClick={() => setIsProfilePreviewOpen(false)}
              >
                ×
              </button>
              <img
                src={profileImage}
                alt={profileImageAlt}
                className="h-full w-full rounded-lg object-contain"
                onClick={(event) => event.stopPropagation()}
              />
            </div>
          </div>
        )}

        {/* Title Badge */}
        <motion.div
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <Sparkles size={14} className="text-neon-cyan" />
          <span className="text-xs font-body text-void14 tracking-wide">
            Systems Product Engineer — Technical Founder
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          className="font-heading font-bold text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] text-white tracking-tight leading-[0.9] mb-3"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          SAILESH
          <br />
          <span className="text-gradient">IYYAPPAN JR.</span>
        </motion.h1>

        {/* Hero Statement */}
        <motion.p
          className="font-body text-lg sm:text-xl md:text-xl lg:text-[1.3rem] text-void14 max-w-5xl mx-auto mb-2 leading-[1.45]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {heroData.subtitle}
        </motion.p>

        {/* Supporting Statement */}
        <motion.p
          className="font-body text-sm md:text-[12px] text-void12 mb-2 max-w-4xl mx-auto leading-[1.45]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {heroData.description}
        </motion.p>

        {/* CTAs - Belong ONLY to hero section, scroll away naturally */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <motion.a
            href={heroData.ctaPrimary.href}
            className="group relative px-8 py-4 bg-white text-void font-heading font-semibold rounded-full overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10">{heroData.ctaPrimary.label}</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-neon-blue to-neon-cyan"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
            <span className="absolute inset-0 z-10 flex items-center justify-center text-white font-heading font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              {heroData.ctaPrimary.label}
            </span>
          </motion.a>

          <motion.a
            href={resume.file}
            download={resume.filename}
            className="px-8 py-4 glass rounded-full font-heading font-medium text-white hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {resume.title}
          </motion.a>
        </motion.div>

      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/3 left-[10%] w-32 h-32 border border-white/5 rounded-full" />
      <div className="absolute bottom-1/3 right-[10%] w-48 h-48 border border-white/5 rounded-full" />
    </section>
  );
}
