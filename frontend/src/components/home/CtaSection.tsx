'use client';

import { ArrowUpRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { MotionWrap } from '@/components/MotionWrap';
import { useSettings } from '@/lib/settings-context';
import { buildTelLink } from '@/lib/utils';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';

export function CtaSection() {
  const { primaryPhone, whatsappLink } = useSettings();
  const phoneLink = primaryPhone ? buildTelLink(primaryPhone.value) : null;

  return (
    <section
      className="relative overflow-hidden bg-ink-950 py-20 text-stone-50 sm:py-28"
      aria-label="Start your project"
    >
      <div className="absolute inset-0 blueprint-dark opacity-50" aria-hidden />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(176,141,87,0.16),transparent_55%)]" aria-hidden />
      <div className="pointer-events-none absolute right-[6%] top-1/2 hidden h-64 w-64 -translate-y-1/2 border border-white/10 lg:block" aria-hidden />

      <Container className="relative">
        <div className="grid items-end gap-12 lg:grid-cols-12">
          <MotionWrap className="lg:col-span-7" amount={0.25}>
            <p className="type-eyebrow inline-flex items-center gap-3 text-bronze-300">
              <span className="h-px w-7 bg-bronze-300/70" aria-hidden />
              Start a project
            </p>
            <h2 className="type-h2 mt-5 max-w-2xl text-stone-50">
              Let&apos;s build something exceptional.
            </h2>
            <p className="mt-5 max-w-xl text-[0.975rem] leading-relaxed text-white/55">
              Share your drawings, dimensions or simply an idea. We will advise on materials,
              feasibility and a clear next step.
            </p>
          </MotionWrap>

          <MotionWrap className="lg:col-span-5" delay={0.1} amount={0.25}>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button href="/contact" size="lg" variant="primary" className="justify-between">
                Discuss your project
                <ArrowUpRight className="h-4 w-4" />
              </Button>
              <div className="grid grid-cols-2 gap-3">
                {phoneLink ? (
                  <Button href={phoneLink} size="lg" variant="outline-light" className="justify-center px-4">
                    <Phone className="h-4 w-4" />
                    Call
                  </Button>
                ) : null}
                {whatsappLink ? (
                  <Button href={whatsappLink} size="lg" variant="outline-light" className="justify-center px-4">
                    <WhatsAppIcon className="h-4 w-4" />
                    WhatsApp
                  </Button>
                ) : null}
              </div>
            </div>
          </MotionWrap>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="type-eyebrow text-bronze-200/70">
            One Stop Solution For Glass &amp; Aluminium Works
          </p>
          <p className="text-[0.625rem] uppercase tracking-[0.24em] text-white/55">
            Nashik · Maharashtra · India
          </p>
        </div>
      </Container>
    </section>
  );
}
