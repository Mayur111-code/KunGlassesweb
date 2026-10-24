'use client';

import type { ReactNode } from 'react';
import { MotionConfig } from 'framer-motion';
import { SettingsProvider } from '@/lib/settings-context';

/**
 * `reducedMotion="user"` makes Framer Motion respect the OS-level motion
 * preference for every descendant animation without branching the initial
 * render (which is what used to risk server/client markup mismatches).
 * Opacity still animates; transforms are skipped for reduced-motion users.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SettingsProvider>{children}</SettingsProvider>
    </MotionConfig>
  );
}
