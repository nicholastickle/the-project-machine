// =============================================================================
// APP PROVIDERS
// =============================================================================

'use client';

import { useEffect } from 'react';
import { USE_LOCAL_STORAGE } from '@/utils/env';
import { initializeLocalStorage } from '@/mock/initLocalStorage';

export function AppProviders({ children }: { children: React.ReactNode }) {
  // Initialize localStorage in development
  useEffect(() => {
    if (USE_LOCAL_STORAGE) {
      initializeLocalStorage();
    }
  }, []);

  return <>{children}</>;
}