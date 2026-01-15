// =========================================================================
// ENVIRONMENT UTILITIES
// =========================================================================

export const USE_LOCAL_STORAGE = !process.env.NEXT_PUBLIC_SUPABASE_URL;

export const getEnvironment = () => {
  return {
    useLocalStorage: USE_LOCAL_STORAGE,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
};