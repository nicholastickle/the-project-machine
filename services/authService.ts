// =========================================================================
// AUTH SERVICE
// =========================================================================

import type { User } from '@/stores/types';
import { USE_LOCAL_STORAGE } from '@/utils/env';
import { localStorageAdapter } from './adapters/localStorageAdapter';
import { supabaseAdapter } from './adapters/supabaseAdapter';

const adapter = USE_LOCAL_STORAGE ? localStorageAdapter : supabaseAdapter;

export const authService = {
  /**
   * Sign in with email and password
   */
  signIn: async (email: string, otp: string): Promise<User> => {
    return await adapter.auth.signIn(email, otp);
  },

  /**
   * Sign up with email, password, and name
   */
  signUp: async (email: string, otp: string): Promise<User> => {
    return await adapter.auth.signUp(email, otp);
  },

  /**
   * Sign out current user
   */
  signOut: async (): Promise<void> => {
    await adapter.auth.signOut();
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser: async (): Promise<User | null> => {
    return await adapter.auth.getCurrentUser();
  },
};