import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: 'Privacy Policy | KUN Glass & Aluminium',
    description: 'Privacy Policy for KUN Glass & Aluminium.',
    path: '/privacy-policy',
  }),
  // The root layout applies a `%s | KUN Glass & Aluminium` template. `absolute`
  // opts out of it so the title is not suffixed twice.
  title: { absolute: 'Privacy Policy | KUN Glass & Aluminium' },
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
