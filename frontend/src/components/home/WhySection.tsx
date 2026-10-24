'use client';

import { ArrowUpRight, Medal, ShieldCheck, Sparkles, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { MotionWrap, StaggerContainer, StaggerItem } from '@/components/MotionWrap';

const ITEMS = [
  {
    icon: ShieldCheck,
    title: 'Trusted experience',
    desc: 'Over 15 years as KUN, backed by 25+ years of individual industry experience.',
  },
  {
    icon: Sparkles,
    title: 'Quality materials',
    desc: 'Premium-grade glass, aluminium and hardware selected for lasting performance.',
  },
  {
    icon: Wrench,
    title: 'Custom solutions',
    desc: 'Tailored engineering for industrial, commercial and individual requirements.',
  },
  {
    icon: Medal,
    title: 'Professional execution',
    desc: 'Expert workmanship from site survey and planning to the final finish.',
  },
];

export function WhySection() {
  return (
    <section className="section bg-surface" id="why-kun" aria-label="Why choose KUN">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <MotionWrap className="lg:col-span-5" amount={0.2}>
            <div className="lg:sticky lg:top-32">
              <p className="type-eyebrow inline-flex items-center gap-3 text-bronze-700">
                <span className="h-px w-7 bg-bronze-500/70" aria-hidden />
                Why KUN
              </p>
              <h2 className="type-h2 mt-5 max-w-md text-ink-950">
                Built on trust. Crafted with precision.
              </h2>
              <p className="type-lede mt-6 max-w-md">
                Glass and aluminium are unforgiving materials. Every millimetre of fit, finish and
                fixing matters — which is why our process is measured, documented and accountable.
              </p>

              <Button href="/about" variant="ink" size="md" className="mt-9">
                More about us
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
              </Button>

              <p className="mt-10 border-t border-line pt-5 text-[0.625rem] uppercase tracking-[0.24em] text-steel-500">
                Nashik · Maharashtra · Since 2010
              </p>
            </div>
          </MotionWrap>

          <StaggerContainer className="grid gap-x-10 sm:grid-cols-2 lg:col-span-7">
            {ITEMS.map((item, index) => (
              <StaggerItem key={item.title}>
                <div className="group relative h-full border-t border-line py-8">
                  <span
                    className="absolute left-0 top-0 h-px w-0 bg-bronze-500 transition-all duration-500 ease-arch group-hover:w-full"
                    aria-hidden
                  />
                  <div className="flex items-start justify-between gap-4">
                    <span className="type-eyebrow text-steel-500">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <item.icon className="h-5 w-5 text-bronze-700" aria-hidden />
                  </div>
                  <h3 className="mt-8 font-display text-xl font-medium tracking-[-0.02em] text-ink-950">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[0.875rem] leading-relaxed text-steel-500">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}

            <StaggerItem className="sm:col-span-2">
              <div className="flex flex-col justify-between gap-4 border-t border-line py-8 sm:flex-row sm:items-center">
                <p className="max-w-sm font-display text-lg font-medium tracking-[-0.015em] text-ink-900">
                  Every installation delivered with a documented handover.
                </p>
                <Button href="/contact" variant="outline" size="md">
                  Start a conversation
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </Container>
    </section>
  );
}
