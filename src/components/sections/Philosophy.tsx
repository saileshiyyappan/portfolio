'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { philosophyItems } from '@/data/philosophy';
import { useInView } from '@/hooks/useInView';
import { staggerContainer, staggerItem } from '@/lib/animations';
import SectionHeader from '@/components/ui/SectionHeader';
import Container from '@/components/ui/Container';
import IconRenderer from '@/components/ui/IconRenderer';

const PhilosophyCard = memo(function PhilosophyCard({ item }: { item: typeof philosophyItems[0] }) {
  return (
    <motion.div
      className="group relative glass rounded-2xl p-6 lg:p-8 hover:bg-white/[0.05] transition-all duration-500"
      variants={staggerItem}
      whileHover={{ y: -4 }}
    >
      <div
        className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${item.color} opacity-5`}
      />
      <div className="relative z-10">
        <div className="w-10 h-10 rounded-lg bg-neon-blue/10 flex items-center justify-center mb-4 group-hover:bg-neon-blue/20 transition-colors">
          <IconRenderer
            name={item.icon}
            size={20}
            className="text-neon-cyan"
          />
        </div>
        <h3 className="font-heading font-semibold text-lg text-white mb-2">
          {item.title}
        </h3>
        <p className="font-body text-void13 text-sm leading-relaxed">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
});

export default function Philosophy() {
  const { ref, isInView } = useInView({ rootMargin: '-50px' });

  return (
    <section id="philosophy" className="relative py-16 sm:py-20 overflow-hidden">
      <Container ref={ref}>
        <SectionHeader
          subtitle="Principles"
          title={<>Engineering <span className="text-gradient">Philosophy</span></>}
          description="The principles that guide how systems are designed, built, validated, and deployed."
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
        >
          {philosophyItems.map((item) => (
            <PhilosophyCard key={item.id} item={item} />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
