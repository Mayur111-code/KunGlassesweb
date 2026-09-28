'use client';

import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MotionWrap, StaggerContainer, StaggerItem } from '@/components/MotionWrap';
import { PROCESS_STEPS } from '@/lib/brand';

export function ProcessSection() {
  return (
    <section className="section-padding bg-surface-muted" id="process" aria-label="Our process">
      <Container>
        <MotionWrap className="mb-14">
          <SectionHeading
            eyebrow="How we work"
            title="A clear path from idea to completion"
            description="Structured steps so your glass and aluminium project stays on track."
          />
        </MotionWrap>

        <StaggerContainer className="grid gap-8 md:grid-cols-5">
          {PROCESS_STEPS.map((step, index) => (
            <StaggerItem key={step.step}>
              <div className="relative h-full">
                {index < PROCESS_STEPS.length - 1 ? (
                  <div
                    className="absolute left-8 top-12 hidden h-px w-[calc(100%-2rem)] bg-gradient-to-r from-navy-200 to-navy-100 md:block"
                    aria-hidden
                  />
                ) : null}
                <p className="font-display text-3xl font-bold text-brand-orange">{step.step}</p>
                <h3 className="mt-3 font-display text-lg font-semibold text-navy-950">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-600">{step.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </section>
  );
}
