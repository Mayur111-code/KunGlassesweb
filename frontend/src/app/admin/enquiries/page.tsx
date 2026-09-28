'use client';

import { useEffect, useState, useCallback, type FormEvent } from 'react';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  Filter,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  X,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Modal } from '@/components/admin/Modal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { FormField } from '@/components/admin/FormField';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/admin/Table';
import { enquiriesApi } from '@/services';
import { getErrorMessage } from '@/lib/api';
import { formatDateTime, truncate } from '@/lib/utils';
import type { Enquiry, EnquiryStatus, Pagination } from '@/types';
import { ENQUIRY_STATUSES, PROJECT_CATEGORIES, SOURCES } from '@/types';

const STATUS_BADGE: Record<string, 'blue' | 'amber' | 'navy' | 'orange' | 'green' | 'red' | 'gray'> = {
  NEW: 'blue',
  CONTACTED: 'amber',
  IN_PROGRESS: 'navy',
  QUOTED: 'orange',
  CONVERTED: 'green',
  REJECTED: 'red',
  CLOSED: 'gray',
};

const EMPTY_FORM: Record<string, string> = {
  fullName: '',
  phone: '',
  email: '',
  company: '',
  serviceInterestedInName: '',
  message: '',
  preferredContactMethod: 'phone',
  location: '',
  source: 'website',
};

