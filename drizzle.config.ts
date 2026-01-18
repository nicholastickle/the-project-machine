import type { Config } from 'drizzle-kit';
import { config } from 'dotenv';

// Load .env.local
config({ path: '.env.local' });

// Build connection string from Supabase components
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const projectRef = supabaseUrl?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
const connectionString = `postgresql://postgres:${process.env.DATABASE_PASSWORD}@db.${projectRef}.supabase.co:5432/postgres`;

export default {
  schema: './lib/db/schema.ts',
  out: './supabase/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || connectionString,
  },
} satisfies Config;
