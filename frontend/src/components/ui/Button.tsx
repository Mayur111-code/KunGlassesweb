import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'ink' | 'navy' | 'outline' | 'outline-light' | 'ghost' | 'white';
type Size = 'sm' | 'md' | 'lg' | 'icon';

const variantClasses: Record<Variant, string> = {
  /* Bronze with charcoal type passes WCAG AA (≈6:1) and reads as a material,
     not a generic SaaS CTA. */
  primary:
    'bg-bronze-500 text-ink-950 shadow-[0_14px_34px_-18px_rgba(176,141,87,0.9)] hover:bg-bronze-400 hover:shadow-[0_18px_40px_-16px_rgba(176,141,87,0.85)]',
  ink: 'bg-ink-900 text-stone-50 hover:bg-ink-800',
  /* Legacy alias used by the admin CMS. */
  navy: 'bg-ink-900 text-stone-50 hover:bg-ink-800',
  outline:
    'border border-ink-900/25 text-ink-900 hover:border-ink-900 hover:bg-ink-900 hover:text-stone-50',
  'outline-light':
    'border border-white/30 text-stone-50 hover:border-white hover:bg-white hover:text-ink-950',
  ghost: 'text-ink-900 hover:bg-ink-900/[0.06]',
  white: 'bg-white text-ink-950 shadow-sm hover:bg-stone-200',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-4 text-[0.8125rem]',
  md: 'h-11 px-5 text-sm',
  lg: 'h-[3.25rem] px-7 text-[0.9375rem]',
  icon: 'h-10 w-10',
};

const baseClasses =
  'group/btn inline-flex select-none items-center justify-center gap-2.5 rounded-xs font-medium tracking-[0.01em] transition-[background-color,border-color,color,box-shadow,transform] duration-300 ease-arch focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px disabled:pointer-events-none disabled:opacity-60';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  /** Render as a link instead of a nested <button> inside an <a>. */
  href?: string;
  external?: boolean;
  children?: ReactNode;
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  type = 'button',
  href,
  external,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className);

  if (href) {
    const isExternal = external ?? /^(https?:|mailto:|tel:)/.test(href);
    if (isExternal) {
      return (
        <a href={href} className={classes} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
