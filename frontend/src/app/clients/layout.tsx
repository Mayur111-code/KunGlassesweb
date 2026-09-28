import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Our Clients',
  description:
    'See the builders, architects, developers and businesses that trust KUN Glass & Aluminium for glass and aluminium fabrication work in Nashik.',
  path: '/clients',
});

export default function ClientsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
