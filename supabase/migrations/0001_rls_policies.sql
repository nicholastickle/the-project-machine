-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Generated for v0.3 hybrid model
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE taskbook_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- HELPER FUNCTION: Check if user is project member
-- ==========================================
CREATE OR REPLACE FUNCTION is_project_member(project_uuid uuid, user_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM project_members
    WHERE project_id = project_uuid AND user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper: Check if user is project owner
CREATE OR REPLACE FUNCTION is_project_owner(project_uuid uuid, user_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM projects
    WHERE id = project_uuid AND created_by = user_uuid AND deleted_at IS NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper: Check if user is project editor
CREATE OR REPLACE FUNCTION is_project_editor(project_uuid uuid, user_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM project_members
    WHERE project_id = project_uuid AND user_id = user_uuid AND role = 'editor'
  ) OR is_project_owner(project_uuid, user_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- PROJECTS POLICIES
-- ==========================================

-- Users can view projects they're members of
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (is_project_member(id, auth.uid()) OR created_by = auth.uid());

-- Users can create projects (they become owner)
CREATE POLICY "Users can create projects"
  ON projects FOR INSERT
  WITH CHECK (created_by = auth.uid());

-- Only editors can update projects
CREATE POLICY "Editors can update projects"
  ON projects FOR UPDATE
  USING (is_project_editor(id, auth.uid()))
  WITH CHECK (is_project_editor(id, auth.uid()));

-- Only owners can delete projects (soft delete)
CREATE POLICY "Owners can delete projects"
  ON projects FOR UPDATE
  USING (created_by = auth.uid() AND deleted_at IS NULL)
  WITH CHECK (created_by = auth.uid());

-- ==========================================
-- PROJECT MEMBERS POLICIES
-- ==========================================

-- Members can view other members in their projects
CREATE POLICY "Members can view project members"
  ON project_members FOR SELECT
  USING (is_project_member(project_id, auth.uid()));

-- Only owners can add members
CREATE POLICY "Owners can add members"
  ON project_members FOR INSERT
  WITH CHECK (is_project_owner(project_id, auth.uid()));

-- Only owners can update member roles
CREATE POLICY "Owners can update members"
  ON project_members FOR UPDATE
  USING (is_project_owner(project_id, auth.uid()));

-- Only owners can remove members
CREATE POLICY "Owners can remove members"
  ON project_members FOR DELETE
  USING (is_project_owner(project_id, auth.uid()));

-- ==========================================
-- TASKS POLICIES
-- ==========================================

-- Members can view tasks in their projects
CREATE POLICY "Members can view tasks"
  ON tasks FOR SELECT
  USING (is_project_member(project_id, auth.uid()));

-- Editors can create tasks
CREATE POLICY "Editors can create tasks"
  ON tasks FOR INSERT
  WITH CHECK (is_project_editor(project_id, auth.uid()));

-- Editors can update tasks
CREATE POLICY "Editors can update tasks"
  ON tasks FOR UPDATE
  USING (is_project_editor(project_id, auth.uid()));

-- Editors can soft-delete tasks
CREATE POLICY "Editors can delete tasks"
  ON tasks FOR UPDATE
  USING (is_project_editor(project_id, auth.uid()) AND deleted_at IS NULL)
  WITH CHECK (is_project_editor(project_id, auth.uid()));

-- ==========================================
-- SUBTASKS POLICIES
-- ==========================================

-- Members can view subtasks if they can view the parent task
CREATE POLICY "Members can view subtasks"
  ON subtasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = subtasks.task_id AND is_project_member(tasks.project_id, auth.uid())
    )
  );

-- Editors can create subtasks
CREATE POLICY "Editors can create subtasks"
  ON subtasks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = subtasks.task_id AND is_project_editor(tasks.project_id, auth.uid())
    )
  );

-- Editors can update subtasks
CREATE POLICY "Editors can update subtasks"
  ON subtasks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = subtasks.task_id AND is_project_editor(tasks.project_id, auth.uid())
    )
  );

-- Editors can soft-delete subtasks
CREATE POLICY "Editors can delete subtasks"
  ON subtasks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = subtasks.task_id AND is_project_editor(tasks.project_id, auth.uid())
    ) AND deleted_at IS NULL
  );

-- ==========================================
-- TASK ASSIGNMENTS POLICIES
-- ==========================================

CREATE POLICY "Members can view assignments"
  ON task_assignments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_assignments.task_id AND is_project_member(tasks.project_id, auth.uid())
    )
  );

CREATE POLICY "Editors can create assignments"
  ON task_assignments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_assignments.task_id AND is_project_editor(tasks.project_id, auth.uid())
    )
  );

CREATE POLICY "Editors can delete assignments"
  ON task_assignments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_assignments.task_id AND is_project_editor(tasks.project_id, auth.uid())
    )
  );

