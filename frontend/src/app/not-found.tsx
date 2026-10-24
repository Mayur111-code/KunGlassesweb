import Link from 'next/link';
import { Container } from '@/components/ui/Container';

export default function NotFound() {
  return (
    <section className="relative flex min-h-[85svh] items-center overflow-hidden bg-ink-950 text-stone-50">
      <div className="absolute inset-0 hero-architectural" aria-hidden />
      <div className="absolute inset-0 blueprint-dark opacity-60" aria-hidden />
      <div className="pointer-events-none absolute right-[10%] top-1/4 hidden h-56 w-56 border border-white/10 lg:block" aria-hidden />

      <Container className="relative py-24">
        <p className="type-eyebrow inline-flex items-center gap-3 text-bronze-300">
          <span className="h-px w-7 bg-bronze-300/70" aria-hidden />
          Error 404
        </p>
        <h1 className="type-h1 mt-6 max-w-2xl text-stone-50">
          This page has been moved, or never existed.
        </h1>
        <p className="mt-6 max-w-md text-[0.975rem] leading-relaxed text-white/55">
          The page you are looking for is not here. Explore our services and completed work, or
          contact the KUN team directly.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-xs bg-bronze-500 px-6 text-[0.9375rem] font-medium text-ink-950 transition-colors duration-300 hover:bg-bronze-400"
          >
            Back to Home
          </Link>
          <Link
            href="/services"
            className="inline-flex h-12 items-center justify-center rounded-xs border border-white/30 px-6 text-[0.9375rem] font-medium text-stone-50 transition-colors duration-300 hover:bg-white hover:text-ink-950"
          >
            View Services
          </Link>
        </div>
      </Container>
    </section>
  );
}
