'use client';

import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MotionWrap, StaggerContainer, StaggerItem } from '@/components/MotionWrap';
import { ContactForm } from '@/components/ContactForm';
import { useSettings } from '@/lib/settings-context';
import {
  KUN_COMPANY_ADDRESS,
  buildTelLink,
  buildWhatsAppLink,
  buildMailtoLink,
  getImageUrl,
} from '@/lib/utils';

export default function ContactPage() {
  const { settings, primaryPhone, primaryWhatsApp, primaryEmail, whatsappLink } = useSettings();
  const addressLines = (settings?.address ?? KUN_COMPANY_ADDRESS).split('\n').filter(Boolean);
  const heroImage = getImageUrl(settings?.heroImages?.contact);

  const phoneLink = primaryPhone ? buildTelLink(primaryPhone.value) : null;
  const emailLink = primaryEmail ? buildMailtoLink(primaryEmail.value, 'Enquiry from Website') : null;

  return (
    <>
      <PageHero
        eyebrow="Contact us"
        title={
          <>
            Get in <span className="text-brand-light">touch</span>
          </>
        }
        description="Have a project in mind? Contact us for a consultation and quote."
        imageUrl={heroImage}
      />

      <section className="section-padding">
        <Container>
          <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
            <div className="lg:col-span-3">
              <MotionWrap>
                <h2 className="font-display text-2xl font-bold text-navy-950">Send us a message</h2>
                <p className="mt-2 text-navy-500">We typically respond within one business day.</p>
              </MotionWrap>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>

            <div className="lg:col-span-2">
              <MotionWrap delay={0.1}>
                <div className="space-y-5">
                  <div className="rounded-lg border border-navy-100/80 bg-white p-6 shadow-sm">
                    <h3 className="font-display text-lg font-bold text-navy-950">Contact details</h3>
                    <div className="mt-5 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-navy-50 text-brand-orange">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-navy-400">Address</p>
                          {addressLines.map((line, i) => (
                            <p key={i} className={`text-sm ${i === 0 ? 'font-semibold text-navy-900' : 'text-navy-600'}`}>
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                      {phoneLink && primaryPhone && (
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-navy-50 text-brand-orange">
                            <Phone className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-navy-400">Phone</p>
                            <a href={phoneLink} className="text-sm font-semibold text-navy-900 hover:text-brand-orange">
                              {primaryPhone.value}
                            </a>
                          </div>
                        </div>
                      )}
                      {emailLink && primaryEmail && (
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-navy-50 text-brand-orange">
                            <Mail className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-navy-400">Email</p>
                            <a href={emailLink} className="text-sm font-semibold text-navy-900 hover:text-brand-orange">
                              {primaryEmail.value}
                            </a>
                          </div>
                        </div>
                      )}
                      {whatsappLink && primaryWhatsApp && (
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
                            <MessageCircle className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-navy-400">WhatsApp</p>
                            <a
                              href={whatsappLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-semibold text-navy-900 hover:text-emerald-600"
                            >
                              {primaryWhatsApp.value}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {phoneLink && (
                      <a href={phoneLink}>
                        <Button variant="primary" size="md" className="w-full">
                          <Phone className="h-4 w-4" /> Call Now
                        </Button>
                      </a>
                    )}
                    {whatsappLink && (
                      <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                        <Button
                          variant="outline"
                          size="md"
                          className="w-full border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white"
                        >
                          <MessageCircle className="h-4 w-4" /> WhatsApp Us
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </MotionWrap>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-padding bg-surface-muted">
        <Container>
          <MotionWrap className="mb-12">
            <SectionHeading
              eyebrow="Quick connect"
              title="Other ways to reach us"
              description="Choose the method that works best for you."
            />
          </MotionWrap>

          <StaggerContainer className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-3">
            {phoneLink && primaryPhone && (
              <StaggerItem>
                <a href={phoneLink} className="block">
                  <div className="rounded-lg border border-navy-100/80 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-card">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-md bg-brand-orange/10">
                      <Phone className="h-6 w-6 text-brand-orange" />
                    </div>
                    <h3 className="text-sm font-bold text-navy-950">Call us</h3>
                    <p className="mt-1 text-xs text-navy-500">{primaryPhone.value}</p>
                  </div>
                </a>
              </StaggerItem>
            )}
            {whatsappLink && (
              <StaggerItem>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="block">
                  <div className="rounded-lg border border-navy-100/80 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-card">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-md bg-emerald-50">
                      <MessageCircle className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h3 className="text-sm font-bold text-navy-950">WhatsApp</h3>
                    <p className="mt-1 text-xs text-navy-500">Chat with us</p>
                  </div>
                </a>
              </StaggerItem>
            )}
            {emailLink && primaryEmail && (
              <StaggerItem>
                <a href={emailLink} className="block">
                  <div className="rounded-lg border border-navy-100/80 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-card">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-md bg-sky-50">
                      <Mail className="h-6 w-6 text-sky-600" />
                    </div>
                    <h3 className="text-sm font-bold text-navy-950">Email</h3>
                    <p className="mt-1 text-xs text-navy-500">{primaryEmail.value}</p>
                  </div>
                </a>
              </StaggerItem>
            )}
          </StaggerContainer>
        </Container>
      </section>
    </>
  );
}
