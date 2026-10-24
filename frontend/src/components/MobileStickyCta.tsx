'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone } from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { useSettings } from '@/lib/settings-context';
import { buildTelLink } from '@/lib/utils';

export function MobileStickyCta() {
  const pathname = usePathname();
  const { primaryPhone, whatsappLink } = useSettings();

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
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-background/95 backdrop-blur-md safe-area-bottom lg:hidden"
      >
        <div className="flex items-center gap-2 px-4 py-3">
          {phoneLink && (
            <a
              href={phoneLink}
              className="flex flex-1 items-center justify-center gap-2 rounded-xs bg-ink-950 px-4 py-3 text-[0.8125rem] font-medium text-stone-50 transition-colors hover:bg-ink-800"
              aria-label="Call us"
            >
              <Phone className="h-4 w-4" />
              Call Now
            </a>
          )}
          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-xs bg-emerald-600 px-4 py-3 text-[0.8125rem] font-medium text-white transition-colors hover:bg-emerald-700"
              aria-label="Chat with KUN Glass & Aluminium on WhatsApp"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp
            </a>
          )}
          {!phoneLink && !whatsappLink && (
            <Link
              href="/contact"
              className="flex flex-1 items-center justify-center gap-2 rounded-xs bg-bronze-500 px-4 py-3 text-[0.8125rem] font-medium text-ink-950 transition-colors hover:bg-bronze-400"
            >
              Get a Quote
            </Link>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
