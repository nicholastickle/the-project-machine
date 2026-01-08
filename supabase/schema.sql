-- Project Machine v1.0 Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Projects: Unit of collaboration
create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  created_by uuid references auth.users(id),
  archived_at timestamptz
);

-- PlanSnapshots: ONLY authoritative memory
create table if not exists plan_snapshots (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade not null,
  snapshot_data jsonb not null, -- Stores { nodes, edges } from ReactFlow
  created_at timestamptz default now(),
  created_by uuid references auth.users(id),
  snapshot_type text default 'manual', -- 'manual' | 'autosave' | 'ai_generated'
  summary text -- Optional human-readable summary
);

-- Reflections: Start/end of day context
create table if not exists reflections (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade not null,
  reflection_type text not null check (reflection_type in ('start_of_day', 'end_of_day')),
  content text not null,
  created_at timestamptz default now(),
  created_by uuid references auth.users(id)
);

-- Reference Notes: Institutional knowledge
create table if not exists reference_notes (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade not null,
  title text not null,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  created_by uuid references auth.users(id)
);

-- File Summaries: Human-confirmed summaries (NOT raw files)
create table if not exists file_summaries (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade not null,
  filename text not null,
  file_type text, -- 'excel' | 'csv' | 'pdf' | 'other'
  summary text not null, -- Human-confirmed summary
  confirmed_at timestamptz default now(),
  confirmed_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- Chat Messages: Conversation history with AI
-- Chat Messages: Conversation history with AI
create table if not exists chat_messages (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now(),
  created_by uuid references auth.users(id)
);

-- Chat Threads: Grouping for chat (NEW)
create table if not exists chat_threads (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade not null,
  title text not null,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Users: Public profile table (Synced with Auth)
create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz default now()
);

-- Tasks: Core unit of work
create table if not exists tasks (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade not null,
  title text not null,
  description text,
  status text not null default 'Not started' check (status in ('Not started', 'On-going', 'Stuck', 'Complete', 'Abandoned')),
  estimated_hours integer,
  time_spent integer not null default 0,
  sort_order integer not null default 0,
  created_by uuid references auth.users(id) not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

-- Subtasks: Granular work items
create table if not exists subtasks (
  id uuid primary key default uuid_generate_v4(),
  task_id uuid references tasks(id) on delete cascade not null,
  title text not null,
  is_completed boolean not null default false,
  estimated_duration integer default 0,
  time_spent integer default 0,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Task Assignments: Who is doing what
create table if not exists task_assignments (
  id uuid primary key default uuid_generate_v4(),
  task_id uuid references tasks(id) on delete cascade not null,
  user_id uuid references auth.users(id) not null,
  role text default 'assignee' check (role in ('assignee', 'reviewer')),
  assigned_at timestamptz default now(),
  assigned_by uuid references auth.users(id)
);

-- Task Comments: Discussion on tasks
create table if not exists task_comments (
  id uuid primary key default uuid_generate_v4(),
  task_id uuid references tasks(id) on delete cascade not null,
  user_id uuid references auth.users(id) not null,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

-- Taskbook Entries: Templates
create table if not exists taskbook_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id), -- Nullable for global templates
  project_id uuid references projects(id) on delete cascade, -- Nullable
  title text not null,
  description text,
  category text,
  default_subtasks jsonb,
  usage_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

-- Pending Invitations: Track project invites
create table if not exists pending_invitations (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade not null,
  invited_email text not null,
  role text not null check (role in ('editor', 'viewer')),
  invited_by uuid references auth.users(id) not null,
  invite_token text unique not null,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  created_at timestamptz default now()
);

-- Project Members: Minimal roles
create table if not exists project_members (
  project_id uuid references projects(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null default 'editor' check (role in ('editor', 'viewer')),
  joined_at timestamptz default now(),
  primary key (project_id, user_id)
);

-- Usage Logs: Observability (internal only)
create table if not exists usage_logs (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade,
  user_id uuid references auth.users(id),
  event_type text not null, -- 'project_created' | 'snapshot_saved' | 'snapshot_loaded' | 'ai_query' | 'export' | 'reflection_added'
  event_data jsonb,
  created_at timestamptz default now()
);

-- Indexes for common queries
create index if not exists idx_plan_snapshots_project on plan_snapshots(project_id, created_at desc);
create index if not exists idx_reflections_project on reflections(project_id, created_at desc);
create index if not exists idx_reference_notes_project on reference_notes(project_id);
create index if not exists idx_chat_messages_project on chat_messages(project_id, created_at asc);
create index if not exists idx_tasks_project on tasks(project_id);
create index if not exists idx_subtasks_task on subtasks(task_id);
create index if not exists idx_pending_invitations_token on pending_invitations(invite_token);
create index if not exists idx_pending_invitations_email on pending_invitations(invited_email, accepted_at);
create index if not exists idx_usage_logs_project on usage_logs(project_id, created_at desc);
create index if not exists idx_usage_logs_type on usage_logs(event_type, created_at desc);
create index if not exists idx_usage_logs_user on usage_logs(user_id, created_at desc);

-- Updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Add triggers for updated_at
create trigger update_projects_updated_at before update on projects
  for each row execute procedure update_updated_at_column();

create trigger update_reference_notes_updated_at before update on reference_notes
  for each row execute procedure update_updated_at_column();

create trigger update_tasks_updated_at before update on tasks
  for each row execute procedure update_updated_at_column();

create trigger update_subtasks_updated_at before update on subtasks
  for each row execute procedure update_updated_at_column();

create trigger update_chat_threads_updated_at before update on chat_threads
  for each row execute procedure update_updated_at_column();

-- Enable Row Level Security
alter table projects enable row level security;
alter table plan_snapshots enable row level security;
alter table reflections enable row level security;
alter table reference_notes enable row level security;
alter table file_summaries enable row level security;
alter table chat_messages enable row level security;
alter table chat_threads enable row level security;
alter table tasks enable row level security;
alter table subtasks enable row level security;
alter table task_assignments enable row level security;
alter table task_comments enable row level security;
alter table taskbook_entries enable row level security;
alter table pending_invitations enable row level security;
alter table project_members enable row level security;
alter table usage_logs enable row level security;
alter table users enable row level security;

-- RLS Policies: Projects
create policy "Users can view their projects"
  on projects for select
  using (
    created_by = auth.uid() or
    exists (
      select 1 from project_members
      where project_id = projects.id and user_id = auth.uid()
    )
  );

create policy "Users can create projects"
  on projects for insert
  with check (created_by = auth.uid());

create policy "Editors can update projects"
  on projects for update
  using (
    exists (
      select 1 from project_members
      where project_id = projects.id
        and user_id = auth.uid()
        and role = 'editor'
    ) or created_by = auth.uid()
  );

-- RLS Policies: PlanSnapshots
create policy "Users can view plan snapshots"
  on plan_snapshots for select
  using (
    exists (
      select 1 from project_members
      where project_id = plan_snapshots.project_id and user_id = auth.uid()
    ) or exists (
      select 1 from projects
      where id = plan_snapshots.project_id and created_by = auth.uid()
    )
  );

create policy "Editors can create plan snapshots"
  on plan_snapshots for insert
  with check (
    exists (
      select 1 from project_members
      where project_id = plan_snapshots.project_id
        and user_id = auth.uid()
        and role = 'editor'
    ) or exists (
      select 1 from projects
      where id = plan_snapshots.project_id and created_by = auth.uid()
    )
  );

-- RLS Policies: Reflections
create policy "Users can view reflections"
  on reflections for select
  using (
    exists (
      select 1 from project_members
      where project_id = reflections.project_id and user_id = auth.uid()
    ) or exists (
      select 1 from projects
      where id = reflections.project_id and created_by = auth.uid()
    )
  );

create policy "Editors can create reflections"
  on reflections for insert
  with check (
    exists (
      select 1 from project_members
      where project_id = reflections.project_id
        and user_id = auth.uid()
        and role = 'editor'
    ) or exists (
      select 1 from projects
      where id = reflections.project_id and created_by = auth.uid()
    )
  );

-- RLS Policies: Reference Notes
create policy "Users can view reference notes"
  on reference_notes for select
  using (
    exists (
      select 1 from project_members
      where project_id = reference_notes.project_id and user_id = auth.uid()
    ) or exists (
      select 1 from projects
      where id = reference_notes.project_id and created_by = auth.uid()
    )
  );

create policy "Editors can create reference notes"
  on reference_notes for insert
  with check (
    exists (
      select 1 from project_members
      where project_id = reference_notes.project_id
        and user_id = auth.uid()
        and role = 'editor'
    ) or exists (
      select 1 from projects
      where id = reference_notes.project_id and created_by = auth.uid()
    )
  );

create policy "Editors can update reference notes"
  on reference_notes for update
  using (
    exists (
      select 1 from project_members
      where project_id = reference_notes.project_id
        and user_id = auth.uid()
        and role = 'editor'
    ) or exists (
      select 1 from projects
      where id = reference_notes.project_id and created_by = auth.uid()
    )
  );

-- RLS Policies: File Summaries
create policy "Users can view file summaries"
  on file_summaries for select
  using (
    exists (
      select 1 from project_members
      where project_id = file_summaries.project_id and user_id = auth.uid()
    ) or exists (
      select 1 from projects
      where id = file_summaries.project_id and created_by = auth.uid()
    )
  );

create policy "Editors can create file summaries"
  on file_summaries for insert
  with check (
    exists (
      select 1 from project_members
      where project_id = file_summaries.project_id
        and user_id = auth.uid()
        and role = 'editor'
    ) or exists (
      select 1 from projects
      where id = file_summaries.project_id and created_by = auth.uid()
    )
  );

-- RLS Policies: Chat Messages
create policy "Users can view chat messages"
  on chat_messages for select
  using (
    exists (
      select 1 from project_members
      where project_id = chat_messages.project_id and user_id = auth.uid()
    ) or exists (
      select 1 from projects
      where id = chat_messages.project_id and created_by = auth.uid()
    )
  );

create policy "Editors can create chat messages"
  on chat_messages for insert
  with check (
    exists (
      select 1 from project_members
      where project_id = chat_messages.project_id
        and user_id = auth.uid()
        and role = 'editor'
    ) or exists (
      select 1 from projects
      where id = chat_messages.project_id and created_by = auth.uid()
    )
  );

create policy "Users can delete chat messages"
  on chat_messages for delete
  using (
    exists (
      select 1 from projects
      where id = chat_messages.project_id and created_by = auth.uid()
    )
  );

-- RLS Policies: Tasks (Mirrors Projects)
create policy "Users can view tasks"
  on tasks for select
  using (
    exists (
      select 1 from project_members
      where project_id = tasks.project_id and user_id = auth.uid()
    ) or exists (
      select 1 from projects
      where id = tasks.project_id and created_by = auth.uid()
    )
  );

create policy "Editors can create tasks"
  on tasks for insert
  with check (
    exists (
      select 1 from project_members
      where project_id = tasks.project_id
        and user_id = auth.uid()
        and role = 'editor'
    ) or exists (
      select 1 from projects
      where id = tasks.project_id and created_by = auth.uid()
    )
  );

create policy "Editors can update tasks"
  on tasks for update
  using (
    exists (
      select 1 from project_members
      where project_id = tasks.project_id
        and user_id = auth.uid()
        and role = 'editor'
    ) or exists (
      select 1 from projects
      where id = tasks.project_id and created_by = auth.uid()
    )
  );

create policy "Editors can delete tasks"
  on tasks for delete
  using (
    exists (
      select 1 from project_members
      where project_id = tasks.project_id
        and user_id = auth.uid()
        and role = 'editor'
    ) or exists (
      select 1 from projects
      where id = tasks.project_id and created_by = auth.uid()
    )
  );

-- RLS Policies: Subtasks (Inherits from Tasks)
create policy "Users can view subtasks"
  on subtasks for select
  using (
    exists (
      select 1 from tasks
      where id = subtasks.task_id and (
        exists (
            select 1 from project_members
            where project_id = tasks.project_id and user_id = auth.uid()
        ) or exists (
            select 1 from projects
            where id = tasks.project_id and created_by = auth.uid()
        )
      )
    )
  );

create policy "Editors can manage subtasks"
  on subtasks for all
  using (
    exists (
      select 1 from tasks
      where id = subtasks.task_id and (
        exists (
            select 1 from project_members
            where project_id = tasks.project_id
             and user_id = auth.uid()
             and role = 'editor'
        ) or exists (
            select 1 from projects
            where id = tasks.project_id and created_by = auth.uid()
        )
      )
    )
  );

-- RLS Policies: Project Members
create policy "Users can view project members"
  on project_members for select
  using (
    user_id = auth.uid() or
    exists (
      select 1 from project_members pm
      where pm.project_id = project_members.project_id and pm.user_id = auth.uid()
    )
  );

create policy "Editors can add project members"
  on project_members for insert
  with check (
    exists (
      select 1 from projects
      where id = project_members.project_id and created_by = auth.uid()
    )
  );

-- RLS Policies: Usage Logs (internal only - no RLS needed, use service role)
-- Users should not see usage logs directly

-- RLS Policies: Users (Public Profile)
create policy "Users can view profiles"
  on users for select
  using (true);

create policy "Users can update own profile"
  on users for update
  using (id = auth.uid());
