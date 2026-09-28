// 'use client';

// import Link from 'next/link';
// import { useEffect, useState } from 'react';
// import { Container } from '@/components/ui/Container';
// import { useSettings } from '@/lib/settings-context';
// import { SITE_LOGO } from '@/lib/brand';
// import { servicesApi } from '@/services';
// import type { Service } from '@/types';
// import {
//   KUN_COMPANY_ADDRESS,
//   buildMailtoLink,
//   buildTelLink,
//   buildWhatsAppLink,
// } from '@/lib/utils';
// import { Phone, Mail, MapPin, MessageCircle, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';

// export function Footer() {
//   const { settings, primaryPhone, primaryEmail, contactMethods, primaryWhatsApp } = useSettings();
//   const [services, setServices] = useState<Service[]>([]);
//   const year = new Date().getFullYear();

//   useEffect(() => {
//     servicesApi.getAll().then((response) => setServices(response.data.slice(0, 6))).catch(() => setServices([]));
//   }, []);
//   const copyright = settings?.copyrightText || `\u00A9 ${year} KUN Glass & Aluminium. All rights reserved.`;

//   const phoneLink = primaryPhone ? buildTelLink(primaryPhone.value) : null;
//   const emailLink = primaryEmail ? buildMailtoLink(primaryEmail.value) : null;
//   const waLink = primaryWhatsApp
//     ? buildWhatsAppLink(primaryWhatsApp.value, settings?.whatsappDefaultMessage || '')
//     : null;

//   const socials = [
//     { href: settings?.facebookUrl, icon: Facebook, label: 'Facebook' },
//     { href: settings?.instagramUrl, icon: Instagram, label: 'Instagram' },
//     { href: settings?.linkedinUrl, icon: Linkedin, label: 'LinkedIn' },
//     { href: settings?.youtubeUrl, icon: Youtube, label: 'YouTube' },
//   ].filter((s) => !!s.href);

//   return (
//     <footer className="border-t-4 border-brand-orange bg-navy-950 text-white">
//       <Container className="py-16 sm:py-20">
//         <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
//           {/* Column 1 — Brand */}
//           <div className="lg:col-span-4">
//             <div className="mb-5 flex items-center gap-3">
//               <img src={settings?.logo || SITE_LOGO} alt="KUN Glass and Aluminium" className="h-11 w-auto object-contain" />
//             </div>
//             <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-brand-light">Glass &amp; aluminium works</p>
//             <p className="max-w-sm text-sm leading-relaxed text-navy-200">
//               {settings?.footerDescription ??
//                 'Premium glass and aluminium solutions for modern residential, commercial and industrial spaces in Nashik, Maharashtra.'}
//             </p>
//             {socials.length > 0 && (
//               <div className="mt-6 flex gap-2">
//                 {socials.map((s) => (
//                   <a
//                     key={s.label}
//                     href={s.href!}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     aria-label={s.label}
//                     className="flex h-9 w-9 items-center justify-center rounded-md bg-white/10 text-white/75 transition-colors hover:bg-brand-orange hover:text-white"
//                   >
//                     <s.icon className="h-4 w-4" />
//                   </a>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Column 2 — Quick links */}
//           <div className="lg:col-span-2">
//             <h4 className="mb-5 text-sm font-semibold text-white">Quick links</h4>
//             <ul className="space-y-2.5">
//               {[
//                 { href: '/', label: 'Home' },
//                 { href: '/about', label: 'About Us' },
//                 { href: '/services', label: 'Services' },
//                 { href: '/projects', label: 'Projects' },
//                 { href: '/clients', label: 'Our Clients' },
//                 { href: '/contact', label: 'Contact Us' },
//               ].map((link) => (
//                 <li key={link.href}>
//                   <Link href={link.href} className="link-underline text-sm text-navy-200 hover:text-white">
//                     {link.label}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Column 3 — Services */}
//           <div className="lg:col-span-3">
//             <h4 className="mb-5 text-sm font-semibold text-white">Services</h4>
//             <ul className="space-y-2.5">
//               {services.map((service) => (
//                 <li key={service._id}>
//                   <Link href={`/services/${service.slug}`} className="link-underline text-sm text-navy-200 hover:text-white">
//                     {service.title}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Column 4 — Contact */}
//           <div className="lg:col-span-3">
//             <h4 className="mb-5 text-sm font-semibold text-white">Contact</h4>
//             <ul className="space-y-4 text-sm text-navy-200">
//               {phoneLink && (
//                 <li>
//                   <a href={phoneLink} className="flex items-start gap-3 transition-colors hover:text-white">
//                     <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
//                     <span>
//                       {contactMethods
//                         .filter((c) => c.type === 'phone')
//                         .map((c) => c.value)
//                         .join(' \u00B7 ') || primaryPhone?.value}
//                     </span>
//                   </a>
//                 </li>
//               )}
//               {emailLink && (
//                 <li>
//                   <a href={emailLink} className="flex items-start gap-3 transition-colors hover:text-white">
//                     <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
//                     <span>{primaryEmail?.value}</span>
//                   </a>
//                 </li>
//               )}
//               {waLink && (
//                 <li>
//                   <a
//                     href={waLink}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-start gap-3 transition-colors hover:text-emerald-300"
//                   >
//                     <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
//                     <span>WhatsApp</span>
//                   </a>
//                 </li>
//               )}
//               <li>
//                 <div className="flex items-start gap-3">
//                   <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />
//                   <span className="whitespace-pre-line">{settings?.address ?? KUN_COMPANY_ADDRESS}</span>
//                 </div>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </Container>

