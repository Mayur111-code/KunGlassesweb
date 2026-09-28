import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export function LoadError({ message = 'We could not load this content.', onRetry }: { message?: string; onRetry: () => void }) {
  return (
    <div className="mx-auto flex min-h-[22rem] max-w-md flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50/50 px-6 text-center">
      <AlertCircle className="mb-4 h-10 w-10 text-red-600" aria-hidden="true" />
      <h2 className="text-lg font-bold text-navy-950">Something went wrong</h2>
      <p className="mt-2 text-sm leading-relaxed text-navy-600">{message}</p>
      <Button className="mt-5" variant="outline" onClick={onRetry}>
        <RefreshCw className="h-4 w-4" /> Try again
      </Button>
    </div>
  );
}
