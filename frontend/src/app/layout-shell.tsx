'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { MobileStickyCta } from '@/components/MobileStickyCta';

export function LayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="overflow-x-clip pt-0 pb-20 lg:pb-0">{children}</main>
      <Footer />
      <FloatingWhatsApp />
      <MobileStickyCta />
    </>
  );
}
