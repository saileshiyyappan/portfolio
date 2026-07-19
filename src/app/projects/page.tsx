import { Metadata } from 'next';
import { getAllProjectsFromCMS } from '@/lib/projectLoader';
import { generateSEO } from '@/lib/seo';
import ProjectsList from '@/components/project/ProjectsList';
import PageCloseButton from '@/components/ui/PageCloseButton';

export const metadata: Metadata = generateSEO({
  title: 'Projects — Sailesh Iyyappan Jr.',
  description: 'A curated selection of engineering projects spanning wearable technology, AI platforms, and consumer hardware.',
});

export default async function ProjectsPage() {
  const projects = await getAllProjectsFromCMS();

  return (
    <main className="relative min-h-screen bg-void">
      <PageCloseButton href="/" label="Back to Home" />
      <div className="pt-24 sm:pt-32 pb-20">
        <ProjectsList projects={projects} />
      </div>
    </main>
  );
}
