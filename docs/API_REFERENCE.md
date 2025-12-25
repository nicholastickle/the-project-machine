# Project Machine - API Reference

**Version**: 1.0.0  
**Base URL**: `/api`  
**Authentication**: All endpoints require Supabase JWT token via cookies (handled automatically by client)

---

## Table of Contents

1. [Projects](#projects)
2. [Snapshots](#snapshots)
3. [Reflections](#reflections)
4. [Files](#files)
5. [Exports](#exports)
6. [AI Chat](#ai-chat)
7. [Usage Tracking](#usage-tracking)
8. [Collaboration](#collaboration) *(Coming Soon)*
9. [Settings](#settings) *(Coming Soon)*

---

## Projects

### `GET /api/projects`
**Get all projects for current user**

**Response**:
```json
{
  "projects": [
    {
      "id": "uuid",
      "name": "My Project",
      "description": "Project description",
      "created_at": "2025-12-25T00:00:00Z",
      "updated_at": "2025-12-25T00:00:00Z"
    }
  ]
}
```

### `POST /api/projects`
**Create new project**

**Request**:
```json
{
  "name": "New Project",
  "description": "Optional description"
}
```

**Response**:
```json
{
  "project": {
    "id": "uuid",
    "name": "New Project",
    "description": "Optional description",
    "created_at": "2025-12-25T00:00:00Z"
  }
}
```

### `PATCH /api/projects/[id]`
**Update project metadata**

**Request**:
```json
{
  "name": "Updated Name",
  "description": "Updated description"
}
```

**Response**:
```json
{
  "project": {
    "id": "uuid",
    "name": "Updated Name",
    "description": "Updated description"
  }
}
```

### `DELETE /api/projects/[id]`
**Delete project and all related data**

**Response**:
```json
{
  "success": true
}
```

---

## Snapshots

### `GET /api/projects/[id]/snapshots`
**Get all snapshots for project (ordered newest first)**

**Response**:
```json
{
  "snapshots": [
    {
      "id": "uuid",
      "project_id": "uuid",
      "snapshot_data": {
        "nodes": [...],
        "edges": [...]
      },
      "created_at": "2025-12-25T00:00:00Z"
    }
  ]
}
```

### `POST /api/projects/[id]/snapshots`
**Create new snapshot (autosave)**

**Request**:
```json
{
  "snapshot_data": {
    "nodes": [
      {
        "id": "task-1",
        "type": "taskCardNode",
        "position": { "x": 100, "y": 200 },
        "data": {
          "title": "Task Title",
          "status": "Not started",
          "description": "Task description",
          "estimatedHours": 4,
          "timeSpent": 0,
          "subtasks": []
        }
      }
    ],
    "edges": [
      {
        "id": "e1-2",
        "source": "task-1",
        "target": "task-2"
      }
    ]
  }
}
```

**Response**:
```json
{
  "snapshot": {
    "id": "uuid",
    "created_at": "2025-12-25T00:00:00Z"
  }
}
```

### `GET /api/projects/[id]/snapshots/[snapshotId]`
**Get specific snapshot by ID**

**Response**:
```json
{
  "snapshot": {
    "id": "uuid",
    "snapshot_data": { "nodes": [...], "edges": [...] },
    "created_at": "2025-12-25T00:00:00Z"
  }
}
```

### `POST /api/projects/[id]/snapshots/[snapshotId]/restore`
**Restore canvas to a previous snapshot**

**Response**:
```json
{
  "snapshot": {
    "id": "uuid",
    "snapshot_data": { "nodes": [...], "edges": [...] }
  }
}
```

**Note**: Creates new snapshot with restored data (doesn't modify history)

---

## Reflections

### `GET /api/projects/[id]/reflections`
**Get all reflections for project**

**Query Params**:
- `type` (optional): `start-of-day` | `end-of-day` | `ad-hoc`
- `limit` (optional): Number of results (default: 50)

**Response**:
```json
{
  "reflections": [
    {
      "id": "uuid",
      "project_id": "uuid",
      "reflection_type": "start-of-day",
      "reflection_text": "Today I plan to...",
      "created_at": "2025-12-25T09:00:00Z"
    }
  ]
}
```

### `POST /api/projects/[id]/reflections`
**Create new reflection**

**Request**:
```json
{
  "reflection_type": "start-of-day",
  "reflection_text": "Today I plan to complete the login feature and fix bugs."
}
```

**Response**:
```json
{
  "reflection": {
    "id": "uuid",
    "reflection_type": "start-of-day",
    "reflection_text": "Today I plan to...",
    "created_at": "2025-12-25T09:00:00Z"
  }
}
```

### `PATCH /api/projects/[id]/reflections/[reflectionId]`
**Update existing reflection**

**Request**:
```json
{
  "reflection_text": "Updated reflection text"
}
```

**Response**:
```json
{
  "reflection": {
    "id": "uuid",
    "reflection_text": "Updated reflection text"
  }
}
```

### `DELETE /api/projects/[id]/reflections/[reflectionId]`
**Delete reflection**

**Response**:
```json
{
  "success": true
}
```

---

## Files

### `GET /api/projects/[id]/files`
**Get all uploaded files and their summaries**

**Response**:
```json
{
  "files": [
    {
      "id": "uuid",
      "project_id": "uuid",
      "filename": "requirements.xlsx",
      "file_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "file_size_bytes": 45000,
      "storage_path": "project-files/project-id/timestamp_filename.xlsx",
      "ai_generated_summary": "This file contains...",
      "summary": "User-edited summary or null if not confirmed",
      "confirmed_at": "2025-12-25T10:00:00Z",
      "created_at": "2025-12-25T09:30:00Z"
    }
  ]
}
```

### `POST /api/projects/[id]/files`
**Upload file and generate AI summary**

**Request**: `multipart/form-data`
- `file`: File upload (Excel, CSV, or PDF)
- `extractStructure`: `"true"` to extract file structure for AI

**Response**:
```json
{
  "file": {
    "id": "uuid",
    "filename": "requirements.xlsx",
    "file_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "file_size_bytes": 45000,
    "ai_generated_summary": "This Excel file contains 3 sheets: Requirements (23 rows)...",
    "confirmed_at": null
  }
}
```

**Notes**:
- Max file size: 10MB
- Allowed types: `.xlsx`, `.xls`, `.csv`, `.pdf`
- File not used in AI context until confirmed
- Extracts structure (sheets, columns, headings) for AI to summarize

### `PATCH /api/projects/[id]/files/[fileId]`
**Confirm file summary (user can edit AI-generated summary)**

**Request**:
```json
{
  "summary": "User-edited summary of what this file contains"
}
```

**Response**:
```json
{
  "file": {
    "id": "uuid",
    "summary": "User-edited summary",
    "confirmed_at": "2025-12-25T10:00:00Z"
  }
}
```

### `DELETE /api/projects/[id]/files/[fileId]`
**Delete file from storage and database**

**Response**:
```json
{
  "success": true
}
```

---

## Exports

### `GET /api/projects/[id]/export/excel`
**Export project as Excel workbook**

**Response**: Excel file download (`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`)

**Sheets**:
1. **Tasks**: All task cards with status, estimates, time spent, dependencies
2. **Subtasks**: All subtasks with completion status, duration, time spent
3. **Project Info**: Metadata (name, description, export date, task count)

**Headers**:
- Tasks: ID, Title, Status, Description, Est. Hours, Time Spent, Progress %, Dependencies
- Subtasks: Parent Task, Title, Completed, Est. Duration (min), Time Spent (min)

### `GET /api/projects/[id]/export/timesheet`
**Export time tracking as timesheet**

**Response**: Excel file download

**Format**: Timesheet with date, task, subtask, hours, status, notes

**Use Case**: Billing, time reports, invoicing

---

## AI Chat

### `POST /api/ai/chat`
**Send message to AI assistant**

**Request**:
```json
{
  "projectId": "uuid",
  "message": "Add a task for user authentication",
  "history": [
    { "role": "user", "content": "Previous message" },
    { "role": "assistant", "content": "Previous response" }
  ],
  "currentSnapshot": {
    "nodes": [...],
    "edges": [...]
  }
}
```

**Response**:
```json
{
  "response": "I'll add that task for you. [COMMAND:{...}]",
  "sources": ["current_plan", "reflections", "file_summaries"],
  "tokens_used": 450
}
```

**AI Context Includes**:
1. Current plan (nodes + edges from snapshot)
2. Last 5 snapshots (to understand changes)
3. Recent reflections (start/end of day)
4. Reference notes (future feature)
5. Confirmed file summaries

**Command Format** (embedded in response):
```json
[COMMAND:{
  "action": "addTask",
  "title": "User Authentication",
  "status": "Not started",
  "description": "Implement login/signup",
  "subtasks": []
}]
```

**Supported Commands**:
- `addTask`: Create new task node
- `updateTask`: Modify existing task (match by title)
- `deleteTask`: Remove task (match by title)

**Note**: Commands shown to user for confirmation before execution

---

## Chat History

### `GET /api/projects/[id]/chat`
**Load conversation history**

**Response**:
```json
{
  "messages": [
    {
      "id": "uuid",
      "role": "user",
      "content": "Add a login task",
      "created_at": "2025-12-25T10:00:00Z"
    },
    {
      "id": "uuid",
      "role": "assistant",
      "content": "I'll add that for you...",
      "created_at": "2025-12-25T10:00:05Z"
    }
  ]
}
```

**Notes**:
- Messages ordered chronologically (oldest first)
- Only returns messages for current project
- Use this to restore chat on page reload

### `POST /api/projects/[id]/chat`
**Save chat message**

**Request**:
```json
{
  "role": "user",
  "content": "Add a task for user authentication"
}
```

**Response**:
```json
{
  "message": {
    "id": "uuid",
    "role": "user",
    "content": "Add a task for user authentication",
    "created_at": "2025-12-25T10:00:00Z"
  }
}
```

**Notes**:
- Call this after sending to AI to save in database
- Save both user and assistant messages
- Role must be "user" or "assistant"

### `DELETE /api/projects/[id]/chat`
**Clear all chat history for project**

**Response**:
```json
{
  "success": true
}
```

**Notes**:
- Deletes all messages for this project
- Cannot be undone
- Only project owner can clear history

---

## Collaboration

### `GET /api/projects/[id]/collaborators`
**List all project collaborators**

**Response**:
```json
{
  "collaborators": [
    {
      "user_id": "uuid",
      "role": "owner",
      "joined_at": null
    },
    {
      "user_id": "uuid",
      "role": "editor",
      "joined_at": "2025-12-25T10:00:00Z"
    }
  ]
}
```

**Roles**:
- `owner`: Project creator (cannot be removed)
- `editor`: Can edit canvas, add reflections, upload files
- `viewer`: Read-only access (future feature)

### `POST /api/projects/[id]/collaborators`
**Invite user to project** *(Not Yet Implemented)*

**Request**:
```json
{
  "email": "user@example.com",
  "role": "editor"
}
```

**Response**:
```json
{
  "message": "Invitation feature coming soon",
  "details": "In v1.0, this will send an email invitation to the user"
}
```

**Status**: `501 Not Implemented`

**Future Implementation**:
1. Create pending invitation
2. Send email with invitation link
3. User accepts via link
4. Add to project_members table

### `DELETE /api/projects/[id]/collaborators/[userId]`
**Remove collaborator from project**

**Response**:
```json
{
  "success": true
}
```

**Notes**:
- Only project owner can remove collaborators
- Cannot remove project owner
- User loses all access to project

---

## Reference Notes

### `GET /api/projects/[id]/notes`
**Get all reference notes (institutional knowledge)**

**Response**:
```json
{
  "notes": [
    {
      "id": "uuid",
      "title": "Database Schema Notes",
      "content": "Our user table uses UUID...",
      "created_at": "2025-12-20T10:00:00Z",
      "updated_at": "2025-12-25T10:00:00Z"
    }
  ]
}
```

**Notes**:
- Ordered by updated_at (newest first)
- Used by AI for context about institutional knowledge
- Different from files (these are manually written notes)

### `POST /api/projects/[id]/notes`
**Create new reference note**

**Request**:
```json
{
  "title": "Database Schema Notes",
  "content": "Our user table uses UUID primary keys..."
}
```

**Response**:
```json
{
  "note": {
    "id": "uuid",
    "title": "Database Schema Notes",
    "content": "Our user table uses UUID...",
    "created_at": "2025-12-25T10:00:00Z",
    "updated_at": "2025-12-25T10:00:00Z"
  }
}
```

### `PATCH /api/projects/[id]/notes/[noteId]`
**Update reference note**

**Request**:
```json
{
  "title": "Updated Title",
  "content": "Updated content"
}
```

**Response**:
```json
{
  "note": {
    "id": "uuid",
    "title": "Updated Title",
    "content": "Updated content",
    "updated_at": "2025-12-25T11:00:00Z"
  }
}
```

### `DELETE /api/projects/[id]/notes/[noteId]`
**Delete reference note**

**Response**:
```json
{
  "success": true
}
```

---

## Usage Tracking

### `GET /api/usage`
**Get usage statistics for current user**

**Query Params**:
- `start_date` (optional): ISO date string
- `end_date` (optional): ISO date string
- `event_type` (optional): Filter by event type

**Response**:
```json
{
  "usage": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "project_id": "uuid",
      "event_type": "ai_query",
      "event_data": {
        "message_length": 45,
        "response_length": 230,
        "model": "gpt-4o-mini",
        "tokens_used": 450
      },
      "created_at": "2025-12-25T10:30:00Z"
    }
  ],
  "summary": {
    "total_events": 150,
    "total_ai_tokens": 45000,
    "total_file_uploads": 12,
    "total_exports": 8
  }
}
```

**Event Types**:
- `ai_query`: AI chat message
- `file_upload`: File uploaded
- `project_export`: Excel/timesheet export
- `snapshot_save`: Autosave triggered
- `snapshot_restore`: Restored previous version

---

## Collaboration *(Coming Soon)*

### `POST /api/projects/[id]/share`
**Invite user to project**

### `GET /api/projects/[id]/collaborators`
**List all project collaborators**

### `DELETE /api/projects/[id]/collaborators/[userId]`
**Remove collaborator**

---

## Settings *(Coming Soon)*

### `GET /api/projects/[id]/settings`
**Get project settings**

### `PATCH /api/projects/[id]/settings`
**Update project settings**

---

## Database Schema

### Tables

**projects**
- `id` (uuid, PK)
- `user_id` (uuid, FK to auth.users)
- `name` (text)
- `description` (text, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**snapshots**
- `id` (uuid, PK)
- `project_id` (uuid, FK to projects)
- `snapshot_data` (jsonb) - Contains nodes and edges
- `created_at` (timestamp)

**reflections**
- `id` (uuid, PK)
- `project_id` (uuid, FK to projects)
- `reflection_type` (text) - 'start-of-day', 'end-of-day', 'ad-hoc'
- `reflection_text` (text)
- `created_at` (timestamp)

**file_summaries**
- `id` (uuid, PK)
- `project_id` (uuid, FK to projects)
- `filename` (text)
- `file_type` (text)
- `file_size_bytes` (integer)
- `storage_path` (text) - Path in Supabase Storage
- `ai_generated_summary` (text)
- `summary` (text, nullable) - User-confirmed summary
- `confirmed_at` (timestamp, nullable)
- `created_at` (timestamp)

**chat_messages**
- `id` (uuid, PK)
- `project_id` (uuid, FK to projects)
- `role` (text) - 'user' or 'assistant'
- `content` (text)
- `created_at` (timestamp)
- `created_by` (uuid, FK to auth.users)

**project_members**
- `project_id` (uuid, FK to projects)
- `user_id` (uuid, FK to auth.users)
- `role` (text) - 'editor' or 'viewer'
- `joined_at` (timestamp)
- Primary Key: (project_id, user_id)

**usage_logs**
- `id` (uuid, PK)
- `user_id` (uuid, FK to auth.users)
- `project_id` (uuid, FK to projects, nullable)
- `event_type` (text)
- `event_data` (jsonb)
- `created_at` (timestamp)

---

## Error Responses

All endpoints return consistent error format:

```json
{
  "error": "Error message",
  "details": "Additional context (optional)"
}
```

**Common Status Codes**:
- `200`: Success
- `400`: Bad request (invalid input)
- `401`: Unauthorized (not logged in)
- `403`: Forbidden (not project owner)
- `404`: Resource not found
- `500`: Server error

---

## Rate Limits

- AI Chat: 60 requests/minute per user
- File Upload: 10 files/minute per user
- Exports: 20 requests/minute per user
- All others: 100 requests/minute per user

---

## Authentication

All API routes use Supabase Row Level Security (RLS):

1. User must be authenticated (JWT token in cookies)
2. Users can only access their own projects
3. Projects table has RLS policy: `user_id = auth.uid()`
4. All child tables (snapshots, reflections, files) enforce project ownership

**Client-side usage**:
```typescript
// Automatically includes auth cookies
const response = await fetch('/api/projects', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'New Project' })
})
```

---

## Future Endpoints (Not Yet Implemented)

### Project Settings
- `GET /api/projects/[id]/settings` - Get settings
- `PATCH /api/projects/[id]/settings` - Update settings

### Reference Notes (Manual Context)
- `POST /api/projects/[id]/notes` - Add note
- `GET /api/projects/[id]/notes` - List notes
- `DELETE /api/projects/[id]/notes/[noteId]` - Delete note

---

**Last Updated**: December 25, 2025
