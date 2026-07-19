'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Project } from '@/types';
import Container from '@/components/ui/Container';
import SectionHeader from '@/components/ui/SectionHeader';
import { staggerContainer, staggerItem } from '@/lib/animations';

interface ProjectsListProps {
  projects: Project[];
}

export default function ProjectsList({ projects }: ProjectsListProps) {
  return (
    <Container>
      <SectionHeader
        subtitle="Portfolio"
        title={<>All <span className="text-gradient">Projects</span></>}
        description="Every project is an opportunity to build something patent-worthy and impactful."
      />

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {projects.map((project) => (
          <motion.div
            key={project.id}
            variants={staggerItem}
            whileHover={{ y: -8 }}
          >
            <Link href={`/projects/${project.slug}`} className="group block">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6">
                <img
                  src={project.coverImage.src}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight size={18} className="text-white" />
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-body bg-gradient-to-r ${project.color} text-white`}>
                    {project.category}
                  </span>
                </div>
              </div>
              <h3 className="font-heading font-semibold text-xl text-white mb-2 group-hover:text-neon-cyan transition-colors">
                {project.title}
              </h3>
              <p className="font-body text-sm text-void14 line-clamp-2">{project.shortDescription}</p>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </Container>
  );
}
