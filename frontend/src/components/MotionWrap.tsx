'use client';

import { motion, useInView, type Variants } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

const ARCH_EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Upper bound on how long a block may stay hidden waiting for a scroll reveal.
 * Without it a block that never receives an IntersectionObserver callback
 * (printing, throttled observers, some in-app browsers) stays at `opacity: 0`
 * while still occupying layout space, which reads as a blank gap.
 */
const REVEAL_FALLBACK_MS = 1600;

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: ARCH_EASE },
  },
};

interface MotionWrapProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
  amount?: number;
}

export function MotionWrap({
  children,
  className,
  variants = defaultVariants,
  delay = 0,
  amount = 0.15,
}: MotionWrapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount, margin: '0px 0px -8% 0px' });
  const [fallbackVisible, setFallbackVisible] = useState(false);

  useEffect(() => {
    if (isInView) return;
    if (typeof IntersectionObserver === 'undefined') {
      setFallbackVisible(true);
      return;
    }
    const timer = window.setTimeout(() => setFallbackVisible(true), REVEAL_FALLBACK_MS);
    return () => window.clearTimeout(timer);
  }, [isInView]);

  const show = isInView || fallbackVisible;
  const visible = variants.visible as { transition?: Record<string, unknown> } | undefined;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={show ? 'visible' : 'hidden'}
      variants={{
        ...variants,
        visible: {
          ...(variants.visible as Record<string, unknown>),
          transition: { ...visible?.transition, delay },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  className,
  stagger = 0.09,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1, margin: '0px 0px -8% 0px' });
  const [fallbackVisible, setFallbackVisible] = useState(false);

  useEffect(() => {
    if (isInView) return;
    if (typeof IntersectionObserver === 'undefined') {
      setFallbackVisible(true);
      return;
    }
    const timer = window.setTimeout(() => setFallbackVisible(true), REVEAL_FALLBACK_MS);
    return () => window.clearTimeout(timer);
  }, [isInView]);

  const show = isInView || fallbackVisible;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={show ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: 0.05 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 22 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.65, ease: ARCH_EASE },
        },
      }}
      className={cn('h-full', className)}
    >
      {children}
    </motion.div>
  );
}
