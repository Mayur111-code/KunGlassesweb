'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

/**
 * Route-level error boundary.
 *
 * Without this, any unhandled client-side exception renders Next.js's bare
 * "Application error" page in production. This keeps the visitor on a branded
 * page with a way forward, and reports the digest for support/debugging.
 */
export default function GlobalRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log for server-side observability; never render the raw message to users.
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-950 px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-navy-900/60 px-6 py-10 text-center">
        <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-brand-orange" aria-hidden="true" />
        <h1 className="font-display text-xl font-bold text-white">Something went wrong</h1>
        <p className="mt-3 text-sm leading-relaxed text-navy-300">
          An unexpected error occurred while loading this page. Please try again, or get in touch with us
          if the problem continues.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" /> Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            <Home className="h-4 w-4" aria-hidden="true" /> Back to home
          </Link>
        </div>

        {error.digest ? (
          <p className="mt-6 text-[11px] text-navy-400">
            Reference: <span className="font-mono">{error.digest}</span>
          </p>
        ) : null}
      </div>
    </main>
  );
}
