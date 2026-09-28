import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'navy' | 'outline' | 'outline-light' | 'ghost' | 'white';
type Size = 'sm' | 'md' | 'lg' | 'icon';

const variantClasses: Record<Variant, string> = {
  primary: 'bg-brand-orange text-white hover:bg-brand-dark shadow-sm hover:shadow-glow',
  navy: 'bg-navy-900 text-white hover:bg-navy-800',
  outline: 'border border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white',
  'outline-light': 'border border-white/60 text-white hover:bg-white hover:text-navy-900',
  ghost: 'text-navy-900 hover:bg-navy-50',
  white: 'bg-white text-navy-900 shadow-sm hover:bg-navy-50',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-12 px-8 text-base',
  icon: 'h-10 w-10',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({ className, variant = 'primary', size = 'md', type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}