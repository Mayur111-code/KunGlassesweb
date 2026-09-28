'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils';

interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  children?: ReactNode;
  className?: string;
  imageUrl?: string;
}

export function PageHero({ eyebrow, title, description, children, className, imageUrl }: PageHeroProps) {
  return (
    <section
      className={cn(
        'relative flex min-h-[42vh] items-end overflow-hidden bg-navy-950 sm:min-h-[46vh]',
        className
      )}
    >
      {imageUrl ? (
        <>
          <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" aria-hidden />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/88 to-navy-950/75" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 gradient-navy" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          />
          <div className="pointer-events-none absolute -right-24 top-1/4 h-72 w-72 rounded-full border border-white/10 motion-reduce:hidden" />
          <div className="pointer-events-none absolute right-1/4 top-1/2 h-40 w-px bg-gradient-to-b from-transparent via-brand-orange/40 to-transparent motion-reduce:hidden" />
        </>
      )}

      <Container className="relative z-10 pb-14 pt-28 sm:pb-16 sm:pt-32">
        {eyebrow ? (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 text-sm font-semibold text-brand-light"
          >
            {eyebrow}
          </motion.p>
        ) : null}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-display max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]"
        >
          {title}
        </motion.h1>
        {description ? (
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-5 max-w-2xl text-base leading-relaxed text-navy-100/90 sm:text-lg"
          >
            {description}
          </motion.p>
        ) : null}
        {children ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-8"
          >
            {children}
          </motion.div>
        ) : null}
      </Container>
    </section>
  );
}
