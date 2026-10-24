'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { useSettings } from '@/lib/settings-context';
import { SITE_LOGO } from '@/lib/brand';
import { servicesApi } from '@/services';
import type { Service } from '@/types';
import { KUN_COMPANY_ADDRESS, buildMailtoLink, buildTelLink, buildWhatsAppLink } from '@/lib/utils';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from '@/components/ui/BrandIcons';

/** Development credit — official SSS Grow Tech website. Do not remove. */
const SSS_GROW_TECH_URL = 'https://www.sssgrowtech.co.in/';

const QUICK_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Projects' },
  { href: '/clients', label: 'Our Clients' },
  { href: '/contact', label: 'Contact Us' },
];

export function Footer() {
  const { settings, primaryPhone, primaryEmail, contactMethods, primaryWhatsApp } = useSettings();
  const [services, setServices] = useState<Service[]>([]);

  const year = new Date().getFullYear();

  useEffect(() => {
    servicesApi
      .getAll()
      .then((response) => setServices(response.data.slice(0, 6)))
      .catch(() => setServices([]));
  }, []);

  const copyright =
    settings?.copyrightText || `© ${year} KUN Glass & Aluminium. All rights reserved.`;

  const phoneLink = primaryPhone ? buildTelLink(primaryPhone.value) : null;
  const emailLink = primaryEmail ? buildMailtoLink(primaryEmail.value) : null;
  const waLink = primaryWhatsApp
    ? buildWhatsAppLink(primaryWhatsApp.value, settings?.whatsappDefaultMessage || '')
    : null;

  const socials = [
    { href: settings?.facebookUrl, icon: FaFacebookF, label: 'Facebook' },
    { href: settings?.instagramUrl, icon: FaInstagram, label: 'Instagram' },
    { href: settings?.linkedinUrl, icon: FaLinkedinIn, label: 'LinkedIn' },
    { href: settings?.youtubeUrl, icon: FaYoutube, label: 'YouTube' },
  ].filter((social) => Boolean(social.href));

  return (
    <footer className="relative overflow-hidden bg-ink-950 text-white/70">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-bronze-500/60 to-transparent" aria-hidden />
      <div className="pointer-events-none absolute inset-0 blueprint-dark opacity-40" aria-hidden />
      <div className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-bronze-500/[0.06] blur-3xl" aria-hidden />

      <Container className="relative py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="inline-flex items-center"
              aria-label="KUN Glass and Aluminium — Home"
            >
              <span className="flex h-14 items-center justify-center overflow-hidden rounded-xs bg-white px-3 ring-1 ring-white/10">
                <img
                  src={settings?.logo || SITE_LOGO}
                  alt="KUN Glass and Aluminium"
                  className="h-10 w-auto object-contain"
                />
              </span>
            </Link>

            <p className="mt-7 type-eyebrow text-bronze-300/80">
              One Stop Solution For Glass &amp; Aluminium Works
            </p>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">
              {settings?.footerDescription ??
                'Premium glass and aluminium solutions for modern residential, commercial and industrial spaces in Nashik, Maharashtra.'}
            </p>

            {socials.length > 0 && (
              <div className="mt-7 flex gap-2">
                {socials.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href!}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex h-9 w-9 items-center justify-center rounded-xs border border-white/10 text-white/55 transition-colors duration-300 hover:border-bronze-500/60 hover:text-bronze-300"
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className="lg:col-span-2">
            <h2 className="type-eyebrow text-white/50">Explore</h2>
            <ul className="mt-6 space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[0.8125rem] text-white/60 transition-colors duration-300 hover:text-bronze-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services from the CMS */}
          <div className="lg:col-span-3">
            <h2 className="type-eyebrow text-white/50">Services</h2>
            <ul className="mt-6 space-y-3">
              {services.length > 0 ? (
                services.map((service) => (
                  <li key={service._id}>
                    <Link
                      href={`/services/${service.slug}`}
                      className="text-[0.8125rem] text-white/60 transition-colors duration-300 hover:text-bronze-300"
                    >
                      {service.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <Link
                    href="/services"
                    className="text-[0.8125rem] text-white/60 transition-colors duration-300 hover:text-bronze-300"
                  >
                    View all services
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h2 className="type-eyebrow text-white/50">Studio</h2>
            <ul className="mt-6 space-y-4 text-[0.8125rem] text-white/60">
              {phoneLink && (
                <li>
                  <a href={phoneLink} className="flex items-start gap-3 transition-colors hover:text-white">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-bronze-400/80" aria-hidden />
                    <span>
                      {contactMethods
                        .filter((contact) => contact.type === 'phone')
                        .map((contact) => contact.value)
                        .join('  ·  ') || primaryPhone?.value}
                    </span>
                  </a>
                </li>
              )}

              {emailLink && (
                <li>
                  <a href={emailLink} className="flex items-start gap-3 transition-colors hover:text-white">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-bronze-400/80" aria-hidden />
                    <span className="break-all">{primaryEmail?.value}</span>
                  </a>
                </li>
              )}

              {waLink && (
                <li>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 transition-colors hover:text-white"
                  >
                    <WhatsAppIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400/90" />
                    <span>WhatsApp us</span>
                  </a>
                </li>
              )}

              <li>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-bronze-400/80" aria-hidden />
                  <address className="whitespace-pre-line not-italic leading-relaxed">
                    {settings?.address ?? KUN_COMPANY_ADDRESS}
                  </address>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10">
        <Container className="flex flex-col items-center gap-4 py-6 text-center text-[0.6875rem] tracking-[0.04em] text-white/55 sm:flex-row sm:justify-between sm:text-left">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-5">
            <p>{copyright}</p>
            <div className="flex items-center gap-4">
              <Link href="/privacy-policy" className="transition-colors hover:text-white">
                Privacy Policy
              </Link>
              <span className="h-3 w-px bg-white/15" aria-hidden />
              <Link href="/terms-of-service" className="transition-colors hover:text-white">
                Terms of Service
              </Link>
            </div>
          </div>

          <p className="flex flex-col items-center gap-x-1.5 sm:flex-row sm:flex-wrap">
            <span>Designed &amp; Developed by</span>{' '}
            <a
              href={SSS_GROW_TECH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-bronze-300 underline decoration-bronze-500/30 underline-offset-4 transition-colors duration-200 hover:text-bronze-200 hover:decoration-bronze-300"
            >
              SSS Grow Tech
            </a>
          </p>
        </Container>
      </div>
    </footer>
  );
}
