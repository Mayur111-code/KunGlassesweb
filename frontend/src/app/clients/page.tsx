'use client';

import { useCallback, useEffect, useState } from 'react';
import { Building2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { PageHero } from '@/components/ui/PageHero';
import { MotionWrap, StaggerContainer, StaggerItem } from '@/components/MotionWrap';
import { LoadError } from '@/components/ui/LoadState';
import { CtaSection } from '@/components/home/CtaSection';
import { clientsApi } from '@/services';
import { getClientLogo, getSectionImage } from '@/lib/section-images';
import { getImageUrl, getInitials } from '@/lib/utils';
import { useSettings } from '@/lib/settings-context';
import type { Client } from '@/types';

export default function ClientsPage() {
  const { settings } = useSettings();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const heroImage = getSectionImage(settings, 'clients');

  const loadClients = useCallback(() => {
    setLoading(true);
    setError(false);
    clientsApi
      .getAll()
      .then((response) => setClients(response.data ?? []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const featured = clients.filter((client) => client.isFeatured);
  const others = clients.filter((client) => !client.isFeatured);

  return (
    <>
      <PageHero
        eyebrow="Clients"
        title={
          <>
            Trusted by names
            <br className="hidden sm:block" /> that <span className="text-bronze-300">build.</span>
          </>
        }
        description="Long-standing relationships with developers, institutions, retailers and industrial groups across Nashik and Maharashtra."
        imageUrl={heroImage}
        meta={<span>{loading ? 'Loading' : `${clients.length} clients`}</span>}
      />

      <section className="section bg-surface" aria-label="Client directory">
        <Container>
          {loading ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <div key={index} className="h-40 animate-pulse bg-stone-200" />
              ))}
            </div>
          ) : error ? (
            <LoadError
              message="Our client list could not be loaded. Please check your connection and try again."
              onRetry={loadClients}
            />
          ) : clients.length === 0 ? (
            <MotionWrap>
              <div className="flex flex-col items-center justify-center border border-dashed border-line py-24 text-center">
                <Building2 className="h-10 w-10 text-steel-300" aria-hidden />
                <h2 className="mt-6 font-display text-2xl font-medium tracking-[-0.02em] text-ink-950">
                  Client list in progress
                </h2>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-steel-500">
                  We are refreshing our client directory. Please check back shortly.
                </p>
              </div>
            </MotionWrap>
          ) : (
            <>
              {featured.length > 0 ? (
                <div>
                  <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="type-eyebrow text-bronze-700">Key Partners</p>
                      <h2 className="type-h3 mt-4 text-ink-950">Relationships built on delivery.</h2>
                    </div>
                    <p className="text-[0.625rem] uppercase tracking-[0.2em] text-steel-500">
                      {featured.length} featured
                    </p>
                  </div>

                  <StaggerContainer className="mt-4 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
                    {featured.map((client) => {
                      const logo = getClientLogo(client);
                      return (
                        <StaggerItem key={client._id}>
                          <div className="flex h-full flex-col bg-surface p-6">
                            <div className="flex h-16 items-center">
                              {logo ? (
                                <img
                                  src={getImageUrl(client.logo)}
                                  alt={client.name}
                                  loading="lazy"
                                  decoding="async"
                                  className="max-h-12 max-w-[10rem] object-contain"
                                />
                              ) : (
                                <span className="flex h-12 w-12 items-center justify-center border border-line text-sm font-semibold text-bronze-700">
                                  {getInitials(client.name)}
                                </span>
                              )}
                            </div>

                            <h3 className="mt-6 font-display text-lg font-medium tracking-[-0.015em] text-ink-950">
                              {client.name}
                            </h3>
                            {client.category ? (
                              <p className="mt-1 text-[0.625rem] uppercase tracking-[0.18em] text-bronze-700">
                                {client.category}
                              </p>
                            ) : null}
                            {client.description ? (
                              <p className="mt-3 flex-1 text-[0.8125rem] leading-relaxed text-steel-500">
                                {client.description}
                              </p>
                            ) : (
                              <div className="flex-1" />
                            )}

                            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line pt-4 text-[0.6875rem] text-steel-500">
                              {client.location ? (
                                <span className="inline-flex items-center gap-1.5">
                                  <MapPin className="h-3 w-3" aria-hidden />
                                  {client.location}
                                </span>
                              ) : null}
                              {client.projectDescription ? (
                                <span className="inline-flex items-center gap-1.5">
                                  <Building2 className="h-3 w-3" aria-hidden />
                                  Project delivered
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </StaggerItem>
                      );
                    })}
                  </StaggerContainer>
                </div>
              ) : null}

              {others.length > 0 ? (
                <div className={featured.length > 0 ? 'mt-20' : ''}>
                  <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="type-eyebrow text-bronze-700">
                        {featured.length > 0 ? 'Directory' : 'Our Clients'}
                      </p>
                      <h2 className="type-h3 mt-4 text-ink-950">
                        {featured.length > 0 ? 'More valued clients.' : 'Clients we work with.'}
                      </h2>
                    </div>
                    <p className="text-[0.625rem] uppercase tracking-[0.2em] text-steel-500">
                      {others.length} total
                    </p>
                  </div>

                  <StaggerContainer className="mt-4 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-4">
                    {others.map((client) => {
                      const logo = getClientLogo(client);
                      return (
                        <StaggerItem key={client._id}>
                          <div className="flex h-full min-h-[8.5rem] flex-col items-center justify-center gap-3 bg-surface p-5 text-center">
                            {logo ? (
                              <img
                                src={getImageUrl(client.logo)}
                                alt={client.name}
                                loading="lazy"
                                decoding="async"
                                className="h-10 max-w-[8rem] object-contain opacity-75 transition-opacity duration-300 hover:opacity-100"
                              />
                            ) : (
                              <span className="flex h-10 w-10 items-center justify-center border border-line text-xs font-semibold text-bronze-700">
                                {getInitials(client.name)}
                              </span>
                            )}
                            <p className="text-[0.75rem] font-medium leading-tight text-ink-800">
                              {client.name}
                            </p>
                            {client.category ? (
                              <p className="text-[0.5625rem] uppercase tracking-[0.16em] text-steel-500">
                                {client.category}
                              </p>
                            ) : null}
                          </div>
                        </StaggerItem>
                      );
                    })}
                  </StaggerContainer>
                </div>
              ) : null}

              <div className="mt-14 flex flex-col items-start justify-between gap-6 border-t border-line pt-8 sm:flex-row sm:items-center">
                <p className="max-w-md text-sm leading-relaxed text-steel-500">
                  Want references for a project like yours? Our team can share relevant completed
                  work on request.
                </p>
                <Button href="/contact" variant="ink" size="md">
                  Request references
                </Button>
              </div>
            </>
          )}
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
