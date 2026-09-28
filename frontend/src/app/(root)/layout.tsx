import type { Metadata } from 'next';

/**
 * Route group for the homepage only.
 *
 * The root layout cannot declare `alternates.canonical` because Next.js inherits
 * metadata down to every child route, which would mark all pages as the
 * homepage. A dedicated layout lets the homepage self-canonicalize while every
 * other page keeps its own canonical from `buildPageMetadata`.
 */
export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
