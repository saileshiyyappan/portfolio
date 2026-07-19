'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Patent } from '@/types';
import Container from '@/components/ui/Container';
import { fadeUp } from '@/lib/animations';

interface PatentDetailProps {
  patent: Patent;
}

export default function PatentDetail({ patent }: PatentDetailProps) {
  const statusColors: Record<string, string> = {
    filed: 'bg-neon-blue/20 text-neon-blue',
    pending: 'bg-neon-yellow/20 text-neon-yellow',
    granted: 'bg-neon-green/20 text-neon-green',
    published: 'bg-neon-purple/20 text-neon-purple',
  };

  return (
    <Container>
      <motion.div initial="hidden" animate="visible" variants={fadeUp}>
        <Link href="/patents" className="inline-flex items-center gap-2 text-void14 hover:text-white transition-colors mb-8">
          <ArrowLeft size={16} />
          <span className="font-body text-sm">Back to Patents</span>
        </Link>

        <div className="mb-8">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-body mb-4 ${statusColors[patent.status]}`}>
            {patent.status}
          </span>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-white mb-4">
            {patent.title}
          </h1>
          <p className="font-body text-void14 text-lg leading-relaxed">{patent.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="glass rounded-2xl p-6">
            <h3 className="font-heading font-medium text-white mb-3">Inventors</h3>
            <div className="space-y-2">
              {patent.inventors.map((inv) => (
                <p key={inv} className="font-body text-sm text-void14">{inv}</p>
              ))}
            </div>
          </div>
          <div className="glass rounded-2xl p-6">
            <h3 className="font-heading font-medium text-white mb-3">Details</h3>
            <div className="space-y-2 font-body text-sm text-void14">
              <p><span className="text-void12">Filing Date:</span> {patent.filingDate}</p>
              {patent.grantDate && <p><span className="text-void12">Grant Date:</span> {patent.grantDate}</p>}
              {patent.patentNumber && <p><span className="text-void12">Patent Number:</span> {patent.patentNumber}</p>}
              {patent.applicationNumber && <p><span className="text-void12">Application:</span> {patent.applicationNumber}</p>}
              {patent.jurisdiction && <p><span className="text-void12">Jurisdiction:</span> {patent.jurisdiction}</p>}
            </div>
          </div>
        </div>

        {patent.claims && patent.claims.length > 0 && (
          <div className="glass rounded-2xl p-8 mb-8">
            <h2 className="font-heading font-semibold text-xl text-white mb-6">Key Claims</h2>
            <ol className="space-y-4">
              {patent.claims.map((claim, i) => (
                <li key={i} className="flex gap-4">
                  <span className="font-heading font-bold text-neon-cyan flex-shrink-0">{i + 1}.</span>
                  <p className="font-body text-void14">{claim}</p>
                </li>
              ))}
            </ol>
          </div>
        )}

        {patent.images.length > 0 && (
          <div className="mb-8">
            <h2 className="font-heading font-semibold text-xl text-white mb-6">Figures</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {patent.images.map((img, i) => (
                <div key={i} className="relative aspect-video rounded-xl overflow-hidden">
                  <img src={img.src} alt={img.caption || ''} className="w-full h-full object-cover" />
                  {img.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-void/80 to-transparent">
                      <p className="font-body text-xs text-white/80">{img.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </Container>
  );
}
