'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MotionWrap } from '@/components/MotionWrap';
import { getImageUrl, getInitials } from '@/lib/utils';
import type { Client } from '@/types';

interface ClientsSectionProps {
  clients: Client[];
}

export function ClientsSection({ clients }: ClientsSectionProps) {
  if (clients.length === 0) return null;

  const row = [...clients, ...clients];

  return (
    <section className="section-padding overflow-hidden" id="clients" aria-label="Our clients">
      <Container>
        <MotionWrap className="mb-12">
          <SectionHeading
            eyebrow="Our clients"
            title="Trusted by leading brands"
            description="Reputed names across retail, education, IT, industrial and government sectors."
          />
        </MotionWrap>
      </Container>

      {/* Desktop marquee */}
      <div className="relative mb-12 hidden md:block">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent" />
        <div className="flex w-max animate-marquee-slow motion-reduce:animate-none gap-10 px-6">
          {row.map((client, i) => (
            <div
              key={`${client._id}-${i}`}
              className="flex h-24 w-44 shrink-0 items-center justify-center rounded-lg border border-navy-100/80 bg-white px-4 shadow-sm transition-all duration-300 hover:shadow-card-hover hover:border-navy-200"
            >
              {client.logo ? (
                <img
                  src={getImageUrl(client.logo)}
                  alt={client.name}
                  className="max-h-14 max-w-full object-contain opacity-80 transition-opacity duration-300 hover:opacity-100"
                  loading="lazy"
                />
              ) : (
                <span className="font-display text-lg font-bold text-navy-700">{getInitials(client.name)}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile grid */}
      <Container>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 md:hidden">
          {clients.slice(0, 8).map((client) => (
            <div
              key={client._id}
              className="flex flex-col items-center rounded-lg border border-navy-100/80 bg-white p-5 text-center transition-all duration-300 hover:shadow-card-hover hover:border-navy-200"
            >
              {client.logo ? (
                <img
                  src={getImageUrl(client.logo)}
                  alt={client.name}
                  className="mb-3 h-14 max-w-full object-contain opacity-80"
                  loading="lazy"
                />
              ) : (
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-navy-50 text-sm font-bold text-brand-orange">
                  {getInitials(client.name)}
                </div>
              )}
              <p className="text-sm font-semibold leading-tight text-navy-900">{client.name}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/clients">
            <Button variant="outline" size="md" className="group">
              View all clients
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
