'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
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

const EASE = [0.22, 1, 0.36, 1] as const;

export function Navbar() {
  const { settings } = useSettings();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isHome = pathname === '/';
  const onHero = isHome && !scrolled && !open;
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-500 ease-arch',
        onHero
          ? 'border-b border-transparent bg-transparent'
          : 'border-b border-line/80 bg-background/90 shadow-[0_1px_0_rgba(31,31,31,0.04)] backdrop-blur-xl'
      )}
    >
      <Container>
        <div className="flex h-[4.5rem] items-center justify-between gap-4 lg:h-[5.25rem]">
          {/* Brand */}
          <Link
            href="/"
            className="group flex shrink-0 items-center"
            aria-label="KUN Glass and Aluminium — Home"
          >
            {/* The supplied logo is a wide lockup; it is always shown at its
                natural aspect ratio on a light plaque so the blue/orange brand
                mark stays legible over both the dark hero and the light header. */}
            <span
              className={cn(
                'flex h-11 items-center justify-center overflow-hidden rounded-xs bg-white px-2.5 transition-all duration-500 lg:h-12 lg:px-3',
                onHero ? 'ring-1 ring-white/25' : 'ring-1 ring-line'
              )}
            >
              <img
                src={settings?.logo || SITE_LOGO}
                alt="KUN Glass and Aluminium"
                className="h-8 w-auto object-contain lg:h-9"
              />
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => {
              const active =
                pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'group relative px-3.5 py-2 text-[0.75rem] font-medium uppercase tracking-[0.14em] transition-colors duration-300',
                    onHero
                      ? active
                        ? 'text-bronze-300'
                        : 'text-white/75 hover:text-white'
                      : active
                        ? 'text-bronze-700'
                        : 'text-steel-500 hover:text-ink-950'
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      'absolute inset-x-3.5 -bottom-0.5 h-px origin-left transition-transform duration-300 ease-arch',
                      active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                      onHero ? 'bg-bronze-300/80' : 'bg-bronze-500'
                    )}
                    aria-hidden
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <Link
              href="/admin/login"
              className={cn(
                'text-[0.6875rem] font-medium uppercase tracking-[0.16em] transition-colors duration-300',
                onHero ? 'text-white/50 hover:text-white' : 'text-steel-500 hover:text-ink-900'
              )}
            >
              Admin
            </Link>
            <Button
              href="/contact"
              size="sm"
              variant="primary"
              className="h-10 px-5 text-[0.75rem] uppercase tracking-[0.12em]"
            >
              Start a project
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
            </Button>
          </div>

          {/* Mobile trigger */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            className={cn(
              'flex h-11 w-11 items-center justify-center rounded-xs transition-colors lg:hidden',
              onHero ? 'text-white hover:bg-white/10' : 'text-ink-900 hover:bg-ink-900/5'
            )}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </Container>

      {/* Scroll progress — a 1px bronze line, only once the page has moved. */}
      <motion.div
        aria-hidden
        style={{ scaleX: scrollYProgress }}
        className={cn(
          'h-px origin-left bg-bronze-500/70 transition-opacity duration-500',
          scrolled ? 'opacity-100' : 'opacity-0'
        )}
      />

      {mounted
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <motion.div
                  key="mobile-menu"
                  id="mobile-navigation"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Site navigation"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="fixed inset-0 z-50 bg-ink-950 text-stone-50 lg:hidden"
                >
                  <div className="absolute inset-0 blueprint-dark opacity-40" aria-hidden />
                  <div className="relative flex h-full flex-col">
                    <Container className="flex h-[4.5rem] shrink-0 items-center justify-between">
                      <span className="flex h-10 items-center overflow-hidden rounded-xs bg-white px-2.5">
                        <img
                          src={settings?.logo || SITE_LOGO}
                          alt="KUN Glass and Aluminium"
                          className="h-7 w-auto object-contain"
                        />
                      </span>
                      <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={() => setOpen(false)}
                        aria-label="Close menu"
                        className="flex h-11 w-11 items-center justify-center rounded-xs text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </Container>

                    <Container className="flex flex-1 flex-col justify-between overflow-y-auto pb-10 pt-6">
                      <nav aria-label="Mobile" className="flex flex-col">
                        {NAV_LINKS.map((link, index) => {
                          const active =
                            pathname === link.href ||
                            (link.href !== '/' && pathname.startsWith(link.href));
                          return (
                            <motion.div
                              key={link.href}
                              initial={{ opacity: 0, y: 18 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 0.08 + index * 0.05, ease: EASE }}
                            >
                              <Link
                                href={link.href}
                                className={cn(
                                  'flex items-baseline gap-4 border-b border-white/10 py-4 transition-colors',
                                  active ? 'text-bronze-300' : 'text-stone-100 hover:text-bronze-300'
                                )}
                              >
                                <span className="text-[0.625rem] font-medium tabular-nums tracking-[0.2em] text-white/50">
                                  {String(index + 1).padStart(2, '0')}
                                </span>
                                <span className="font-display text-[1.6rem] font-medium leading-none tracking-[-0.02em]">
                                  {link.label}
                                </span>
                              </Link>
                            </motion.div>
                          );
                        })}
                      </nav>

                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.42, ease: EASE }}
                        className="mt-10 space-y-3"
                      >
                        <Button href="/contact" size="lg" variant="primary" className="w-full justify-between">
                          Start a project
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                        <Link
                          href="/admin/login"
                          className="block py-2 text-center text-[0.6875rem] uppercase tracking-[0.2em] text-white/55"
                        >
                          Admin login
                        </Link>
                        <p className="pt-2 text-[0.625rem] uppercase tracking-[0.22em] text-white/55">
                          Nashik, Maharashtra · Est. 2010
                        </p>
                      </motion.div>
                    </Container>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body
          )
        : null}
    </header>
  );
}
