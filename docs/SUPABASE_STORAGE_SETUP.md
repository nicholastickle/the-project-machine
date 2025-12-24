# Supabase Storage Setup

## Create Storage Bucket

1. Go to Supabase Dashboard → Storage
2. Create new bucket:
   - **Name:** `project-files`
   - **Public:** No (private)
   - **File size limit:** 10MB
   - **Allowed MIME types:** 
     - application/vnd.openxmlformats-officedocument.spreadsheetml.sheet (Excel)
     - application/vnd.ms-excel (Excel legacy)
     - text/csv (CSV)
     - application/pdf (PDF)

## RLS Policies

**Use Supabase Dashboard** (SQL Editor won't work for storage.objects):

1. Go to **Storage** → `project-files` bucket → **Policies** tab

2. Create policy: **"Users can upload to their projects"**
   - **Policy name:** Users can upload to their projects
   - **Policy command:** INSERT
   - **Target roles:** authenticated
   - **WITH CHECK expression:**
   ```sql
   (storage.foldername(name))[1] IN (
     SELECT id::text FROM projects WHERE created_by = auth.uid()
     UNION
     SELECT project_id::text FROM project_members WHERE user_id = auth.uid()
   )
   ```

3. Create policy: **"Users can read their project files"**
   - **Policy name:** Users can read their project files
   - **Policy command:** SELECT
   - **Target roles:** authenticated
   - **USING expression:**
   ```sql
   (storage.foldername(name))[1] IN (
     SELECT id::text FROM projects WHERE created_by = auth.uid()
     UNION
     SELECT project_id::text FROM project_members WHERE user_id = auth.uid()
   )
   ```

4. Create policy: **"Users can delete their own project files"**
   - **Policy name:** Users can delete their own project files
   - **Policy command:** DELETE
   - **Target roles:** authenticated
   - **USING expression:**
   ```sql
   (storage.foldername(name))[1] IN (
     SELECT id::text FROM projects WHERE created_by = auth.uid()
   )
   ```

## File Storage Structure

Files will be stored with path structure:
```
project-files/
  {project_id}/
    {timestamp}_{original_filename}
```

Example: `project-files/abc-123-def/1703456789_budget-2024.xlsx`

## Usage from Code

```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

// Upload file
const { data, error } = await supabase.storage
  .from('project-files')
  .upload(`${projectId}/${Date.now()}_${file.name}`, file)

// Download file
const { data, error } = await supabase.storage
  .from('project-files')
  .download(filePath)

// Get public URL (signed, temporary)
const { data } = await supabase.storage
  .from('project-files')
  .createSignedUrl(filePath, 3600) // 1 hour expiry
```

## Environment Variables

Add to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Already configured ✅
