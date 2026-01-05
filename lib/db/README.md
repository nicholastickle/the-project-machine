# Drizzle Setup Guide

## Quick Start

1. **Add your Supabase connection string to `.env.local`:**
   ```bash
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   ```

   You can find this in Supabase Dashboard → Settings → Database → Connection String (Transaction mode)

2. **Generate migration files:**
   ```bash
   npm run db:generate
   ```

3. **Apply migrations to Supabase:**
   ```bash
   npm run db:push
   ```

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Generate migration SQL from schema.ts |
| `npm run db:migrate` | Apply migrations (reads from supabase/migrations/) |
| `npm run db:push` | Push schema directly without migrations (dev only) |
| `npm run db:studio` | Open Drizzle Studio (visual DB editor) |

## Schema Location

- **Schema definition:** `lib/db/schema.ts`
- **Generated migrations:** `supabase/migrations/`
- **Drizzle client:** `lib/db/index.ts`

## Usage Example

```typescript
import { db } from '@/lib/db';
import { tasks, subtasks } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Create a task
const newTask = await db.insert(tasks).values({
  projectId: 'uuid',
  title: 'Build API',
  status: 'in_progress',
  createdBy: userId,
}).returning();

// Query tasks with relations
const tasksWithSubtasks = await db.query.tasks.findMany({
  where: eq(tasks.projectId, projectId),
  with: {
    subtasks: true,
    assignments: true,
    comments: true,
  },
});
```

## Notes

- **User table:** Managed by Supabase Auth. Don't directly insert users.
- **RLS Policies:** Add these manually in Supabase after schema migration.
- **Soft deletes:** Tables have `deleted_at` field. Filter by `IS NULL` in queries.

## Snapshot Retention

To prevent `plan_snapshots` table from growing infinitely, run this cleanup job weekly:

```sql
-- Keep only last 50 autosaves per project
DELETE FROM plan_snapshots
WHERE created_at < NOW() - INTERVAL '7 days'
AND id NOT IN (
  SELECT id FROM plan_snapshots
  WHERE project_id = plan_snapshots.project_id
  ORDER BY created_at DESC
  LIMIT 50
);
```

Schedule via Supabase Edge Functions or cron job.
