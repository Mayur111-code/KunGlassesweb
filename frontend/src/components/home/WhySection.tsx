'use client';

import { Medal, ShieldCheck, Sparkles, Wrench } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MotionWrap, StaggerContainer, StaggerItem } from '@/components/MotionWrap';

const items = [
  {
    icon: ShieldCheck,
    title: 'Trusted experience',
    desc: 'Over 15 years as KUN with 25+ years of individual industry experience.',
  },
  {
    icon: Sparkles,
    title: 'Quality materials',
    desc: 'Premium-grade glass, aluminium and hardware for lasting results.',
  },
  {
    icon: Wrench,
    title: 'Custom solutions',
    desc: 'Tailored work for industrial, commercial and individual requirements.',
  },
  {
    icon: Medal,
    title: 'Professional execution',
    desc: 'Expert workmanship from survey and planning to final finish.',
  },
];

export function WhySection() {
  return (
    <section className="section-padding bg-navy-950 text-white" id="why-kun" aria-label="Why choose KUN">
      <Container>
        <MotionWrap className="mb-14">
          <SectionHeading
            dark
            eyebrow="Why choose KUN"
            title="Built on trust, crafted with precision"
            description="Experience, quality materials and reliable service on every project."
          />
        </MotionWrap>

        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <StaggerItem key={item.title}>
              <div className="group h-full rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-brand-orange/30 hover:bg-white/[0.07]">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-brand-orange/15 text-brand-light transition-colors duration-300 group-hover:bg-brand-orange/25">
                  <item.icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="font-display text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-200">{item.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </section>
  );
}
