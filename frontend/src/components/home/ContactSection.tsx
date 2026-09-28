'use client';

import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MotionWrap } from '@/components/MotionWrap';
import { ContactForm } from '@/components/ContactForm';
import { useSettings } from '@/lib/settings-context';
import {
  KUN_COMPANY_ADDRESS,
  buildMailtoLink,
  buildTelLink,
} from '@/lib/utils';

export function ContactSection() {
  const { settings, primaryPhone, primaryEmail, primaryWhatsApp, whatsappLink } = useSettings();
  const addressLines = (settings?.address ?? KUN_COMPANY_ADDRESS).split('\n').filter(Boolean);
  const phoneLink = primaryPhone ? buildTelLink(primaryPhone.value) : null;
  const emailLink = primaryEmail ? buildMailtoLink(primaryEmail.value, 'Enquiry from Website') : null;

  return (
    <section className="section-padding" id="contact" aria-label="Contact us">
      <Container>
        <MotionWrap className="mb-14">
          <SectionHeading
            align="left"
            eyebrow="Contact"
            title="Start your project with us"
            description="Share your requirement and we respond with clarity, timelines and a professional quote."
          />
        </MotionWrap>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Contact info */}
          <MotionWrap>
            <div className="space-y-6">
              <div className="rounded-lg border border-navy-100/80 bg-white p-6 shadow-sm">
                <h3 className="font-display text-lg font-bold text-navy-950">Contact information</h3>
                <ul className="mt-6 space-y-5">
                  {phoneLink && primaryPhone ? (
                    <li>
                      <a href={phoneLink} className="group flex gap-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-navy-50 text-brand-orange transition-colors group-hover:bg-brand-orange/10">
                          <Phone className="h-4 w-4" />
                        </span>
                        <span>
                          <span className="block text-xs font-medium text-navy-400">Phone</span>
                          <span className="text-sm font-semibold text-navy-900 group-hover:text-brand-orange transition-colors">
                            {primaryPhone.value}
                          </span>
                        </span>
                      </a>
                    </li>
                  ) : null}
                  {emailLink && primaryEmail ? (
                    <li>
                      <a href={emailLink} className="group flex gap-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-navy-50 text-brand-orange transition-colors group-hover:bg-brand-orange/10">
                          <Mail className="h-4 w-4" />
                        </span>
                        <span>
                          <span className="block text-xs font-medium text-navy-400">Email</span>
                          <span className="text-sm font-semibold text-navy-900 group-hover:text-brand-orange transition-colors">
                            {primaryEmail.value}
                          </span>
                        </span>
                      </a>
                    </li>
                  ) : null}
                  {whatsappLink && primaryWhatsApp ? (
                    <li>
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex gap-4"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100">
                          <MessageCircle className="h-4 w-4" />
                        </span>
                        <span>
                          <span className="block text-xs font-medium text-navy-400">WhatsApp</span>
                          <span className="text-sm font-semibold text-navy-900 group-hover:text-emerald-600 transition-colors">
                            {primaryWhatsApp.value}
                          </span>
                        </span>
                      </a>
                    </li>
                  ) : null}
                  <li className="flex gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-navy-50 text-brand-orange">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-xs font-medium text-navy-400">Address</span>
                      <span className="text-sm leading-relaxed text-navy-700">
                        {addressLines.map((line, i) => (
                          <span key={i} className="block">
                            {line}
                          </span>
                        ))}
                      </span>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </MotionWrap>

          {/* Contact form */}
          <MotionWrap delay={0.1}>
            <div className="rounded-lg border border-navy-100/80 bg-white p-6 shadow-sm sm:p-8">
              <h3 className="font-display text-lg font-bold text-navy-950">Request a quote</h3>
              <p className="mt-2 text-sm text-navy-500">All fields marked * are required.</p>
              <div className="mt-6">
                <ContactForm compact />
              </div>
            </div>
          </MotionWrap>
        </div>
      </Container>
    </section>
  );
}
