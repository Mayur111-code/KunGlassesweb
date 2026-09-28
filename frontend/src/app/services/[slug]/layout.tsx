import type { Metadata } from 'next';
import { buildPageMetadata, humanizeSlug } from '@/lib/seo';

interface ServiceLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ServiceLayoutProps): Promise<Metadata> {
  const { slug } = await params;
  const name = humanizeSlug(slug);

  return buildPageMetadata({
    title: `${name} in Nashik`,
    description: `KUN Glass & Aluminium provides professional ${name.toLowerCase()} services in Nashik, Maharashtra. Custom fabrication, quality materials and on-time installation.`,
    path: `/services/${slug}`,
  });
}

export default async function ServiceDetailLayout({ children, params }: ServiceLayoutProps) {
  await params;
  return <>{children}</>;
}
