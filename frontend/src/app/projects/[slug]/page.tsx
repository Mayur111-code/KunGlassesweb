'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  ChevronLeft,
  ChevronRight,
  Expand,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { RecordImage } from '@/components/ui/RecordImage';
import { PageHero } from '@/components/ui/PageHero';
import { MotionWrap, StaggerContainer, StaggerItem } from '@/components/MotionWrap';
import { FullPageLoader } from '@/components/ui/Spinner';
import { CtaSection } from '@/components/home/CtaSection';
import { projectsApi } from '@/services';
import { getImageUrl } from '@/lib/utils';
import type { Project } from '@/types';

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [related, setRelated] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(false);
    setLightboxIndex(null);
    projectsApi
      .getBySlug(slug)
      .then((response) => setProject(response.data.project))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!project) return;
    projectsApi
      .getAll()
      .then((response) =>
        setRelated(
          (response.data ?? [])
            .filter(
              (item) =>
                item.slug !== project.slug &&
                item.isActive &&
                (item.category === project.category || item.serviceName === project.serviceName)
            )
            .slice(0, 3)
        )
      )
      .catch(() => setRelated([]));
  }, [project]);

  const images = useMemo(
    () => (project?.images ?? []).map((image) => getImageUrl(image)).filter(Boolean),
    [project]
  );

  const gallery = images.slice(1);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxIndex(null);
      if (event.key === 'ArrowLeft')
        setLightboxIndex((current) =>
          current === null ? null : (current - 1 + gallery.length) % gallery.length
        );
      if (event.key === 'ArrowRight')
        setLightboxIndex((current) => (current === null ? null : (current + 1) % gallery.length));
    };
    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, gallery.length]);

  if (loading) return <FullPageLoader label="Loading project" />;

  if (error || !project) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 px-6 text-center">
        <Building2 className="h-10 w-10 text-steel-300" aria-hidden />
        <h1 className="font-display text-3xl font-medium tracking-[-0.02em] text-ink-950">
          Project not found
        </h1>
        <p className="max-w-sm text-sm text-steel-500">
          This project does not exist or is no longer published.
        </p>
        <Button href="/projects" variant="outline" size="md" className="mt-2">
          <ArrowLeft className="h-4 w-4" /> Back to projects
        </Button>
      </div>
    );
  }

  const cover = images[0];
  const description = project.description?.trim();

  const facts = [
    { label: 'Client', value: project.clientName },
    { label: 'Location', value: project.location },
    { label: 'Category', value: project.category },
    { label: 'Service', value: project.serviceName },
    { label: 'Completed', value: project.completionYear ? String(project.completionYear) : '' },
  ].filter((fact) => Boolean(fact.value));

  return (
    <>
      <PageHero
        eyebrow={project.category || 'Project'}
        title={project.title}
        description={[project.clientName, project.location].filter(Boolean).join(' · ')}
        meta={<span>{project.completionYear ? `Completed ${project.completionYear}` : 'KUN Project'}</span>}
      >
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-[0.75rem] uppercase tracking-[0.16em] text-white/55 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          All projects
        </Link>
      </PageHero>

      {/* Fact strip */}
      <section className="border-b border-line bg-surface" aria-label="Project facts">
        <Container>
          <dl className="grid grid-cols-2 gap-px bg-line sm:grid-cols-3 lg:grid-cols-5">
            {facts.map((fact) => (
              <div key={fact.label} className="bg-surface px-5 py-6 sm:px-6">
                <dt className="text-[0.5625rem] uppercase tracking-[0.22em] text-steel-500">
                  {fact.label}
                </dt>
                <dd className="mt-2 text-[0.875rem] font-medium text-ink-900">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="section bg-surface">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="min-w-0 lg:col-span-8">
              <div className="media-frame mb-8 aspect-[4/3]">
                <RecordImage src={cover} alt={project.title} loading="eager" fetchPriority="high"
                  decoding="async" className="h-full w-full object-cover" />
              </div>
              <p className="type-eyebrow text-bronze-700">Overview</p>
              <h2 className="type-h2 mt-5 max-w-2xl text-ink-950">
                Thoughtful execution for a considered space.
              </h2>

              <div className="mt-7 max-w-2xl space-y-5 text-[1.0625rem] leading-[1.8] text-steel-500">
                {description ? (
                  description
                    .split(/\n+/)
                    .filter((paragraph) => paragraph.trim())
                    .map((paragraph, index) => <p key={`${paragraph.slice(0, 24)}-${index}`}>{paragraph}</p>)
                ) : (
                  <p>
                    Detailed project notes for this commission will be published here shortly. For
                    drawings, references or specification details, please contact our team.
                  </p>
                )}
              </div>

              {project.featured ? (
                <div className="mt-9 flex items-center gap-3 border-t border-line pt-5">
                  <span className="h-1.5 w-1.5 rounded-full bg-bronze-500" aria-hidden />
                  <p className="text-[0.625rem] uppercase tracking-[0.22em] text-steel-500">
                    Featured KUN project
                  </p>
                </div>
              ) : null}
            </div>

            <MotionWrap className="lg:col-span-4" delay={0.1} amount={0.15}>
              <div className="border border-line bg-white p-6 shadow-soft sm:p-7">
                <h2 className="font-display text-xl font-medium tracking-[-0.02em] text-ink-950">
                  Project information
                </h2>
                <dl className="mt-6 space-y-4">
                  {facts.map((fact) => (
                    <div key={fact.label} className="border-b border-line pb-4 last:border-b-0 last:pb-0">
                      <dt className="text-[0.5625rem] uppercase tracking-[0.22em] text-steel-500">
                        {fact.label}
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-ink-900">{fact.value}</dd>
                    </div>
                  ))}
                </dl>

                <Button href="/contact" variant="primary" size="md" className="mt-7 w-full justify-between">
                  Discuss a similar project
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </MotionWrap>
          </div>
        </Container>
      </section>

      {gallery.length > 0 ? (
        <section className="section surface-stone border-y border-line" aria-label="Project gallery">
          <Container>
            <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="type-eyebrow text-bronze-700">Gallery</p>
                <h2 className="type-h3 mt-4 text-ink-950">Materials, lines and finishes.</h2>
              </div>
              <p className="text-[0.6875rem] uppercase tracking-[0.2em] text-steel-500">
                {gallery.length} {gallery.length === 1 ? 'image' : 'images'}
              </p>
            </div>

            <StaggerContainer className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((image, index) => (
                <StaggerItem key={`${image}-${index}`}>
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(index)}
                    className="group media-frame aspect-[4/3] w-full text-left"
                    aria-label={`Open gallery image ${index + 1} of ${gallery.length}`}
                  >
                    <RecordImage
                      src={image}
                      alt={`${project.title} gallery image ${index + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 ease-arch group-hover:scale-[1.045]"
                    />
                    <span className="absolute inset-0 bg-ink-950/0 transition-colors duration-300 group-hover:bg-ink-950/20" />
                    <Expand className="absolute right-4 top-4 h-4 w-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden />
                  </button>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </Container>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="section bg-surface" aria-label="Related projects">
          <Container>
            <div className="flex items-end justify-between gap-6 border-b border-line pb-6">
              <div>
                <p className="type-eyebrow text-bronze-700">Continue exploring</p>
                <h2 className="type-h3 mt-4 text-ink-950">Related projects</h2>
              </div>
              <Button href="/projects" variant="outline" size="sm">
                All projects
              </Button>
            </div>

            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <Link key={item._id} href={`/projects/${item.slug}`} className="group block">
                  <div className="media-frame aspect-[4/3]">
                    {item.images?.[0] ? (
                      <RecordImage
                        src={getImageUrl(item.images[0])}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-700 ease-arch group-hover:scale-[1.045]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-ink-900">
                        <Building2 className="h-9 w-9 text-white/20" aria-hidden />
                      </div>
                    )}
                  </div>
                  <div className="mt-4 border-t border-line pt-4">
                    <h3 className="font-display text-lg font-medium tracking-[-0.015em] text-ink-950 transition-colors group-hover:text-bronze-700">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-steel-500">
                      {[item.clientName, item.location].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <CtaSection />

      <AnimatePresence>
        {lightboxIndex !== null && gallery[lightboxIndex] ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-ink-950/95 p-4 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label="Project gallery"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-xs border border-white/20 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close gallery"
            >
              <X className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setLightboxIndex((current) =>
                  current === null ? null : (current - 1 + gallery.length) % gallery.length
                );
              }}
              className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xs border border-white/20 text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:left-6"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <figure className="max-h-[86vh] max-w-6xl" onClick={(event) => event.stopPropagation()}>
              <RecordImage
                src={gallery[lightboxIndex]}
                alt={`${project.title} gallery image ${lightboxIndex + 1}`}
                className="max-h-[82vh] w-auto max-w-full object-contain"
              />
              <figcaption className="mt-3 text-center text-[0.625rem] uppercase tracking-[0.2em] text-white/55">
                {project.title} — {lightboxIndex + 1} / {gallery.length}
              </figcaption>
            </figure>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setLightboxIndex((current) =>
                  current === null ? null : (current + 1) % gallery.length
                );
              }}
              className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xs border border-white/20 text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:right-6"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
