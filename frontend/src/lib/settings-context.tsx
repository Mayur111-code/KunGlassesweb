'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { settingsApi } from '@/services';
import type { ContactMethod, SettingsPayload, SiteSettings } from '@/types';

interface SettingsContextValue {
  settings: SiteSettings | null;
  contactMethods: ContactMethod[];
  isLoading: boolean;
  error: string | null;
  phones: ContactMethod[];
  whatsapp: ContactMethod[];
  emails: ContactMethod[];
  primaryPhone: ContactMethod | null;
  primaryWhatsApp: ContactMethod | null;
  primaryEmail: ContactMethod | null;
  whatsappLink: string | null;
  refresh: () => Promise<void>;
}

const DEFAULT_WHATSAPP_MESSAGE =
  'Hello KUN Glass & Aluminium, I am interested in your glass/aluminium services. I would like to discuss my requirement.';

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

const transform = (payload: SettingsPayload) => {
  const { settings, contactMethods } = payload;

  const active = contactMethods.filter((c) => c.isActive);
  const phones = active.filter((c) => c.type === 'phone');
  const whatsapp = active.filter((c) => c.type === 'whatsapp');
  const emails = active.filter((c) => c.type === 'email');

  const primaryPhone = phones.find((p) => p.isPrimary) ?? phones[0] ?? null;
  const primaryWhatsApp = whatsapp.find((w) => w.isPrimary) ?? whatsapp[0] ?? null;
  const primaryEmail = emails.find((e) => e.isPrimary) ?? emails[0] ?? null;

  return {
    settings,
    contactMethods: active,
    phones,
    whatsapp,
    emails,
    primaryPhone,
    primaryWhatsApp,
    primaryEmail,
  };
};

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [contactMethods, setContactMethods] = useState<ContactMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await settingsApi.getPublic();
      const { settings: s, contactMethods: c } = res.data;
      setSettings(s);
      setContactMethods(c.filter((m) => m.isActive));
    } catch {
      setError('Failed to load site settings');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<SettingsContextValue>(() => {
    const derived = transform({ settings: settings ?? ({} as SiteSettings), contactMethods });
    let whatsappLink: string | null = null;
    if (derived.primaryWhatsApp) {
      const message = settings?.whatsappDefaultMessage || DEFAULT_WHATSAPP_MESSAGE;
      const digits = derived.primaryWhatsApp.value.replace(/\D/g, '');
      const formatted = digits.length === 10 ? `91${digits}` : digits;
      whatsappLink = `https://wa.me/${formatted}?text=${encodeURIComponent(message)}`;
    }
    return {
      ...derived,
      settings: settings ?? null,
      contactMethods,
      isLoading,
      error,
      whatsappLink,
      refresh,
    };
  }, [settings, contactMethods, isLoading, error, refresh]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}