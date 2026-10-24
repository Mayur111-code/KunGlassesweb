import localFont from 'next/font/local';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Suspense } from 'react';
import './globals.css';
import { Providers } from './providers';
import { LayoutShell } from './layout-shell';

/**
 * Fonts are self-hosted (SIL Open Font License, files in ./fonts).
 *
 * Google-hosted `next/font/google` requires a build-time request to
 * fonts.googleapis.com, which makes the production build fail in offline or
 * firewalled environments and adds a third-party dependency on every deploy.
 * Local variable fonts keep the build hermetic, avoid the extra DNS/TLS hop and
 * still expose CSS variables for the design tokens.
 */
const inter = localFont({
  src: './fonts/inter-latin-variable.woff2',
  variable: '--font-inter',
  display: 'swap',
  weight: '100 900',
  fallback: ['system-ui', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
});

const jakarta = localFont({
  src: './fonts/plus-jakarta-sans-latin-variable.woff2',
  variable: '--font-display',
  display: 'swap',
  weight: '200 800',
  fallback: ['system-ui', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kun-glassesweb.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'KUN Glass & Aluminium | Architectural Glass & Aluminium Works',
    template: '%s | KUN Glass & Aluminium',
  },
  description:
    'KUN Glass & Aluminium designs, fabricates and installs precision glass and aluminium solutions for residential, commercial and architectural spaces in Nashik, Maharashtra.',
  applicationName: 'KUN Glass & Aluminium',
  keywords: [
    'glass and aluminium works',
    'aluminium sliding windows Nashik',
    'toughened glass partitions',
    'ACP cladding',
    'architectural glazing',
    'KUN Glass & Aluminium',
  ],
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    type: 'website',
    siteName: 'KUN Glass & Aluminium',
    title: 'KUN Glass & Aluminium | Architectural Glass & Aluminium Works',
    description:
      'Precision-crafted glass and aluminium solutions for contemporary residential, commercial and architectural spaces.',
    url: siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KUN Glass & Aluminium',
    description:
      'Precision-crafted glass and aluminium solutions for contemporary residential, commercial and architectural spaces.',
  },
};

export const viewport: Viewport = {
  themeColor: '#F8F7F5',
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'KUN Glass & Aluminium',
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description:
    'Glass, aluminium and ACP fabrication company delivering architectural glazing, windows, doors, partitions and facades.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Nashik',
    addressRegion: 'Maharashtra',
    addressCountry: 'IN',
  },
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
      <body suppressHydrationWarning className="min-h-screen bg-background font-sans text-text-primary antialiased">
        <Providers>
          <Suspense>
            <LayoutShell>{children}</LayoutShell>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
