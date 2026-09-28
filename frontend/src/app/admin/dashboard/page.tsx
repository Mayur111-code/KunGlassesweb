'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Wrench,
  Building2,
  Users,
  MessageSquare,
  Mail,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { Spinner, FullPageLoader } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { dashboardApi, enquiriesApi, activityApi } from '@/services';
import { formatDateTime, getInitials, truncate } from '@/lib/utils';
import { getErrorMessage } from '@/lib/api';
import type { DashboardStats, Enquiry, ActivityLog } from '@/types';

const statusVariant: Record<string, 'blue' | 'amber' | 'gray' | 'orange' | 'green' | 'red' | 'navy'> = {
  NEW: 'blue',
  CONTACTED: 'amber',
  IN_PROGRESS: 'navy',
  QUOTED: 'orange',
  CONVERTED: 'green',
  REJECTED: 'red',
  CLOSED: 'gray',
};

interface StatCardProps {
  label: string;
  value: number;
  icon: typeof Wrench;
  color: string;
  href?: string;
}

function StatCard({ label, value, icon: Icon, color, href }: StatCardProps) {
  const content = (
    <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-navy-950">{value}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-white ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const [statsRes, enquiriesRes, activityRes] = await Promise.all([
        dashboardApi.getStats(),
        enquiriesApi.getAll(undefined, '?limit=5'),
        activityApi.getAll(undefined, '?limit=10'),
      ]);
      setStats(statsRes);
      setRecentEnquiries(enquiriesRes.data.items);
      setRecentActivity(activityRes.data.items);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return <FullPageLoader label="Loading dashboard..." />;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {error}
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={load}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const enquiriesByStatus = stats.enquiries;
  const statusData = [
    { label: 'NEW', count: enquiresCount(recentEnquiries, 'NEW') },
    { label: 'CONTACTED', count: enquiresCount(recentEnquiries, 'CONTACTED') },
    { label: 'IN_PROGRESS', count: enquiresCount(recentEnquiries, 'IN_PROGRESS') },
    { label: 'QUOTED', count: enquiresCount(recentEnquiries, 'QUOTED') },
    { label: 'CONVERTED', count: enquiresCount(recentEnquiries, 'CONVERTED') },
    { label: 'REJECTED', count: enquiresCount(recentEnquiries, 'REJECTED') },
    { label: 'CLOSED', count: enquiresCount(recentEnquiries, 'CLOSED') },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Services" value={stats.services.total} icon={Wrench} color="bg-brand-orange" href="/admin/services" />
        <StatCard label="Active Services" value={stats.services.active} icon={Wrench} color="bg-navy-700" href="/admin/services" />
        <StatCard label="Total Projects" value={stats.projects.total} icon={Building2} color="bg-sky-600" href="/admin/projects" />
        <StatCard label="Total Clients" value={stats.clients.total} icon={Users} color="bg-emerald-600" href="/admin/clients" />
        <StatCard label="Total Enquiries" value={stats.enquiries.total} icon={MessageSquare} color="bg-violet-600" href="/admin/enquiries" />
        <StatCard label="New Enquiries" value={stats.enquiries.new} icon={Mail} color="bg-sky-500" href="/admin/enquiries?status=NEW" />
        <StatCard label="Pending Enquiries" value={stats.enquiries.pending} icon={Clock} color="bg-amber-500" href="/admin/enquiries" />
        <StatCard label="Converted Enquiries" value={stats.enquiries.converted} icon={MessageSquare} color="bg-emerald-600" href="/admin/enquiries?status=CONVERTED" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-navy-950">Recent Enquiries</h2>
            <Link href="/admin/enquiries" className="flex items-center gap-1 text-sm text-brand-orange hover:underline">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {recentEnquiries.length === 0 ? (
            <p className="py-8 text-center text-sm text-neutral-400">No enquiries yet</p>
          ) : (
            <div className="space-y-3">
              {recentEnquiries.map((enquiry) => (
                <Link
                  key={enquiry._id}
                  href="/admin/enquiries"
                  className="flex items-center justify-between rounded-lg border border-neutral-100 p-3 transition-colors hover:bg-neutral-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-100 text-xs font-semibold text-navy-700">
                      {getInitials(enquiry.fullName)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-navy-950">{enquiry.fullName}</p>
                      <p className="text-xs text-neutral-400">
                        {enquiry.serviceInterestedInName || 'General enquiry'} · {formatDateTime(enquiry.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Badge variant={statusVariant[enquiry.status] ?? 'gray'}>{enquiry.status}</Badge>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-navy-950">Enquiry Status Distribution</h2>
          <div className="space-y-3">
            {statusData.map((s) => {
              const max = Math.max(...statusData.map((d) => d.count), 1);
              return (
                <div key={s.label} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 text-xs font-medium text-neutral-500">{s.label}</span>
                  <div className="h-4 flex-1 overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className="h-full rounded-full bg-brand-orange transition-all"
                      style={{ width: `${(s.count / max) * 100}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-sm font-semibold text-navy-950">{s.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm xl:col-span-2">
          <h2 className="mb-4 font-semibold text-navy-950">Recent Activity</h2>
          {recentActivity.length === 0 ? (
            <p className="py-8 text-center text-sm text-neutral-400">No activity yet</p>
          ) : (
            <div className="space-y-2">
              {recentActivity.map((log) => (
                <div key={log._id} className="flex items-center justify-between border-b border-neutral-50 py-2.5 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                      <Clock className="h-4 w-4 text-neutral-400" />
                    </div>
                    <div>
                      <p className="text-sm text-navy-950">
                        <span className="font-medium">{log.adminName || log.admin}</span>{' '}
                        <span className="text-neutral-500">
                          {log.action} {log.entity}
                          {log.entityName ? ` · ${truncate(log.entityName, 40)}` : ''}
                        </span>
                      </p>
                      <p className="text-xs text-neutral-400">{formatDateTime(log.createdAt)}</p>
                    </div>
                  </div>
                  <Badge variant="gray">{log.entity}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-navy-950">Quick Actions</h2>
          <div className="space-y-2">
            <Link href="/admin/enquiries" className="block rounded-lg border border-neutral-200 p-4 hover:border-brand-orange">
              <p className="text-sm font-medium text-navy-950">Manage Enquiries</p>
              <p className="text-xs text-neutral-400">Follow up on new leads</p>
            </Link>
            <Link href="/admin/services" className="block rounded-lg border border-neutral-200 p-4 hover:border-brand-orange">
              <p className="text-sm font-medium text-navy-950">Add Service</p>
              <p className="text-xs text-neutral-400">Create a new service listing</p>
            </Link>
            <Link href="/admin/projects" className="block rounded-lg border border-neutral-200 p-4 hover:border-brand-orange">
              <p className="text-sm font-medium text-navy-950">Add Project</p>
              <p className="text-xs text-neutral-400">Showcase completed work</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function enquiresCount(enquiries: Enquiry[], status: string): number {
  return enquiries.filter((e) => e.status === status).length;
}