import type { Metadata } from 'next';
import { buildPageMetadata, humanizeSlug } from '@/lib/seo';

interface ProjectLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectLayoutProps): Promise<Metadata> {
  const { slug } = await params;
  const name = humanizeSlug(slug);

  return buildPageMetadata({
    title: `${name}`,
    description: `Project details for ${name} — glass, aluminium and ACP work completed by KUN Glass & Aluminium, Nashik.`,
    path: `/projects/${slug}`,
    type: 'article',
  });
}

export default async function ProjectDetailLayout({ children, params }: ProjectLayoutProps) {
  await params;
  return <>{children}</>;
}
