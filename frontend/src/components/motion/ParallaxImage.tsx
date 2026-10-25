'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  position?: 'relative' | 'absolute';
  /** Vertical travel in px across the viewport pass. Keep it subtle. */
  strength?: number;
}

/**
 * A single architectural image with a gentle scroll-linked parallax.
 *
 * The image is oversized inside an overflow-hidden frame so the translate never
 * exposes an edge. The transform is neutralised by the global
 * `prefers-reduced-motion` rule, keeping the markup SSR-safe (no hook branch in
 * the initial render).
 */
export function ParallaxImage({
  src,
  alt,
  className,
  imgClassName,
  priority = false,
  position = 'relative',
  strength = 24,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-strength, strength]);

  return (
    <div ref={ref} className={cn('overflow-hidden', className)} style={{ position }}>
      <motion.img
        data-parallax
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        draggable={false}
        style={{ y }}
        className={cn(
          'absolute -top-[8%] left-0 h-[116%] w-full object-cover',
          imgClassName
        )}
      />
    </div>
  );
}
