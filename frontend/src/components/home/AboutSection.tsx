'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { MotionWrap } from '@/components/MotionWrap';
import { getImageUrl } from '@/lib/utils';
import { useSettings } from '@/lib/settings-context';

const highlights = [
  'Toughened glass interiors and exteriors',
  'ACP cladding and modern facade systems',
  'Industrial-grade precision glass work',
  'Customized solutions for individual requirements',
];

interface AboutSectionProps {
  image?: string;
}

export function AboutSection({ image }: AboutSectionProps) {
  const { settings } = useSettings();
  const imgSrc = image ? getImageUrl(image) : '';

  return (
    <section className="section-padding bg-surface-muted" id="about" aria-label="About KUN Glass and Aluminium">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Image column */}
          <MotionWrap>
            <div className="relative aspect-[4/5] max-h-[560px] overflow-hidden rounded-lg bg-navy-900 sm:aspect-[5/6]">
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt="KUN Glass and Aluminium workshop and installations"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full flex-col justify-end bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 p-8 text-white">
                  <p className="font-display text-5xl font-bold text-brand-orange">15+</p>
                  <p className="mt-1 text-lg font-semibold">Years in business</p>
                  <p className="mt-4 max-w-sm text-sm leading-relaxed text-navy-200">
                    KUN started in 2010 with individual experience of more than 25 years in glass and aluminium.
                  </p>
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
            </div>
          </MotionWrap>

          {/* Content column */}
          <MotionWrap delay={0.12}>
            <p className="text-sm font-semibold text-brand-orange">About KUN Glass &amp; Aluminium</p>
            <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
              One stop solution for glass &amp; aluminium works
            </h2>
            <p className="mt-5 leading-relaxed text-navy-600">
              {settings?.aboutShort ??
                'From our beginnings in wholesale glass trading, we have evolved into a comprehensive provider of glass, aluminium and interior solutions \u2014 serving residential, commercial and industrial clients with precision, quality and care.'}
            </p>
            <ul className="mt-8 space-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-navy-700">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-orange" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/about" className="mt-8 inline-block">
              <Button variant="outline" size="md" className="group">
                Know More About Us
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </MotionWrap>
        </div>
      </Container>
    </section>
  );
}
