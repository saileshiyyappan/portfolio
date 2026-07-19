import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPatentBySlug, getAllPatentSlugs } from '@/data/patents';
import { generatePatentSEO } from '@/lib/seo';
import PatentDetail from '@/components/patents/PatentDetail';
import PageCloseButton from '@/components/ui/PageCloseButton';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = getAllPatentSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const patent = getPatentBySlug(params.slug);
  if (!patent) return {};
  return generatePatentSEO(patent.title, patent.description, patent.slug);
}

export default function PatentPage({ params }: Props) {
  const patent = getPatentBySlug(params.slug);
  if (!patent) notFound();

  return (
    <main className="relative min-h-screen bg-void">
      <PageCloseButton href="/patents" label="Back to Patents" />
      <div className="pt-24 sm:pt-32 pb-20">
        <PatentDetail patent={patent} />
      </div>
    </main>
  );
}
