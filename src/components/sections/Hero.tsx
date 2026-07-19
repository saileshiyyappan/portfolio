'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, ArrowDown } from 'lucide-react';
import { heroData } from '@/data/hero';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-6 text-center"
        style={{ y, opacity, scale }}
      >
        {/* Availability Badge */}
        <motion.div
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8"
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
          className="relative mx-auto mb-8 w-32 h-32 sm:w-40 sm:h-40"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-neon-blue/20 to-neon-cyan/10 animate-pulse-slow" />
          <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-neon-blue/30 via-neon-cyan/20 to-neon-teal/10 blur-sm" />
          <div className="relative w-full h-full rounded-full glass border border-white/10 flex items-center justify-center overflow-hidden">
            <span className="font-heading font-bold text-3xl sm:text-4xl text-white/60">SI</span>
          </div>
        </motion.div>

        {/* Title Badge */}
        <motion.div
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6"
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
          className="font-heading font-bold text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white tracking-tight leading-[0.9] mb-6"
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
          className="font-body text-lg sm:text-xl md:text-2xl text-void14 max-w-3xl mx-auto mb-4 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {heroData.subtitle}
        </motion.p>

        {/* Supporting Statement */}
        <motion.p
          className="font-body text-sm text-void12 mb-12 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {heroData.description}
        </motion.p>

        {/* CTAs - Belong ONLY to hero section, scroll away naturally */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <motion.button
            onClick={() => scrollTo(heroData.ctaPrimary.href)}
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
          </motion.button>

          <motion.button
            onClick={() => scrollTo(heroData.ctaSecondary.href)}
            className="px-8 py-4 glass rounded-full font-heading font-medium text-white hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {heroData.ctaSecondary.label}
          </motion.button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowDown size={20} className="text-void12" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute top-1/3 left-[10%] w-32 h-32 border border-white/5 rounded-full" />
      <div className="absolute bottom-1/3 right-[10%] w-48 h-48 border border-white/5 rounded-full" />
    </section>
  );
}
