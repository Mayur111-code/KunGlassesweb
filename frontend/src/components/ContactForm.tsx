'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ButtonSpinner } from '@/components/ui/Spinner';
import { MotionWrap } from '@/components/MotionWrap';
import { useSettings } from '@/lib/settings-context';
import { buildTelLink, cn } from '@/lib/utils';
import { servicesApi, enquiriesApi } from '@/services';
import type { Service } from '@/types';

const inputClass =
  'w-full h-11 px-4 rounded-md border border-navy-200/80 bg-white text-sm text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/25 focus:border-brand-orange transition-all duration-200';

interface ContactFormProps {
  className?: string;
  compact?: boolean;
}

export function ContactForm({ className, compact }: ContactFormProps) {
  const { primaryPhone, whatsappLink } = useSettings();
  const [services, setServices] = useState<Service[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    company: '',
    serviceInterestedIn: '',
    message: '',
    preferredContactMethod: 'phone' as 'phone' | 'email' | 'whatsapp',
  });

  const phoneLink = primaryPhone ? buildTelLink(primaryPhone.value) : null;

  useEffect(() => {
    servicesApi
      .getAll()
      .then((res) => setServices(res.data ?? []))
      .catch(() => {});
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.phone.trim() || !form.message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await enquiriesApi.submit({
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        company: form.company.trim() || undefined,
        serviceInterestedIn: form.serviceInterestedIn || undefined,
        message: form.message.trim(),
        preferredContactMethod: form.preferredContactMethod,
        source: 'website',
      });
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again or contact us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <MotionWrap>
        <div className={cn('rounded-xl border border-emerald-200 bg-emerald-50/80 p-8 text-center', className)}>
          <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-emerald-500" />
          <h3 className="mb-2 text-xl font-bold text-navy-950">Thank you</h3>
          <p className="mb-6 text-navy-600">
            Your enquiry was submitted successfully. Our team will contact you shortly.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            {phoneLink && (
              <a href={phoneLink}>
                <Button variant="outline" size="md">
                  Call Now
                </Button>
              </a>
            )}
            {whatsappLink && (
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Button variant="primary" size="md">
                  WhatsApp Us
                </Button>
              </a>
            )}
          </div>
        </div>
      </MotionWrap>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-5', className)} noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-fullName" className="mb-1.5 block text-sm font-semibold text-navy-900">
            Name *
          </label>
          <input
            id="cf-fullName"
            name="fullName"
            type="text"
            required
            value={form.fullName}
            onChange={handleChange}
            className={inputClass}
            autoComplete="name"
          />
        </div>
        <div>
          <label htmlFor="cf-phone" className="mb-1.5 block text-sm font-semibold text-navy-900">
            Phone *
          </label>
          <input
            id="cf-phone"
            name="phone"
            type="tel"
            required
            value={form.phone}
            onChange={handleChange}
            className={inputClass}
            autoComplete="tel"
          />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-email" className="mb-1.5 block text-sm font-semibold text-navy-900">
            Email
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className={inputClass}
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="cf-company" className="mb-1.5 block text-sm font-semibold text-navy-900">
            Company
          </label>
          <input
            id="cf-company"
            name="company"
            type="text"
            value={form.company}
            onChange={handleChange}
            className={inputClass}
            autoComplete="organization"
          />
        </div>
      </div>
      <div>
        <label htmlFor="cf-service" className="mb-1.5 block text-sm font-semibold text-navy-900">
          Service
        </label>
        <select
          id="cf-service"
          name="serviceInterestedIn"
          value={form.serviceInterestedIn}
          onChange={handleChange}
          className={cn(inputClass, 'cursor-pointer appearance-none')}
        >
          <option value="">Select a service</option>
          {services.map((s) => (
            <option key={s._id} value={s.title}>
              {s.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <span className="mb-2 block text-sm font-semibold text-navy-900">Preferred contact method</span>
        <div className="flex flex-wrap gap-3">
          {(
            [
              { value: 'phone', label: 'Phone' },
              { value: 'email', label: 'Email' },
              { value: 'whatsapp', label: 'WhatsApp' },
            ] as const
          ).map((opt) => (
            <label
              key={opt.value}
              className={cn(
                'flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors duration-200',
                form.preferredContactMethod === opt.value
                  ? 'border-brand-orange bg-brand-orange/5 text-navy-950'
                  : 'border-navy-200 text-navy-600 hover:border-navy-300'
              )}
            >
              <input
                type="radio"
                name="preferredContactMethod"
                value={opt.value}
                checked={form.preferredContactMethod === opt.value}
                onChange={handleChange}
                className="accent-brand-orange"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="cf-message" className="mb-1.5 block text-sm font-semibold text-navy-900">
          Message *
        </label>
        <textarea
          id="cf-message"
          name="message"
          required
          rows={compact ? 4 : 5}
          value={form.message}
          onChange={handleChange}
          placeholder="Tell us about your project or requirement..."
          className={cn(inputClass, 'h-auto resize-none py-3')}
        />
      </div>
      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" variant="primary" size="lg" disabled={submitting} className="group w-full sm:w-auto">
        {submitting ? (
          <>
            <ButtonSpinner /> Sending...
          </>
        ) : (
          <>
            Send Enquiry
            <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </Button>
    </form>
  );
}
