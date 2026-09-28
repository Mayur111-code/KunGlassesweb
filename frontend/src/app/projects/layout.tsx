import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Our Projects',
  description:
    'Browse completed residential, commercial and industrial glass, aluminium and ACP projects delivered by KUN Glass & Aluminium across Nashik, Maharashtra.',
  path: '/projects',
});

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
