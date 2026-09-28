import type { Metadata } from 'next';

const SITE_NAME = 'KUN Glass & Aluminium';

/**
 * Builds page metadata with an absolute canonical URL.
 *
 * `metadataBase` is set once in the root layout, so relative canonical paths
 * are resolved against the configured site URL. Declaring the canonical on a
 * per-route basis is important: Next.js inherits metadata from parent layouts,
 * so a single root-level canonical would mark every page as the homepage.
 */
export const buildPageMetadata = ({
  title,
  description,
  path,
  image,
  type = 'website',
}: {
  title: string;
  description: string;
  /** Route path beginning with a slash, e.g. `/services`. */
  path: string;
  image?: string;
  type?: 'website' | 'article';
}): Metadata => ({
  title,
  description,
  alternates: {
    canonical: path,
  },
  openGraph: {
    type,
    siteName: SITE_NAME,
    title,
    description,
    ...(image ? { images: [image] } : {}),
  },
  twitter: {
    card: image ? 'summary_large_image' : 'summary',
    title,
    description,
    ...(image ? { images: [image] } : {}),
  },
});

/** Turns `glass-partition` into `Glass Partition` for use in titles. */
export const humanizeSlug = (slug: string): string =>
  slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
