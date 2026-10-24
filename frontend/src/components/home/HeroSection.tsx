'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { RevealText } from '@/components/motion/RevealText';

interface HeroSectionProps {
  /** Configured `SiteSettings.heroImages.home` — never a service image. */
  heroImage?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

const SECTORS = ['Residential', 'Commercial', 'Industrial', 'Architectural'];

export function HeroSection({ heroImage }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.55, 0.8]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-ink-950 text-stone-50"
      aria-label="KUN Glass & Aluminium — architectural glass and aluminium"
    >
      {/* Architectural image or designed fallback */}
      {heroImage ? (
        <motion.div
          key={heroImage}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: EASE }}
          className="absolute inset-0"
        >
          <motion.div data-parallax style={{ y: imageY }} className="absolute inset-x-0 -top-[8%] h-[116%]">
            <img
              src={heroImage}
              alt="KUN Glass & Aluminium architectural glazing project"
              className="h-full w-full object-cover"
              fetchPriority="high"
              decoding="async"
            />
          </motion.div>
        </motion.div>
      ) : (
        <>
          <div className="absolute inset-0 hero-architectural" />
          <div className="absolute inset-0 blueprint-dark opacity-70" />
        </>
      )}

      {/* Readability + depth */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/70 to-ink-950/10"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/5 to-ink-950/55" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_78%_18%,rgba(176,141,87,0.14),transparent_55%)]" />

      {/* Fine architectural linework */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute right-[9%] top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent lg:block" />
        <div className="absolute left-[46%] top-[12%] hidden h-32 w-32 border border-white/10 lg:block" />
        <div className="absolute right-[16%] bottom-[24%] hidden h-20 w-20 border border-bronze-500/25 lg:block" />
      </div>

      <Container className="relative z-10 flex min-h-[100svh] flex-col justify-between pb-8 pt-28 sm:pb-10 sm:pt-32 lg:pb-12 lg:pt-36">
        <div className="flex items-center justify-between">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="type-eyebrow inline-flex items-center gap-3 text-bronze-300/90"
          >
            <span className="h-px w-8 bg-bronze-300/60" aria-hidden />
            Architectural Glass &amp; Aluminium Solutions
          </motion.p>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden text-[0.625rem] uppercase tracking-[0.26em] text-white/50 sm:block"
          >
            Nashik · Maharashtra
          </motion.span>
        </div>

        <motion.div style={{ opacity: contentOpacity }} className="mt-16 sm:mt-20 lg:mt-0">
          <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-8">
              <h1 className="type-hero text-stone-50 text-shadow-hero">
                <span className="block">
                  <RevealText text="Modern Spaces." />
                </span>
                <span className="mt-1 block text-stone-50/75 sm:mt-2">
                  <RevealText text="Stronger Tomorrow." offset={2} />
                </span>
              </h1>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.1, delay: 0.65, ease: EASE }}
                className="mt-8 h-px w-full max-w-md origin-left bg-gradient-to-r from-bronze-500/80 via-bronze-500/30 to-transparent"
                aria-hidden
              />

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
                className="mt-7 max-w-xl text-[0.975rem] leading-[1.75] text-stone-200/80 sm:text-[1.0625rem]"
              >
                Precision-crafted glass and aluminium solutions for contemporary residential,
                commercial, and architectural spaces.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
                className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <Button href="/projects" size="lg" variant="primary" className="w-full sm:w-auto">
                  Explore Our Work
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                </Button>
                <Button href="/contact" size="lg" variant="outline-light" className="w-full sm:w-auto">
                  Discuss Your Project
                </Button>
              </motion.div>
            </div>

            {/* Side note — quiet editorial detail on large screens */}
            <motion.aside
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.9, ease: EASE }}
              className="hidden border-l border-white/15 pl-6 lg:col-span-4 lg:block xl:pl-8"
            >
              <p className="type-eyebrow text-white/50">Established</p>
              <p className="mt-3 font-display text-4xl font-medium tracking-[-0.03em] text-stone-50">
                2010
              </p>
              <p className="mt-4 max-w-[19rem] text-sm leading-relaxed text-white/55">
                Over 25 years of combined industry experience in architectural glass, aluminium and
                ACP fabrication.
              </p>
              <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
                {SECTORS.map((sector) => (
                  <span key={sector} className="text-[0.625rem] uppercase tracking-[0.18em] text-white/55">
                    {sector}
                  </span>
                ))}
              </div>
            </motion.aside>
          </div>
        </motion.div>

        {/* Bottom rail */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="mt-14 flex flex-col gap-5 border-t border-white/10 pt-5 sm:mt-16 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="type-eyebrow flex items-center gap-3 text-bronze-200/75">
            <span className="h-1 w-1 rounded-full bg-bronze-400" aria-hidden />
            One Stop Solution For Glass &amp; Aluminium Works
          </p>

          <div className="hidden items-center gap-2 text-[0.625rem] uppercase tracking-[0.24em] text-white/50 sm:flex">
            <span>Scroll</span>
            <motion.span
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden
            >
              <ArrowDown className="h-3.5 w-3.5" />
            </motion.span>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
