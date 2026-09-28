'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SITE_LOGO } from '@/lib/brand';
import { cn } from '@/lib/utils';
import { useSettings } from '@/lib/settings-context';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Projects' },
  { href: '/clients', label: 'Clients' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const { settings } = useSettings();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const isHome = pathname === '/';
  const onHero = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        onHero ? 'bg-transparent' : 'bg-white/95 shadow-sm backdrop-blur-md border-b border-navy-100/80'
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-4 sm:h-[4.25rem]">
          <Link href="/" className="flex shrink-0 items-center gap-3 group" aria-label="KUN Glass and Aluminium — Home">
            <img src={settings?.logo || SITE_LOGO} alt="KUN Glass and Aluminium" className="h-9 w-auto object-contain sm:h-10" />
            <div className="hidden leading-tight sm:block">
              <span
                className={cn(
                  'block text-sm font-bold tracking-tight transition-colors',
                  onHero ? 'text-white' : 'text-navy-950'
                )}
              >
                KUN Glass &amp; Aluminium
              </span>
              <span className={cn('block text-xs font-medium', onHero ? 'text-navy-200' : 'text-navy-500')}>
                Glass &amp; aluminium works
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => {
              const active =
                pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'link-underline relative px-3.5 py-2 text-sm font-medium transition-colors',
                    onHero
                      ? active
                        ? 'text-brand-light'
                        : 'text-white/85 hover:text-white'
                      : active
                        ? 'text-brand-orange'
                        : 'text-navy-700 hover:text-navy-950'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Link href="/admin/login">
              <Button
                size="sm"
                variant={onHero ? 'outline-light' : 'outline'}
                className={cn(!onHero && 'border-navy-200 text-navy-800 hover:bg-navy-50')}
              >
                Login
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="sm" variant="primary" className="group">
                Get a Quote
              </Button>
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className={cn(
              'flex h-11 w-11 items-center justify-center rounded-md transition-colors lg:hidden',
              onHero ? 'text-white hover:bg-white/10' : 'text-navy-900 hover:bg-navy-50'
            )}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-navy-950/40 lg:hidden"
              aria-label="Close menu overlay"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              id="mobile-navigation"
              className="relative z-50 border-b border-navy-100 bg-white lg:hidden"
            >
              <Container className="flex max-h-[calc(100dvh-4rem)] flex-col gap-1 overflow-y-auto py-4">
                {NAV_LINKS.map((link) => {
                  const active =
                    pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'rounded-md px-4 py-3 text-base font-medium transition-colors',
                        active ? 'bg-brand-orange/10 text-brand-orange' : 'text-navy-800 hover:bg-navy-50'
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                <div className="mt-4 grid gap-3 border-t border-navy-100 pt-4">
                  <Link href="/admin/login">
                    <Button variant="outline" size="md" className="w-full border-navy-200">
                      Login
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="primary" size="md" className="w-full">
                      Get a Quote
                    </Button>
                  </Link>
                </div>
              </Container>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
