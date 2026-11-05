'use client';

import { motion } from 'framer-motion';
import { technologyCategories } from '@/data/techstack';
import { useInView } from '@/hooks/useInView';
import SectionHeader from '@/components/ui/SectionHeader';
import Container from '@/components/ui/Container';
import TechnologyBadge from '@/components/ui/TechnologyBadge';

export default function TechnologyStack() {
  const { ref, isInView } = useInView({ threshold: 0.1, once: true });

  return (
    <section id="technology-stack" className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      <Container>
        <div ref={ref} className="space-y-12">
          <SectionHeader
            title="Technology Stack"
            subtitle="Technologies, platforms and engineering domains I use to design intelligent products."
          />

          <div className="space-y-8">
            {technologyCategories.map((category) => {
              const direction = category.order % 2 === 0 ? 'tech-lane-left' : 'tech-lane-right';
              const badges = [...category.badges, ...category.badges];

              return (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 18 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                  transition={{ duration: 0.5, delay: category.order * 0.06 }}
                >
                  <div className="mb-3 flex items-baseline gap-3 px-1">
                    <span className="font-heading text-xs tracking-[0.2em] text-neon-cyan">
                      {String(category.order).padStart(2, '0')}
                    </span>
                    <h3 className="font-heading text-sm font-semibold uppercase tracking-[0.14em] text-white/80 sm:text-base">
                      {category.category}
                    </h3>
                  </div>

                  <div className="tech-lane-mask relative overflow-hidden py-1">
                    <div className={`tech-lane-track ${direction} flex w-max gap-3 pr-3`}>
                      {badges.map((badge, index) => (
                        <TechnologyBadge
                          key={`${category.category}-${badge.src}-${index}`}
                          src={badge.src}
                          decorative={index >= category.badges.length}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
