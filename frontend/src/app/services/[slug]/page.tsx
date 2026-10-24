'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Check, GlassWater, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { PageHero } from '@/components/ui/PageHero';
import { MotionWrap, StaggerContainer, StaggerItem } from '@/components/MotionWrap';
import { FullPageLoader } from '@/components/ui/Spinner';
import { CtaSection } from '@/components/home/CtaSection';
import { useSettings } from '@/lib/settings-context';
import { buildTelLink, getImageUrl } from '@/lib/utils';
import { servicesApi } from '@/services';
import type { ImageValue, Service } from '@/types';

export default function ServiceDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const [service, setService] = useState<Service | null>(null);
  const [related, setRelated] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const { primaryPhone, whatsappLink } = useSettings();
  const phoneLink = primaryPhone ? buildTelLink(primaryPhone.value) : null;

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(false);

    servicesApi
      .getBySlug(slug)
      .then((response) => setService(response.data.service))
      .catch(() => setError(true))
      .finally(() => setLoading(false));

    servicesApi
      .getAll()
      .then((response) =>
        setRelated(
          (response.data ?? []).filter((item) => item.slug !== slug && item.isActive).slice(0, 3)
        )
      )
      .catch(() => setRelated([]));
  }, [slug]);

  useEffect(() => {
    if (!lightbox) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightbox(null);
    };
    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightbox]);

  if (loading) return <FullPageLoader label="Loading service" />;

  if (error || !service) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 px-6 text-center">
        <GlassWater className="h-10 w-10 text-steel-300" aria-hidden />
        <h1 className="font-display text-3xl font-medium tracking-[-0.02em] text-ink-950">
          Service not found
        </h1>
        <p className="max-w-sm text-sm text-steel-500">
          The service you are looking for does not exist or is no longer published.
        </p>
        <Button href="/services" variant="outline" size="md" className="mt-2">
          <ArrowLeft className="h-4 w-4" /> Back to services
        </Button>
      </div>
    );
  }

  const image = getImageUrl(service.featuredImage);
  const gallery = (service.gallery ?? []).filter(Boolean);
  const paragraphs = service.description
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <>
      <PageHero
        eyebrow="Service"
        title={service.title}
        description={service.shortDescription}
        imageUrl={image || undefined}
        meta={<span>Service · KUN Glass &amp; Aluminium</span>}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button href="/contact" size="lg" variant="primary">
            Request a quote
            <ArrowUpRight className="h-4 w-4" />
          </Button>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-[0.75rem] uppercase tracking-[0.16em] text-white/55 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            All services
          </Link>
        </div>
      </PageHero>

      <section className="section bg-surface">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-8">
              <MotionWrap amount={0.15}>
                <p className="type-eyebrow text-bronze-700">Overview</p>
                <div className="mt-6 max-w-2xl space-y-5 text-[1.0625rem] leading-[1.8] text-steel-500">
                  {paragraphs.map((paragraph, index) => (
                    <p key={`${paragraph.slice(0, 24)}-${index}`}>{paragraph}</p>
                  ))}
                </div>
              </MotionWrap>

              {service.features?.length > 0 ? (
                <MotionWrap className="mt-14" amount={0.15}>
                  <p className="type-eyebrow text-bronze-700">Scope &amp; features</p>
                  <StaggerContainer className="mt-6 grid gap-x-8 border-t border-line sm:grid-cols-2">
                    {service.features.map((feature) => (
                      <StaggerItem key={feature}>
                        <div className="flex items-start gap-3 border-b border-line py-4 text-[0.875rem] leading-snug text-ink-700">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-bronze-500/35 text-bronze-700">
                            <Check className="h-3 w-3" aria-hidden />
                          </span>
                          {feature}
                        </div>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </MotionWrap>
              ) : null}

              {service.specifications?.length > 0 ? (
                <MotionWrap className="mt-14" amount={0.15}>
                  <p className="type-eyebrow text-bronze-700">Specifications</p>
                  <div className="mt-6 border border-line">
                    <dl>
                      {service.specifications.map((spec, index) => (
                        <div
                          key={`${spec.label}-${index}`}
                          className="grid grid-cols-1 border-b border-line last:border-b-0 sm:grid-cols-3"
                        >
                          <dt className="bg-stone-50 px-5 py-4 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-steel-500">
                            {spec.label}
                          </dt>
                          <dd className="px-5 py-4 text-sm text-ink-800 sm:col-span-2">{spec.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </MotionWrap>
              ) : null}

              {gallery.length > 0 ? (
                <MotionWrap className="mt-14" amount={0.1}>
                  <p className="type-eyebrow text-bronze-700">Gallery</p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {gallery.map((item: ImageValue, index: number) => {
                      const src = getImageUrl(item);
                      if (!src) return null;
                      return (
                        <button
                          key={`${src}-${index}`}
                          type="button"
                          onClick={() => setLightbox(src)}
                          className="group media-frame aspect-[4/3] text-left"
                          aria-label={`Open ${service.title} gallery image ${index + 1}`}
                        >
                          <img
                            src={src}
                            alt={`${service.title} detail ${index + 1}`}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover transition-transform duration-700 ease-arch group-hover:scale-[1.04]"
                          />
                        </button>
                      );
                    })}
                  </div>
                </MotionWrap>
              ) : null}
            </div>

            {/* Quote panel */}
            <div className="lg:col-span-4">
              <MotionWrap delay={0.1} amount={0.2}>
                <div className="sticky top-28 border border-line bg-white p-6 shadow-soft sm:p-7">
                  <p className="type-eyebrow text-bronze-700">Next step</p>
                  <h2 className="mt-4 font-display text-2xl font-medium tracking-[-0.02em] text-ink-950">
                    Get a considered quote.
                  </h2>
                  <p className="mt-3 text-[0.875rem] leading-relaxed text-steel-500">
                    Send us your drawings or site dimensions. We will respond with material options,
                    lead time and a transparent estimate.
                  </p>

                  <div className="mt-6 flex flex-col gap-2.5">
                    <Button href="/contact" variant="primary" size="md" className="w-full justify-between">
                      Request quote
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                    {phoneLink ? (
                      <Button href={phoneLink} variant="outline" size="md" className="w-full">
                        Call our team
                      </Button>
                    ) : null}
                    {whatsappLink ? (
                      <Button href={whatsappLink} variant="outline" size="md" className="w-full">
                        WhatsApp us
                      </Button>
                    ) : null}
                  </div>

                  <p className="mt-6 border-t border-line pt-4 text-[0.625rem] uppercase tracking-[0.2em] text-steel-500">
                    Nashik · Maharashtra
                  </p>
                </div>
              </MotionWrap>
            </div>
          </div>
        </Container>
      </section>

      {related.length > 0 ? (
        <section className="section-tight border-t border-line bg-surface">
          <Container>
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="type-eyebrow text-bronze-700">Continue</p>
                <h2 className="type-h3 mt-4 text-ink-950">Other services</h2>
              </div>
              <Button href="/services" variant="outline" size="sm">
                All services
              </Button>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <Link key={item._id} href={`/services/${item.slug}`} className="group block">
                  <div className="media-frame aspect-[16/10]">
                    {item.featuredImage ? (
                      <img
                        src={getImageUrl(item.featuredImage)}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-700 ease-arch group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-ink-900">
                        <GlassWater className="h-9 w-9 text-white/20" aria-hidden />
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-3 border-t border-line pt-4">
                    <h3 className="font-display text-lg font-medium tracking-[-0.015em] text-ink-950 transition-colors group-hover:text-bronze-700">
                      {item.title}
                    </h3>
                    <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-steel-500 transition-colors group-hover:text-bronze-700" aria-hidden />
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <CtaSection />

      <AnimatePresence>
        {lightbox ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-ink-950/95 p-4"
            onClick={() => setLightbox(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Image preview"
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-xs border border-white/20 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close image preview"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={lightbox}
              alt={service.title}
              className="max-h-[88vh] max-w-full object-contain"
              onClick={(event) => event.stopPropagation()}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
