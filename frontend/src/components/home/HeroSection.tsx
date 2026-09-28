'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { useSettings } from '@/lib/settings-context';
import { getImageUrl } from '@/lib/utils';

interface HeroSectionProps {
  heroImage?: string;
}

export function HeroSection({ heroImage }: HeroSectionProps) {
  const { settings } = useSettings();
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], [0, 80]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const imageSrc = heroImage ? getImageUrl(heroImage) : '';

  return (
    <section className="relative min-h-[min(900px,100vh)] overflow-hidden bg-navy-950" aria-label="Hero">
      {/* Background image with reveal */}
      {imageSrc ? (
        <motion.div
          style={{ y: bgY }}
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 motion-reduce:transform-none"
        >
          <img
            src={imageSrc}
            alt=""
            className="h-[120%] w-full object-cover"
            aria-hidden
          />
        </motion.div>
      ) : (
        <div className="absolute inset-0 hero-architectural" />
      )}

      {/* Gradient overlays for readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-950/90 via-navy-950/70 to-navy-900/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-navy-950/30" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(240,120,24,0.10),transparent_50%)]" />

      {/* Quiet architectural linework keeps the hero dimensional without competing with the message. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <motion.div
          initial={{ opacity: 0, x: 40, y: -20 }}
          animate={{ opacity: 0.06, x: 0, y: 0 }}
          transition={{ duration: 2, delay: 0.8, ease: 'easeOut' }}
          className="absolute right-[8%] top-[15%] h-40 w-40 border border-white/20 sm:h-64 sm:w-64 lg:h-80 lg:w-80"
        />
        <motion.div
          initial={{ opacity: 0, x: -30, y: 30 }}
          animate={{ opacity: 0.04, x: 0, y: 0 }}
          transition={{ duration: 2.2, delay: 1, ease: 'easeOut' }}
          className="absolute left-[5%] bottom-[20%] h-32 w-32 border border-brand-orange/20 sm:h-48 sm:w-48"
        />
        <motion.div
          initial={{ opacity: 0, rotate: -45 }}
          animate={{ opacity: 0.03, rotate: 0 }}
          transition={{ duration: 2.4, delay: 1.2, ease: 'easeOut' }}
          className="absolute right-[15%] bottom-[25%] h-24 w-24 border border-white/15 sm:h-36 sm:w-36"
          style={{ transform: 'rotate(45deg)' }}
        />
      </div>

      {/* Content */}
      <Container className="relative z-10 flex min-h-[min(900px,100vh)] flex-col justify-center pb-20 pt-28 sm:pt-32 lg:pb-28">
        <motion.div style={{ opacity }}>
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-brand-light"
          >
            <span className="h-px w-8 bg-brand-orange" aria-hidden />
            KUN Glass &amp; Aluminium
          </motion.p>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="font-display max-w-4xl text-4xl font-bold leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-[3.75rem] lg:leading-[1.1]"
          >
            One Stop Solution For
            <span className="mt-2 block text-navy-100">Glass &amp; Aluminium Works</span>
          </motion.h1>

          {/* Animated decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 h-px max-w-xs origin-left bg-gradient-to-r from-brand-orange to-transparent"
            aria-hidden
          />

          {/* Supporting text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-8 max-w-2xl text-base leading-relaxed text-navy-100/95 sm:text-lg"
          >
            {settings?.aboutShort ??
              `${settings?.companyName ?? 'KUN Glass & Aluminium'} delivers complete glass, aluminium, interior and exterior solutions for residential, commercial and industrial projects across Nashik, Maharashtra.`}
          </motion.p>

          {/* CTA pair */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Link href="/contact" className="w-full sm:w-auto">
              <Button size="lg" variant="primary" className="group w-full sm:w-auto">
                Get a Quote
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/projects" className="w-full sm:w-auto">
              <Button size="lg" variant="outline-light" className="group w-full sm:w-auto">
                Explore Projects
                <ArrowRight className="h-4 w-4 opacity-70 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>

          {/* Trust line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-10 text-sm text-navy-200/80"
          >
            Residential &middot; Commercial &middot; Industrial
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.7, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 sm:bottom-12"
          aria-hidden
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="h-5 w-5 text-white/40" />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
