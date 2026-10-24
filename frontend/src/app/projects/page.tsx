'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Building2, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { PageHero } from '@/components/ui/PageHero';
import { MotionWrap, StaggerContainer, StaggerItem } from '@/components/MotionWrap';
import { LoadError } from '@/components/ui/LoadState';
import { CtaSection } from '@/components/home/CtaSection';
import { projectsApi } from '@/services';
import { getSectionImage } from '@/lib/section-images';
import { getImageUrl, cn } from '@/lib/utils';
import { useSettings } from '@/lib/settings-context';
import type { Project } from '@/types';

export default function ProjectsPage() {
  const { settings } = useSettings();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const heroImage = getSectionImage(settings, 'projects');

  const loadProjects = useCallback(() => {
    setLoading(true);
    setError(false);
    projectsApi
      .getAll()
      .then((response) => setProjects(response.data ?? []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const categories = useMemo(() => {
    const values = new Set(projects.map((project) => project.category).filter(Boolean));
    return ['All', ...Array.from(values)];
  }, [projects]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return projects.filter((project) => {
      const matchCategory = category === 'All' || project.category === category;
      const matchSearch =
        !query ||
        [project.title, project.clientName, project.location, project.category]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(query));
      return matchCategory && matchSearch;
    });
  }, [projects, category, search]);

  return (
    <>
      <PageHero
        eyebrow="Projects"
        title={
          <>
            Work measured in
            <br className="hidden sm:block" /> <span className="text-bronze-300">light and line.</span>
          </>
        }
        description="A portfolio of completed glass, aluminium and ACP work across residential, commercial and industrial architecture."
        imageUrl={heroImage}
        meta={<span>{loading ? 'Loading' : `${projects.length} projects`}</span>}
      />

      <section className="section bg-surface" aria-label="Project portfolio">
        <Container>
          {loading ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <div key={index} className="space-y-4">
                  <div className="aspect-[4/5] animate-pulse bg-stone-200" />
                  <div className="h-4 w-2/3 animate-pulse bg-stone-300" />
                  <div className="h-3 w-1/2 animate-pulse bg-stone-200" />
                </div>
              ))}
            </div>
          ) : error ? (
            <LoadError
              message="Our projects could not be loaded. Please check your connection and try again."
              onRetry={loadProjects}
            />
          ) : projects.length === 0 ? (
            <MotionWrap>
              <div className="flex flex-col items-center justify-center border border-dashed border-line py-24 text-center">
                <Building2 className="h-10 w-10 text-steel-300" aria-hidden />
                <h2 className="mt-6 font-display text-2xl font-medium tracking-[-0.02em] text-ink-950">
                  Portfolio in progress
                </h2>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-steel-500">
                  We are preparing the latest project photography. In the meantime, our team is
                  happy to share references directly.
                </p>
                <Button href="/contact" variant="outline" size="md" className="mt-6">
                  Request references
                </Button>
              </div>
            </MotionWrap>
          ) : (
            <>
              {/* Filters */}
              <div className="flex flex-col gap-6 border-b border-line pb-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                  {categories.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setCategory(item)}
                      aria-pressed={category === item}
                      className={cn(
                        'shrink-0 rounded-xs border px-4 py-2 text-[0.6875rem] font-medium uppercase tracking-[0.14em] transition-colors duration-300',
                        category === item
                          ? 'border-ink-950 bg-ink-950 text-stone-50'
                          : 'border-line text-steel-500 hover:border-steel-400 hover:text-ink-900'
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <div className="relative w-full lg:w-72">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-500" aria-hidden />
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search projects, clients, locations"
                    aria-label="Search projects"
                    className="field h-11 pl-10 text-[0.8125rem]"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <p className="text-[0.6875rem] uppercase tracking-[0.2em] text-steel-500">
                  {filtered.length} {filtered.length === 1 ? 'project' : 'projects'}
                </p>
                {category !== 'All' || search ? (
                  <button
                    type="button"
                    onClick={() => {
                      setCategory('All');
                      setSearch('');
                    }}
                    className="text-[0.6875rem] uppercase tracking-[0.16em] text-bronze-700 underline-offset-4 hover:underline"
                  >
                    Clear filters
                  </button>
                ) : null}
              </div>

              {filtered.length === 0 ? (
                <div className="mt-10 flex flex-col items-center justify-center border border-dashed border-line py-20 text-center">
                  <Building2 className="h-9 w-9 text-steel-300" aria-hidden />
                  <h2 className="mt-5 font-display text-xl font-medium text-ink-950">
                    No matching projects
                  </h2>
                  <p className="mt-2 text-sm text-steel-500">
                    Try a different category or search term.
                  </p>
                </div>
              ) : (
                <StaggerContainer className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((project) => {
                    const cover = getImageUrl(project.images?.[0]);
                    return (
                      <StaggerItem key={project._id}>
                        <Link href={`/projects/${project.slug}`} className="group block h-full">
                          <article>
                            <div className="media-frame aspect-[4/5]">
                              {cover ? (
                                <img
                                  src={cover}
                                  alt={project.title}
                                  loading="lazy"
                                  decoding="async"
                                  className="h-full w-full object-cover transition-transform duration-[1.1s] ease-arch group-hover:scale-[1.045]"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center bg-ink-900">
                                  <Building2 className="h-10 w-10 text-white/20" aria-hidden />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/10 to-transparent" />

                              {project.category ? (
                                <span className="absolute left-4 top-4 border border-white/25 bg-ink-950/30 px-2.5 py-1 text-[0.5625rem] uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm">
                                  {project.category}
                                </span>
                              ) : null}

                              <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center border border-white/25 text-white/75 transition-all duration-500 ease-arch group-hover:border-bronze-400 group-hover:bg-bronze-500 group-hover:text-ink-950">
                                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                              </span>

                              <div className="absolute inset-x-0 bottom-0 p-5">
                                <h2 className="font-display text-xl font-medium tracking-[-0.015em] text-stone-50">
                                  {project.title}
                                </h2>
                                <p className="mt-1 text-[0.75rem] text-white/55">
                                  {[project.clientName, project.location].filter(Boolean).join(' · ')}
                                </p>
                              </div>
                            </div>
                          </article>
                        </Link>
                      </StaggerItem>
                    );
                  })}
                </StaggerContainer>
              )}
            </>
          )}
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
