import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export function LoadError({ message = 'We could not load this content.', onRetry }: { message?: string; onRetry: () => void }) {
  return (
    <div className="mx-auto flex min-h-[22rem] max-w-md flex-col items-center justify-center border border-line bg-surface px-8 text-center shadow-soft">
      <AlertCircle className="mb-5 h-9 w-9 text-bronze-700" aria-hidden="true" />
      <h2 className="font-display text-2xl font-medium tracking-[-0.02em] text-ink-950">Something went wrong</h2>
      <p className="mt-3 text-sm leading-relaxed text-steel-500">{message}</p>
      <Button className="mt-6" variant="outline" onClick={onRetry}>
        <RefreshCw className="h-4 w-4" /> Try again
      </Button>
    </div>
  );
}
