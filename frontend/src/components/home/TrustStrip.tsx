'use client';

import { Container } from '@/components/ui/Container';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { MotionWrap } from '@/components/MotionWrap';

interface TrustStripProps {
  projectCount: number;
  clientCount: number;
}

export function TrustStrip({ projectCount, clientCount }: TrustStripProps) {
  const items: { label: string; value?: string; numeric?: number }[] = [
    { label: 'Trusted since', value: '2010' },
    { label: 'Industry experience', value: '25+ yrs' },
    { label: 'Years in business', value: '15+' },
    projectCount > 0
      ? { label: 'Projects delivered', numeric: projectCount }
      : clientCount > 0
        ? { label: 'Trusted clients', numeric: clientCount }
        : { label: 'Serving', value: 'Nashik & MH' },
  ];

  return (
    <section className="relative border-b border-line bg-surface" aria-label="Company credentials">
      <Container>
        <div className="grid grid-cols-2 gap-y-8 lg:grid-cols-4">
          {items.map((item, index) => (
            <MotionWrap key={item.label} delay={index * 0.07} amount={0.2}>
              <div className="relative px-0 py-8 sm:px-6 lg:py-10 lg:pl-8">
                <div className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-bronze-500" aria-hidden />
                  <p className="type-eyebrow text-steel-500">{item.label}</p>
                </div>
                <p className="mt-4 font-display text-3xl font-medium tracking-[-0.03em] text-ink-950 sm:text-[2.35rem]">
                  {typeof item.numeric === 'number' ? (
                    <AnimatedCounter value={item.numeric} />
                  ) : (
                    item.value
                  )}
                </p>
              </div>
            </MotionWrap>
          ))}
        </div>
      </Container>
    </section>
  );
}
