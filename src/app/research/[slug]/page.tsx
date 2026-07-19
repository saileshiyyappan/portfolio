import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getResearchBySlug, getAllResearchSlugs } from '@/data/research';
import { generateResearchSEO } from '@/lib/seo';
import ResearchDetail from '@/components/research/ResearchDetail';
import PageCloseButton from '@/components/ui/PageCloseButton';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = getAllResearchSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const paper = getResearchBySlug(params.slug);
  if (!paper) return {};
  return generateResearchSEO(paper.title, paper.abstract, paper.slug);
}

export default function ResearchPaperPage({ params }: Props) {
  const paper = getResearchBySlug(params.slug);
  if (!paper) notFound();

  return (
    <main className="relative min-h-screen bg-void">
      <PageCloseButton href="/research" label="Back to Research" />
      <div className="pt-24 sm:pt-32 pb-20">
        <ResearchDetail paper={paper} />
      </div>
    </main>
  );
}
