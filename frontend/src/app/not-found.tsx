import Link from 'next/link';
import { Container } from '@/components/ui/Container';

export default function NotFound() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center">
      <Container className="text-center py-20">
        <p className="text-8xl font-bold text-brand-orange mb-6">404</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy-950 mb-4">
          Page Not Found
        </h1>
        <p className="text-navy-600 mb-8 max-w-md mx-auto">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-brand-orange text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-dark transition-colors"
        >
          Back to Home
        </Link>
      </Container>
    </section>
  );
}