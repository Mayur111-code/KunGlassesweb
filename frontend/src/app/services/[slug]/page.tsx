'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  GlassWater,
  MessageCircle,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { MotionWrap, StaggerContainer, StaggerItem } from '@/components/MotionWrap';
import { FullPageLoader } from '@/components/ui/Spinner';
import { useSettings } from '@/lib/settings-context';
import { buildTelLink, getImageUrl } from '@/lib/utils';
import { servicesApi } from '@/services';
import type { ImageValue, Service } from '@/types';

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<ImageValue>(null);
  const { primaryPhone, whatsappLink } = useSettings();
  const phoneLink = primaryPhone ? buildTelLink(primaryPhone.value) : null;

  useEffect(() => {
    if (!slug) return;
    servicesApi.getBySlug(slug)
      .then((res) => setService(res.data.service))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <FullPageLoader label="Loading service..." />;

  if (error || !service) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <GlassWater className="h-16 w-16 text-navy-200" />
        <h2 className="text-xl font-bold text-navy-950">Service Not Found</h2>
        <p className="text-navy-500">The service you are looking for does not exist.</p>
        <Link href="/services">
          <Button variant="outline" size="md">
            <ArrowLeft className="h-4 w-4" /> Back to Services
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {lightboxImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/80 hover:text-white z-10"
            onClick={() => setLightboxImage(null)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
          <img
            src={getImageUrl(lightboxImage)}
            alt={service.title}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}

      <section className="relative min-h-[45vh] flex items-center gradient-navy overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <Container className="relative z-10 py-32 sm:py-36">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> All Services
            </Link>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.1] mb-4 max-w-3xl"
          >
            {service.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg text-navy-100/80 max-w-2xl leading-relaxed"
          >
            {service.shortDescription}
          </motion.p>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <MotionWrap>
                <div className="prose prose-lg max-w-none text-navy-700">
                  {service.description.split('\n').map((paragraph, i) => (
                    paragraph.trim() && <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </MotionWrap>

              {service.features.length > 0 && (
                <MotionWrap delay={0.1}>
                  <h3 className="font-display text-xl font-bold text-navy-950 mb-5">Key Features</h3>
                  <StaggerContainer className="grid sm:grid-cols-2 gap-3">
                    {service.features.map((feature) => (
                      <StaggerItem key={feature}>
                        <div className="flex items-start gap-3 bg-navy-50 rounded-xl p-4">
                          <CheckCircle2 className="h-5 w-5 text-brand-orange shrink-0 mt-0.5" />
                          <span className="text-sm text-navy-700">{feature}</span>
                        </div>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </MotionWrap>
              )}

              {service.specifications.length > 0 && (
                <MotionWrap delay={0.15}>
                  <h3 className="font-display text-xl font-bold text-navy-950 mb-5">Specifications</h3>
                  <div className="bg-white rounded-2xl border border-navy-100/50 overflow-hidden">
                    <table className="w-full">
                      <tbody>
                        {service.specifications.map((spec, i) => (
                          <tr key={spec.label} className={i % 2 === 0 ? 'bg-navy-50/50' : ''}>
                            <td className="px-5 py-3.5 text-sm font-semibold text-navy-900 w-1/3">{spec.label}</td>
                            <td className="px-5 py-3.5 text-sm text-navy-600">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </MotionWrap>
              )}
            </div>

            <div className="lg:col-span-1">
              <MotionWrap delay={0.2}>
                <div className="sticky top-24 space-y-5">
                  <div className="bg-white rounded-2xl p-6 shadow-card border border-navy-100/50">
                    <h3 className="font-display text-lg font-bold text-navy-950 mb-4">Get a Quote</h3>
                    <p className="text-sm text-navy-500 mb-5 leading-relaxed">
                      Interested in this service? Contact us for a free consultation and quote.
                    </p>
                    <div className="space-y-3">
                      <Link href="/contact" className="block">
                        <Button variant="primary" size="md" className="w-full">
                          Request Quote <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                      {phoneLink && (
                        <a href={phoneLink} className="block">
                          <Button variant="outline" size="md" className="w-full">
                            <Phone className="h-4 w-4" /> Call Now
                          </Button>
                        </a>
                      )}
                      {whatsappLink && (
                        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="block">
                          <Button variant="outline" size="md" className="w-full bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-500 hover:text-white">
                            <MessageCircle className="h-4 w-4" /> WhatsApp
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </MotionWrap>
            </div>
          </div>
        </Container>
      </section>

      {service.gallery.length > 0 && (
        <section className="py-20 sm:py-28 bg-navy-50/50">
          <Container>
            <MotionWrap className="mb-10">
              <h3 className="font-display text-2xl font-bold text-navy-950 text-center mb-2">Gallery</h3>
              <p className="text-navy-500 text-center">A look at our work in action</p>
            </MotionWrap>

            <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {service.gallery.map((img, i) => (
                <StaggerItem key={i}>
                  <button
                    onClick={() => setLightboxImage(img)}
                    className="block w-full aspect-[4/3] rounded-xl overflow-hidden bg-navy-100 group cursor-pointer"
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`${service.title} gallery ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </button>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </Container>
        </section>
      )}

      <section className="py-20 sm:py-28 gradient-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E")' }} />
        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <MotionWrap>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
                Need This Service?
              </h2>
              <p className="text-navy-100/80 mb-8 text-lg">
                Get in touch with us today for a free consultation and personalized quote.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg" variant="primary" className="sm:w-auto w-full">
                    Get a Quote <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                {whatsappLink && (
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="sm:w-auto w-full">
                    <Button size="lg" variant="outline-light" className="w-full bg-emerald-600/20 border-emerald-400/60 text-emerald-300 hover:bg-emerald-500 hover:text-white">
                      <MessageCircle className="h-4 w-4" /> WhatsApp Us
                    </Button>
                  </a>
                )}
              </div>
            </MotionWrap>
          </div>
        </Container>
      </section>
    </>
  );
}
