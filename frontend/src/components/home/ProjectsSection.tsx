'use client';

import Link from 'next/link';
import { ArrowRight, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MotionWrap, StaggerContainer, StaggerItem } from '@/components/MotionWrap';
import { getImageUrl } from '@/lib/utils';
import type { Project } from '@/types';

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  if (projects.length === 0) return null;

  const featured = projects.find((p) => p.featured) ?? projects[0];
  const rest = projects.filter((p) => p._id !== featured._id).slice(0, 3);

  return (
    <section className="section-padding surface-grid" id="projects" aria-label="Featured projects">
      <Container>
        <MotionWrap className="mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            align="left"
            eyebrow="Our work"
            title="Featured projects"
            description="A selection of work delivered across Nashik and Maharashtra."
          />
          <Link href="/projects" className="shrink-0">
            <Button variant="outline" size="md" className="group w-full sm:w-auto">
              View all
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </MotionWrap>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Featured project — large */}
          <MotionWrap className="lg:col-span-7">
            <Link href={`/projects/${featured.slug}`} className="group block">
              <article className="relative aspect-[4/3] overflow-hidden rounded-md bg-navy-900 lg:aspect-auto lg:min-h-[420px]">
                {featured.images?.[0] ? (
                  <img
                    src={getImageUrl(featured.images[0])}
                    alt={featured.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Building2 className="h-16 w-16 text-white/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/30 to-transparent transition-colors duration-300 group-hover:from-navy-950/95" />
                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                  {featured.category ? (
                    <span className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-light">
                      {featured.category}
                    </span>
                  ) : null}
                  <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">{featured.title}</h3>
                  <p className="mt-2 text-sm text-navy-200">
                    {featured.clientName}
                    {featured.location ? ` \u00B7 ${featured.location}` : ''}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    View project <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </article>
            </Link>
          </MotionWrap>

          {/* Supporting projects — stack */}
          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            {rest.map((project) => (
              <StaggerItem key={project._id}>
                <Link href={`/projects/${project.slug}`} className="group block">
                  <article className="relative aspect-[16/10] overflow-hidden rounded-md bg-navy-900 lg:aspect-[16/11]">
                    {project.images?.[0] ? (
                      <img
                        src={getImageUrl(project.images[0])}
                        alt={project.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-navy-800" />
                    )}
                    <div className="absolute inset-0 bg-navy-950/50 transition-colors duration-300 group-hover:bg-navy-950/65" />
                    <div className="absolute inset-0 flex flex-col justify-end p-5">
                      <h3 className="font-display text-lg font-bold text-white">{project.title}</h3>
                      <p className="mt-1 text-xs text-navy-200">
                        {project.clientName}
                        {project.location ? ` \u00B7 ${project.location}` : ''}
                      </p>
                      <span className="mt-3 text-sm font-semibold text-brand-light opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        View project &rarr;
                      </span>
                    </div>
                  </article>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </Container>
    </section>
  );
}
