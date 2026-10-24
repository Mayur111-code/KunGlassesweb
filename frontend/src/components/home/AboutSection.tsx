'use client';

import { ArrowUpRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { MotionWrap } from '@/components/MotionWrap';
import { ParallaxImage } from '@/components/motion/ParallaxImage';
import { useSettings } from '@/lib/settings-context';
import { cn } from '@/lib/utils';

const HIGHLIGHTS = [
  'Toughened glass interiors and exteriors',
  'ACP cladding and modern facade systems',
  'Industrial-grade precision glass work',
  'Customised solutions for every requirement',
];

interface AboutSectionProps {
  /**
   * Configured `SiteSettings.heroImages.about` only.
   *
   * Historically this prop received the first service's featured image, which
   * is what made a service upload appear in the About block. Section imagery is
   * owned exclusively by site settings — see `lib/section-images.ts`.
   */
  image?: string;
}

export function AboutSection({ image }: AboutSectionProps) {
  const { settings } = useSettings();

  return (
    <section
      className="section surface-stone relative overflow-hidden"
      id="about"
      aria-label="About KUN Glass and Aluminium"
    >
      <div className="pointer-events-none absolute inset-0 blueprint opacity-[0.35]" aria-hidden />

      <Container className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Image column — always the configured About image */}
          <MotionWrap className="lg:col-span-6" amount={0.2}>
            <div className="relative mx-auto w-full max-w-[34rem] lg:mx-0">
              <div className="corner-frame relative z-10">
                <div className="media-frame aspect-[4/5] sm:aspect-[5/6]">
                  {image ? (
                    <>
                      <ParallaxImage
                        src={image}
                        alt="KUN Glass and Aluminium — installed architectural glazing and aluminium works"
                        className="absolute inset-0 h-full w-full"
                        imgClassName="opacity-95"
                        strength={22}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/5 to-transparent" />
                    </>
                  ) : (
                    <div className="flex h-full w-full flex-col justify-between bg-ink-950 p-8 text-stone-50 sm:p-10">
                      <div className="flex items-start justify-between">
                        <p className="type-eyebrow text-bronze-300/80">KUN · Est. 2010</p>
                        <span className="h-10 w-10 border border-white/15" aria-hidden />
                      </div>
                      <div>
                        <p className="font-display text-6xl font-medium tracking-[-0.04em] text-bronze-300 sm:text-7xl">
                          15+
                        </p>
                        <p className="mt-3 font-display text-xl font-medium text-stone-50">
                          Years in business
                        </p>
                        <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
                          Founded in 2010 with more than 25 years of combined experience in glass,
                          aluminium and architectural fabrication.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 border-t border-white/15 bg-ink-950/55 px-5 py-4 backdrop-blur-md">
                    <p className="type-eyebrow text-white/70">KUN Glass &amp; Aluminium</p>
                    <p className="text-[0.625rem] uppercase tracking-[0.2em] text-bronze-200/80">
                      Nashik · MH
                    </p>
                  </div>
                </div>
              </div>

              {/* Offset label — architectural framing detail */}
              <div className="mt-5 hidden items-center gap-3 pl-1 lg:absolute lg:-left-6 lg:bottom-24 lg:mt-0 lg:flex lg:flex-col lg:items-start lg:gap-1">
                <span className="text-[0.5625rem] uppercase tracking-[0.26em] text-steel-500 [writing-mode:vertical-rl] lg:rotate-180">
                  Craftsmanship
                </span>
                <span className="hidden h-16 w-px bg-bronze-500/40 lg:block" aria-hidden />
              </div>
            </div>
          </MotionWrap>

          {/* Content column */}
          <MotionWrap className="lg:col-span-6" delay={0.1} amount={0.2}>
            <p className="type-eyebrow text-bronze-700">About KUN Glass &amp; Aluminium</p>
            <h2 className="type-h2 mt-5 max-w-xl text-ink-950">
              One stop solution for glass &amp; aluminium works.
            </h2>
            <p className="type-lede mt-6 max-w-xl">
              {settings?.aboutShort ??
                'From our beginnings in wholesale glass trading, we have evolved into a comprehensive provider of glass, aluminium and interior solutions — serving residential, commercial and industrial clients with precision, quality and care.'}
            </p>

            <ul className="mt-9 grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {HIGHLIGHTS.map((item, index) => (
                <li
                  key={item}
                  className={cn(
                    'flex items-start gap-3 border-t border-line pt-4 text-[0.875rem] leading-snug text-ink-700',
                    index % 2 === 0 ? 'sm:pr-2' : 'sm:pl-2'
                  )}
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-bronze-500/35 text-bronze-700">
                    <Check className="h-3 w-3" aria-hidden />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
              <Button href="/about" variant="ink" size="md">
                Our Story
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
              </Button>
              <Button href="/services" variant="outline" size="md">
                Explore Services
              </Button>
            </div>
          </MotionWrap>
        </div>
      </Container>
    </section>
  );
}
