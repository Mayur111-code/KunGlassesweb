import { Fragment, type CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface RevealTextProps {
  text: string;
  className?: string;
  /** Index offset so multiple lines can continue the same stagger. */
  offset?: number;
}

/**
 * Word-level entrance reveal implemented with CSS (not JS).
 *
 * Benefits over a client-side split:
 * - identical server/client markup → no hydration mismatch;
 * - no observer dependency, so the copy is never left invisible;
 * - `prefers-reduced-motion` is handled by the global CSS override.
 *
 * Screen readers get the complete sentence from the sr-only node while the
 * animated words are hidden from the accessibility tree.
 */
export function RevealText({ text, className, offset = 0 }: RevealTextProps) {
  const words = text.split(' ');

  return (
    <span className={cn('inline', className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <Fragment key={`${word}-${index}`}>
            <span className="word-mask">
              <span
                className="word-rise inline-block"
                style={{ '--i': index + offset } as CSSProperties}
              >
                {word}
              </span>
            </span>
            {index < words.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </span>
    </span>
  );
}
