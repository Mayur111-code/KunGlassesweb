'use client';

import { useState, useRef, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/lib/auth-context';
import { getErrorMessage } from '@/lib/api';

const getLoginErrorMessage = (err: unknown): string => {
  if (err instanceof TypeError) {
    return 'Unable to connect to the server. Please try again.';
  }
  const message = getErrorMessage(err);
  if (message === 'Invalid email or password.') return message;
  return message || 'Unable to log in. Please try again.';
};

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const submittingRef = useRef(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }

    submittingRef.current = true;
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace('/admin/dashboard');
    } catch (err) {
      setError(getLoginErrorMessage(err));
      submittingRef.current = false;
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img
            src="/logo.png"
            alt="KUN Glass & Aluminium"
            className="mx-auto mb-4 h-16 w-auto object-contain"
          />
          <h1 className="text-2xl font-bold text-white">KUN Glass &amp; Aluminium</h1>
          <p className="mt-1 text-sm text-navy-300">Admin Panel</p>
        </div>

        <div className="rounded-xl bg-white p-8 shadow-2xl">
          <h2 className="mb-6 text-center text-lg font-semibold text-navy-950">Sign in to your account</h2>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-navy-900">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 py-2.5 pl-10 pr-4 text-sm text-navy-950 outline-none transition-colors focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                  placeholder="Enter your email address"
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-navy-900">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 py-2.5 pl-10 pr-4 text-sm text-navy-950 outline-none transition-colors focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                  placeholder="Enter your password"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Spinner size="sm" className="border-white border-t-transparent" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-navy-400">
          &copy; {new Date().getFullYear()} KUN Glass &amp; Aluminium. All rights reserved.
        </p>
      </div>
    </div>
  );
}