-- Fix for infinite recursion in RLS policies
-- Run this in Supabase SQL Editor

-- Drop ALL problematic policies
DROP POLICY IF EXISTS "Users can view project members" ON project_members;
DROP POLICY IF EXISTS "Editors can add project members" ON project_members;
DROP POLICY IF EXISTS "Project creators can add members" ON project_members;

-- Fix project_members: No circular dependency
-- Users can ONLY see their own membership records
CREATE POLICY "Users can view their own memberships"
  ON project_members FOR SELECT
  USING (user_id = auth.uid());

-- Project creators can add members (no dependency on project_members)
CREATE POLICY "Project creators can add members"
  ON project_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_members.project_id 
      AND projects.created_by = auth.uid()
    )
  );

-- Success message
SELECT 'RLS policies fixed! No more infinite loops ✅' as status;
