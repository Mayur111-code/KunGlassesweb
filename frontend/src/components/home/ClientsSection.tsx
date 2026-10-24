'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { getClientLogo } from '@/lib/section-images';
import { getImageUrl, getInitials } from '@/lib/utils';
import type { Client } from '@/types';

interface ClientsSectionProps {
  clients: Client[];
}

export function ClientsSection({ clients }: ClientsSectionProps) {
  if (clients.length === 0) return null;

  const row = [...clients, ...clients];

  return (
    <section className="section surface-stone" id="clients" aria-label="Our clients">
      <Container>
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="type-eyebrow inline-flex items-center gap-3 text-bronze-700">
              <span className="h-px w-7 bg-bronze-500/70" aria-hidden />
              Our Clients
            </p>
            <h2 className="type-h2 mt-5 text-ink-950">Trusted by names that build.</h2>
            <p className="mt-5 max-w-xl text-[0.975rem] leading-relaxed text-steel-500">
              Long-standing relationships across retail, education, IT, industrial and government
              sectors.
            </p>
          </div>
          <Button href="/clients" variant="outline" size="md" className="shrink-0 self-start sm:self-auto">
            All clients
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
      </Container>

      {/* Desktop marquee */}
      <div className="relative mt-12 hidden overflow-hidden border-y border-line py-2 md:block">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-stone-100 to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-stone-100 to-transparent" aria-hidden />

        <div className="marquee-track">
          {row.map((client, index) => {
            const logo = getClientLogo(client);
            return (
              <div
                key={`${client._id}-${index}`}
                className="flex h-24 w-52 shrink-0 items-center justify-center border-l border-line px-7"
                aria-hidden={index >= clients.length}
              >
                {logo ? (
                  <img
                    src={getImageUrl(client.logo)}
                    alt={client.name}
                    loading="lazy"
                    decoding="async"
                    className="max-h-12 max-w-full object-contain opacity-60 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0"
                  />
                ) : (
                  <span className="font-display text-lg font-medium tracking-[0.06em] text-steel-500">
                    {getInitials(client.name)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile grid */}
      <Container className="md:hidden">
        <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden border border-line bg-line">
          {clients.slice(0, 8).map((client) => {
            const logo = getClientLogo(client);
            return (
              <div
                key={client._id}
                className="flex min-h-[6.5rem] flex-col items-center justify-center gap-2 bg-surface p-4 text-center"
              >
                {logo ? (
                  <img
                    src={getImageUrl(client.logo)}
                    alt={client.name}
                    loading="lazy"
                    decoding="async"
                    className="h-10 max-w-full object-contain opacity-70"
                  />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-xs font-semibold text-bronze-700">
                    {getInitials(client.name)}
                  </span>
                )}
                <p className="text-[0.6875rem] font-medium leading-tight text-steel-500">
                  {client.name}
                </p>
              </div>
            );
          })}
        </div>
        <Link
          href="/clients"
          className="mt-6 flex items-center justify-between border-t border-line pt-4 text-sm text-ink-900"
        >
          View all clients
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </Link>
      </Container>
    </section>
  );
}
