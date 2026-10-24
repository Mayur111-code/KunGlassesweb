import type { ReactNode } from 'react';
import { PageHero } from '@/components/ui/PageHero';
import { Container } from '@/components/ui/Container';

export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

interface LegalDocumentProps {
  eyebrow: string;
  title: string;
  description: string;
  /** Placeholder until the company owner supplies a real review date. */
  lastUpdated: string;
  sections: LegalSection[];
  /** Rendered after the numbered sections, e.g. a contact card. */
  footerContent?: ReactNode;
}

/**
 * Shared presentation for the static legal pages.
 *
 * Intentionally free of scroll-reveal animation: long-form legal text should
 * read immediately, and animated content risks staying invisible (see
 * `MotionWrap`). The copy itself lives in each page's `SECTIONS` array so the
 * owner can replace it without touching this file.
 */
export function LegalDocument({
  eyebrow,
  title,
  description,
  lastUpdated,
  sections,
  footerContent,
}: LegalDocumentProps) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} description={description} />

      <section className="section bg-surface">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-steel-500">
                <span className="font-medium text-ink-950">Last Updated:</span>{' '}
                <span className="text-bronze-700">{lastUpdated}</span>
              </p>

              <span className="inline-flex w-fit items-center rounded-xs border border-line px-3 py-1 text-[0.625rem] font-medium uppercase tracking-[0.18em] text-steel-500">
                Sample content
              </span>
            </div>

            <div className="mb-12 border border-line bg-stone-50 p-5 sm:p-6">
              <p className="text-sm leading-relaxed text-steel-500">
                <span className="font-medium text-ink-950">Placeholder notice.</span> The text on
                this page is sample content prepared for development. Replace every section below
                with the company&rsquo;s legally reviewed wording before publishing.
              </p>
            </div>

            <ol className="space-y-12">
              {sections.map((section, index) => (
                <li key={section.heading} className="scroll-mt-28">
                  <div className="flex items-baseline gap-3">
                    <span
                      className="font-display text-sm font-medium tabular-nums text-bronze-700"
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <h2 className="type-h3 text-ink-950">
                      {section.heading}
                    </h2>
                  </div>

                  {section.paragraphs?.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="mt-4 text-base leading-[1.8] text-steel-500 first:mt-4 sm:text-[1.0625rem]"
                    >
                      {paragraph}
                    </p>
                  ))}

                  {section.bullets?.length ? (
                    <ul className="mt-5 space-y-3 border-l border-line pl-5">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3 text-base leading-[1.8] text-steel-500">
                          <span
                            className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-bronze-500"
                            aria-hidden="true"
                          />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ol>

            {footerContent}
          </div>
        </Container>
      </section>
    </>
  );
}
