'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TableProps {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className }: TableProps) {
  return (
    <div className={cn('max-w-full overflow-x-auto overscroll-contain rounded-lg border border-neutral-200 bg-white', className)} tabIndex={0} role="region" aria-label="Data table">
      <table className="min-w-[640px] w-full text-left text-sm">{children}</table>
    </div>
  );
}

export function TableHead({ children, className }: TableProps) {
  return (
    <thead className={cn('border-b border-neutral-200 bg-neutral-50 text-xs font-semibold uppercase tracking-wider text-neutral-500', className)}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className }: TableProps) {
  return <tbody className={cn('divide-y divide-neutral-100', className)}>{children}</tbody>;
}

export function TableRow({ children, className, onClick }: TableProps & { onClick?: () => void }) {
  return (
    <tr
      className={cn('transition-colors hover:bg-neutral-50', onClick && 'cursor-pointer', className)}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

export function TableCell({ children, className }: TableProps) {
  return <td className={cn('px-4 py-3 text-neutral-700', className)}>{children}</td>;
}
