'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, FileCheck, Calendar, Users, Lightbulb } from 'lucide-react';
import { Patent } from '@/types';
import Container from '@/components/ui/Container';
import SectionHeader from '@/components/ui/SectionHeader';


interface PatentsListProps {
  patents: Patent[];
}

export default function PatentsList({ patents }: PatentsListProps) {
  const statusColors: Record<string, string> = {
    filed: 'bg-neon-blue/20 text-neon-blue',
    pending: 'bg-neon-yellow/20 text-neon-yellow',
    granted: 'bg-neon-green/20 text-neon-green',
    published: 'bg-neon-purple/20 text-neon-purple',
  };

  const statusLabels: Record<string, string> = {
    filed: 'Filed',
    pending: 'Pending Review',
    granted: 'Granted',
    published: 'Published',
  };

  return (
    <Container>
      <SectionHeader
        subtitle="Intellectual Property"
        title={<>Patent & <span className="text-gradient">Innovation</span> Portfolio</>}
        description="Novel inventions and innovations across wearable health tech, AI diagnostics, embedded systems, and consumer hardware."
      />

      {/* Innovation Timeline */}
      <div className="relative mb-20">
        <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-neon-blue via-neon-cyan to-neon-green opacity-30" />
        <div className="space-y-8">
          {patents.map((patent, i) => (
            <motion.div
              key={patent.id}
              className="relative pl-12"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className={`absolute left-2 top-4 w-5 h-5 rounded-full border-4 border-void ${statusColors[patent.status]?.replace('bg-', 'bg-').replace('/20', '') || 'bg-neon-blue'}`} />
              <Link
                href={`/patents/${patent.slug}`}
                className="group block glass rounded-2xl p-8 hover:bg-white/[0.05] transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Left: Status & Meta */}
                  <div className="flex flex-col gap-3 lg:w-48 flex-shrink-0">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-body w-fit ${statusColors[patent.status] || 'glass text-void14'}`}>
                      {statusLabels[patent.status] || patent.status}
                    </span>
                    <div className="flex items-center gap-2 text-void12">
                      <Calendar size={14} />
                      <span className="font-body text-xs">{patent.filingDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-void12">
                      <Users size={14} />
                      <span className="font-body text-xs">{patent.inventors.length} Inventors</span>
                    </div>
                    {patent.applicationNumber && (
                      <div className="flex items-center gap-2 text-void12">
                        <FileCheck size={14} />
                        <span className="font-body text-xs">{patent.applicationNumber}</span>
                      </div>
                    )}
                  </div>

                  {/* Center: Content */}
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold text-xl text-white mb-3 group-hover:text-neon-cyan transition-colors">
                      {patent.title}
                    </h3>
                    <p className="font-body text-sm text-void14 line-clamp-3 mb-4">{patent.description}</p>
                    {patent.claims && patent.claims.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {patent.claims.slice(0, 3).map((claim, idx) => (
                          <span key={idx} className="px-2 py-1 glass rounded text-xs font-body text-void12 flex items-center gap-1">
                            <Lightbulb size={10} />
                            Claim {idx + 1}
                          </span>
                        ))}
                        {patent.claims.length > 3 && (
                          <span className="px-2 py-1 text-xs font-body text-void12">+{patent.claims.length - 3} more</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right: Arrow */}
                  <div className="w-10 h-10 rounded-full glass flex items-center justify-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight size={18} className="text-white" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </Container>
  );
}
