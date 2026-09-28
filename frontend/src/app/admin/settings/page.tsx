'use client';

import { useEffect, useState, useCallback, type SVGProps } from 'react';
import { Save, Plus, Trash2, Star, Phone, MessageCircle, Mail, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { FormField } from '@/components/admin/FormField';
import { ImagePicker } from '@/components/admin/ImagePicker';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { settingsApi } from '@/services';
import { getErrorMessage } from '@/lib/api';
import type { SiteSettings, ContactMethod } from '@/types';

type Tab = 'general' | 'hero' | 'contact' | 'social' | 'seo' | 'whatsapp' | 'footer';

const TABS: { key: Tab; label: string }[] = [
  { key: 'general', label: 'General' },
  { key: 'hero', label: 'Page Hero Images' },
  { key: 'contact', label: 'Contact Methods' },
  { key: 'social', label: 'Social Media' },
  { key: 'seo', label: 'SEO' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'footer', label: 'Footer' },
];

const EMPTY_SETTINGS: Partial<SiteSettings> = {
  companyName: '',
  tagline: '',
  logo: '',
  favicon: '',
  facebookUrl: '',
  instagramUrl: '',
  linkedinUrl: '',
  youtubeUrl: '',
  seoTitle: '',
  seoDescription: '',
  seoKeywords: [],
  ogImage: '',
  googleVerification: '',
  robotsContent: 'index, follow',
  whatsappEnabled: true,
  whatsappDefaultMessage: '',
  address: '',
  googleMapsUrl: '',
  footerDescription: '',
  copyrightText: '',
  heroImages: {
    home: '',
    about: '',
    services: '',
    projects: '',
    clients: '',
    contact: '',
  },
};

interface ContactMethodForm {
  type: string;
  value: string;
  label: string;
  isPrimary: boolean;
  isActive: boolean;
  displayOrder: number;
}

const EMPTY_CONTACT_FORM: ContactMethodForm = {
  type: 'phone',
  value: '',
  label: '',
  isPrimary: false,
  isActive: true,
  displayOrder: 0,
};

const ICONS: Record<string, typeof Phone> = { phone: Phone, whatsapp: MessageCircle, email: Mail };
const TYPE_LABELS: Record<string, string> = { phone: 'Phone', whatsapp: 'WhatsApp', email: 'Email' };

// eslint-disable-next-line unused-imports/no-unused-vars
function PencilIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [settings, setSettings] = useState<Partial<SiteSettings>>(EMPTY_SETTINGS);
  const [contactMethods, setContactMethods] = useState<ContactMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState<ContactMethodForm>(EMPTY_CONTACT_FORM);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [deletingContact, setDeletingContact] = useState<ContactMethod | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await settingsApi.getAdmin();
      setSettings(res.data.settings);
      setContactMethods(res.data.contactMethods);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const updateSetting = (key: keyof SiteSettings, value: unknown) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSettingsSave = async () => {
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const res = await settingsApi.update(settings);
      setSettings(res.data.settings);
      setMessage('Settings saved successfully');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleCreateContact = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await settingsApi.createContactMethod(contactForm);
      setContactMethods((prev) => [...prev, res.data.contactMethod]);
      setShowContactForm(false);
      setContactForm(EMPTY_CONTACT_FORM);
      setMessage('Contact method added');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateContact = async () => {
    if (!editingContactId) return;
    setSaving(true);
    setError('');
    try {
      const res = await settingsApi.updateContactMethod(
        editingContactId,
        { ...contactForm, type: contactForm.type as ContactMethod['type'] }
      );
      setContactMethods((prev) => prev.map((c) => (c._id === editingContactId ? res.data.contactMethod : c)));
      setEditingContactId(null);
      setShowContactForm(false);
      setContactForm(EMPTY_CONTACT_FORM);
      setMessage('Contact method updated');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleSetPrimary = async (id: string) => {
    try {
      const res = await settingsApi.setPrimaryContactMethod(id);
      setContactMethods((prev) =>
        prev.map((c) => (c.type === res.data.contactMethod.type ? { ...c, isPrimary: c._id === id } : c))
      );
      setMessage('Set as primary');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDeleteContact = async () => {
    if (!deletingContact) return;
    try {
      await settingsApi.deleteContactMethod(deletingContact._id);
      setContactMethods((prev) => prev.filter((c) => c._id !== deletingContact._id));
      setDeletingContact(null);
      setMessage('Contact method deleted');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const openEditContact = (cm: ContactMethod) => {
    setContactForm({
      type: cm.type,
      value: cm.value,
      label: cm.label,
      isPrimary: cm.isPrimary,
      isActive: cm.isActive,
      displayOrder: cm.displayOrder,
    });
    setEditingContactId(cm._id);
    setShowContactForm(true);
  };

  const renderField = (key: keyof SiteSettings, label: string, opts?: { type?: string; placeholder?: string }) => {
    const type = opts?.type ?? 'text';
    const placeholder = opts?.placeholder ?? '';
    const currentValue = settings[key];

    return (
      <FormField key={key} label={label}>
        {type === 'textarea' ? (
          <textarea
            rows={3}
            value={(currentValue as string) ?? ''}
            onChange={(e) => updateSetting(key, e.target.value)}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
            placeholder={placeholder}
          />
        ) : type === 'toggle' ? (
          <button
            type="button"
            onClick={() => updateSetting(key, !currentValue)}
            className={`relative h-6 w-11 rounded-full transition-colors ${currentValue ? 'bg-brand-orange' : 'bg-neutral-200'}`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${currentValue ? 'left-[22px]' : 'left-0.5'}`} />
          </button>
        ) : type === 'comma' ? (
          <input
            type="text"
            value={Array.isArray(currentValue) ? (currentValue as string[]).join(', ') : ''}
            onChange={(e) =>
              updateSetting(key, e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean))
            }
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
            placeholder={placeholder}
          />
        ) : (
          <input
            type={type}
            value={(currentValue as string) ?? ''}
            onChange={(e) => updateSetting(key, e.target.value)}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
            placeholder={placeholder}
          />
        )}
      </FormField>
    );
  };

  const renderContactList = (type: 'phone' | 'whatsapp' | 'email') => {
    const Icon = ICONS[type];
    const methods = contactMethods.filter((c) => c.type === type);
    return (
      <div key={type}>
        <h4 className="text-sm font-semibold text-navy-700 mb-3 flex items-center gap-2">
          <Icon className="h-4 w-4" /> {TYPE_LABELS[type]}
        </h4>
        {methods.length === 0 ? (
          <p className="text-xs text-neutral-400 mb-4">No {type} configured</p>
        ) : (
          <div className="space-y-2 mb-4">
            {methods.map((cm) => (
              <div
                key={cm._id}
                className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
                  cm.isPrimary ? 'border-brand-orange/30 bg-brand-orange/5' : 'border-neutral-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                      cm.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-100 text-neutral-400'
                    }`}
                  >
                    {cm.isActive ? 'ON' : 'OFF'}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-navy-950">{cm.value}</p>
                    <p className="text-xs text-neutral-400">{cm.label || TYPE_LABELS[cm.type]}</p>
                  </div>
                  {cm.isPrimary && (
                    <span className="rounded-full bg-brand-orange/10 px-2 py-0.5 text-xs font-semibold text-brand-orange">
                      Primary
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {!cm.isPrimary && (
                    <button
                      onClick={() => handleSetPrimary(cm._id)}
                      className="rounded p-1.5 text-neutral-300 hover:bg-amber-50 hover:text-amber-600"
                      title="Set Primary"
                    >
                      <Star className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => openEditContact(cm)}
                    className="rounded p-1.5 text-neutral-400 hover:bg-navy-50 hover:text-navy-700"
                    title="Edit"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeletingContact(cm)}
                    className="rounded p-1.5 text-neutral-300 hover:bg-red-50 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center justify-between rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
          <button onClick={() => setError('')}><X className="h-4 w-4" /></button>
        </div>
      )}
      {message && (
        <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
          <button onClick={() => setMessage('')}><X className="h-4 w-4" /></button>
        </div>
      )}

      <div className="flex gap-1 overflow-x-auto border-b border-neutral-200 pb-0">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`shrink-0 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-brand-orange text-brand-orange'
                : 'border-transparent text-navy-400 hover:text-navy-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        {activeTab === 'general' && (
          <div className="max-w-2xl space-y-4">
            <h3 className="mb-4 text-lg font-semibold text-navy-950">General Settings</h3>
            {renderField('companyName', 'Company Name')}
            {renderField('tagline', 'Tagline')}
            {renderField('logo', 'Logo URL', { placeholder: 'https://...' })}
            {renderField('favicon', 'Favicon URL', { placeholder: 'https://...' })}
            {renderField('address', 'Address (one line per line)', {
              type: 'textarea',
              placeholder: 'KUN Glass & Aluminium\nS. No. 349/2/3, Lohkare Mala, Nashik - 422003',
            })}
            {renderField('googleMapsUrl', 'Google Maps URL', {
              placeholder: 'https://www.google.com/maps/...',
            })}
          </div>
        )}

        {activeTab === 'hero' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-navy-950">Page Hero Images</h3>
              <p className="mt-1 text-sm text-neutral-500">
                These images control page-level heroes only. Project uploads stay attached to their project.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {([
                ['home', 'Home Hero'],
                ['about', 'About Hero'],
                ['services', 'Services Hero'],
                ['projects', 'Projects Hero'],
                ['clients', 'Clients Hero'],
                ['contact', 'Contact Hero'],
              ] as const).map(([key, label]) => (
                <div key={key} className="rounded-lg border border-neutral-200 p-4">
                  <h4 className="mb-1 text-sm font-semibold text-navy-950">{label}</h4>
                  <p className="mb-3 text-xs text-neutral-500">Used only on the {key} page.</p>
                  <ImagePicker
                    value={settings.heroImages?.[key] ?? ''}
                    onChange={(value) => updateSetting('heroImages', { ...settings.heroImages, [key]: value })}
                    altText={label}
                    label={label.toLowerCase()}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-navy-950">Contact Methods</h3>
              <Button
                variant="navy"
                size="sm"
                onClick={() => { setEditingContactId(null); setContactForm(EMPTY_CONTACT_FORM); setShowContactForm(true); }}
              >
                <Plus className="h-4 w-4" /> Add Method
              </Button>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {renderContactList('phone')}
              {renderContactList('whatsapp')}
            </div>
            {renderContactList('email')}

            {showContactForm && (
              <div className="mt-4 rounded-lg border border-brand-orange/20 bg-brand-orange/5 p-4">
                <h4 className="mb-4 text-sm font-semibold text-navy-950">
                  {editingContactId ? 'Edit Contact Method' : 'Add Contact Method'}
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Type">
                    <select
                      value={contactForm.type}
                      onChange={(e) => setContactForm({ ...contactForm, type: e.target.value })}
                      className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-orange"
                    >
                      <option value="phone">Phone</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="email">Email</option>
                    </select>
                  </FormField>
                  <FormField label="Value">
                    <input
                      type={contactForm.type === 'email' ? 'email' : 'tel'}
                      value={contactForm.value}
                      onChange={(e) => setContactForm({ ...contactForm, value: e.target.value })}
                      className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-orange"
                      placeholder={contactForm.type === 'email' ? 'name@example.com' : '9823097867'}
                    />
                  </FormField>
                  <FormField label="Label">
                    <input
                      type="text"
                      value={contactForm.label}
                      onChange={(e) => setContactForm({ ...contactForm, label: e.target.value })}
                      className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-orange"
                      placeholder="Office / Mobile / etc."
                    />
                  </FormField>
                  <FormField label="Display Order">
                    <input
                      type="number"
                      value={contactForm.displayOrder}
                      onChange={(e) => setContactForm({ ...contactForm, displayOrder: parseInt(e.target.value) || 0 })}
                      className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-orange"
                    />
                  </FormField>
                </div>
                <div className="mt-4 flex items-center gap-6">
                  <label className="flex items-center gap-2 text-sm text-navy-700">
                    <input
                      type="checkbox"
                      checked={contactForm.isPrimary}
                      onChange={(e) => setContactForm({ ...contactForm, isPrimary: e.target.checked })}
                      className="rounded border-neutral-300 text-brand-orange focus:ring-brand-orange"
                    />
                    Primary
                  </label>
                  <label className="flex items-center gap-2 text-sm text-navy-700">
                    <input
                      type="checkbox"
                      checked={contactForm.isActive}
                      onChange={(e) => setContactForm({ ...contactForm, isActive: e.target.checked })}
                      className="rounded border-neutral-300 text-brand-orange focus:ring-brand-orange"
                    />
                    Active
                  </label>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="navy"
                    size="sm"
                    onClick={editingContactId ? handleUpdateContact : handleCreateContact}
                    disabled={saving || !contactForm.value.trim()}
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingContactId ? 'Update' : 'Add'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setShowContactForm(false); setEditingContactId(null); setContactForm(EMPTY_CONTACT_FORM); }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'social' && (
          <div className="max-w-2xl space-y-4">
            <h3 className="mb-4 text-lg font-semibold text-navy-950">Social Media Links</h3>
            {renderField('facebookUrl', 'Facebook URL', { placeholder: 'https://facebook.com/...' })}
            {renderField('instagramUrl', 'Instagram URL', { placeholder: 'https://instagram.com/...' })}
            {renderField('linkedinUrl', 'LinkedIn URL', { placeholder: 'https://linkedin.com/...' })}
            {renderField('youtubeUrl', 'YouTube URL', { placeholder: 'https://youtube.com/...' })}
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="max-w-2xl space-y-4">
            <h3 className="mb-4 text-lg font-semibold text-navy-950">SEO Settings</h3>
            {renderField('seoTitle', 'Site Title', { placeholder: 'KUN Glass & Aluminium — Premium Solutions' })}
            {renderField('seoDescription', 'Meta Description', { type: 'textarea' })}
            {renderField('seoKeywords', 'Keywords (comma separated)', { type: 'comma' })}
            {renderField('ogImage', 'Open Graph Image URL', { type: 'text', placeholder: 'https://...' })}
            {renderField('googleVerification', 'Google Verification Code')}
            {renderField('robotsContent', 'Robots Content', { placeholder: 'index, follow' })}
          </div>
        )}

        {activeTab === 'whatsapp' && (
          <div className="max-w-2xl space-y-4">
            <h3 className="mb-4 text-lg font-semibold text-navy-950">WhatsApp Settings</h3>
            {renderField('whatsappEnabled', 'Enable WhatsApp Button', { type: 'toggle' })}
            {renderField('whatsappDefaultMessage', 'Default WhatsApp Message', {
              type: 'textarea',
              placeholder: 'Hello KUN Glass & Aluminium, I am interested in your services.',
            })}
          </div>
        )}

        {activeTab === 'footer' && (
          <div className="max-w-2xl space-y-4">
            <h3 className="mb-4 text-lg font-semibold text-navy-950">Footer Settings</h3>
            {renderField('footerDescription', 'Footer Description', { type: 'textarea' })}
            {renderField('copyrightText', 'Copyright Text', {
              type: 'text',
              placeholder: '© 2026 KUN Glass & Aluminium. All rights reserved.',
            })}
          </div>
        )}

        <div className="mt-6 border-t border-neutral-100 pt-4">
          <Button variant="navy" onClick={handleSettingsSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Settings
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={!!deletingContact}
        title="Delete Contact Method"
        message={`Are you sure you want to delete ${deletingContact?.value || 'this contact method'}? This cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDeleteContact}
        onCancel={() => setDeletingContact(null)}
        danger
      />
    </div>
  );
}