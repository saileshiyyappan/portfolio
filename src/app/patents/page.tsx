import { Metadata } from 'next';
import { patents } from '@/data/patents';
import { generateSEO } from '@/lib/seo';
import PatentsList from '@/components/patents/PatentsList';

export const metadata: Metadata = generateSEO({
  title: 'Patents — Sailesh Iyyappan Jr.',
  description: 'Patents filed in wearable health tech, AI diagnostics, embedded systems, and consumer hardware.',
});

export default function PatentsPage() {
  return (
    <main className="relative min-h-screen bg-void">
      <div className="pt-32 pb-20">
        <PatentsList patents={patents} />
      </div>
    </main>
  );
}
