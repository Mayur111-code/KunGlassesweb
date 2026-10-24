'use client';

import Link from 'next/link';
import { ArrowUpRight, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { MotionWrap, StaggerContainer, StaggerItem } from '@/components/MotionWrap';
import { TiltCard } from '@/components/motion/TiltCard';
import { getImageUrl } from '@/lib/utils';
import type { Project } from '@/types';

interface ProjectsSectionProps {
  projects: Project[];
}

function meta(project: Project) {
  return [project.clientName, project.location].filter(Boolean).join(' · ');
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  if (projects.length === 0) return null;

  const featured = projects.find((project) => project.featured) ?? projects[0];
  const rest = projects.filter((project) => project._id !== featured._id).slice(0, 2);

  return (
    <section
      className="section relative overflow-hidden bg-ink-950 text-stone-50"
      id="projects"
      aria-label="Featured projects"
    >
      <div className="pointer-events-none absolute inset-0 blueprint-dark opacity-50" aria-hidden />
      <div className="pointer-events-none absolute -left-32 top-0 h-[28rem] w-[28rem] rounded-full bg-bronze-500/[0.07] blur-3xl" aria-hidden />

      <Container className="relative">
        <div className="flex flex-col gap-8 border-b border-white/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="type-eyebrow inline-flex items-center gap-3 text-bronze-300">
              <span className="h-px w-7 bg-bronze-300/70" aria-hidden />
              Selected Work
            </p>
            <h2 className="type-h2 mt-5 text-stone-50">A portfolio built in glass, aluminium and light.</h2>
            <p className="mt-5 max-w-xl text-[0.975rem] leading-relaxed text-white/55">
              Completed residential, commercial and industrial work across Nashik and Maharashtra.
            </p>
          </div>
          <Button href="/projects" variant="outline-light" size="md" className="shrink-0 self-start lg:self-auto">
            All projects
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          {/* Featured project */}
          <MotionWrap className="lg:col-span-8" amount={0.15}>
            <TiltCard max={3}>
              <Link href={`/projects/${featured.slug}`} className="group block">
                <article className="relative aspect-[4/3] overflow-hidden bg-ink-800 sm:aspect-[16/11] lg:aspect-[16/10]">
                  {featured.images?.[0] ? (
                    <img
                      src={getImageUrl(featured.images[0])}
                      alt={featured.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-[1.2s] ease-arch group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Building2 className="h-14 w-14 text-white/20" aria-hidden />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/25 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                    {featured.category ? (
                      <p className="type-eyebrow text-bronze-300">{featured.category}</p>
                    ) : null}
                    <h3 className="mt-3 font-display text-2xl font-medium tracking-[-0.02em] text-stone-50 sm:text-3xl">
                      {featured.title}
                    </h3>
                    <p className="mt-2 text-sm text-white/55">{meta(featured)}</p>
                  </div>

                  <span className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center border border-white/25 text-white/80 transition-all duration-500 ease-arch group-hover:border-bronze-400 group-hover:bg-bronze-500 group-hover:text-ink-950">
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </span>
                </article>
              </Link>
            </TiltCard>
          </MotionWrap>

          {/* Supporting projects */}
          <StaggerContainer className="grid gap-8 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
            {rest.map((project) => (
              <StaggerItem key={project._id}>
                <Link href={`/projects/${project.slug}`} className="group block h-full">
                  <article className="flex h-full flex-col">
                    <div className="media-frame aspect-[4/3] lg:aspect-[16/10]">
                      {project.images?.[0] ? (
                        <img
                          src={getImageUrl(project.images[0])}
                          alt={project.title}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-[1.1s] ease-arch group-hover:scale-[1.05]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-ink-800">
                          <Building2 className="h-10 w-10 text-white/20" aria-hidden />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
                    </div>
                    <div className="mt-4 flex items-start justify-between gap-4 border-t border-white/10 pt-4">
                      <div>
                        <h3 className="font-display text-lg font-medium tracking-[-0.015em] text-stone-50">
                          {project.title}
                        </h3>
                        <p className="mt-1 text-xs text-white/55">{meta(project)}</p>
                      </div>
                      <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-white/50 transition-all duration-300 group-hover:text-bronze-300" aria-hidden />
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
