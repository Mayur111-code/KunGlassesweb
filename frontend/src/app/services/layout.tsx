import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Glass & Aluminium Services',
  description:
    'Aluminium sliding windows, toughened glass partitions, ACP cladding, frameless glass, shower enclosures and fabrication services in Nashik.',
  path: '/services',
});

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
