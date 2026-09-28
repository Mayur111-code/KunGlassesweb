'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useSettings } from '@/lib/settings-context';

export function FloatingWhatsApp() {
  const { primaryWhatsApp, whatsappLink, settings } = useSettings();

  if (!settings?.whatsappEnabled || !whatsappLink || !primaryWhatsApp) return null;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-40 group"
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.4, type: 'spring', stiffness: 260, damping: 20 }}
        className="relative"
      >
        <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-30 motion-reduce:hidden" />
        <div className="relative h-14 w-14 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center text-white shadow-xl transition-all duration-200 group-hover:scale-110">
          <MessageCircle className="h-6 w-6" />
        </div>
        <div className="absolute -left-2 -top-2 h-3 w-3 rounded-full bg-red-500 border-2 border-white animate-pulse" />
      </motion.div>
    </a>
  );
}
