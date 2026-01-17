-- Enable Realtime for Canvas Sync (Sprint 3)
-- This allows multi-user collaboration on tasks

-- Enable realtime broadcasts for tasks table
alter publication supabase_realtime add table tasks;

-- Optional: Enable for plan_snapshots if needed in future
-- (Currently not required as we only listen to task changes)
-- alter publication supabase_realtime add table plan_snapshots;

-- Verify publication exists and is configured
do $$
begin
  if not exists (
    select 1 from pg_publication where pubname = 'supabase_realtime'
  ) then
    raise exception 'supabase_realtime publication does not exist';
  end if;
end $$;
