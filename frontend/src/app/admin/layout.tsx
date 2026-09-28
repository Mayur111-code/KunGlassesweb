'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Wrench,
  Building2,
  Users,
  MessageSquare,
  Image,
  Settings,
  Shield,
  Activity,
  ExternalLink,
  ChevronDown,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { FullPageLoader } from '@/components/ui/Spinner';
import { getInitials } from '@/lib/utils';
import type { Role } from '@/types';

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles?: Role[];
}

const navItems: NavItem[] = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/services', label: 'Services', icon: Wrench },
  { href: '/admin/projects', label: 'Projects', icon: Building2 },
  { href: '/admin/clients', label: 'Clients', icon: Users },
  { href: '/admin/enquiries', label: 'Enquiries', icon: MessageSquare },
  { href: '/admin/media', label: 'Media', icon: Image },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
  { href: '/admin/users', label: 'Users', icon: Shield, roles: ['SUPER_ADMIN', 'ADMIN'] },
  { href: '/admin/activity-logs', label: 'Activity', icon: Activity },
];

const pageTitles: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/services': 'Services',
  '/admin/projects': 'Projects',
  '/admin/clients': 'Clients',
  '/admin/enquiries': 'Enquiries',
  '/admin/media': 'Media Library',
  '/admin/settings': 'Settings',
  '/admin/users': 'Users',
  '/admin/activity-logs': 'Activity Logs',
};

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated, user, logout, can } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSidebarOpen(false);
        setDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  if (isLoading) {
    return <FullPageLoader label="Loading admin..." />;
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const filtered = navItems.filter((item) => !item.roles || can(...item.roles));
  const title = pageTitles[pathname] || 'Admin';

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-64 flex-col bg-navy-950 transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="KUN Glass & Aluminium"
              className="h-8 w-auto object-contain"
            />
            <div>
              <div className="text-sm font-bold text-white">KUN Glass</div>
              <div className="text-[10px] font-medium text-navy-400">Admin Panel</div>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1 text-navy-400 hover:text-white lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {filtered.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20'
                    : 'text-navy-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-navy-800 px-3 py-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-navy-400 hover:bg-navy-800 hover:text-white"
          >
            <ExternalLink size={18} />
            View Website
          </a>
        </div>
      </aside>

      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-navy-100/80 bg-white/95 px-4 shadow-sm backdrop-blur-md lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-navy-600 hover:bg-neutral-100 lg:hidden"
              aria-label="Open navigation"
              aria-expanded={sidebarOpen}
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-semibold text-navy-950">{title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-navy-600 hover:bg-neutral-100 sm:flex"
            >
              <ExternalLink className="h-4 w-4" />
              View Site
            </a>

            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-neutral-100"
                aria-label="Open account menu"
                aria-expanded={dropdownOpen}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-900 text-xs font-semibold text-white">
                  {getInitials(user?.name)}
                </div>
                <div className="hidden text-left md:block">
                  <div className="text-sm font-medium text-navy-950">{user?.name}</div>
                  <div className="text-xs text-neutral-400">{user?.role}</div>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-neutral-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border border-neutral-200 bg-white py-1 shadow-lg">
                  <div className="border-b border-neutral-100 px-4 py-3">
                    <p className="truncate text-sm font-medium text-navy-950">{user?.name}</p>
                    <p className="text-xs text-neutral-400">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AuthProvider>
  );
}
