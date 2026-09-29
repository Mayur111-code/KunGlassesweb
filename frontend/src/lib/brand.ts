/** Public site logo — local asset, not ImageKit */
export const SITE_LOGO = '/logo.png';

/**
 * Last-resort contact fallbacks, used only when the CMS settings request fails
 * or the site is viewed with the API unreachable. These are the real KUN Glass
 * & Aluminium business numbers already configured in the admin CMS, not
 * invented placeholders.
 */
export const FALLBACK_PHONE_NUMBERS = ['9823097867', '9595343528'] as const;

export const PROCESS_STEPS = [
  { step: '01', title: 'Requirement', description: 'Share your space, scope and expectations with our team.' },
  { step: '02', title: 'Consultation', description: 'We assess the site and recommend the right materials and approach.' },
  { step: '03', title: 'Design & Planning', description: 'Drawings, measurements and a clear plan before fabrication begins.' },
  { step: '04', title: 'Execution', description: 'Precision fabrication and professional on-site installation.' },
  { step: '05', title: 'Completion', description: 'Final inspection, handover and support for your peace of mind.' },
] as const;
