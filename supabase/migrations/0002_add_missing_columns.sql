-- ==========================================
-- ADD MISSING COLUMNS TO EXISTING TABLES
-- Migration 0002: Add deleted_at and other missing columns
-- ==========================================

-- Add deleted_at to projects (replace archived_at)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS deleted_at timestamp;

-- Add deleted_at to tasks
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS deleted_at timestamp;

-- Add deleted_at to subtasks  
ALTER TABLE subtasks ADD COLUMN IF NOT EXISTS deleted_at timestamp;

-- Add deleted_at to task_comments
ALTER TABLE task_comments ADD COLUMN IF NOT EXISTS deleted_at timestamp;

-- Add deleted_at to taskbook_entries
ALTER TABLE taskbook_entries ADD COLUMN IF NOT EXISTS deleted_at timestamp;

-- Note: file_summaries already exists with different structure, skip for now
