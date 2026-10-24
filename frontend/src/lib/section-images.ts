import { getImageUrl } from '@/lib/utils';
import type { SiteSettings } from '@/types';

/**
 * IMAGE OWNERSHIP RULES — read before changing anything here.
 *
 * ImageKit stores a flat list of media assets, so *nothing* in the media
 * library itself records which entity an upload belongs to. Ownership is
 * expressed only by which document stores the URL:
 *
 *   SiteSettings.heroImages.*  → page/section imagery (home, about, …)
 *   Service.featuredImage      → that one service (card + detail page)
 *   Service.gallery            → that one service's gallery
 *   Project.images             → that one project (cover + gallery)
 *   Client.logo                → that one client's logo
 *   SiteSettings.logo/ogImage  → brand-level imagery
 *
 * A section must therefore never derive its image from a service, project or
 * client record. Doing exactly that — picking the first service with a
 * featured image and passing it to the About section — is what caused a
 * service upload to appear as the homepage About image.
 */

export type SectionImageKey = 'home' | 'about' | 'services' | 'projects' | 'clients' | 'contact';

/**
 * Resolves a page/section image strictly from the configured site settings.
 * Returns `undefined` when the owner has not configured one, so callers can
 * render an intentional empty state instead of borrowing another entity's
 * asset.
 */
export function getSectionImage(
  settings: SiteSettings | null | undefined,
  key: SectionImageKey
): string | undefined {
  const url = getImageUrl(settings?.heroImages?.[key]);
  return url || undefined;
}

/** Resolves a service's own featured image. Never used for section imagery. */
export function getServiceImage(service: { featuredImage?: unknown } | null | undefined): string | undefined {
  const url = getImageUrl(service?.featuredImage as Parameters<typeof getImageUrl>[0]);
  return url || undefined;
}

/** Resolves a project's own cover image (first image in the project record). */
export function getProjectCover(project: { images?: unknown[] } | null | undefined): string | undefined {
  const first = project?.images?.[0] as Parameters<typeof getImageUrl>[0];
  const url = getImageUrl(first);
  return url || undefined;
}

/** Resolves a client's own logo. */
export function getClientLogo(client: { logo?: unknown } | null | undefined): string | undefined {
  const url = getImageUrl(client?.logo as Parameters<typeof getImageUrl>[0]);
  return url || undefined;
}
