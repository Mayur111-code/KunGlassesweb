import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'gray' | 'green' | 'amber' | 'red' | 'blue' | 'orange' | 'navy';

const variantClasses: Record<BadgeVariant, string> = {
  gray: 'bg-navy-100 text-navy-700',
  green: 'bg-emerald-100 text-emerald-700',
  amber: 'bg-amber-100 text-amber-700',
  red: 'bg-red-100 text-red-700',
  blue: 'bg-sky-100 text-sky-700',
  orange: 'bg-brand-orange/10 text-brand-orange',
  navy: 'bg-navy-900 text-white',
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
        'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}