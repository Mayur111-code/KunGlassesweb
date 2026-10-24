'use client';

import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { MotionWrap } from '@/components/MotionWrap';
import { ContactForm } from '@/components/ContactForm';
import { useSettings } from '@/lib/settings-context';
import { KUN_COMPANY_ADDRESS, buildMailtoLink, buildTelLink } from '@/lib/utils';

export function ContactSection() {
  const { settings, primaryPhone, primaryEmail, primaryWhatsApp, whatsappLink } = useSettings();
  const addressLines = (settings?.address ?? KUN_COMPANY_ADDRESS).split(/\r?\n/).filter(Boolean);
  const phoneLink = primaryPhone ? buildTelLink(primaryPhone.value) : null;
  const emailLink = primaryEmail ? buildMailtoLink(primaryEmail.value, 'Enquiry from Website') : null;

  return (
    <section className="section bg-surface" id="contact" aria-label="Contact us">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Editorial contact column */}
          <MotionWrap className="lg:col-span-5" amount={0.2}>
            <p className="type-eyebrow inline-flex items-center gap-3 text-bronze-700">
              <span className="h-px w-7 bg-bronze-500/70" aria-hidden />
              Contact
            </p>
            <h2 className="type-h2 mt-5 text-ink-950">Start your project with us.</h2>
            <p className="type-lede mt-5 max-w-md">
              Share your requirement and we respond with clarity — drawings, timelines and a
              professional quote.
            </p>

            <ul className="mt-10 border-t border-line">
              {phoneLink && primaryPhone ? (
                <li className="border-b border-line">
                  <a href={phoneLink} className="group flex items-start gap-4 py-5">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center border border-line text-bronze-700 transition-colors duration-300 group-hover:border-bronze-500/60">
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

              {emailLink && primaryEmail ? (
                <li className="border-b border-line">
                  <a href={emailLink} className="group flex items-start gap-4 py-5">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center border border-line text-bronze-700 transition-colors duration-300 group-hover:border-bronze-500/60">
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

              {whatsappLink && primaryWhatsApp ? (
                <li className="border-b border-line">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-4 py-5"
                  >
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center border border-line text-emerald-700 transition-colors duration-300 group-hover:border-emerald-500/50">
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
                  </span>
                </div>
              </li>
            </ul>
          </MotionWrap>

          {/* Enquiry form */}
          <MotionWrap className="lg:col-span-7" delay={0.12} amount={0.2}>
            <div className="border border-line bg-white p-6 shadow-soft sm:p-9 lg:p-10">
              <div className="flex items-start justify-between gap-6 border-b border-line pb-6">
                <div>
                  <p className="type-eyebrow text-bronze-700">Enquiry</p>
                  <h3 className="type-h3 mt-3 text-ink-950">Tell us about your project</h3>
                </div>
                <span className="hidden h-10 w-10 border border-bronze-500/40 sm:block" aria-hidden />
              </div>
              <p className="mt-4 text-[0.8125rem] text-steel-500">
                Fields marked * are required. We reply within one business day.
              </p>
              <div className="mt-8">
                <ContactForm compact />
              </div>
            </div>
          </MotionWrap>
        </div>
      </Container>
    </section>
  );
}
