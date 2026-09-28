import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Contact KUN Glass & Aluminium',
  description:
    'Get a free quote for glass, aluminium, ACP cladding and partition work in Nashik. Call, WhatsApp or send an enquiry and our team will respond.',
  path: '/contact',
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
