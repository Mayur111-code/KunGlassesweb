import nodemailer, { type Transporter } from 'nodemailer';
import { APP } from '../config/constants';

interface EnquiryEmailPayload {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
}

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT ?? 587);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const FROM_EMAIL = process.env.FROM_EMAIL ?? 'no-reply@kunglass.com';
const ADMIN_NOTIFICATION_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL ?? '';

const getTransporter = (): Transporter => {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
    throw new Error('SMTP is not configured. Set SMTP_HOST, SMTP_USER and SMTP_PASSWORD env vars.');
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  });
};

export const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"${APP.NAME}" <${FROM_EMAIL}>`,
    to,
    subject,
    html,
  });
};

export const sendAdminEnquiryNotification = async (enquiry: EnquiryEmailPayload): Promise<void> => {
  if (!ADMIN_NOTIFICATION_EMAIL) {
    throw new Error('ADMIN_NOTIFICATION_EMAIL is not configured.');
  }

  const html = `
    <h2>New Enquiry Received</h2>
    <ul>
      <li><strong>Name:</strong> ${escapeHtml(enquiry.name)}</li>
      <li><strong>Email:</strong> ${escapeHtml(enquiry.email)}</li>
      <li><strong>Phone:</strong> ${escapeHtml(enquiry.phone ?? 'Not provided')}</li>
      <li><strong>Service:</strong> ${escapeHtml(enquiry.service ?? 'General enquiry')}</li>
    </ul>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(enquiry.message).replace(/\n/g, '<br/>')}</p>
  `;

  await sendEmail(ADMIN_NOTIFICATION_EMAIL, `New enquiry from ${enquiry.name}`, html);
};

export const sendCustomerConfirmation = async (enquiry: EnquiryEmailPayload): Promise<void> => {
  const html = `
    <h2>Thank you for contacting ${APP.NAME}</h2>
    <p>Dear ${escapeHtml(enquiry.name)},</p>
    <p>
      We have received your enquiry regarding
      ${escapeHtml(enquiry.service ?? 'our glass & aluminium services')}. Our team will get back to
      you soon.
    </p>
    <p>In the meantime, if you have any questions, feel free to reply to this email.</p>
    <p>Thank you,<br/>The ${APP.NAME} Team</p>
  `;

  await sendEmail(enquiry.email, 'We received your enquiry', html);
};