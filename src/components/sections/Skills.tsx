'use client';

import { useState, memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { skills } from '@/data/skills';
import { Skill } from '@/types';
import { useInView } from '@/hooks/useInView';
import { staggerItem } from '@/lib/animations';
import SectionHeader from '@/components/ui/SectionHeader';
import Container from '@/components/ui/Container';
import IconRenderer from '@/components/ui/IconRenderer';

const SkillCard = memo(function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  const { ref, isInView } = useInView({ rootMargin: '-50px' });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      className="group relative glass rounded-2xl p-6 lg:p-8 hover:bg-white/[0.05] transition-all duration-500 cursor-default"
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={staggerItem}
      whileHover={{ y: -5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${skill.color} opacity-5`} />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${skill.color} bg-opacity-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            <IconRenderer name={skill.icon} size={24} className="text-white" />
          </div>
          <span className="font-heading font-bold text-3xl text-white/20 group-hover:text-white/40 transition-colors">
            {skill.level}%
          </span>
        </div>
        <h3 className="font-heading font-semibold text-lg lg:text-xl text-white mb-2">{skill.title}</h3>
        <p className="font-body text-sm text-void13 leading-relaxed mb-4">{skill.description}</p>

        <div className="relative h-1.5 bg-void5 rounded-full overflow-hidden mb-4">
          <motion.div
            className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${skill.color}`}
            initial={{ width: 0 }}
            animate={isInView ? { width: `${skill.level}%` } : {}}
            transition={{ duration: 1.2, delay: index * 0.08 + 0.3, ease: 'easeOut' }}
          />
        </div>

        <motion.div
          className="flex flex-wrap gap-1.5"
          initial={{ opacity: 0, height: 0 }}
          animate={isHovered ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          {skill.technologies?.map((tech) => (
            <span key={tech} className="px-2 py-0.5 glass rounded text-[10px] font-body text-void12 border border-white/5">
              {tech}
            </span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
});

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const categories = ['All', ...Array.from(new Set(skills.map((s) => s.category).filter(Boolean)))].filter((c): c is string => typeof c === 'string');
  const filteredSkills = activeCategory === 'All' ? skills : skills.filter((s) => s.category === activeCategory);

  const handleCategoryChange = useCallback((cat: string) => {
    setActiveCategory(cat);
  }, []);

  return (
    <section id="skills" className="relative py-16 sm:py-20 overflow-hidden">
      <Container>
        <SectionHeader
          subtitle="Capabilities"
          title={<>Technical <span className="text-gradient">Expertise</span></>}
          description="A deep toolkit spanning embedded hardware, AI systems, and product engineering — built over years of hands-on building."
        />

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-full font-body text-sm transition-all ${
                activeCategory === cat ? 'bg-white text-void font-semibold' : 'glass text-void14 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
          layout
        >
          {filteredSkills.map((skill, i) => (
            <SkillCard key={skill.id} skill={skill} index={i} />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
