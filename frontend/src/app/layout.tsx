import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import type { Metadata } from 'next';
import Script from 'next/script';
import { Suspense } from 'react';
import './globals.css';
import { Providers } from './providers';
import { LayoutShell } from './layout-shell';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://kun-glassesweb.vercel.app'),
  title: {
    default: 'KUN Glass & Aluminium | Premium Glass & Aluminium Works',
    template: '%s | KUN Glass & Aluminium',
  },
  description:
    'KUN Glass & Aluminium delivers premium glass and aluminium solutions for residential, commercial, and architectural projects.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'KUN Glass & Aluminium',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://kun-glassesweb.vercel.app',
  logo: '/logo.png',
  sameAs: [],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning className={`${inter.variable} ${jakarta.variable}`}>
      <head>
        <Script
          id="kun-organization-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen font-sans bg-background text-text-primary antialiased">
        <Providers>
          <Suspense>
            <LayoutShell>{children}</LayoutShell>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