export default function AdminEnquiriesPage() {
  const [items, setItems] = useState<Enquiry[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState<Enquiry | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Record<string, string>>(EMPTY_FORM);
  const [note, setNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [followUpDate, setFollowUpDate] = useState('');

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      params.set('page', String(page));
      params.set('limit', '10');
      params.set('sort', '-createdAt');
      const res = await enquiriesApi.getAll(undefined, `?${params.toString()}`);
      setItems(res.data.items);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page, statusFilter]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter]);
  useEffect(() => { fetchItems(); }, [fetchItems]);

  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Phone', 'Email', 'Company', 'Service', 'Status', 'Created'];
    const rows = items.map((e) => [
      e._id,
      e.fullName,
      e.phone,
      e.email ?? '',
      e.company ?? '',
      (typeof e.serviceInterestedInName === 'string' ? e.serviceInterestedInName : (e.serviceInterestedIn as { title?: string })?.title) ?? '',
      e.status,
      e.createdAt,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const openDetail = async (enquiry: Enquiry) => {
    try {
      const res = await enquiriesApi.get(enquiry._id);
      setSelected(res.data.enquiry);
      setDetailOpen(true);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const openEdit = (enquiry: Enquiry) => {
    setForm({
      fullName: enquiry.fullName,
      phone: enquiry.phone,
      email: enquiry.email ?? '',
      company: enquiry.company ?? '',
      serviceInterestedInName: enquiry.serviceInterestedInName ?? '',
      message: enquiry.message,
      preferredContactMethod: enquiry.preferredContactMethod,
      location: enquiry.location ?? '',
      source: enquiry.source ?? 'website',
    });
    setFollowUpDate(enquiry.followUpDate ?? '');
    setEditOpen(true);
  };

  const handleEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    try {
      await enquiriesApi.update(selected._id, {
        ...form,
        followUpDate: followUpDate || undefined,
      } as unknown as Partial<Enquiry>);
      setMessage('Enquiry updated');
      setEditOpen(false);
      fetchItems();
      if (detailOpen) {
        const res = await enquiriesApi.get(selected._id);
        setSelected(res.data.enquiry);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleStatus = async (enquiryId: string, status: EnquiryStatus) => {
    try {
      await enquiriesApi.updateStatus(enquiryId, status);
      setMessage(`Status changed to ${status}`);
      fetchItems();
      if (selected && selected._id === enquiryId) {
        const res = await enquiriesApi.get(enquiryId);
        setSelected(res.data.enquiry);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleAddNote = async () => {
    if (!selected || !note.trim()) return;
    setAddingNote(true);
    try {
      const res = await enquiriesApi.addNote(selected._id, note.trim());
      setSelected(res.data.enquiry);
      setNote('');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setAddingNote(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await enquiriesApi.remove(deleting._id);
      setMessage('Enquiry deleted');
      setDeleting(null);
      fetchItems();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const getServiceName = (e: Enquiry) => {
    if (typeof e.serviceInterestedInName === 'string' && e.serviceInterestedInName) return e.serviceInterestedInName;
    if (e.serviceInterestedIn && typeof e.serviceInterestedIn === 'object') return e.serviceInterestedIn.title;
    return '';
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center justify-between">
          {error}
          <button onClick={() => setError('')}><X className="h-4 w-4" /></button>
        </div>
      )}
      {message && (
        <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700 flex items-center justify-between">
          {message}
          <button onClick={() => setMessage('')}><X className="h-4 w-4" /></button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search enquiries..."
              className="w-full rounded-lg border border-neutral-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
            />
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={exportCSV}>
          Export CSV
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setStatusFilter('ALL')}
          className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
            statusFilter === 'ALL' ? 'bg-navy-900 text-white' : 'bg-neutral-100 text-navy-600 hover:bg-neutral-200'
          }`}
        >
          All
        </button>
        {ENQUIRY_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              statusFilter === s ? 'bg-navy-900 text-white' : 'bg-neutral-100 text-navy-600 hover:bg-neutral-200'
            }`}
          >
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
            <MessageSquare className="h-10 w-10 mb-3" />
            <p className="text-sm">No enquiries found</p>
          </div>
        ) : (
          <Table>
            <TableHead>
              <tr>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="hidden px-4 py-3 font-medium lg:table-cell">Email</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Service</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Date</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </TableHead>
            <TableBody>
              {items.map((enquiry) => (
                <TableRow key={enquiry._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-100 text-xs font-semibold text-navy-700">
                        {enquiry.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-navy-950 text-sm">{enquiry.fullName}</p>
                        {enquiry.company && <p className="text-xs text-neutral-400">{enquiry.company}</p>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><span className="text-sm text-navy-700">{enquiry.phone}</span></TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className="text-sm text-neutral-500">{enquiry.email || '—'}</span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-sm text-neutral-500">{truncate(getServiceName(enquiry) || '—', 20)}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_BADGE[enquiry.status]}>{enquiry.status}</Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="text-xs text-neutral-400">{formatDateTime(enquiry.createdAt)}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openDetail(enquiry)}
                        className="rounded p-1.5 text-navy-400 hover:bg-navy-50 hover:text-navy-700"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => { setSelected(enquiry); openEdit(enquiry); }}
                        className="rounded p-1.5 text-navy-400 hover:bg-navy-50 hover:text-navy-700"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleting(enquiry)}
                        className="rounded p-1.5 text-neutral-300 hover:bg-red-50 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-neutral-400">
            Page {pagination.page} of {pagination.totalPages} — {pagination.total} total
          </p>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title="Enquiry Details" maxWidth="max-w-3xl">
        {selected && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-neutral-400 mb-1">Name</p>
                <p className="text-sm font-medium text-navy-950">{selected.fullName}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-1">Phone</p>
                <p className="text-sm font-medium text-navy-950">{selected.phone}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-1">Email</p>
                <p className="text-sm text-navy-700">{selected.email || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-1">Company</p>
                <p className="text-sm text-navy-700">{selected.company || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-1">Service</p>
                <p className="text-sm text-navy-700">{getServiceName(selected) || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-1">Source</p>
                <p className="text-sm text-navy-700 capitalize">{selected.source}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-1">Preferred Contact</p>
                <p className="text-sm text-navy-700 capitalize">{selected.preferredContactMethod}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-1">Created</p>
                <p className="text-sm text-navy-700">{formatDateTime(selected.createdAt)}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-neutral-400 mb-1">Message</p>
              <p className="text-sm text-navy-700 whitespace-pre-wrap bg-neutral-50 rounded-lg p-3">{selected.message}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-navy-950 mb-3">Status</p>
              <div className="flex flex-wrap gap-2">
                {ENQUIRY_STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatus(selected._id, s)}
                    disabled={selected.status === s}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                      selected.status === s
                        ? 'bg-brand-orange text-white'
                        : 'bg-neutral-100 text-navy-600 hover:bg-neutral-200'
                    }`}
                  >
                    {s.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-navy-950 mb-3">Follow-up Date</p>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={selected.followUpDate ? new Date(selected.followUpDate).toISOString().split('T')[0] : ''}
                  onChange={async (e) => {
                    if (!e.target.value) return;
                    try {
                      await enquiriesApi.update(selected._id, { followUpDate: e.target.value } as unknown as Partial<Enquiry>);
                      const res = await enquiriesApi.get(selected._id);
                      setSelected(res.data.enquiry);
                      setMessage('Follow-up date updated');
                    } catch (err) { setError(getErrorMessage(err)); }
                  }}
                  className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                />
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-navy-950 mb-3">Notes</p>
              <div className="space-y-3 mb-3">
                {(selected.notes ?? []).map((n, i) => (
                  <div key={n._id ?? i} className="rounded-lg bg-neutral-50 p-3">
                    <p className="text-sm text-navy-700 whitespace-pre-wrap">{n.note}</p>
                    <p className="text-xs text-neutral-400 mt-1">
                      {typeof n.addedBy === 'object' && n.addedBy ? n.addedBy.name : 'Admin'} — {formatDateTime(n.createdAt)}
                    </p>
                  </div>
                ))}
                {(!selected.notes || selected.notes.length === 0) && (
                  <p className="text-xs text-neutral-400">No notes yet</p>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note..."
                  className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                  onKeyDown={(e) => { if (e.key === 'Enter' && note.trim()) handleAddNote(); }}
                />
                <Button variant="navy" size="sm" onClick={handleAddNote} disabled={!note.trim() || addingNote}>
                  {addingNote ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add'}
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
              <Button variant="ghost" size="sm" onClick={() => { setDetailOpen(false); openEdit(selected); }}>
                <Pencil className="h-4 w-4" /> Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { setDetailOpen(false); setDeleting(selected); }} className="text-red-600 hover:bg-red-50 hover:text-red-700">
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title={selected ? 'Edit Enquiry' : 'New Enquiry'} maxWidth="max-w-2xl">
        <form onSubmit={handleEdit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Full Name">
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                required
              />
            </FormField>
            <FormField label="Phone">
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                required
              />
            </FormField>
            <FormField label="Email">
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
              />
            </FormField>
            <FormField label="Company">
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
              />
            </FormField>
            <FormField label="Service">
              <input
                type="text"
                value={form.serviceInterestedInName}
                onChange={(e) => setForm({ ...form, serviceInterestedInName: e.target.value })}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
              />
            </FormField>
            <FormField label="Source">
              <select
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
              >
                {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
            <FormField label="Preferred Contact Method">
              <select
                value={form.preferredContactMethod}
                onChange={(e) => setForm({ ...form, preferredContactMethod: e.target.value })}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
              >
                <option value="phone">Phone</option>
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </FormField>
            <FormField label="Location">
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
              />
            </FormField>
          </div>
          <FormField label="Message">
            <textarea
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
              required
            />
          </FormField>
          <FormField label="Follow-up Date">
            <input
              type="date"
              value={followUpDate ? new Date(followUpDate).toISOString().split('T')[0] : ''}
              onChange={(e) => setFollowUpDate(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
            />
          </FormField>
          <div className="flex justify-end gap-2 pt-4 border-t border-neutral-100">
            <Button variant="ghost" size="sm" type="button" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button variant="navy" size="sm" type="submit" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title="Delete Enquiry"
        message={`Are you sure you want to permanently delete the enquiry from "${deleting?.fullName}"? This cannot be undone.`}
        confirmText="Delete Permanently"
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        danger
      />
    </div>
  );
}