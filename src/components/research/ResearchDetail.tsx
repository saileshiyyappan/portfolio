'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, FileText } from 'lucide-react';
import { ResearchPaper } from '@/types';
import Container from '@/components/ui/Container';
import { fadeUp } from '@/lib/animations';

interface ResearchDetailProps {
  paper: ResearchPaper;
}

export default function ResearchDetail({ paper }: ResearchDetailProps) {
  const statusColors: Record<string, string> = {
    published: 'bg-neon-green/20 text-neon-green',
    'under-review': 'bg-neon-yellow/20 text-neon-yellow',
    'in-preparation': 'bg-neon-blue/20 text-neon-blue',
    accepted: 'bg-neon-purple/20 text-neon-purple',
  };

  return (
    <Container>
      <motion.div initial="hidden" animate="visible" variants={fadeUp}>
        <Link href="/research" className="inline-flex items-center gap-2 text-void14 hover:text-white transition-colors mb-8">
          <ArrowLeft size={16} />
          <span className="font-body text-sm">Back to Research</span>
        </Link>

        <div className="mb-8">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-body mb-4 ${statusColors[paper.publicationStatus]}`}>
            {paper.publicationStatus}
          </span>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-white mb-4">
            {paper.title}
          </h1>
          {paper.journalOrConference && (
            <p className="font-body text-void14 mb-2">{paper.journalOrConference}</p>
          )}
          {paper.publicationDate && (
            <p className="font-body text-sm text-void12">{new Date(paper.publicationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
          )}
        </div>

        <div className="glass rounded-2xl p-8 mb-8">
          <h2 className="font-heading font-semibold text-xl text-white mb-4">Abstract</h2>
          <p className="font-body text-void14 leading-relaxed">{paper.abstract}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="glass rounded-2xl p-6">
            <h3 className="font-heading font-medium text-white mb-3">Authors</h3>
            <div className="space-y-2">
              {paper.authors.map((author) => (
                <p key={author} className="font-body text-sm text-void14">{author}</p>
              ))}
            </div>
          </div>
          <div className="glass rounded-2xl p-6">
            <h3 className="font-heading font-medium text-white mb-3">Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {paper.keywords.map((kw) => (
                <span key={kw} className="px-3 py-1 glass rounded-full text-xs font-body text-void12">{kw}</span>
              ))}
            </div>
          </div>
        </div>

        {paper.researchImages.length > 0 && (
          <div className="mb-8">
            <h2 className="font-heading font-semibold text-xl text-white mb-6">Figures</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paper.researchImages.map((img, i) => (
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

        <div className="flex flex-wrap gap-4">
          {paper.paperLink && (
            <a href={paper.paperLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 glass rounded-full font-heading text-sm text-white hover:bg-white/10 transition-colors">
              View Paper <ExternalLink size={14} />
            </a>
          )}
          {paper.pdfLink && (
            <a href={paper.pdfLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 glass rounded-full font-heading text-sm text-white hover:bg-white/10 transition-colors">
              Download PDF <FileText size={14} />
            </a>
          )}
        </div>
      </motion.div>
    </Container>
  );
}
