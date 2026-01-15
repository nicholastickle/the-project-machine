import { pgTable, uuid, text, timestamp, integer, boolean, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ==========================================
// ENUMS
// ==========================================

export const projectRoleEnum = pgEnum('project_role', ['editor', 'viewer']);
export const taskStatusEnum = pgEnum('task_status', ['Backlog', 'Planned', 'In Progress', 'Stuck', 'Completed', 'Cancelled']);
export const reflectionTypeEnum = pgEnum('reflection_type', ['start_of_day', 'end_of_day']);
export const chatRoleEnum = pgEnum('chat_role', ['user', 'assistant', 'system']);
export const assignmentRoleEnum = pgEnum('assignment_role', ['assignee', 'reviewer']);

// ==========================================
// CORE TABLES
// ==========================================

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  archivedAt: timestamp('archived_at', { withTimezone: true }),
  deletedAt: timestamp('deleted_at'), // Soft delete support
});

export const projectMembers = pgTable('project_members', {
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull(),
  role: projectRoleEnum('role').notNull().default('editor'),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
});

// Note: Users table managed by Supabase Auth
export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==========================================
// TASKS (Hybrid Model - First-class entities)
// ==========================================

export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  status: taskStatusEnum('status').notNull().default('Backlog'),
  estimatedHours: integer('estimated_hours'),
  timeSpent: integer('time_spent').notNull().default(0),
  sortOrder: integer('sort_order').notNull().default(0),
  createdBy: uuid('created_by').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const subtasks = pgTable('subtasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  taskId: uuid('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  isCompleted: boolean('is_completed').notNull().default(false),
  estimatedDuration: integer('estimated_duration').notNull().default(0),
  timeSpent: integer('time_spent').notNull().default(0),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'), // Soft delete support
});

export const taskAssignments = pgTable('task_assignments', {
  id: uuid('id').primaryKey().defaultRandom(),
  taskId: uuid('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull(),
  role: assignmentRoleEnum('role').notNull().default('assignee'),
  assignedAt: timestamp('assigned_at').defaultNow().notNull(),
  assignedBy: uuid('assigned_by').notNull(),
});

export const taskComments = pgTable('task_comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  taskId: uuid('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

// ==========================================
// TASKBOOK (Template Library)
// ==========================================

export const taskbookEntries = pgTable('taskbook_entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id'), // nullable - null means global template
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }), // nullable
  title: text('title').notNull(),
  description: text('description'),
  category: text('category'),
  defaultSubtasks: jsonb('default_subtasks'),
  usageCount: integer('usage_count').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

// ==========================================
// CANVAS (Visual Layout)
// ==========================================

export const planSnapshots = pgTable('plan_snapshots', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  snapshotData: jsonb('snapshot_data').notNull(), // { nodes: [{ id, task_id, position }], edges: [] }
  snapshotType: text('snapshot_type').default('manual'), // 'manual' | 'autosave' | 'ai_generated'
  summary: text('summary'),
  createdBy: uuid('created_by').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==========================================
// CHAT (AI Conversations)
// ==========================================

export const chatThreads = pgTable('chat_threads', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  createdBy: uuid('created_by').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const chatMessages = pgTable('chat_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  role: chatRoleEnum('role').notNull(),
  content: text('content').notNull(),
  createdBy: uuid('created_by'), // Nullable - only set for user messages, null for AI
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==========================================
// CONTEXT (Reflections & References)
// ==========================================

export const reflections = pgTable('reflections', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  reflectionType: text('reflection_type').notNull(), // TEXT instead of ENUM to match DB
  content: text('content').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  createdBy: uuid('created_by'), // Added to match DB schema
});

export const referenceNotes = pgTable('reference_notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  createdBy: uuid('created_by').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const fileSummaries = pgTable('file_summaries', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  confirmedBy: uuid('confirmed_by').notNull(),
  filename: text('filename').notNull(),
  fileType: text('file_type'), // 'excel' | 'csv' | 'pdf' | 'other'
  summary: text('summary').notNull(),
  confirmedAt: timestamp('confirmed_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==========================================
// COLLABORATION (Invitations)
// ==========================================

export const pendingInvitations = pgTable('pending_invitations', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  invitedEmail: text('invited_email').notNull(),
  role: projectRoleEnum('role').notNull(),
  invitedBy: uuid('invited_by').notNull(),
  inviteToken: text('invite_token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  acceptedAt: timestamp('accepted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==========================================
// OBSERVABILITY (Usage Logs)
// ==========================================

export const usageLogs = pgTable('usage_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  userId: uuid('user_id'), // nullable - allows tracking before login
  eventType: text('event_type').notNull(), // 'page_view' | 'landing_cta_click' | 'project_created' | etc.
  eventData: jsonb('event_data'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==========================================
// RELATIONS (For Drizzle Query API)
// ==========================================

export const projectsRelations = relations(projects, ({ many, one }) => ({
  members: many(projectMembers),
  tasks: many(tasks),
  snapshots: many(planSnapshots),
  chatThreads: many(chatThreads),
  reflections: many(reflections),
  referenceNotes: many(referenceNotes),
  fileSummaries: many(fileSummaries),
  invitations: many(pendingInvitations),
  taskbookEntries: many(taskbookEntries),
  usageLogs: many(usageLogs),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  subtasks: many(subtasks),
  assignments: many(taskAssignments),
  comments: many(taskComments),
}));

export const subtasksRelations = relations(subtasks, ({ one }) => ({
  task: one(tasks, {
    fields: [subtasks.taskId],
    references: [tasks.id],
  }),
}));

export const taskAssignmentsRelations = relations(taskAssignments, ({ one }) => ({
  task: one(tasks, {
    fields: [taskAssignments.taskId],
    references: [tasks.id],
  }),
}));

export const taskCommentsRelations = relations(taskComments, ({ one }) => ({
  task: one(tasks, {
    fields: [taskComments.taskId],
    references: [tasks.id],
  }),
}));

export const chatThreadsRelations = relations(chatThreads, ({ one, many }) => ({
  project: one(projects, {
    fields: [chatThreads.projectId],
    references: [projects.id],
  }),
  messages: many(chatMessages),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  project: one(projects, {
    fields: [chatMessages.projectId],
    references: [projects.id],
  }),
}));
