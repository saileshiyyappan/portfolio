'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations';
import { aboutData } from '@/data/about';
import IconRenderer from '@/components/ui/IconRenderer';
import Container from '@/components/ui/Container';

const FocusCard = memo(function FocusCard({ area }: { area: typeof aboutData.focusAreas[0] }) {
  return (
    <motion.div
      className="group relative glass rounded-2xl p-6 hover:bg-white/[0.05] transition-all duration-500"
      variants={staggerItem}
      whileHover={{ y: -4 }}
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-neon-blue/10 to-neon-cyan/5" />
      <div className="relative z-10">
        <div className="w-10 h-10 rounded-lg bg-neon-blue/10 flex items-center justify-center mb-4 group-hover:bg-neon-blue/20 transition-colors">
          <IconRenderer name={area.icon} size={20} className="text-neon-cyan" />
        </div>
        <h3 className="font-heading font-semibold text-lg text-white mb-2">
          {area.title}
        </h3>
        <p className="font-body text-void13 text-sm leading-relaxed">
          {area.description}
        </p>
      </div>
    </motion.div>
  );
});

const StatItem = memo(function StatItem({ stat }: { stat: typeof aboutData.stats[0] }) {
  return (
    <div className="text-center">
      <div className="font-heading font-bold text-3xl text-gradient mb-1">{stat.value}</div>
      <div className="font-body text-xs text-void13">{stat.label}</div>
    </div>
  );
});

export default function About() {
  const { ref, isInView } = useInView({ rootMargin: '-50px' });

  return (
    <section id="about" className="relative py-16 sm:py-20 overflow-hidden">
      <Container ref={ref}>
        {/* Section Header */}
        <motion.div
          className="text-center mb-10"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
        >
          <span className="font-body text-xs text-neon-cyan tracking-[0.3em] uppercase mb-3 block">
            {aboutData.subtitle}
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-white mb-4">
            {aboutData.title.split(' ').slice(0, -1).join(' ')}{' '}
            <span className="text-gradient">{aboutData.title.split(' ').slice(-1)}</span>
          </h2>
          <p className="font-body text-void14 text-base max-w-2xl mx-auto leading-relaxed">
            {aboutData.description}
          </p>
        </motion.div>

        {/* Focus Areas Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
        >
          {aboutData.focusAreas.map((area) => (
            <FocusCard key={area.id} area={area} />
          ))}
        </motion.div>

        {/* Stats Row */}
        <motion.div
          className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {aboutData.stats.map((stat) => (
            <StatItem key={stat.label} stat={stat} />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
