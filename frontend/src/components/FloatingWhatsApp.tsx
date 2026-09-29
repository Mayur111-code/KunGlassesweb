'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { useSettings } from '@/lib/settings-context';

export function FloatingWhatsApp() {
  const { whatsappLink } = useSettings();
  const [footerVisible, setFooterVisible] = useState(false);

  // The footer bottom bar already lists a WhatsApp link, so the floating button
  // steps aside while the footer is on screen rather than covering it.
  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { rootMargin: '0px 0px -15% 0px' },
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  // The context always resolves a real business number, so this only bails in
  // the impossible case of no configured number at all. The CTA must never be
  // hidden because a settings request is slow, failed, or in flight.
  if (!whatsappLink) return null;

  return (
    <AnimatePresence>
      {!footerVisible && (
        <motion.a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with KUN Glass & Aluminium on WhatsApp"
          title="Chat with us on WhatsApp"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="group fixed bottom-[calc(env(safe-area-inset-bottom)+6.5rem)] right-[max(0.75rem,env(safe-area-inset-right))] z-50 lg:bottom-[max(1.5rem,env(safe-area-inset-bottom))]"
        >
          <span className="relative flex h-14 w-14 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-emerald-500/30 motion-safe:animate-ping motion-reduce:hidden" />
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl transition-all duration-200 group-hover:scale-110 group-hover:bg-emerald-600 group-focus-visible:ring-2 group-focus-visible:ring-emerald-500 group-focus-visible:ring-offset-2">
              <WhatsAppIcon className="h-7 w-7" />
            </span>
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
