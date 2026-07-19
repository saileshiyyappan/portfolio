'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { timelineEvents } from '@/data/timeline';
import { useInView } from '@/hooks/useInView';
import { scrollRevealLeft, scrollRevealRight } from '@/lib/animations';
import SectionHeader from '@/components/ui/SectionHeader';
import Container from '@/components/ui/Container';
import IconRenderer from '@/components/ui/IconRenderer';

const TimelineNode = memo(function TimelineNode({ event, index }: { event: typeof timelineEvents[0]; index: number }) {
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      className="relative flex items-start gap-4 md:gap-8 mb-12 md:mb-16"
      initial="hidden"
      animate="visible"
      variants={isLeft ? scrollRevealLeft(index * 0.15) : scrollRevealRight(index * 0.15)}
    >
      {/* Content */}
      <div className={`flex-1 ${isLeft ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12 md:order-2'}`}>
        <div className="glass rounded-2xl p-5 md:p-6 hover:bg-white/[0.05] transition-colors ml-10 md:ml-0">
          <span className={`font-heading font-bold text-xl md:text-2xl ${event.color} mb-2 block`}>{event.year}</span>
          <h3 className="font-heading font-semibold text-lg md:text-xl text-white mb-2">{event.title}</h3>
          <p className="font-body text-sm text-void14 leading-relaxed">{event.description}</p>
        </div>
      </div>

      {/* Timeline Node */}
      <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10">
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${event.bgColor} border-2 border-white/10 flex items-center justify-center`}>
          <IconRenderer name={event.icon} size={14} className={`${event.color}`} />
        </div>
      </div>

      {/* Spacer */}
      <div className="hidden md:block flex-1" />
    </motion.div>
  );
});

export default function Timeline() {
  const { ref } = useInView({ rootMargin: '-100px' });

  return (
    <section id="timeline" className="relative py-16 sm:py-20 overflow-hidden">
      <Container size="lg" ref={ref}>
        <SectionHeader
          subtitle="Journey"
          title={<>Engineering <span className="text-gradient">Timeline</span></>}
          description="From research to patents, prototypes to products — the evolution of a systems engineering practice."
        />

        <div className="relative">
          {/* Vertical Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-neon-blue via-neon-cyan to-neon-teal -translate-x-1/2" />
          <div className="md:hidden absolute left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-neon-blue via-neon-cyan to-neon-teal" />

          {timelineEvents.map((event, i) => (
            <TimelineNode key={event.id} event={event} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
