'use client';

import { useEffect, useState, useCallback, type FormEvent } from 'react';
import { Plus, Search, Pencil, Trash2, Loader2, Shield, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Modal } from '@/components/admin/Modal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { FormField } from '@/components/admin/FormField';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/admin/Table';
import { usersApi } from '@/services';
import { getErrorMessage } from '@/lib/api';
import { formatDateTime, getInitials } from '@/lib/utils';
import type { User, Pagination, Role } from '@/types';
import { ROLES_LIST } from '@/types';

const ROLE_BADGE: Record<string, 'navy' | 'orange' | 'gray'> = {
  SUPER_ADMIN: 'navy',
  ADMIN: 'orange',
  EDITOR: 'gray',
};

interface FormState {
  name: string;
  email: string;
  password: string;
  role: Role;
  isActive: boolean;
}

const EMPTY_FORM: FormState = { name: '', email: '', password: '', role: 'EDITOR', isActive: true };

export default function AdminUsersPage() {
  const [items, setItems] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [deactivating, setDeactivating] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      params.set('page', String(page));
      params.set('limit', '10');
      const res = await usersApi.getAll(undefined, `?${params.toString()}`);
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
  useEffect(() => { setPage(1); }, [debouncedSearch]);
  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (user: User) => {
    setEditing(user);
    setForm({ name: user.name, email: user.email, password: '', role: user.role, isActive: user.isActive });
    setFormErrors({});
    setModalOpen(true);
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    if (!editing && form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      if (editing) {
        await usersApi.update(editing._id, {
          name: form.name,
          email: form.email,
          role: form.role,
          isActive: form.isActive,
          ...(form.password
            ? ({ password: form.password } as unknown as Partial<User>)
            : {}),
        });
        setMessage('User updated');
      } else {
        await usersApi.create({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
          isActive: form.isActive,
        } as unknown as Partial<User>);
        setMessage('User created');
      }
      setModalOpen(false);
      fetchItems();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async () => {
    if (!deactivating) return;
    try {
      await usersApi.remove(deactivating._id);
      setMessage('User deactivated');
      setDeactivating(null);
      fetchItems();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

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

      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-[200px] flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full rounded-lg border border-neutral-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
            />
          </div>
        </div>
        <Button variant="navy" size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add User
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Spinner /></div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
            <Shield className="mb-3 h-10 w-10" />
            <p className="text-sm">No users found</p>
          </div>
        ) : (
          <Table>
            <TableHead>
              <tr>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Last Login</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </TableHead>
            <TableBody>
              {items.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-900 text-xs font-semibold text-white">
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-navy-950">{user.name}</p>
                        <p className="text-xs text-neutral-400">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={ROLE_BADGE[user.role]}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? 'green' : 'gray'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-xs text-neutral-400">{formatDateTime(user.lastLogin)}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(user)}
                        className="rounded p-1.5 text-navy-400 hover:bg-navy-50 hover:text-navy-700"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      {user.isActive && (
                        <button
                          onClick={() => setDeactivating(user)}
                          className="rounded p-1.5 text-neutral-300 hover:bg-red-50 hover:text-red-600"
                          title="Deactivate"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-8 w-8 rounded-lg text-xs font-semibold transition-colors ${
                p === page ? 'bg-brand-orange text-white' : 'bg-neutral-100 text-navy-600 hover:bg-neutral-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit User' : 'Add User'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Name" error={formErrors.name}>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
            />
          </FormField>
          <FormField label="Email" error={formErrors.email}>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
            />
          </FormField>
          <FormField label={editing ? 'New Password (leave blank to keep current)' : 'Password'} error={formErrors.password}>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
              placeholder={editing ? '••••••••' : 'Minimum 6 characters'}
            />
          </FormField>
          <FormField label="Role">
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-orange"
            >
              {ROLES_LIST.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </FormField>
          <FormField label="Status">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-navy-700">
                <input
                  type="radio"
                  checked={form.isActive}
                  onChange={() => setForm({ ...form, isActive: true })}
                  className="rounded border-neutral-300 text-brand-orange"
                />
                Active
              </label>
              <label className="flex items-center gap-2 text-sm text-navy-700">
                <input
                  type="radio"
                  checked={!form.isActive}
                  onChange={() => setForm({ ...form, isActive: false })}
                  className="rounded border-neutral-300 text-brand-orange"
                />
                Inactive
              </label>
            </div>
          </FormField>
          <div className="flex justify-end gap-2 border-t border-neutral-100 pt-4">
            <Button variant="ghost" size="sm" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="navy" size="sm" type="submit" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editing ? 'Save Changes' : 'Create User'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deactivating}
        title="Deactivate User"
        message={`Are you sure you want to deactivate "${deactivating?.name}"? They will not be able to log in until reactivated.`}
        confirmText="Deactivate"
        onConfirm={handleDeactivate}
        onCancel={() => setDeactivating(null)}
        danger
      />
    </div>
  );
}