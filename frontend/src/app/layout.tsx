import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { LayoutShell } from './layout-shell';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'KUN Glass & Aluminium — Premium Glass & Aluminium Solutions in Nashik',
    template: '%s | KUN Glass & Aluminium',
  },
  description:
    'KUN Glass & Aluminium delivers premium glass, aluminium, ACP cladding, partition, sliding windows and interior solutions across Nashik, Maharashtra since 2010.',
  icons: { icon: '/logo.png' },
  keywords: [
    'glass and aluminium nashik',
    'aluminium sliding windows',
    'ACP cladding nashik',
    'toughened glass',
    'glass partition',
    'KUN Glass and Aluminium',
    'glass work maharashtra',
    'aluminium facade',
  ],
  openGraph: {
    type: 'website',
    siteName: 'KUN Glass & Aluminium',
    title: 'KUN Glass & Aluminium — Premium Glass & Aluminium Solutions',
    description:
      'One Stop Solution For Glass & Aluminium Works. Trusted since 2010 for premium residential, commercial and industrial projects in Nashik.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KUN Glass & Aluminium',
    description:
      'Premium glass and aluminium solutions for modern spaces — trusted since 2010.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'KUN Glass & Aluminium',
  description: 'Premium glass and aluminium solutions for residential, commercial and industrial spaces.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://kunglass.com',
  telephone: ['+919823097867', '+919595343528'],
  email: 'kunglass@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Lohkare Mala, Near Golden Universal School, Opposite Ceramic House Showroom, Behind Tuljai Hotel, Aurangabad-Takli Link Road',
    addressLocality: 'Nashik',
    addressRegion: 'Maharashtra',
    postalCode: '422003',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 19.9975,
    longitude: 73.7898,
  },
  areaServed: [
    { '@type': 'City', name: 'Nashik' },
    { '@type': 'State', name: 'Maharashtra' },
  ],
  foundingDate: '2010',
  sameAs: [],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <link rel="icon" href="/logo.png" type="image/jpeg" />
        <meta name="theme-color" content="#0e1627" />
        <meta name="google-site-verification" content="" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen font-sans">
        <Providers>
          <LayoutShell>{children}</LayoutShell>
        </Providers>
      </body>
    </html>
  );
}