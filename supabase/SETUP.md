# Supabase Setup Guide

## Prerequisites
- Supabase account (https://supabase.com)
- Node.js 18+ installed
- npm or pnpm

## Step 1: Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in:
   - **Name**: project-machine-v1 (or your choice)
   - **Database Password**: Save this securely
   - **Region**: Choose closest to your users (e.g., US East, EU West)
4. Click "Create new project" (takes ~2 minutes)

## Step 2: Get Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...` (long JWT token)
   - **service_role key**: `eyJhbGc...` (different JWT, keep secret!)

## Step 3: Configure Environment

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and fill in:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key...
   OPENAI_API_KEY=sk-...your-openai-key...
   ```

## Step 4: Run Database Migration

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `supabase/schema.sql`
4. Paste into the SQL editor
5. Click **Run** (or press Ctrl+Enter)
6. Verify success: Should see "Success. No rows returned"

## Step 5: Verify Setup

1. Go to **Table Editor** in Supabase dashboard
2. You should see these tables:
   - projects
   - plan_snapshots
   - reflections
   - reference_notes
   - file_summaries
   - project_members
   - usage_logs

3. Go to **Authentication** → **Providers**
4. Enable **Email** provider:
   - Toggle "Enable Email provider" to ON
   - Save changes

## Step 6: Test Connection

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000/canvas

3. Open browser console (F12) and test:
   ```javascript
   // This should log your Supabase URL
   console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
   ```

## Optional: Configure Email Templates

For magic link authentication, customize email templates:

1. Go to **Authentication** → **Email Templates**
2. Edit "Confirm signup" and "Magic Link" templates
3. Update branding/copy as needed

## Troubleshooting

### "Invalid API key" error
- Check that `.env.local` is in the root directory
- Restart dev server after adding env vars
- Verify keys match exactly (no extra spaces)

### "relation does not exist" error
- Schema migration didn't run successfully
- Re-run the SQL from step 4
- Check SQL Editor for error messages

### Can't create records
- Row Level Security (RLS) is enabled
- You must be authenticated to create projects
- For testing, you can temporarily disable RLS in Table Editor

## Next Steps

Once setup is complete:
1. Test creating a project via API
2. Test saving a snapshot
3. Test authentication flow
4. Set up AI endpoints

See `IMPLEMENTATION_ROADMAP.md` for development roadmap.
