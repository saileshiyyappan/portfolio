'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, FileText, BookOpen, Clock } from 'lucide-react';
import { ResearchPaper } from '@/types';
import Container from '@/components/ui/Container';
import SectionHeader from '@/components/ui/SectionHeader';
import { staggerContainer, staggerItem } from '@/lib/animations';

interface ResearchListProps {
  papers: ResearchPaper[];
}

export default function ResearchList({ papers }: ResearchListProps) {
  const [filter, setFilter] = useState<string>('all');

  const statusColors: Record<string, string> = {
    published: 'bg-neon-green/20 text-neon-green',
    'under-review': 'bg-neon-yellow/20 text-neon-yellow',
    'in-preparation': 'bg-neon-blue/20 text-neon-blue',
    accepted: 'bg-neon-purple/20 text-neon-purple',
  };

  const statusLabels: Record<string, string> = {
    published: 'Published',
    'under-review': 'Under Review',
    'in-preparation': 'In Preparation',
    accepted: 'Accepted',
  };

  const filters = ['all', 'published', 'under-review', 'in-preparation'];
  const filteredPapers = filter === 'all' ? papers : papers.filter((p) => p.publicationStatus === filter);

  return (
    <Container>
      <SectionHeader
        subtitle="Publications"
        title={<>Research <span className="text-gradient">Papers</span></>}
        description="Peer-reviewed research on sensor fusion, edge AI, IoT architectures, and engineering systems."
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-full font-body text-sm transition-all ${
              filter === f ? 'bg-white text-void font-semibold' : 'glass text-void14 hover:bg-white/10'
            }`}
          >
            {f === 'all' ? 'All Papers' : statusLabels[f] || f}
          </button>
        ))}
      </div>

      <motion.div
        className="grid grid-cols-1 gap-6"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {filteredPapers.map((paper) => (
          <motion.div
            key={paper.id}
            variants={staggerItem}
            whileHover={{ y: -3 }}
          >
            <Link
              href={`/research/${paper.slug}`}
              className="group block glass rounded-2xl p-8 hover:bg-white/[0.05] transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                {/* Left: Status & Meta */}
                <div className="flex flex-col gap-3 lg:w-48 flex-shrink-0">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-body w-fit ${statusColors[paper.publicationStatus] || 'glass text-void14'}`}>
                    {statusLabels[paper.publicationStatus] || paper.publicationStatus}
                  </span>
                  {paper.journalOrConference && (
                    <div className="flex items-center gap-2 text-void12">
                      <BookOpen size={14} />
                      <span className="font-body text-xs">{paper.journalOrConference}</span>
                    </div>
                  )}
                  {paper.publicationDate && (
                    <div className="flex items-center gap-2 text-void12">
                      <Clock size={14} />
                      <span className="font-body text-xs">{new Date(paper.publicationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
                    </div>
                  )}
                  {paper.citations !== undefined && (
                    <div className="flex items-center gap-2 text-void12">
                      <FileText size={14} />
                      <span className="font-body text-xs">{paper.citations} citations</span>
                    </div>
                  )}
                </div>

                {/* Center: Content */}
                <div className="flex-1">
                  <h3 className="font-heading font-semibold text-xl text-white mb-3 group-hover:text-neon-cyan transition-colors">
                    {paper.title}
                  </h3>
                  <p className="font-body text-sm text-void14 line-clamp-3 mb-4">{paper.abstract}</p>
                  <div className="flex flex-wrap gap-2">
                    {paper.keywords.map((kw) => (
                      <span key={kw} className="px-2 py-1 glass rounded text-xs font-body text-void12">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right: Arrow */}
                <div className="w-10 h-10 rounded-full glass flex items-center justify-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight size={18} className="text-white" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </Container>
  );
}
