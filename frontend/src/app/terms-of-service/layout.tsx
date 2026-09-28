import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: 'Terms of Service | KUN Glass & Aluminium',
    description: 'Terms of Service for KUN Glass & Aluminium.',
    path: '/terms-of-service',
  }),
  // The root layout applies a `%s | KUN Glass & Aluminium` template. `absolute`
  // opts out of it so the title is not suffixed twice.
  title: { absolute: 'Terms of Service | KUN Glass & Aluminium' },
};

export default function TermsOfServiceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
