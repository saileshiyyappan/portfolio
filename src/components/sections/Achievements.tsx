'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { achievements } from '@/data/achievements';
import { useInView } from '@/hooks/useInView';
import { staggerContainer, staggerItem } from '@/lib/animations';
import SectionHeader from '@/components/ui/SectionHeader';
import Container from '@/components/ui/Container';
import IconRenderer from '@/components/ui/IconRenderer';

const AchievementCard = memo(function AchievementCard({ achievement }: { achievement: typeof achievements[0] }) {
  return (
    <motion.div
      className="group glass rounded-2xl p-5 lg:p-6 hover:bg-white/[0.05] transition-all duration-500"
      variants={staggerItem}
      whileHover={{ y: -4 }}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-blue/20 to-neon-cyan/10 flex items-center justify-center flex-shrink-0">
          <IconRenderer name={achievement.icon} size={22} className="text-neon-cyan" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-semibold text-lg text-white mb-1">{achievement.title}</h3>
          <p className="font-body text-sm text-void14 leading-relaxed">{achievement.description}</p>
        </div>
      </div>
    </motion.div>
  );
});

export default function Achievements() {
  const { ref, isInView } = useInView({ rootMargin: '-50px' });

  return (
    <section id="achievements" className="relative py-16 sm:py-20 overflow-hidden">
      <Container ref={ref}>
        <SectionHeader
          subtitle="Recognition"
          title={<>Key <span className="text-gradient">Achievements</span></>}
          description="Milestones that define the engineering practice — from patents to product launches."
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
        >
          {achievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
