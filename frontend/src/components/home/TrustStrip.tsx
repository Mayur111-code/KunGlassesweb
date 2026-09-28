'use client';

import { Calendar, Award, Building2, Users } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { MotionWrap } from '@/components/MotionWrap';

interface TrustStripProps {
  projectCount: number;
  clientCount: number;
}

export function TrustStrip({ projectCount, clientCount }: TrustStripProps) {
  const items = [
    { icon: Calendar, label: 'Trusted since', value: '2010' },
    { icon: Award, label: 'Industry experience', value: '25+' },
    { icon: Building2, label: 'Years in business', value: '15+' },
    ...(projectCount > 0
      ? [{ icon: Building2 as typeof Building2, label: 'Projects delivered', value: null as string | null, numeric: projectCount }]
      : clientCount > 0
        ? [{ icon: Users as typeof Users, label: 'Trusted clients', value: null as string | null, numeric: clientCount }]
        : [{ icon: Users as typeof Users, label: 'Serving', value: 'Nashik & MH' as string | null, numeric: undefined as number | undefined }]),
  ];

  return (
    <section className="relative z-20 border-b border-navy-100/80 bg-white py-10 sm:py-12" aria-label="Company credentials">
      <Container>
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
          {items.map((item, i) => (
            <MotionWrap key={item.label} delay={i * 0.06}>
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-navy-50 text-brand-orange">
                  <item.icon className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-navy-950 sm:text-3xl">
                    {'numeric' in item && item.numeric != null ? (
                      <AnimatedCounter value={item.numeric} />
                    ) : (
                      item.value
                    )}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-navy-500 sm:text-sm">{item.label}</p>
                </div>
              </div>
            </MotionWrap>
          ))}
        </div>
      </Container>
    </section>
  );
}
