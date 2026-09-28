'use client';

import { useEffect, useState, useCallback, type FormEvent } from 'react';
import { Plus, Search, Pencil, Trash2, Eye, EyeOff, Check, Image as ImageIcon, X, Loader2, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Modal } from '@/components/admin/Modal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { FormField } from '@/components/admin/FormField';
import { ImageGalleryPicker } from '@/components/admin/ImagePicker';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/admin/Table';
import { projectsApi } from '@/services';
import { getErrorMessage } from '@/lib/api';
import { getImageUrl, slugify } from '@/lib/utils';
import type { Project, Pagination } from '@/types';
import { PROJECT_CATEGORIES } from '@/types';

const emptyForm = {
  title: '',
  clientName: '',
  location: '',
  category: PROJECT_CATEGORIES[0],
  serviceName: '',
  description: '',
  images: [] as string[],
  completionYear: '' as string,
  featured: false,
  isActive: true,
  displayOrder: 0,
};

export default function AdminProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (categoryFilter) params.set('category', categoryFilter);
      if (activeFilter) params.set('isActive', activeFilter);
      params.set('page', String(page));
      params.set('limit', '10');
      const query = `?${params.toString()}`;
      const res = await projectsApi.getAdmin(undefined, query);
      setItems(res.data.items);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, categoryFilter, activeFilter, page]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, categoryFilter, activeFilter]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditing(project);
    setForm({
      title: project.title,
      clientName: project.clientName,
      location: project.location,
      category: project.category,
      serviceName: project.serviceName,
      description: project.description,
      images: (project.images ?? []).map((image) => getImageUrl(image)),
      completionYear: project.completionYear ? String(project.completionYear) : '',
      featured: project.featured,
      isActive: project.isActive,
      displayOrder: project.displayOrder,
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.clientName.trim()) errs.clientName = 'Client name is required';
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
        clientName: form.clientName.trim(),
        location: form.location.trim(),
        category: form.category,
        serviceName: form.serviceName.trim(),
        description: form.description,
        images: form.images.filter(Boolean),
        completionYear: form.completionYear ? Number(form.completionYear) : undefined,
        featured: form.featured,
        isActive: form.isActive,
        displayOrder: Number(form.displayOrder) || 0,
      };
      if (editing) {
        await projectsApi.update(editing._id, payload);
        setMessage('Project updated successfully');
      } else {
        await projectsApi.create(payload);
        setMessage('Project created successfully');
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
      await projectsApi.remove(deleting._id);
      setDeleting(null);
      setMessage('Project deleted');
      fetchItems();
    } catch (err) {
      setDeleting(null);
      setMessage(getErrorMessage(err));
    }
  };

  const handleToggleActive = async (project: Project) => {
    try {
      await projectsApi.update(project._id, { isActive: !project.isActive });
      fetchItems();
    } catch (err) {
      setMessage(getErrorMessage(err));
    }
  };

  const handleToggleFeatured = async (project: Project) => {
    try {
      await projectsApi.update(project._id, { featured: !project.featured });
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

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full rounded-lg border border-neutral-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-orange sm:w-52"
          >
            <option value="">All Categories</option>
            {PROJECT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-orange sm:w-40"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add Project
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-lg border border-neutral-200 bg-white py-16 text-center">
          <p className="text-sm text-neutral-400">No projects found</p>
        </div>
      ) : (
        <>
          <Table>
            <TableHead>
              <tr>
                <th className="px-4 py-3 font-medium">Image</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Year</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </TableHead>
            <TableBody>
              {items.map((project) => (
                <TableRow key={project._id}>
                  <TableCell>
                    {project.images?.[0] ? (
                      <img
                        src={getImageUrl(project.images[0])}
                        alt={project.title}
                        className="h-10 w-14 rounded-md object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-14 items-center justify-center rounded-md bg-neutral-100">
                        <ImageIcon className="h-4 w-4 text-neutral-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-navy-950">{project.title}</TableCell>
                  <TableCell className="text-neutral-500">{project.clientName}</TableCell>
                  <TableCell>
                    <Badge variant="navy">{project.category}</Badge>
                  </TableCell>
                  <TableCell>{project.completionYear ?? '—'}</TableCell>
                  <TableCell>
                    <Badge variant={project.isActive ? 'green' : 'red'}>
                      {project.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleToggleActive(project)}
                        className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-navy-900"
                        title={project.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {project.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleToggleFeatured(project)}
                        className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-navy-900"
                        title={project.featured ? 'Unfeature' : 'Feature'}
                      >
                        {project.featured ? (
                          <Check className="h-4 w-4 text-brand-orange" />
                        ) : (
                          <Star className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => openEdit(project)}
                        className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-navy-900"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleting(project)}
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
        title={editing ? 'Edit Project' : 'Add Project'}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Title" error={formErrors.title}>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputClass}
                placeholder="Aluminium facade for corporate office"
              />
            </FormField>
            <FormField label="Client Name" error={formErrors.clientName}>
              <input
                value={form.clientName}
                onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                className={inputClass}
                placeholder="Client name"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Location">
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className={inputClass}
                placeholder="Mumbai, Maharashtra"
              />
            </FormField>
            <FormField label="Category">
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputClass}
              >
                {PROJECT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormField label="Service">
              <input
                value={form.serviceName}
                onChange={(e) => setForm({ ...form, serviceName: e.target.value })}
                className={inputClass}
                placeholder="e.g. Window Installation"
              />
            </FormField>
            <FormField label="Completion Year">
              <input
                type="number"
                value={form.completionYear}
                onChange={(e) => setForm({ ...form, completionYear: e.target.value })}
                className={inputClass}
                placeholder="2025"
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

          <FormField label="Description" error={formErrors.description}>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={`${inputClass} min-h-[120px]`}
              placeholder="Project description"
            />
          </FormField>

          <FormField label="Project Images" hint="These images belong only to this project. The first image is used as its cover; mix uploaded images and external HTTPS URLs, then reorder before saving.">
            <ImageGalleryPicker images={form.images} onChange={(images) => setForm({ ...form, images })} altText={form.title} />
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
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
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
              {editing ? 'Update Project' : 'Create Project'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleting?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
