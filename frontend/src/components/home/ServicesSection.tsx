'use client';

import Link from 'next/link';
import { ArrowUpRight, GlassWater } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { StaggerContainer, StaggerItem } from '@/components/MotionWrap';
import { getImageUrl, truncate } from '@/lib/utils';
import type { Service } from '@/types';

interface ServicesSectionProps {
  services: Service[];
}

export function ServicesSection({ services }: ServicesSectionProps) {
  if (services.length === 0) return null;

  return (
    <section className="section bg-surface" id="services" aria-label="Our services">
      <Container>
        <div className="flex flex-col gap-8 border-b border-line pb-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            align="left"
            eyebrow="Capabilities"
            title="Precision services, engineered to fit."
            description="Complete glass and aluminium solutions — designed, fabricated and installed by one accountable team."
          />
          <Button href="/services" variant="outline" size="md" className="shrink-0 self-start lg:self-auto">
            All services
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>

        <StaggerContainer className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:gap-y-16">
          {services.map((service, index) => (
            <StaggerItem
              key={service._id}
              className={index % 2 === 1 ? 'md:mt-16' : undefined}
            >
              <Link href={`/services/${service.slug}`} className="group block h-full">
                <article className="flex h-full flex-col">
                  <div className="media-frame aspect-[4/3]">
                    {service.featuredImage ? (
                      <img
                        src={getImageUrl(service.featuredImage)}
                        alt={service.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-[1.1s] ease-arch group-hover:scale-[1.045]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-ink-900">
                        <GlassWater className="h-12 w-12 text-white/20" aria-hidden />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/55 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />

                    <span className="absolute left-5 top-5 font-display text-[0.6875rem] tracking-[0.24em] text-white/70">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <span className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center border border-white/25 text-white/80 transition-all duration-500 ease-arch group-hover:border-bronze-400 group-hover:bg-bronze-500 group-hover:text-ink-950">
                      <ArrowUpRight className="h-4 w-4" aria-hidden />
                    </span>
                  </div>

                  <div className="mt-5 flex flex-1 items-start justify-between gap-6 border-t border-line pt-5">
                    <div>
                      <h3 className="type-h3 text-ink-950 transition-colors duration-300 group-hover:text-bronze-700">
                        {service.title}
                      </h3>
                      <p className="mt-3 max-w-md text-[0.875rem] leading-relaxed text-steel-500">
                        {truncate(service.shortDescription, 150)}
                      </p>
                    </div>
                  </div>
                </article>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </section>
  );
}
