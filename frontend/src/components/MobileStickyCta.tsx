'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle } from 'lucide-react';
import { useSettings } from '@/lib/settings-context';
import { buildTelLink } from '@/lib/utils';

export function MobileStickyCta() {
  const pathname = usePathname();
  const { primaryPhone, primaryWhatsApp, whatsappLink } = useSettings();

  const isHome = pathname === '/';
  const isAdmin = pathname.startsWith('/admin');
  const isContact = pathname === '/contact';

  if (isAdmin || isContact) return null;

  const phoneLink = primaryPhone ? buildTelLink(primaryPhone.value) : null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="fixed bottom-0 inset-x-0 z-40 border-t border-navy-100 bg-white/95 backdrop-blur-md safe-area-bottom lg:hidden"
      >
        <div className="flex items-center gap-2 px-4 py-3">
          {phoneLink && (
            <a
              href={phoneLink}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-navy-950 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
              aria-label="Call us"
            >
              <Phone className="h-4 w-4" />
              Call Now
            </a>
          )}
          {whatsappLink && primaryWhatsApp && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          )}
          {!phoneLink && !whatsappLink && (
            <Link
              href="/contact"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand-orange px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Get a Quote
            </Link>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
