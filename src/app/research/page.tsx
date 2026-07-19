import { Metadata } from 'next';
import { researchPapers } from '@/data/research';
import { generateSEO } from '@/lib/seo';
import ResearchList from '@/components/research/ResearchList';

export const metadata: Metadata = generateSEO({
  title: 'Research — Sailesh Iyyappan Jr.',
  description: 'Published research on sensor fusion, edge AI, IoT architectures, and engineering systems.',
});

export default function ResearchPage() {
  return (
    <main className="relative min-h-screen bg-void">
      <div className="pt-32 pb-20">
        <ResearchList papers={researchPapers} />
      </div>
    </main>
  );
}
