import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'About KUN Glass & Aluminium',
  description:
    'Learn about KUN Glass & Aluminium, a Nashik-based glass, aluminium and ACP fabrication company delivering precision-crafted solutions since 2010.',
  path: '/about',
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
