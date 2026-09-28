'use client';

import { useEffect, useState, useCallback, type FormEvent } from 'react';
import { Plus, Search, Pencil, Trash2, Eye, EyeOff, Check, Image as ImageIcon, X, Loader2, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Modal } from '@/components/admin/Modal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { FormField } from '@/components/admin/FormField';
import { ImageGalleryPicker, ImagePicker } from '@/components/admin/ImagePicker';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/admin/Table';
import { servicesApi } from '@/services';
import { getErrorMessage } from '@/lib/api';
import { getImageUrl, slugify, truncate } from '@/lib/utils';
import type { Service, ServiceSpecification, Pagination } from '@/types';

const emptyForm = {
  title: '',
  shortDescription: '',
  description: '',
  featuredImage: '',
  gallery: [] as string[],
  features: [] as string[],
  specifications: [] as ServiceSpecification[],
  isActive: true,
  isFeatured: false,
  displayOrder: 0,
  seoTitle: '',
  seoDescription: '',
};

export default function AdminServicesPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [newFeature, setNewFeature] = useState('');
  const [newSpec, setNewSpec] = useState({ label: '', value: '' });

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      params.set('page', String(page));
      params.set('limit', '10');
      const query = `?${params.toString()}`;
      const res = await servicesApi.getAdmin(undefined, query);
      setItems(res.data.items);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (service: Service) => {
    setEditing(service);
    setForm({
      title: service.title,
      shortDescription: service.shortDescription,
      description: service.description,
      featuredImage: getImageUrl(service.featuredImage),
      gallery: (service.gallery ?? []).map((image) => getImageUrl(image)),
      features: service.features ?? [],
      specifications: service.specifications ?? [],
      isActive: service.isActive,
      isFeatured: service.isFeatured,
      displayOrder: service.displayOrder,
      seoTitle: service.seoTitle ?? '',
      seoDescription: service.seoDescription ?? '',
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.shortDescription.trim()) errs.shortDescription = 'Short description is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setMessage('');
    try {
      const payload = {
        title: form.title.trim(),
        slug: slugify(form.title),
        shortDescription: form.shortDescription.trim(),
        description: form.description,
        featuredImage: form.featuredImage || undefined,
        gallery: form.gallery.filter(Boolean),
        features: form.features.filter(Boolean),
        specifications: form.specifications,
        isActive: form.isActive,
        isFeatured: form.isFeatured,
        displayOrder: Number(form.displayOrder) || 0,
        seoTitle: form.seoTitle || undefined,
        seoDescription: form.seoDescription || undefined,
      };
      if (editing) {
        await servicesApi.update(editing._id, payload);
        setMessage('Service updated successfully');
      } else {
        await servicesApi.create(payload);
        setMessage('Service created successfully');
      }
      setModalOpen(false);
      fetchItems();
    } catch (err) {
      setMessage(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setMessage('');
    try {
      await servicesApi.remove(deleting._id);
      setDeleting(null);
      setMessage('Service deleted');
      fetchItems();
    } catch (err) {
      setDeleting(null);
      setMessage(getErrorMessage(err));
    }
  };

  const handleToggleActive = async (service: Service) => {
    try {
      await servicesApi.update(service._id, { isActive: !service.isActive });
      fetchItems();
    } catch (err) {
      setMessage(getErrorMessage(err));
    }
  };

  const handleToggleFeatured = async (service: Service) => {
    try {
      await servicesApi.update(service._id, { isFeatured: !service.isFeatured });
      fetchItems();
    } catch (err) {
      setMessage(getErrorMessage(err));
    }
  };

  const addFeature = () => {
    if (!newFeature.trim()) return;
    setForm({ ...form, features: [...form.features, newFeature.trim()] });
    setNewFeature('');
  };

  const removeFeature = (index: number) => {
    setForm({ ...form, features: form.features.filter((_, i) => i !== index) });
  };


  const addSpec = () => {
    if (!newSpec.label.trim() || !newSpec.value.trim()) return;
    setForm({
      ...form,
      specifications: [...form.specifications, { label: newSpec.label.trim(), value: newSpec.value.trim() }],
    });
    setNewSpec({ label: '', value: '' });
  };

  const removeSpec = (index: number) => {
    setForm({ ...form, specifications: form.specifications.filter((_, i) => i !== index) });
  };

  const inputClass =
    'w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-navy-950 outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20';

  return (
    <div className="space-y-6">
      {message && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
          <Button variant="outline" size="sm" className="mt-2" onClick={fetchItems}>
            Retry
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services..."
            className="w-full rounded-lg border border-neutral-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
          />
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add Service
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-lg border border-neutral-200 bg-white py-16 text-center">
          <p className="text-sm text-neutral-400">No services found</p>
        </div>
      ) : (
        <>
          <Table>
            <TableHead>
              <tr>
                <th className="px-4 py-3 font-medium">Image</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Featured</th>
                <th className="px-4 py-3 font-medium">Active</th>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </TableHead>
            <TableBody>
              {items.map((service) => (
                <TableRow key={service._id}>
                  <TableCell>
                    {service.featuredImage ? (
                      <img
                        src={getImageUrl(service.featuredImage)}
                        alt={service.title}
                        className="h-10 w-14 rounded-md object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-14 items-center justify-center rounded-md bg-neutral-100">
                        <ImageIcon className="h-4 w-4 text-neutral-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-navy-950">{service.title}</TableCell>
                  <TableCell className="text-neutral-500">{service.slug}</TableCell>
                  <TableCell>
                    <Badge variant={service.isFeatured ? 'orange' : 'gray'}>
                      {service.isFeatured ? 'Featured' : 'No'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={service.isActive ? 'green' : 'red'}>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>{service.displayOrder}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleToggleActive(service)}
                        className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-navy-900"
                        title={service.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {service.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleToggleFeatured(service)}
                        className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-navy-900"
                        title={service.isFeatured ? 'Unfeature' : 'Feature'}
                      >
                        {service.isFeatured ? <Check className="h-4 w-4 text-brand-orange" /> : <Star className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => openEdit(service)}
                        className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-navy-900"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleting(service)}
                        className="rounded-lg p-2 text-neutral-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between text-sm">
              <p className="text-neutral-500">
                Showing {pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1}–
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled={page >= pagination.totalPages} onClick={() => setPage(page + 1)}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Service' : 'Add Service'}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Title" error={formErrors.title}>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputClass}
                placeholder="Aluminium Sliding Windows"
              />
            </FormField>
            <FormField label="Display Order">
              <input
                type="number"
                value={form.displayOrder}
                onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
                className={inputClass}
              />
            </FormField>
          </div>

          <FormField label="Short Description" error={formErrors.shortDescription}>
            <textarea
              value={form.shortDescription}
              onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
              className={`${inputClass} min-h-[80px]`}
              placeholder="Brief summary shown on cards"
            />
          </FormField>

          <FormField label="Description" error={formErrors.description}>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={`${inputClass} min-h-[160px]`}
              placeholder="Full service description"
            />
          </FormField>

          <FormField label="Featured Image" hint="Upload a file or use a validated external URL.">
            <ImagePicker value={form.featuredImage} onChange={(featuredImage) => setForm({ ...form, featuredImage })} altText={form.title} label="featured image" />
          </FormField>

          <FormField label="Gallery">
            <ImageGalleryPicker images={form.gallery} onChange={(gallery) => setForm({ ...form, gallery })} altText={form.title} />
          </FormField>

          <FormField label="Features">
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
                  className={inputClass}
                  placeholder="e.g. Thermal break profile"
                />
                <Button variant="outline" size="md" onClick={addFeature}>
                  Add
                </Button>
              </div>
              {form.features.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.features.map((feature, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-navy-50 px-3 py-1 text-xs text-navy-800">
                      {feature}
                      <button type="button" onClick={() => removeFeature(i)} className="text-neutral-400 hover:text-red-600">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </FormField>

          <FormField label="Specifications">
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  value={newSpec.label}
                  onChange={(e) => setNewSpec({ ...newSpec, label: e.target.value })}
                  className={inputClass}
                  placeholder="Label e.g. Glass thickness"
                />
                <input
                  value={newSpec.value}
                  onChange={(e) => setNewSpec({ ...newSpec, value: e.target.value })}
                  className={inputClass}
                  placeholder="Value e.g. 6mm"
                />
                <Button variant="outline" size="md" onClick={addSpec}>
                  Add
                </Button>
              </div>
              {form.specifications.length > 0 && (
                <div className="space-y-2">
                  {form.specifications.map((spec, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-lg border border-neutral-200 p-2 text-sm">
                      <span className="font-medium text-navy-950">{spec.label}</span>
                      <span className="text-neutral-400">:</span>
                      <span className="flex-1 text-neutral-600">{spec.value}</span>
                      <button
                        type="button"
                        onClick={() => removeSpec(i)}
                        className="rounded p-1 text-neutral-400 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FormField>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormField label="SEO Title" hint={truncate(form.seoTitle, 60) || 'Optional'}>
              <input
                value={form.seoTitle}
                onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                className={inputClass}
              />
            </FormField>
            <FormField label="SEO Description">
              <textarea
                value={form.seoDescription}
                onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                className={`${inputClass} min-h-[60px]`}
              />
            </FormField>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-navy-900">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="h-4 w-4 rounded border-neutral-300 text-brand-orange focus:ring-brand-orange"
              />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm text-navy-900">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                className="h-4 w-4 rounded border-neutral-300 text-brand-orange focus:ring-brand-orange"
              />
              Featured
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t border-neutral-100 pt-4">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {editing ? 'Update Service' : 'Create Service'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title="Delete Service"
        message={`Are you sure you want to delete "${deleting?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