-- ==========================================
-- TASK COMMENTS POLICIES
-- ==========================================

CREATE POLICY "Members can view comments"
  ON task_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_comments.task_id AND is_project_member(tasks.project_id, auth.uid())
    )
  );

-- Any member can add comments
CREATE POLICY "Members can create comments"
  ON task_comments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_comments.task_id AND is_project_member(tasks.project_id, auth.uid())
    ) AND user_id = auth.uid()
  );

-- Users can edit their own comments
CREATE POLICY "Users can update own comments"
  ON task_comments FOR UPDATE
  USING (user_id = auth.uid() AND deleted_at IS NULL);

-- Users can soft-delete their own comments
CREATE POLICY "Users can delete own comments"
  ON task_comments FOR UPDATE
  USING (user_id = auth.uid() AND deleted_at IS NULL)
  WITH CHECK (user_id = auth.uid());

-- ==========================================
-- TASKBOOK ENTRIES POLICIES
-- ==========================================

-- Users can view their own taskbook entries
CREATE POLICY "Users can view own taskbook"
  ON taskbook_entries FOR SELECT
  USING (user_id = auth.uid());

-- Users can create their own entries
CREATE POLICY "Users can create taskbook entries"
  ON taskbook_entries FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own entries
CREATE POLICY "Users can update own taskbook entries"
  ON taskbook_entries FOR UPDATE
  USING (user_id = auth.uid());

-- Users can soft-delete their own entries
CREATE POLICY "Users can delete own taskbook entries"
  ON taskbook_entries FOR UPDATE
  USING (user_id = auth.uid() AND deleted_at IS NULL);

-- ==========================================
-- PLAN SNAPSHOTS POLICIES
-- ==========================================

CREATE POLICY "Members can view snapshots"
  ON plan_snapshots FOR SELECT
  USING (is_project_member(project_id, auth.uid()));

-- System creates snapshots (no direct user INSERT)
CREATE POLICY "System can create snapshots"
  ON plan_snapshots FOR INSERT
  WITH CHECK (true); -- Will be secured by API layer

-- Editors can restore/update snapshots
CREATE POLICY "Editors can update snapshots"
  ON plan_snapshots FOR UPDATE
  USING (is_project_editor(project_id, auth.uid()));

-- ==========================================
-- CHAT THREADS & MESSAGES POLICIES
-- ==========================================

CREATE POLICY "Members can view chat threads"
  ON chat_threads FOR SELECT
  USING (is_project_member(project_id, auth.uid()));

CREATE POLICY "Members can create threads"
  ON chat_threads FOR INSERT
  WITH CHECK (is_project_member(project_id, auth.uid()));

CREATE POLICY "Members can view chat messages"
  ON chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_threads
      WHERE chat_threads.id = chat_messages.thread_id AND is_project_member(chat_threads.project_id, auth.uid())
    )
  );

CREATE POLICY "Members can create messages"
  ON chat_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_threads
      WHERE chat_threads.id = chat_messages.thread_id AND is_project_member(chat_threads.project_id, auth.uid())
    )
  );

-- ==========================================
-- REFLECTIONS POLICIES
-- ==========================================

CREATE POLICY "Users can view own reflections"
  ON reflections FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create reflections"
  ON reflections FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own reflections"
  ON reflections FOR UPDATE
  USING (user_id = auth.uid());

-- ==========================================
-- FILE SUMMARIES POLICIES
-- ==========================================

CREATE POLICY "Members can view file summaries"
  ON file_summaries FOR SELECT
  USING (is_project_member(project_id, auth.uid()));

CREATE POLICY "Editors can create file summaries"
  ON file_summaries FOR INSERT
  WITH CHECK (is_project_editor(project_id, auth.uid()));

CREATE POLICY "Editors can update file summaries"
  ON file_summaries FOR UPDATE
  USING (is_project_editor(project_id, auth.uid()));

-- ==========================================
-- PENDING INVITATIONS POLICIES
-- ==========================================

CREATE POLICY "Owners can view invitations"
  ON pending_invitations FOR SELECT
  USING (is_project_owner(project_id, auth.uid()));

CREATE POLICY "Owners can create invitations"
  ON pending_invitations FOR INSERT
  WITH CHECK (is_project_owner(project_id, auth.uid()));

CREATE POLICY "Owners can delete invitations"
  ON pending_invitations FOR DELETE
  USING (is_project_owner(project_id, auth.uid()));

-- ==========================================
-- USAGE LOGS POLICIES (Read-only for users)
-- ==========================================

CREATE POLICY "Users can view own usage logs"
  ON usage_logs FOR SELECT
  USING (user_id = auth.uid());

-- System inserts usage logs (secured via service role key in API)
CREATE POLICY "System can create usage logs"
  ON usage_logs FOR INSERT
  WITH CHECK (true);
