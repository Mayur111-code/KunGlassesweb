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
      'This page explains how KUN Glass & Aluminium handles information that visitors share through this website. The text below is sample content prepared for development and should be reviewed by a qualified professional before it is published.',
      'By continuing to browse this website you are acknowledging that the practices described here may change from time to time, and that the current version of this page always applies.',
    ],
  },
  {
    heading: 'Information We Collect',
    paragraphs: [
      'We collect information that you choose to provide, together with limited technical information generated when the site is used. The categories below are placeholders and should be adjusted to match actual practice.',
    ],
    bullets: [
      'Details you enter into enquiry forms, such as your name, phone number, email address, company and the contents of your message.',
      'The page you visited before or after submitting an enquiry, and the referring source, where available.',
      'Basic technical data such as browser type, device type and approximate region, used to understand how the site performs.',
    ],
  },
  {
    heading: 'How We Use Your Information',
    paragraphs: [
      'Information is used to respond to enquiries, prepare quotations, communicate about ongoing work and keep the website functioning. The list below is illustrative.',
    ],
    bullets: [
      'To reply to enquiries and discuss project requirements.',
      'To prepare, issue and revise quotations and related documents.',
      'To maintain the security, performance and usability of the website.',
      'To contact you about your enquiry or an existing project.',
    ],
  },
  {
    heading: 'Contact and Enquiry Information',
    paragraphs: [
      'When you submit an enquiry, the details you provide are stored so that the enquiry can be reviewed and answered. Placeholder note: confirm the retention period, storage location and who inside the business can access these records before publishing.',
    ],
  },
  {
    heading: 'Cookies and Similar Technologies',
    paragraphs: [
      'This sample text describes cookies in general terms. It should be rewritten to match the cookies and storage actually used by the deployed site, including any advertising or analytics services that are enabled.',
    ],
    bullets: [
      'Strictly necessary storage required for the site to function, such as keeping you signed in to the administration area.',
      'Optional storage that may be used for measurement or preferences, where such services are enabled.',
    ],
  },
  {
    heading: 'Third-Party Services',
    paragraphs: [
      'The site may rely on external providers for hosting, image delivery, email and analytics. Placeholder note: list the specific providers used and clarify that submitted information is shared with them in order to deliver those services.',
    ],
    bullets: [
      'Hosting and infrastructure providers that store site and enquiry data.',
      'An image delivery service used to serve photographs and media.',
      'Analytics or advertising services, if and when these are enabled.',
    ],
  },
  {
    heading: 'Data Security',
    paragraphs: [
      'Reasonable technical and organisational measures are applied to protect submitted information. Placeholder note: this sample wording deliberately avoids any claim of certification or guaranteed level of protection. Describe the controls you actually operate and have verified.',
    ],
  },
  {
    heading: 'Data Retention',
    paragraphs: [
      'Enquiry information is kept only for as long as it is needed to respond, prepare quotations and meet record-keeping needs, after which it may be deleted or archived. Placeholder note: confirm and document the concrete retention period applied to each category of record before publishing.',
    ],
  },
  {
    heading: 'Your Rights',
    paragraphs: [
      'Depending on the rules that apply to you, you may be able to ask for a copy of the information held about you, request corrections, or ask for it to be deleted. Placeholder note: have this section reviewed and adapted for the jurisdictions in which the business operates.',
    ],
    bullets: [
      'Request a copy of the information you have provided.',
      'Ask for inaccurate details to be corrected.',
      'Ask for information to be deleted where it is no longer required.',
    ],
  },
  {
    heading: "Children's Privacy",
    paragraphs: [
      'This website and its services are intended for business enquiries and are not directed at children. Information should not be submitted on behalf of a child without appropriate involvement from a parent or guardian.',
    ],
  },
  {
    heading: 'Changes to This Privacy Policy',
    paragraphs: [
      'This page may be updated from time to time. The "Last Updated" value at the top of the page indicates the most recent revision, and the updated version applies from the moment it is published.',
    ],
  },
  {
    heading: 'Contact Us',
    paragraphs: [
      'Questions about this page, or a request relating to information you have submitted, can be directed to the business using the contact details below or through the enquiry form on the contact page.',
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalDocument
      eyebrow="Legal"
      title="Privacy Policy"
      description="How information submitted through this website is collected, used and handled. Sample content pending legal review."
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
