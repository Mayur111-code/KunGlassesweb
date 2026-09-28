'use client';

import { useEffect, useState, useCallback } from 'react';
import { Filter, ChevronLeft, ChevronRight, Activity, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { activityApi } from '@/services';
import { getErrorMessage } from '@/lib/api';
import { formatDateTime } from '@/lib/utils';
import type { ActivityLog, Pagination } from '@/types';

const ACTION_COLORS: Record<string, 'blue' | 'green' | 'orange' | 'red' | 'amber' | 'gray' | 'navy'> = {
  LOGIN: 'green',
  LOGIN_SUCCESS: 'green',
  UPDATE_SETTINGS: 'amber',
  CREATE: 'blue',
  UPDATE: 'blue',
  DELETE: 'red',
};

const ACTION_LABELS: Record<string, string> = {
  LOGIN: 'Login',
  LOGIN_SUCCESS: 'Login',
  LOGIN_FAILED: 'Failed Login',
  LOGOUT: 'Logout',
  CREATE_SERVICE: 'Create Service',
  UPDATE_SERVICE: 'Update Service',
  DELETE_SERVICE: 'Delete Service',
  CREATE_PROJECT: 'Create Project',
  UPDATE_PROJECT: 'Update Project',
  DELETE_PROJECT: 'Delete Project',
  CREATE_CLIENT: 'Create Client',
  UPDATE_CLIENT: 'Update Client',
  DELETE_CLIENT: 'Delete Client',
  CREATE_ENQUIRY: 'Create Enquiry',
  UPDATE_ENQUIRY: 'Update Enquiry',
  DELETE_ENQUIRY: 'Delete Enquiry',
  UPDATE_SETTINGS: 'Update Settings',
  UPLOAD_MEDIA: 'Upload Media',
  DELETE_MEDIA: 'Delete Media',
  CREATE_USER: 'Create User',
  UPDATE_USER: 'Update User',
  DELETE_USER: 'Delete User',
  CREATE_CONTACTMETHOD: 'Add Contact Method',
  UPDATE_CONTACTMETHOD: 'Update Contact Method',
  DELETE_CONTACTMETHOD: 'Delete Contact Method',
};

export default function AdminActivityPage() {
  const [items, setItems] = useState<ActivityLog[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [entityFilter, setEntityFilter] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (entityFilter) params.set('entity', entityFilter);
      params.set('page', String(page));
      params.set('limit', '20');
      const res = await activityApi.getAll(undefined, `?${params.toString()}`);
      setItems(res.data.items);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [entityFilter, page]);

  useEffect(() => { fetchItems(); }, [fetchItems]);
  useEffect(() => { setPage(1); }, [entityFilter]);

  const getActionLabel = (log: ActivityLog) => {
    if (ACTION_LABELS[log.action]) return ACTION_LABELS[log.action];
    const lower = log.action.toLowerCase();
    if (lower.includes('create')) return 'Create';
    if (lower.includes('update')) return 'Update';
    if (lower.includes('delete')) return 'Delete';
    if (lower.includes('login')) return 'Login';
    return log.action.replace(/_/g, ' ');
  };

  const getBadgeVariant = (action: string): 'blue' | 'green' | 'orange' | 'red' | 'amber' | 'gray' | 'navy' => {
    const lower = action.toLowerCase();
    if (lower.includes('delete')) return 'red';
    if (lower.includes('login')) return 'green';
    if (lower.includes('settings')) return 'amber';
    if (lower.includes('update')) return 'blue';
    if (lower.includes('create')) return 'blue';
    return 'gray';
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center justify-between rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
          <button onClick={() => setError('')}><X className="h-4 w-4" /></button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-neutral-400" />
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand-orange"
          >
            <option value="">All Entities</option>
            <option value="service">Services</option>
            <option value="project">Projects</option>
            <option value="client">Clients</option>
            <option value="enquiry">Enquiries</option>
            <option value="Enquiry">Enquiries</option>
            <option value="media">Media</option>
            <option value="settings">Settings</option>
            <option value="ContactMethod">Contact Methods</option>
          </select>
        </div>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Spinner /></div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
            <Activity className="mb-3 h-10 w-10" />
            <p className="text-sm">No activity logged yet</p>
          </div>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {items.map((log) => (
              <li key={log._id} className="flex items-start gap-4 px-6 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-50 text-xs font-semibold text-navy-700">
                  {log.adminName ? log.adminName.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-navy-950">{log.adminName || 'Admin'}</p>
                    <Badge variant={getBadgeVariant(log.action)}>{getActionLabel(log)}</Badge>
                    <span className="text-xs capitalize text-neutral-400">{log.entity}</span>
                  </div>
                  {log.entityName && (
                    <p className="mt-1 text-xs text-navy-500 truncate">{log.entityName}</p>
                  )}
                  <p className="mt-1 text-xs text-neutral-400">{formatDateTime(log.createdAt)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-neutral-400">
            Page {pagination.page} of {pagination.totalPages} — {pagination.total} entries
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft className="h-4 w-4" /> Prev
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={page >= (pagination.totalPages || 1)}
              onClick={() => setPage((p) => p + 1)}
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}