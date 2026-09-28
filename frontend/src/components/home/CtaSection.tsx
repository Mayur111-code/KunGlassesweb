'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { MotionWrap } from '@/components/MotionWrap';

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-navy-950 py-20 sm:py-28" aria-label="Start your project">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(240,120,24,0.15),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(69,105,172,0.1),transparent_55%)]" />
      <Container className="relative z-10">
        <MotionWrap className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Let&apos;s build something exceptional
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-navy-100/90">
            Have a glass or aluminium requirement? Let&apos;s discuss your project with our team in Nashik.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            <Link href="/contact" className="w-full sm:w-auto">
              <Button size="lg" variant="primary" className="group w-full sm:w-auto">
                Get a Quote
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <Button size="lg" variant="outline-light" className="w-full sm:w-auto">
                Contact Us
              </Button>
            </Link>
          </div>
        </MotionWrap>
      </Container>
    </section>
  );
}
