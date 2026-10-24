'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, GlassWater } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { PageHero } from '@/components/ui/PageHero';
import { MotionWrap } from '@/components/MotionWrap';
import { LoadError } from '@/components/ui/LoadState';
import { CtaSection } from '@/components/home/CtaSection';
import { servicesApi } from '@/services';
import { getSectionImage } from '@/lib/section-images';
import { getImageUrl, cn } from '@/lib/utils';
import { useSettings } from '@/lib/settings-context';
import type { Service } from '@/types';

export default function ServicesPage() {
  const { settings } = useSettings();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const heroImage = getSectionImage(settings, 'services');

  const loadServices = useCallback(() => {
    setLoading(true);
    setError(false);
    servicesApi
      .getAll()
      .then((response) => setServices(response.data ?? []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  return (
    <>
      <PageHero
        eyebrow="Services"
        title={
          <>
            Glass &amp; aluminium,
            <br className="hidden sm:block" /> detailed to the{' '}
            <span className="text-bronze-300">millimetre.</span>
          </>
        }
        description="From the first site survey to the final silicone line, every KUN service is engineered, fabricated and installed by one accountable team."
        imageUrl={heroImage}
        meta={<span>{loading ? 'Loading' : `${services.length} disciplines`}</span>}
      >
        <Button href="/contact" size="lg" variant="primary">
          Discuss your requirement
          <ArrowUpRight className="h-4 w-4" />
        </Button>
      </PageHero>

      <section className="section bg-surface" aria-label="Service index">
        <Container>
          <div className="flex items-end justify-between gap-6 border-b border-line pb-6">
            <p className="type-eyebrow text-bronze-700">Service Index</p>
            <p className="text-[0.6875rem] uppercase tracking-[0.2em] text-steel-500">
              {loading ? 'Loading' : `${services.length} disciplines`}
            </p>
          </div>

          {loading ? (
            <div className="mt-4 divide-y divide-line">
              {[0, 1, 2].map((index) => (
                <div key={index} className="grid gap-8 py-12 lg:grid-cols-12 lg:gap-14">
                  <div className="space-y-4 lg:col-span-6">
                    <div className="h-3 w-16 animate-pulse bg-stone-300" />
                    <div className="h-8 w-3/4 animate-pulse bg-stone-300" />
                    <div className="h-4 w-full animate-pulse bg-stone-200" />
                    <div className="h-4 w-5/6 animate-pulse bg-stone-200" />
                  </div>
                  <div className="aspect-[16/10] animate-pulse bg-stone-200 lg:col-span-6" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="py-16">
              <LoadError
                message="Our services could not be loaded. Please check your connection and try again."
                onRetry={loadServices}
              />
            </div>
          ) : services.length === 0 ? (
            <div className="mt-10 flex flex-col items-center justify-center border border-dashed border-line py-24 text-center">
              <GlassWater className="h-10 w-10 text-steel-300" aria-hidden />
              <h2 className="mt-6 font-display text-2xl font-medium tracking-[-0.02em] text-ink-950">
                Services are being updated
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-steel-500">
                Our team is preparing the latest service catalogue. Please check back shortly or
                contact us directly.
              </p>
              <Button href="/contact" variant="outline" size="md" className="mt-6">
                Contact us
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-line">
              {services.map((service, index) => (
                <MotionWrap key={service._id} amount={0.12}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="group grid gap-8 py-10 lg:grid-cols-12 lg:gap-14 lg:py-16"
                  >
                    <div className={cn('lg:col-span-6', index % 2 === 1 && 'lg:order-last')}>
                      <div className="flex items-baseline gap-4">
                        <span className="type-eyebrow text-bronze-700">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="h-px flex-1 bg-line" aria-hidden />
                      </div>

                      <h2 className="type-h3 mt-6 text-ink-950 transition-colors duration-300 group-hover:text-bronze-700">
                        {service.title}
                      </h2>

                      <p className="mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-steel-500">
                        {service.shortDescription}
                      </p>

                      {service.features?.length > 0 ? (
                        <ul className="mt-6 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                          {service.features.slice(0, 4).map((feature) => (
                            <li
                              key={feature}
                              className="flex items-start gap-2.5 text-[0.8125rem] leading-snug text-ink-700"
                            >
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-bronze-500" aria-hidden />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      ) : null}

                      <span className="mt-8 inline-flex items-center gap-2 text-[0.8125rem] font-medium text-ink-900">
                        View service
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                      </span>
                    </div>

                    <div className="lg:col-span-6">
                      <div className="media-frame aspect-[16/10]">
                        {service.featuredImage ? (
                          <img
                            src={getImageUrl(service.featuredImage)}
                            alt={service.title}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover transition-transform duration-[1.1s] ease-arch group-hover:scale-[1.04]"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-ink-900">
                            <GlassWater className="h-12 w-12 text-white/20" aria-hidden />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/40 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
                        <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center border border-white/25 text-white/80 transition-all duration-500 ease-arch group-hover:border-bronze-400 group-hover:bg-bronze-500 group-hover:text-ink-950">
                          <ArrowUpRight className="h-4 w-4" aria-hidden />
                        </span>
                      </div>
                    </div>
                  </Link>
                </MotionWrap>
              ))}
            </div>
          )}
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
