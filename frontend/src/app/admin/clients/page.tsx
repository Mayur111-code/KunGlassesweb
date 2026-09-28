'use client';

import { useEffect, useState, useCallback, type FormEvent } from 'react';
import { Plus, Search, Pencil, Trash2, Eye, EyeOff, Star, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Modal } from '@/components/admin/Modal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { FormField } from '@/components/admin/FormField';
import { ImagePicker } from '@/components/admin/ImagePicker';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/admin/Table';
import { clientsApi } from '@/services';
import { getErrorMessage } from '@/lib/api';
import { getImageUrl, slugify, truncate } from '@/lib/utils';
import type { Client, Pagination } from '@/types';

const emptyForm = {
  name: '',
  logo: '',
  description: '',
  websiteUrl: '',
  category: '',
  location: '',
  projectDescription: '',
  displayOrder: 0,
  isFeatured: false,
  isActive: true,
};

export default function AdminClientsPage() {
  const [items, setItems] = useState<Client[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [deleting, setDeleting] = useState<Client | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      params.set('page', String(page));
      params.set('limit', '10');
      const query = `?${params.toString()}`;
      const res = await clientsApi.getAdmin(undefined, query);
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

  const openEdit = (client: Client) => {
    setEditing(client);
    setForm({
      name: client.name,
      logo: getImageUrl(client.logo),
      description: client.description ?? '',
      websiteUrl: client.websiteUrl ?? '',
      category: client.category ?? '',
      location: client.location ?? '',
      projectDescription: client.projectDescription ?? '',
      displayOrder: client.displayOrder,
      isFeatured: client.isFeatured,
      isActive: client.isActive,
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
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
        name: form.name.trim(),
        slug: slugify(form.name),
        logo: form.logo || undefined,
        description: form.description || undefined,
        websiteUrl: form.websiteUrl || undefined,
        category: form.category || undefined,
        location: form.location || undefined,
        projectDescription: form.projectDescription || undefined,
        displayOrder: Number(form.displayOrder) || 0,
        isFeatured: form.isFeatured,
        isActive: form.isActive,
      };
      if (editing) {
        await clientsApi.update(editing._id, payload);
        setMessage('Client updated successfully');
      } else {
        await clientsApi.create(payload);
        setMessage('Client created successfully');
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
      await clientsApi.remove(deleting._id);
      setDeleting(null);
      setMessage('Client deleted');
      fetchItems();
    } catch (err) {
      setDeleting(null);
      setMessage(getErrorMessage(err));
    }
  };

  const handleToggleActive = async (client: Client) => {
    try {
      await clientsApi.update(client._id, { isActive: !client.isActive });
      fetchItems();
    } catch (err) {
      setMessage(getErrorMessage(err));
    }
  };

  const handleToggleFeatured = async (client: Client) => {
    try {
      await clientsApi.update(client._id, { isFeatured: !client.isFeatured });
      fetchItems();
    } catch (err) {
      setMessage(getErrorMessage(err));
    }
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
            placeholder="Search clients..."
            className="w-full rounded-lg border border-neutral-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
          />
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add Client
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-lg border border-neutral-200 bg-white py-16 text-center">
          <p className="text-sm text-neutral-400">No clients found</p>
        </div>
      ) : (
        <>
          <Table>
            <TableHead>
              <tr>
                <th className="px-4 py-3 font-medium">Logo</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Featured</th>
                <th className="px-4 py-3 font-medium">Active</th>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </TableHead>
            <TableBody>
              {items.map((client) => (
                <TableRow key={client._id}>
                  <TableCell>
                    {client.logo ? (
                      <img
                        src={getImageUrl(client.logo)}
                        alt={client.name}
                        className="h-10 w-14 rounded-md object-contain"
                      />
                    ) : (
                      <div className="flex h-10 w-14 items-center justify-center rounded-md bg-neutral-100 text-xs font-bold text-neutral-400">
                        {client.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-navy-950">{client.name}</TableCell>
                  <TableCell className="text-neutral-500">{client.category || '—'}</TableCell>
                  <TableCell className="text-neutral-500">{client.location || '—'}</TableCell>
                  <TableCell>
                    <Badge variant={client.isFeatured ? 'orange' : 'gray'}>
                      {client.isFeatured ? 'Featured' : 'No'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={client.isActive ? 'green' : 'red'}>
                      {client.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>{client.displayOrder}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleToggleActive(client)}
                        className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-navy-900"
                        title={client.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {client.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleToggleFeatured(client)}
                        className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-navy-900"
                        title={client.isFeatured ? 'Unfeature' : 'Feature'}
                      >
                        <Star
                          className={`h-4 w-4 ${client.isFeatured ? 'fill-brand-orange text-brand-orange' : ''}`}
                        />
                      </button>
                      <button
                        onClick={() => openEdit(client)}
                        className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-navy-900"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleting(client)}
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
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage(page + 1)}
                >
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
        title={editing ? 'Edit Client' : 'Add Client'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Name" error={formErrors.name}>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
                placeholder="Client name"
              />
            </FormField>
            <FormField label="Category">
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputClass}
                placeholder="e.g. Retail, Office"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Logo" hint="Upload a logo or use a validated external URL.">
              <ImagePicker value={form.logo} onChange={(logo) => setForm({ ...form, logo })} altText={form.name} label="client logo" />
            </FormField>
            <FormField label="Website URL">
              <input
                value={form.websiteUrl}
                onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
                className={inputClass}
                placeholder="https://client.com"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Location">
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className={inputClass}
                placeholder="e.g. Delhi NCR"
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

          <FormField label="Description">
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={`${inputClass} min-h-[80px]`}
              placeholder="Short client description"
            />
          </FormField>

          <FormField label="Project Description">
            <textarea
              value={form.projectDescription}
              onChange={(e) => setForm({ ...form, projectDescription: e.target.value })}
              className={`${inputClass} min-h-[80px]`}
              placeholder="Description of work done for this client"
            />
          </FormField>

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
              {editing ? 'Update Client' : 'Create Client'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title="Delete Client"
        message={`Are you sure you want to delete "${deleting?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
