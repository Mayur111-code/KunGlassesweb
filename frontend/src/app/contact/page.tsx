'use client';

import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { PageHero } from '@/components/ui/PageHero';
import { MotionWrap } from '@/components/MotionWrap';
import { ContactForm } from '@/components/ContactForm';
import { useSettings } from '@/lib/settings-context';
import { getSectionImage } from '@/lib/section-images';
import { KUN_COMPANY_ADDRESS, buildMailtoLink, buildTelLink } from '@/lib/utils';

export default function ContactPage() {
  const { settings, primaryPhone, primaryWhatsApp, primaryEmail, whatsappLink } = useSettings();
  const addressLines = (settings?.address ?? KUN_COMPANY_ADDRESS).split(/\r?\n/).filter(Boolean);
  const heroImage = getSectionImage(settings, 'contact');

  const phoneLink = primaryPhone ? buildTelLink(primaryPhone.value) : null;
  const emailLink = primaryEmail ? buildMailtoLink(primaryEmail.value, 'Enquiry from Website') : null;

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Let&apos;s talk about
            <br className="hidden sm:block" /> your <span className="text-bronze-300">project.</span>
          </>
        }
        description="Send drawings, dimensions or an idea. We will respond with material guidance, timelines and a clear next step."
        imageUrl={heroImage}
        meta={<span>Nashik · Maharashtra</span>}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          {phoneLink ? (
            <Button href={phoneLink} size="lg" variant="primary">
              <Phone className="h-4 w-4" />
              Call our team
            </Button>
          ) : null}
          {whatsappLink ? (
            <Button href={whatsappLink} size="lg" variant="outline-light">
              <MessageCircle className="h-4 w-4" />
              WhatsApp us
            </Button>
          ) : null}
        </div>
      </PageHero>

      <section className="section bg-surface" aria-label="Contact details and enquiry form">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <MotionWrap className="lg:col-span-5" amount={0.2}>
              <p className="type-eyebrow text-bronze-700">Direct Lines</p>
              <h2 className="type-h3 mt-4 max-w-sm text-ink-950">
                Reach the right person, faster.
              </h2>
              <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-steel-500">
                For quotations, site visits or material advice, use any of the channels below. We
                reply within one business day.
              </p>

              <ul className="mt-9 border-t border-line">
                {phoneLink && primaryPhone ? (
                  <li className="border-b border-line">
                    <a href={phoneLink} className="group flex items-start gap-4 py-5">
                      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center border border-line text-bronze-700 transition-colors group-hover:border-bronze-500/60">
                        <Phone className="h-4 w-4" aria-hidden />
                      </span>
                      <span>
                        <span className="block text-[0.5625rem] uppercase tracking-[0.22em] text-steel-500">
                          Phone
                        </span>
                        <span className="mt-1 block text-sm font-medium text-ink-900 transition-colors group-hover:text-bronze-700">
                          {primaryPhone.value}
                        </span>
                      </span>
                    </a>
                  </li>
                ) : null}

                {whatsappLink && primaryWhatsApp ? (
                  <li className="border-b border-line">
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-4 py-5"
                    >
                      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center border border-line text-emerald-700 transition-colors group-hover:border-emerald-500/50">
                        <MessageCircle className="h-4 w-4" aria-hidden />
                      </span>
                      <span>
                        <span className="block text-[0.5625rem] uppercase tracking-[0.22em] text-steel-500">
                          WhatsApp
                        </span>
                        <span className="mt-1 block text-sm font-medium text-ink-900 transition-colors group-hover:text-emerald-700">
                          {primaryWhatsApp.value}
                        </span>
                      </span>
                    </a>
                  </li>
                ) : null}

                {emailLink && primaryEmail ? (
                  <li className="border-b border-line">
                    <a href={emailLink} className="group flex items-start gap-4 py-5">
                      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center border border-line text-bronze-700 transition-colors group-hover:border-bronze-500/60">
                        <Mail className="h-4 w-4" aria-hidden />
                      </span>
                      <span>
                        <span className="block text-[0.5625rem] uppercase tracking-[0.22em] text-steel-500">
                          Email
                        </span>
                        <span className="mt-1 block break-all text-sm font-medium text-ink-900 transition-colors group-hover:text-bronze-700">
                          {primaryEmail.value}
                        </span>
                      </span>
                    </a>
                  </li>
                ) : null}

                <li>
                  <div className="flex items-start gap-4 py-5">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center border border-line text-bronze-700">
                      <MapPin className="h-4 w-4" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-[0.5625rem] uppercase tracking-[0.22em] text-steel-500">
                        Studio
                      </span>
                      <address className="mt-1 block whitespace-pre-line text-sm not-italic leading-relaxed text-ink-700">
                        {addressLines.map((line, index) => (
                          <span key={index} className="block">
                            {line}
                          </span>
                        ))}
                      </address>
                      {settings?.googleMapsUrl ? (
                        <a
                          href={settings.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex text-[0.6875rem] uppercase tracking-[0.16em] text-bronze-700 underline-offset-4 hover:underline"
                        >
                          Open in Google Maps
                        </a>
                      ) : null}
                    </span>
                  </div>
                </li>
              </ul>
            </MotionWrap>

            <MotionWrap className="lg:col-span-7" delay={0.1} amount={0.2}>
              <div className="border border-line bg-white p-6 shadow-soft sm:p-9 lg:p-10">
                <div className="flex items-start justify-between gap-6 border-b border-line pb-6">
                  <div>
                    <p className="type-eyebrow text-bronze-700">Enquiry</p>
                    <h2 className="type-h3 mt-3 text-ink-950">Tell us about your project</h2>
                  </div>
                  <span className="hidden h-10 w-10 border border-bronze-500/40 sm:block" aria-hidden />
                </div>
                <p className="mt-4 text-[0.8125rem] text-steel-500">
                  Fields marked * are required. Your details are used only to respond to this
                  enquiry.
                </p>
                <div className="mt-8">
                  <ContactForm />
                </div>
              </div>
            </MotionWrap>
          </div>
        </Container>
      </section>

      <section className="section-tight border-t border-line surface-stone" aria-label="Service area">
        <Container>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="type-eyebrow text-bronze-700">Service Area</p>
              <p className="mt-3 max-w-xl font-display text-xl font-medium tracking-[-0.015em] text-ink-950">
                Based in Nashik. Delivering across Maharashtra and beyond.
              </p>
            </div>
            <Button href="/projects" variant="outline" size="md">
              See completed work
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
