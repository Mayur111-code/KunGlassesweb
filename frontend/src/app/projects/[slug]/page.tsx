'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Expand,
  MapPin,
  MessageCircle,
  Phone,
  Tag,
  Wrench,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { MotionWrap, StaggerContainer, StaggerItem } from '@/components/MotionWrap';
import { FullPageLoader } from '@/components/ui/Spinner';
import { useSettings } from '@/lib/settings-context';
import { buildTelLink, getImageUrl } from '@/lib/utils';
import { projectsApi } from '@/services';
import type { Project } from '@/types';

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [related, setRelated] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const { primaryPhone, whatsappLink } = useSettings();
  const phoneLink = primaryPhone ? buildTelLink(primaryPhone.value) : null;

  useEffect(() => {
    if (!slug) return;
    projectsApi
      .getBySlug(slug)
      .then((res) => setProject(res.data.project))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!project) return;
    projectsApi
      .getAll()
      .then((res) =>
        setRelated(
          (res.data ?? [])
            .filter(
              (item) => item.slug !== project.slug && item.isActive && (item.category === project.category || item.serviceName === project.serviceName)
            )
            .slice(0, 3)
        )
      )
      .catch(() => {});
  }, [project]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxIndex(null);
      if (event.key === 'ArrowLeft')
        setLightboxIndex((current) =>
          current === null ? null : (current - 1 + (project?.images.length ?? 1)) % (project?.images.length ?? 1)
        );
      if (event.key === 'ArrowRight')
        setLightboxIndex((current) => current === null ? null : (current + 1) % (project?.images.length ?? 1));
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, project?.images.length]);

  if (loading) return <FullPageLoader label="Loading project..." />;
  if (error || !project)
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <Building2 className="h-16 w-16 text-navy-200" />
        <h2 className="font-display text-2xl font-bold text-navy-950">Project Not Found</h2>
        <p className="text-navy-500">The project you are looking for does not exist.</p>
        <Link href="/projects">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4" /> Back to Projects
          </Button>
        </Link>
      </div>
    );

  const images = project.images ?? [];
  const coverImage = getImageUrl(images[0] ?? '', '');
  const details = [
    { label: 'Client', value: project.clientName, icon: Building2 },
    { label: 'Location', value: project.location, icon: MapPin },
    { label: 'Category', value: project.category, icon: Tag },
    { label: 'Service', value: project.serviceName, icon: Wrench },
    ...(project.completionYear ? [{ label: 'Completed', value: String(project.completionYear), icon: Calendar }] : []),
  ].filter((item) => Boolean(item.value));

  const projectDescription = project.description?.trim() || 'Project details will be added soon.';

  return (
    <>
      <AnimatePresence>
        {lightboxIndex !== null && images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-950/95 p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Project image viewer"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-md bg-white/10 text-white hover:bg-white/20"
              aria-label="Close image viewer"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setLightboxIndex((current) => 
                  current === null ? 0 : (current - 1 + images.length) % images.length
                );
              }}
              className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md bg-white/10 text-white hover:bg-white/20"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <img
              src={getImageUrl(images[lightboxIndex])}
              alt={`${project.title} image ${lightboxIndex + 1}`}
              className="max-h-[86vh] max-w-full object-contain"
              onClick={(event) => event.stopPropagation()}
            />
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setLightboxIndex((current) => (current === null ? 0 : (current + 1) % images.length));
              }}
              className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md bg-white/10 text-white hover:bg-white/20"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-white/70">
              {lightboxIndex + 1} / {images.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="bg-[#f7f5f1] text-navy-900">
        <section className="border-b border-navy-100 bg-[#f7f5f1]">
          <Container className="pb-10 pt-24 sm:pt-28 lg:pt-32">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm font-semibold text-navy-600 transition-colors hover:text-brand-orange"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to projects
            </Link>

            <div className="mt-8 max-w-4xl">
              <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em] text-brand-orange">
                <span className="h-px w-8 bg-brand-orange" aria-hidden="true" />
                Project
              </p>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-[1.02] tracking-tight text-navy-950 sm:text-5xl lg:text-6xl"
              >
                {project.title}
              </motion.h1>

              <div className="mt-7 flex flex-wrap gap-3 text-sm text-navy-600 sm:gap-5">
                {project.clientName ? (
                  <div className="inline-flex items-center gap-2 rounded-full border border-navy-200 bg-white/80 px-3 py-2">
                    <Building2 className="h-4 w-4 text-brand-orange" />
                    <span>{project.clientName}</span>
                  </div>
                ) : null}
                {project.location ? (
                  <div className="inline-flex items-center gap-2 rounded-full border border-navy-200 bg-white/80 px-3 py-2">
                    <MapPin className="h-4 w-4 text-brand-orange" />
                    <span>{project.location}</span>
                  </div>
                ) : null}
                {project.completionYear ? (
                  <div className="inline-flex items-center gap-2 rounded-full border border-navy-200 bg-white/80 px-3 py-2">
                    <Calendar className="h-4 w-4 text-brand-orange" />
                    <span>{project.completionYear}</span>
                  </div>
                ) : null}
              </div>
            </div>
          </Container>
        </section>

        <section className="pb-16 sm:pb-24">
          <Container>
            <MotionWrap className="pt-8 sm:pt-12">
              <button
                type="button"
                onClick={() => coverImage && setLightboxIndex(0)}
                className="group relative block w-full overflow-hidden rounded-xl bg-navy-900 text-left shadow-sm ring-1 ring-navy-200 transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                aria-label={coverImage ? `Open cover image for ${project.title}` : 'Project has no cover image'}
              >
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt={`${project.title} project cover`}
                    className="aspect-[16/8] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex aspect-[16/8] items-center justify-center bg-navy-100">
                    <Building2 className="h-20 w-20 text-navy-300" />
                  </div>
                )}

                {coverImage ? (
                  <span className="absolute bottom-5 right-5 inline-flex items-center gap-2 rounded-md bg-navy-950/75 px-3 py-2 text-xs font-semibold text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <Expand className="h-4 w-4" />
                    View cover
                  </span>
                ) : null}
              </button>
            </MotionWrap>
          </Container>
        </section>

        <section className="section-padding pt-0">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-20">
              <MotionWrap>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-brand-orange">Project overview</p>
                <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold leading-tight text-navy-950 sm:text-4xl">
                  Thoughtful execution for a functional, refined space.
                </h2>

                <div className="mt-7 max-w-2xl space-y-5 text-base leading-8 text-navy-600">
                  {projectDescription
                    .split(/\n+/)
                    .filter((paragraph) => paragraph.trim())
                    .map((paragraph, index) => (
                      <p key={`${paragraph.slice(0, 20)}-${index}`}>{paragraph}</p>
                    ))}
                </div>
              </MotionWrap>

              <MotionWrap delay={0.12}>
                <div className="rounded-xl border border-navy-200 bg-white p-6 shadow-sm">
                  <h3 className="font-display text-xl font-semibold text-navy-950">Project information</h3>
                  <dl className="mt-6 space-y-4">
                    {details.map(({ label, value, icon: Icon }) => (
                      <div key={label} className="flex items-start gap-3 border-b border-navy-100 pb-4 last:border-b-0 last:pb-0">
                        <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-md bg-brand-orange/10 text-brand-orange">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </div>
                        <div>
                          <dt className="text-[10px] font-bold uppercase tracking-[0.24em] text-navy-400">{label}</dt>
                          <dd className="mt-1 text-sm font-semibold text-navy-900">{value}</dd>
                        </div>
                      </div>
                    ))}
                  </dl>
                </div>
              </MotionWrap>
            </div>
          </Container>
        </section>

        {images.length > 1 && (
          <section className="surface-grid section-padding">
            <Container>
              <MotionWrap className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-brand-orange">Project gallery</p>
                  <h2 className="mt-3 font-display text-3xl font-semibold text-navy-950 sm:text-4xl">
                    Explore the project in detail.
                  </h2>
                </div>
                <p className="max-w-xs text-sm leading-relaxed text-navy-500">
                  Materials, lines and finishes captured across this KUN project.
                </p>
              </MotionWrap>

              <StaggerContainer className="grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[220px] sm:gap-5 md:grid-cols-4">
                {images.map((image, index) => (
                  <StaggerItem
                    key={`${getImageUrl(image)}-${index}`}
                    className={index === 0 ? 'col-span-2 row-span-2' : index === 3 ? 'col-span-2' : ''}
                  >
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(index)}
                      className="group relative block h-full w-full overflow-hidden rounded-xl bg-navy-100 text-left ring-1 ring-navy-200 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                      aria-label={`Open ${project.title} gallery image ${index + 1}`}
                    >
                      <img
                        src={getImageUrl(image)}
                        alt={`${project.title} gallery image ${index + 1}`}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <span className="absolute inset-0 bg-navy-950/0 transition-colors duration-300 group-hover:bg-navy-950/15" />
                      <Expand className="absolute right-4 top-4 h-5 w-5 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </button>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </Container>
          </section>
        )}

        {related.length > 0 && (
          <section className="section-padding">
            <Container>
              <MotionWrap className="mb-10">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-brand-orange">Continue exploring</p>
                <h2 className="mt-3 font-display text-3xl font-semibold text-navy-950">Related projects</h2>
              </MotionWrap>

              <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <StaggerItem key={item._id}>
                    <Link href={`/projects/${item.slug}`} className="group block overflow-hidden rounded-xl border border-navy-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                      <div className="aspect-[16/10] overflow-hidden bg-navy-900">
                        {item.images?.[0] ? (
                          <img
                            src={getImageUrl(item.images[0])}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-navy-100">
                            <Building2 className="h-10 w-10 text-navy-300" />
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <h3 className="font-display text-xl font-semibold text-navy-950 transition-colors group-hover:text-brand-orange">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-navy-400">
                          {item.clientName}
                        </p>
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </Container>
          </section>
        )}

        <section className="relative overflow-hidden bg-navy-950 py-20 sm:py-24">
          <Container>
            <MotionWrap className="mx-auto max-w-3xl text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-brand-light">Start a conversation</p>
              <h2 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl">
                Ready to start your project?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-navy-200">
                Discuss your glass and aluminium requirements with KUN Glass &amp; Aluminium.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/contact">
                  <Button size="lg">
                    Get a Quote
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                {phoneLink && (
                  <a href={phoneLink}>
                    <Button size="lg" variant="outline-light">
                      <Phone className="h-4 w-4" />
                      Call Now
                    </Button>
                  </a>
                )}
                {whatsappLink && (
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <Button
                      size="lg"
                      className="border border-emerald-400/60 bg-transparent text-emerald-300 hover:border-emerald-500 hover:bg-emerald-500 hover:text-white"
                    >
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </Button>
                  </a>
                )}
              </div>
            </MotionWrap>
          </Container>
        </section>
      </main>
    </>
  );
}

