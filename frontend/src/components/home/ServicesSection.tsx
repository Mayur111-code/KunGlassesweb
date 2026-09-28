'use client';

import Link from 'next/link';
import { ArrowRight, ArrowUpRight, GlassWater } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MotionWrap, StaggerContainer, StaggerItem } from '@/components/MotionWrap';
import { getImageUrl, truncate } from '@/lib/utils';
import type { Service } from '@/types';

interface ServicesSectionProps {
  services: Service[];
}

export function ServicesSection({ services }: ServicesSectionProps) {
  if (services.length === 0) return null;

  return (
    <section className="section-padding" id="services" aria-label="Our services">
      <Container>
        <MotionWrap className="mb-14">
          <SectionHeading
            align="left"
            eyebrow="What we do"
            title="Premium services for every space"
            description="Complete glass and aluminium solutions \u2014 from design to installation \u2014 for residential, commercial and industrial environments."
          />
        </MotionWrap>

        <StaggerContainer className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <StaggerItem key={service._id}>
              <Link href={`/services/${service.slug}`} className="group block h-full">
                <article className="card-editorial flex h-full flex-col overflow-hidden">
                  <div className="relative aspect-[16/10] overflow-hidden bg-navy-900">
                    {service.featuredImage ? (
                      <img
                        src={getImageUrl(service.featuredImage)}
                        alt={service.title}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <GlassWater className="h-14 w-14 text-white/25" aria-hidden />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/75 via-navy-950/20 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
                    <span className="absolute bottom-4 left-4 right-4 font-display text-xl font-semibold leading-tight text-white">
                      {service.title}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="flex-1 text-sm leading-relaxed text-navy-600">
                      {truncate(service.shortDescription, 140)}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-orange transition-colors group-hover:text-brand-dark">
                      Explore service
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </article>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="mt-12">
          <Link href="/services">
            <Button variant="outline" size="md" className="group">
              View all services
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