//       {/* Bottom bar */}
//       <div className="border-t border-white/10 py-6">
//         <Container className="flex flex-col items-center justify-between gap-4 text-xs text-navy-300 sm:flex-row">
//           <p>{copyright}</p>
//           <div className="flex items-center gap-4">
//             <Link href="/privacy" className="link-underline hover:text-white">
//               Privacy Policy
//             </Link>
//             <Link href="/terms" className="link-underline hover:text-white">
//               Terms of Service
//             </Link>
//           </div>
//         </Container>
//       </div>
//     </footer>
//   );
// }



'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Container } from '@/components/ui/Container';
import { useSettings } from '@/lib/settings-context';
import { SITE_LOGO } from '@/lib/brand';
import { servicesApi } from '@/services';
import type { Service } from '@/types';

import {
  KUN_COMPANY_ADDRESS,
  buildMailtoLink,
  buildTelLink,
  buildWhatsAppLink,
} from '@/lib/utils';

import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
} from 'lucide-react';

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from 'react-icons/fa';

export function Footer() {
  const {
    settings,
    primaryPhone,
    primaryEmail,
    contactMethods,
    primaryWhatsApp,
  } = useSettings();

  const [services, setServices] = useState<Service[]>([]);

  const year = new Date().getFullYear();

  useEffect(() => {
    servicesApi
      .getAll()
      .then((response) => {
        setServices(response.data.slice(0, 6));
      })
      .catch(() => {
        setServices([]);
      });
  }, []);

  const copyright =
    settings?.copyrightText ||
    `© ${year} KUN Glass & Aluminium. All rights reserved.`;

  const phoneLink = primaryPhone
    ? buildTelLink(primaryPhone.value)
    : null;

  const emailLink = primaryEmail
    ? buildMailtoLink(primaryEmail.value)
    : null;

  const waLink = primaryWhatsApp
    ? buildWhatsAppLink(
        primaryWhatsApp.value,
        settings?.whatsappDefaultMessage || ''
      )
    : null;

  const socials = [
    {
      href: settings?.facebookUrl,
      icon: FaFacebookF,
      label: 'Facebook',
    },
    {
      href: settings?.instagramUrl,
      icon: FaInstagram,
      label: 'Instagram',
    },
    {
      href: settings?.linkedinUrl,
      icon: FaLinkedinIn,
      label: 'LinkedIn',
    },
    {
      href: settings?.youtubeUrl,
      icon: FaYoutube,
      label: 'YouTube',
    },
  ].filter((social) => !!social.href);

  return (
    <footer className="border-t-4 border-brand-orange bg-navy-950 text-white">
      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">

          {/* Column 1 — Brand */}
          <div className="lg:col-span-4">
            <div className="mb-5 flex items-center gap-3">
              <img
                src={settings?.logo || SITE_LOGO}
                alt="KUN Glass and Aluminium"
                className="h-11 w-auto object-contain"
              />
            </div>

            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-brand-light">
              Glass &amp; aluminium works
            </p>

            <p className="max-w-sm text-sm leading-relaxed text-navy-200">
              {settings?.footerDescription ??
                'Premium glass and aluminium solutions for modern residential, commercial and industrial spaces in Nashik, Maharashtra.'}
            </p>

            {/* Social Media */}
            {socials.length > 0 && (
              <div className="mt-6 flex gap-2">
                {socials.map((social) => {
                  const Icon = social.icon;

                  return (
                    <a
                      key={social.label}
                      href={social.href!}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex h-9 w-9 items-center justify-center rounded-md bg-white/10 text-white/75 transition-colors hover:bg-brand-orange hover:text-white"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Column 2 — Quick links */}
          <div className="lg:col-span-2">
            <h4 className="mb-5 text-sm font-semibold text-white">
              Quick links
            </h4>

            <ul className="space-y-2.5">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About Us' },
                { href: '/services', label: 'Services' },
                { href: '/projects', label: 'Projects' },
                { href: '/clients', label: 'Our Clients' },
                { href: '/contact', label: 'Contact Us' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="link-underline text-sm text-navy-200 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Services */}
          <div className="lg:col-span-3">
            <h4 className="mb-5 text-sm font-semibold text-white">
              Services
            </h4>

            <ul className="space-y-2.5">
              {services.map((service) => (
                <li key={service._id}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="link-underline text-sm text-navy-200 hover:text-white"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div className="lg:col-span-3">
            <h4 className="mb-5 text-sm font-semibold text-white">
              Contact
            </h4>

            <ul className="space-y-4 text-sm text-navy-200">

              {/* Phone */}
              {phoneLink && (
                <li>
                  <a
                    href={phoneLink}
                    className="flex items-start gap-3 transition-colors hover:text-white"
                  >
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />

                    <span>
                      {contactMethods
                        .filter((contact) => contact.type === 'phone')
                        .map((contact) => contact.value)
                        .join(' · ') || primaryPhone?.value}
                    </span>
                  </a>
                </li>
              )}

              {/* Email */}
              {emailLink && (
                <li>
                  <a
                    href={emailLink}
                    className="flex items-start gap-3 transition-colors hover:text-white"
                  >
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />

                    <span>{primaryEmail?.value}</span>
                  </a>
                </li>
              )}

              {/* WhatsApp */}
              {waLink && (
                <li>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 transition-colors hover:text-emerald-300"
                  >
                    <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />

                    <span>WhatsApp</span>
                  </a>
                </li>
              )}

              {/* Address */}
              <li>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" />

                  <span className="whitespace-pre-line">
                    {settings?.address ?? KUN_COMPANY_ADDRESS}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-6">
        <Container className="flex flex-col items-center justify-between gap-4 text-xs text-navy-300 sm:flex-row">

          <p>{copyright}</p>

          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="link-underline hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="link-underline hover:text-white"
            >
              Terms of Service
            </Link>
          </div>

        </Container>
      </div>
    </footer>
  );
}
```
