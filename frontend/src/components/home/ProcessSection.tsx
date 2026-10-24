'use client';

import { useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MotionWrap } from '@/components/MotionWrap';
import { PROCESS_STEPS } from '@/lib/brand';

export function ProcessSection() {
  const trackRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 80%', 'end 55%'],
  });

  return (
    <section className="section surface-stone relative overflow-hidden" id="process" aria-label="Our process">
      <div className="pointer-events-none absolute inset-0 blueprint opacity-30" aria-hidden />
      <Container className="relative">
        <MotionWrap>
          <SectionHeading
            eyebrow="How we work"
            title="A measured path from first survey to final handover."
            description="Five disciplined stages keep every glass and aluminium project on programme, on budget and precisely fitted."
          />
        </MotionWrap>

        <ol ref={trackRef} className="relative mt-16 grid gap-10 md:grid-cols-5 md:gap-6 md:pt-0">
          {/* Desktop progress line */}
          <div className="pointer-events-none absolute left-0 right-0 top-3.5 hidden h-px bg-line md:block" aria-hidden>
            <motion.div
              style={{ scaleX: scrollYProgress }}
              className="h-full origin-left bg-bronze-500"
            />
          </div>
          {/* Mobile vertical line */}
          <div className="pointer-events-none absolute bottom-4 left-3.5 top-2 w-px bg-line md:hidden" aria-hidden />

          {PROCESS_STEPS.map((step) => (
            <li key={step.step} className="relative pl-12 md:pl-0 md:pt-14">
              <span className="absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-full border border-line bg-surface text-[0.5625rem] font-semibold tracking-[0.06em] text-bronze-700 md:left-0">
                {step.step}
              </span>
              <h3 className="font-display text-lg font-medium tracking-[-0.015em] text-ink-950">
                {step.title}
              </h3>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-steel-500 md:pr-4">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
