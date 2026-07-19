import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAllProjectSlugsFromRegistry, getProjectBySlugFromCMS } from '@/lib/projectLoader';
import { generateProjectSEO } from '@/lib/seo';
import ProjectDetail from '@/components/project/ProjectDetail';
import PageCloseButton from '@/components/ui/PageCloseButton';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = getAllProjectSlugsFromRegistry();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProjectBySlugFromCMS(params.slug);
  if (!project) return {};
  return generateProjectSEO(project.title, project.shortDescription, project.slug, project.coverImage.src);
}

export default async function ProjectPage({ params }: Props) {
  const project = await getProjectBySlugFromCMS(params.slug);
  if (!project) notFound();

  return (
    <main className="relative min-h-screen bg-void">
      <PageCloseButton href="/projects" label="Back to Projects" />
      <div className="pt-24 sm:pt-32 pb-20">
        <ProjectDetail project={project} />
      </div>
    </main>
  );
}
