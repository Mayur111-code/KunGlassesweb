import { LegalDocument, type LegalSection } from '@/components/legal/LegalDocument';
import { KUN_COMPANY_ADDRESS } from '@/lib/utils';

/**
 * SAMPLE CONTENT — replace every entry below with legally reviewed wording.
 *
 * Each entry renders as one numbered section. Keep the shape
 * (`heading` + optional `paragraphs` / `bullets`) so the layout stays intact.
 */
const SECTIONS: LegalSection[] = [
  {
    heading: 'Introduction',
    paragraphs: [
      'These terms govern your use of this website. The text below is sample content prepared for development and should be reviewed by a qualified professional before it is published.',
      'By using this website you agree to these terms. If you do not agree with them, please stop using the site.',
    ],
  },
  {
    heading: 'Use of Website',
    paragraphs: [
      'You may browse the site, read its content and submit genuine business enquiries. Placeholder note: confirm the permitted and prohibited uses once the terms are reviewed.',
    ],
    bullets: [
      'Use the site only for lawful purposes and in a way that does not harm the business or third parties.',
      'Do not attempt to gain unauthorised access to any part of the site or its administration area.',
      'Do not copy, scrape or republish substantial parts of the content without written permission.',
    ],
  },
  {
    heading: 'Services Information',
    paragraphs: [
      'Pages describing glass and aluminium services are provided for general information. They describe typical work in general terms and may not cover every situation, specification, constraint or variation that applies to a particular project.',
      'Site content is not an offer and does not create a contract. A scope of work is agreed separately for each project.',
    ],
  },
  {
    heading: 'Project Enquiries and Quotations',
    paragraphs: [
      'Submitting an enquiry does not guarantee that work will be undertaken, that a quotation will be issued, or that any particular price, timeline or specification will be available. Quotations are prepared on the basis of the information available at the time and the assumptions stated within them.',
    ],
    bullets: [
      'Quotation validity, inclusions and exclusions should be confirmed within the quotation document itself.',
      'Site measurements, specifications and site conditions may affect pricing and timelines.',
    ],
  },
  {
    heading: 'Pricing and Availability',
    paragraphs: [
      'Any figures shown on the site are illustrative placeholders and should not be relied upon as final pricing. Prices, lead times and material availability can change and are confirmed only in a written quotation.',
    ],
  },
  {
    heading: 'Intellectual Property',
    paragraphs: [
      'The design, text, layout, photographs, graphics and code of this website belong to the business or its respective licensors. Placeholder note: have this section reviewed, in particular the position on project photography and third-party imagery, before publishing.',
    ],
    bullets: [
      'Do not reproduce site content without written permission.',
      'Third-party names, logos and imagery remain the property of their respective owners.',
    ],
  },
  {
    heading: 'User Responsibilities',
    paragraphs: [
      'You are responsible for the accuracy of the information you submit and for keeping any communication with us confidential. Please do not submit sensitive personal information through the enquiry form unless it is necessary and appropriate to do so.',
    ],
  },
  {
    heading: 'Third-Party Links',
    paragraphs: [
      'The site may contain links to external websites. These are provided for convenience. The business does not control those websites and is not responsible for their content, availability or privacy practices.',
    ],
  },
  {
    heading: 'Website Availability',
    paragraphs: [
      'The site is provided on an "as available" basis. Content may change, be updated or be withdrawn at any time, and the site may be temporarily unavailable for maintenance or technical reasons. Placeholder note: confirm any intended service commitments with your adviser before publishing.',
    ],
  },
  {
    heading: 'Limitation of Liability',
    paragraphs: [
      'Placeholder notice: this section is deliberately incomplete. It must be drafted and reviewed by a qualified professional for the jurisdictions in which the business operates, and should address reliance on site content, project quotations, third-party services and any limits permitted by applicable law.',
    ],
  },
  {
    heading: 'Changes to These Terms',
    paragraphs: [
      'These terms may be revised from time to time. The "Last Updated" value at the top of the page indicates the most recent revision, and the updated version applies from the moment it is published.',
    ],
  },
  {
    heading: 'Contact Information',
    paragraphs: [
      'Questions about these terms can be directed to the business using the contact details below or through the enquiry form on the contact page.',
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <LegalDocument
      eyebrow="Legal"
      title="Terms of Service"
      description="The terms that apply when you use this website. Sample content pending legal review."
      lastUpdated="[Replace Date]"
      sections={SECTIONS}
      footerContent={
        <div className="mt-14 rounded-lg border border-navy-100 bg-surface-muted p-6 sm:p-8">
          <h2 className="font-display text-lg font-bold text-navy-950">KUN Glass &amp; Aluminium</h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-navy-600">
            {KUN_COMPANY_ADDRESS}
          </p>
        </div>
      }
    />
  );
}
