'use client';

import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/layout/Navigation';
import ScrollProgress from '@/components/layout/ScrollProgress';
import Background from '@/components/layout/Background';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';

const About = lazy(() => import('@/components/sections/About'));
const Philosophy = lazy(() => import('@/components/sections/Philosophy'));
const Projects = lazy(() => import('@/components/sections/Projects'));
const Gallery = lazy(() => import('@/components/sections/Gallery'));
const VideoShowcase = lazy(() => import('@/components/sections/VideoShowcase'));
const Timeline = lazy(() => import('@/components/sections/Timeline'));
const Skills = lazy(() => import('@/components/sections/Skills'));
const Achievements = lazy(() => import('@/components/sections/Achievements'));
const Contact = lazy(() => import('@/components/sections/Contact'));

function LazySection({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      {children}
    </Suspense>
  );
}

export default function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative min-h-screen bg-void overflow-hidden"
    >
      <ScrollProgress />
      <Background />
      <Navigation />

      <main className="relative z-10">
        <Hero />
        <LazySection><About /></LazySection>
        <LazySection><Philosophy /></LazySection>
        <LazySection><Projects /></LazySection>
        <LazySection><Gallery /></LazySection>
        <LazySection><VideoShowcase /></LazySection>
        <LazySection><Timeline /></LazySection>
        <LazySection><Skills /></LazySection>
        <LazySection><Achievements /></LazySection>
        <LazySection><Contact /></LazySection>
      </main>

      <Footer />
    </motion.div>
  );
}
