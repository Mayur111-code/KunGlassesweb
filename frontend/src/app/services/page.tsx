'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, GlassWater, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MotionWrap, StaggerContainer, StaggerItem } from '@/components/MotionWrap';
import { FullPageLoader } from '@/components/ui/Spinner';
import { LoadError } from '@/components/ui/LoadState';
import { servicesApi } from '@/services';
import { getImageUrl, truncate } from '@/lib/utils';
import { useSettings } from '@/lib/settings-context';
import type { Service } from '@/types';

export default function ServicesPage() {
  const { settings } = useSettings();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const heroImage = getImageUrl(settings?.heroImages?.services);

  const loadServices = useCallback(() => {
    setLoading(true);
    setError(false);
    servicesApi.getAll()
      .then((res) => setServices(res.data ?? []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadServices(); }, [loadServices]);

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
            Our Services
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.1] mb-6 max-w-3xl"
          >
            Premium Glass &{' '}
            <span className="text-brand-orange">Aluminium Solutions</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg text-navy-100/80 max-w-2xl leading-relaxed"
          >
            From design to installation — we deliver complete solutions for residential, commercial and industrial spaces.
          </motion.p>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          {loading ? (
            <FullPageLoader label="Loading services..." />
          ) : error ? (
            <LoadError message="Our services could not be loaded. Please check your connection and try again." onRetry={loadServices} />
          ) : services.length === 0 ? (
            <div className="text-center py-20">
              <GlassWater className="h-16 w-16 text-navy-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-navy-950 mb-2">No Services Available</h3>
              <p className="text-navy-500">We are currently updating our services. Please check back soon.</p>
            </div>
          ) : (
            <>
              <MotionWrap className="mb-14">
                <SectionHeading
                  eyebrow="What We Offer"
                  title="Our Services"
                  description="Explore our comprehensive range of glass and aluminium solutions."
                />
              </MotionWrap>

              <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <StaggerItem key={service._id}>
                    <Link href={`/services/${service.slug}`} className="group block h-full">
                      <div className="h-full flex flex-col bg-white rounded-md shadow-card hover:shadow-card-hover transition-all duration-300 border border-navy-100/70 overflow-hidden group-hover:-translate-y-1">
                        <div className="h-52 bg-gradient-to-br from-navy-900 to-navy-700 flex items-center justify-center relative overflow-hidden">
                          {service.featuredImage ? (
                            <img
                              src={getImageUrl(service.featuredImage)}
                              alt={service.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="text-center px-6">
                              <GlassWater className="h-14 w-14 text-white/30 mx-auto mb-3" />
                              <span className="text-sm text-white/50 font-medium">{service.title}</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 to-transparent" />
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="text-lg font-bold text-navy-950 mb-2 group-hover:text-brand-orange transition-colors">
                            {service.title}
                          </h3>
                          <p className="text-sm text-navy-500 leading-relaxed mb-4 flex-1">
                            {truncate(service.shortDescription, 150)}
                          </p>
                          {service.features.length > 0 && (
                            <div className="space-y-1.5 mb-4">
                              {service.features.slice(0, 3).map((feature) => (
                                <div key={feature} className="flex items-center gap-2">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-brand-orange shrink-0" />
                                  <span className="text-xs text-navy-600">{feature}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm font-semibold text-brand-orange mt-auto">
                            View Details <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </>
          )}
        </Container>
      </section>
    </>
  );
}
