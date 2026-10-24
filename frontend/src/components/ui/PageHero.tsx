'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import { ParallaxImage } from '@/components/motion/ParallaxImage';
import { cn } from '@/lib/utils';

interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  children?: ReactNode;
  className?: string;
  imageUrl?: string;
  /** Right-hand meta rail, e.g. an index or location. */
  meta?: ReactNode;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Shared editorial hero for inner pages. The page image comes from
 * `SiteSettings.heroImages` via the caller — never from a service or project.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  children,
  className,
  imageUrl,
  meta,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        'relative flex min-h-[54svh] items-end overflow-hidden bg-ink-950 text-stone-50 sm:min-h-[58svh]',
        className
      )}
    >
      {imageUrl ? (
        <>
          <ParallaxImage
            src={imageUrl}
            alt=""
            priority
            strength={30}
            className="absolute inset-0 h-full w-full"
            imgClassName="opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-ink-950/60" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 hero-architectural" />
          <div className="absolute inset-0 blueprint-dark opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/30" />
        </>
      )}

      {/* Architectural line motif */}
      <div className="pointer-events-none absolute inset-y-0 right-[8%] hidden w-px bg-gradient-to-b from-transparent via-bronze-500/30 to-transparent lg:block" aria-hidden />
      <div className="pointer-events-none absolute right-[8%] top-[22%] hidden h-40 w-40 border border-white/10 lg:block" aria-hidden />

      <Container className="relative z-10 pb-14 pt-32 sm:pb-16 sm:pt-36 lg:pb-20 lg:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {eyebrow ? (
            <p className="type-eyebrow inline-flex items-center gap-3 text-bronze-300">
              <span className="h-px w-7 bg-bronze-300/70" aria-hidden />
              {eyebrow}
            </p>
          ) : null}

          <h1 className="type-h1 mt-6 max-w-4xl text-stone-50">{title}</h1>

          {description ? (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-stone-300/85 sm:text-[1.0625rem]">
              {description}
            </p>
          ) : null}

          {children ? <div className="mt-9">{children}</div> : null}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5"
        >
          <p className="type-eyebrow text-white/55">KUN Glass &amp; Aluminium — Nashik, Maharashtra</p>
          {meta ? <div className="text-[0.6875rem] uppercase tracking-[0.24em] text-white/55">{meta}</div> : null}
        </motion.div>
      </Container>
    </section>
  );
}
