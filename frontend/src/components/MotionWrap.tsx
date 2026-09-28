'use client';

import { motion, useInView, useReducedMotion, type Variants } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * Upper bound on how long a block may stay hidden waiting for a scroll reveal.
 * Without it a block that never receives an IntersectionObserver callback (full
 * page capture, printing, print stylesheets, or a blocked/throttled observer)
 * stays at `opacity: 0` while still occupying layout space, which reads as a
 * large blank gap in the page.
 */
const REVEAL_FALLBACK_MS = 1500;

interface MotionWrapProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
}

export function MotionWrap({ children, className, variants = defaultVariants, delay = 0 }: MotionWrapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [fallbackVisible, setFallbackVisible] = useState(false);

  useEffect(() => {
    if (isInView || reduceMotion) {
      setFallbackVisible(true);
      return;
    }
    if (typeof IntersectionObserver === 'undefined') {
      setFallbackVisible(true);
      return;
    }
    const timer = window.setTimeout(() => setFallbackVisible(true), REVEAL_FALLBACK_MS);
    return () => window.clearTimeout(timer);
  }, [isInView, reduceMotion]);

  const show = isInView || fallbackVisible;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={show ? 'visible' : 'hidden'}
      variants={{ ...variants, visible: { ...(variants.visible as Record<string, unknown>), transition: { ...(variants.visible as { transition?: Record<string, unknown> })?.transition, delay } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [fallbackVisible, setFallbackVisible] = useState(false);

  useEffect(() => {
    if (isInView || reduceMotion) {
      setFallbackVisible(true);
      return;
    }
    if (typeof IntersectionObserver === 'undefined') {
      setFallbackVisible(true);
      return;
    }
    const timer = window.setTimeout(() => setFallbackVisible(true), REVEAL_FALLBACK_MS);
    return () => window.clearTimeout(timer);
  }, [isInView, reduceMotion]);

  const show = isInView || fallbackVisible;

  return (
    <motion.div
      ref={ref}
      initial={reduceMotion ? false : 'hidden'}
      animate={show ? 'visible' : 'hidden'}
      transition={{ staggerChildren: 0.1 }}
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
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}