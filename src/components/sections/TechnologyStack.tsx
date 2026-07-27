'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import SectionHeader from '@/components/ui/SectionHeader';
import Container from '@/components/ui/Container';
import technologyStackContent from '@/content/sections/technologyStack.json';

interface TechnologyStackItem {
  name: string;
  image?: string;
  alt?: string;
  website?: string;
}

interface TechnologyStackCategory {
  title: string;
  items: TechnologyStackItem[];
}

interface TechnologyStackContent {
  title: string;
  subtitle: string;
  categories: TechnologyStackCategory[];
}

const content = technologyStackContent as TechnologyStackContent;

export default function TechnologyStack() {
  const { ref, isInView } = useInView({
    threshold: 0.1,
    once: true,
  });

  return (
    <section
      id="technology-stack"
      className="relative py-24 sm:py-28 lg:py-32"
    >
      <Container>
        <div ref={ref} className="space-y-10">
          <SectionHeader
            title={content.title}
            subtitle={content.subtitle}
          />

          <div className="grid gap-6 lg:grid-cols-2">
            {content.categories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 24 }}
                animate={
                  isInView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 24 }
                }
                transition={{
                  duration: 0.45,
                  delay: categoryIndex * 0.05,
                }}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_30px_rgba(0,0,0,0.18)] backdrop-blur-xl"
              >
                <h3 className="mb-4 text-lg font-semibold text-white">
                  {category.title}
                </h3>

                <div className="flex flex-wrap gap-3">
                  {category.items.map((item) => (
                    <a
                      key={`${category.title}-${item.name}`}
                      href={item.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-full border border-cyan-400/25 bg-gradient-to-r from-cyan-400/15 to-cyan-300/10 px-3 py-2 text-sm text-slate-200 transition-all duration-300 hover:border-cyan-300 hover:scale-105 hover:shadow-[0_0_18px_rgba(34,211,238,0.25)]"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 ring-1 ring-cyan-400/20 overflow-hidden">
                        <Image
                          src={item.image || "/assets/logos/default-tech.svg"}
                          alt={item.alt || item.name}
                          width={20}
                          height={20}
                          className="h-5 w-5 object-contain"
                          unoptimized={item.image?.startsWith('http')}
                        />
                      </div>

                      <span>{item.name}</span>
                    </a>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}