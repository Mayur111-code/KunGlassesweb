'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, Star } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MotionWrap, StaggerContainer, StaggerItem } from '@/components/MotionWrap';
import { FullPageLoader } from '@/components/ui/Spinner';
import { LoadError } from '@/components/ui/LoadState';
import { clientsApi } from '@/services';
import { getImageUrl, getInitials } from '@/lib/utils';
import { useSettings } from '@/lib/settings-context';
import type { Client } from '@/types';

export default function ClientsPage() {
  const { settings } = useSettings();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const heroImage = getImageUrl(settings?.heroImages?.clients);

  const loadClients = useCallback(() => {
    setLoading(true);
    setError(false);
    clientsApi.getAll()
      .then((res) => setClients(res.data ?? []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadClients(); }, [loadClients]);

  const featuredClients = clients.filter((c) => c.isFeatured);
  const otherClients = clients.filter((c) => !c.isFeatured);

  return (
    <>
      <section className="relative min-h-[40vh] flex items-center gradient-navy overflow-hidden">
        {heroImage && <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" aria-hidden />}
        {heroImage && <div className="absolute inset-0 bg-navy-950/80" />}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <Container className="relative z-10 py-32 sm:py-36">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block rounded-full bg-brand-orange/20 border border-brand-orange/30 px-4 py-1.5 text-xs font-bold text-brand-light tracking-widest uppercase mb-6"
          >
            Our Clients
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.1] mb-6 max-w-3xl"
          >
            Trusted by{' '}
            <span className="text-brand-orange">Leading Brands</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg text-navy-100/80 max-w-2xl leading-relaxed"
          >
            Proud to work with reputed names across retail, education, IT, industrial and government sectors.
          </motion.p>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          {loading ? (
            <FullPageLoader label="Loading clients..." />
          ) : error ? (
            <LoadError message="Our client list could not be loaded. Please check your connection and try again." onRetry={loadClients} />
          ) : clients.length === 0 ? (
            <div className="text-center py-20">
              <Building2 className="h-16 w-16 text-navy-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-navy-950 mb-2">No Clients to Display</h3>
              <p className="text-navy-500">We are currently updating our client list. Please check back soon.</p>
            </div>
          ) : (
            <>
              {featuredClients.length > 0 && (
                <div className="mb-16">
                  <MotionWrap className="mb-10">
                    <SectionHeading
                      eyebrow="Featured Clients"
                      title="Our Key Partners"
                      description="Long-standing relationships built on trust and quality."
                      align="left"
                    />
                  </MotionWrap>

                  <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredClients.map((client) => (
                      <StaggerItem key={client._id}>
                        <div className="h-full bg-white rounded-2xl p-6 shadow-card border border-brand-orange/20 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                          <div className="absolute top-3 right-3">
                            <Star className="h-4 w-4 text-brand-orange fill-brand-orange" />
                          </div>
                          <div className="flex items-start gap-4 mb-4">
                            {client.logo ? (
                              <img src={getImageUrl(client.logo)} alt={client.name} className="h-14 w-14 object-contain shrink-0" />
                            ) : (
                              <div className="h-14 w-14 rounded-xl bg-brand-orange/10 flex items-center justify-center shrink-0 text-brand-orange font-bold text-lg">
                                {getInitials(client.name)}
                              </div>
                            )}
                            <div className="min-w-0">
                              <h3 className="text-base font-bold text-navy-950 truncate">{client.name}</h3>
                              {client.category && <p className="text-xs text-brand-orange font-semibold mt-0.5">{client.category}</p>}
                            </div>
                          </div>
                          {client.description && (
                            <p className="text-sm text-navy-500 leading-relaxed mb-3">{client.description}</p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-navy-400">
                            {client.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> {client.location}
                              </span>
                            )}
                            {client.projectDescription && (
                              <span className="flex items-center gap-1">
                                <Building2 className="h-3 w-3" /> Project done
                              </span>
                            )}
                          </div>
                        </div>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </div>
              )}

              {otherClients.length > 0 && (
                <div>
                  <MotionWrap className="mb-10">
                    <SectionHeading
                      eyebrow={featuredClients.length > 0 ? 'All Clients' : undefined}
                      title={featuredClients.length > 0 ? 'More Valued Clients' : 'Our Clients'}
                      description="Serving a wide range of industries and sectors."
                      align="left"
                    />
                  </MotionWrap>

                  <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                    {otherClients.map((client) => (
                      <StaggerItem key={client._id}>
                        <div className="h-full bg-white rounded-2xl p-5 shadow-card border border-navy-100/50 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 text-center">
                          {client.logo ? (
                            <img src={getImageUrl(client.logo)} alt={client.name} className="h-12 w-auto mx-auto object-contain mb-3" />
                          ) : (
                            <div className="h-12 w-12 mx-auto rounded-full bg-brand-orange/10 flex items-center justify-center mb-3 text-brand-orange font-bold text-base">
                              {getInitials(client.name)}
                            </div>
                          )}
                          <p className="text-sm font-semibold text-navy-900 leading-tight">{client.name}</p>
                          {client.category && <p className="text-xs text-navy-400 mt-1">{client.category}</p>}
                        </div>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </div>
              )}
            </>
          )}
        </Container>
      </section>
    </>
  );
}
