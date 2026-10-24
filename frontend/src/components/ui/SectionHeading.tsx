import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  dark?: boolean;
  children?: ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  dark = false,
  children,
}: SectionHeadingProps) {
  return (
    <div className={cn(align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl text-left')}>
      {eyebrow ? (
        <p
          className={cn(
            'type-eyebrow inline-flex items-center gap-3',
            align === 'center' && 'justify-center',
            dark ? 'text-bronze-300' : 'text-bronze-700'
          )}
        >
          <span className={cn('h-px w-7', dark ? 'bg-bronze-300/70' : 'bg-bronze-500/70')} aria-hidden />
          {eyebrow}
        </p>
      ) : null}

      <h2 className={cn('type-h2 mt-5', dark ? 'text-stone-50' : 'text-ink-950')}>{title}</h2>

      {description ? (
        <p
          className={cn(
            'type-lede mt-5',
            align === 'center' && 'mx-auto',
            dark ? 'text-stone-300/80' : 'text-steel-500'
          )}
        >
          {description}
        </p>
      ) : null}

      {children ? <div className="mt-7">{children}</div> : null}
    </div>
  );
}
