import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'gray' | 'green' | 'amber' | 'red' | 'blue' | 'orange' | 'navy';

const variantClasses: Record<BadgeVariant, string> = {
  gray: 'bg-stone-200 text-steel-500',
  green: 'bg-emerald-100 text-emerald-700',
  amber: 'bg-amber-100 text-amber-700',
  red: 'bg-red-100 text-red-700',
  blue: 'bg-sky-100 text-sky-700',
  orange: 'bg-bronze-500/10 text-bronze-700',
  navy: 'bg-ink-900 text-stone-50',
};

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = 'gray', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-xs px-2.5 py-1 text-[0.6875rem] font-medium tracking-[0.02em]',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}