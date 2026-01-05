# Entity Relationship Diagram

> **Updated**: January 5, 2026 - Hybrid Model v0.3 (Tasks as first-class entities)

## Overview

This ERD represents the **Hybrid Model** architecture where:
- **Tasks** are real database rows (single source of truth for title, status, description)
- **Canvas** visualizes tasks via `PLAN_SNAPSHOT.canvas_state` which stores layout (x,y coordinates) and references Task IDs
- **Subtasks** are first-class entities for granular tracking
- **Soft-delete** everywhere (deleted_at timestamps)
- **Simplified permissions** (owner vs editor, no viewer role in v0.3)

## Diagram

```mermaid
erDiagram
    %% ==========================================
    %% CORE: Users & Projects
    %% ==========================================
    
    USER {
        uuid id PK
        string email
        timestamp created_at
    }

    PROJECT {
        uuid id PK
        string name
        uuid created_by FK
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    PROJECT_MEMBER {
        uuid project_id PK,FK
        uuid user_id PK,FK
        string role "editor | viewer"
        timestamp joined_at
    }

    %% ==========================================
    %% TASKS: First-class entities (Hybrid Model)
    %% ==========================================

    TASK {
        uuid id PK
        uuid project_id FK
        string title
        text description
        string status "backlog | in_progress | blocked | done"
        integer estimated_hours
        integer time_spent
        integer sort_order
        uuid created_by FK
        timestamp created_at
        timestamp updated_at
    }

    SUBTASK {
        uuid id PK
        uuid task_id FK
        string title
        boolean is_completed
        integer estimated_duration
        integer time_spent
        integer sort_order
        timestamp created_at
        timestamp updated_at
    }

    TASK_ASSIGNMENT {
        uuid id PK
        uuid task_id FK
        uuid user_id FK
        string role "assignee | reviewer"
        timestamp assigned_at
        uuid assigned_by FK
    }

    TASK_COMMENT {
        uuid id PK
        uuid task_id FK
        uuid user_id FK
        text content
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    %% ==========================================
    %% TASKBOOK: Template Library
    %% ==========================================

    TASKBOOK_ENTRY {
        uuid id PK
        uuid user_id FK "nullable - null means global template"
        uuid project_id FK "nullable - project-specific or global"
        string title
        text description
        string category
        jsonb default_subtasks
        integer usage_count
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    %% ==========================================
    %% CANVAS: Visual Layout (references Tasks)
    %% ==========================================

    PLAN_SNAPSHOT {
        uuid id PK
        uuid project_id FK
        jsonb canvas_state "nodes with task_id refs, edges, viewport"
        text summary
        uuid created_by FK
        timestamp created_at
    }

    %% ==========================================
    %% CHAT: AI Conversation History
    %% ==========================================

    CHAT_THREAD {
        uuid id PK
        uuid project_id FK
        string title
        uuid created_by FK
        timestamp created_at
        timestamp updated_at
    }

    CHAT_MESSAGE {
        uuid id PK
        uuid thread_id FK
        string role "user | assistant | system"
        text content
        jsonb metadata "model, tokens, tool_calls"
        uuid created_by FK
        timestamp created_at
    }

    %% ==========================================
    %% CONTEXT: Reflections & References
    %% ==========================================

    REFLECTION {
        uuid id PK
        uuid project_id FK
        uuid user_id FK
        string reflection_type "start_of_day | end_of_day"
        text content
        timestamp created_at
    }
TASK {
        uuid id PK
        uuid project_id FK
        string title
        text description
        string status "backlog | in_progress | blocked | done"
        integer estimated_hours
        integer time_spent
        integer sort_order
        uuid created_by FK
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
        timestamp updated_at
    }

    FILE_SUMMARY {
        uuid id PK
        uuid project_id FK
        uuid confirmed_by FK
        string filename
        string file_type "excel | csv | pdf | other"
        text summary
        timestamp confirmed_at
        timestamp created_at
    }

    %% ==========================================
    %% COLLABORATION: Invitations
    %% ==========================================

    PENDING_INVITATION {
        uuid id PK
        uuid project_id FK
        string invited_email
        string role "editor | viewer"
        uuid invited_by FK
        string invite_token UK
        timestamp expires_at
        timestamp accepted_at
        timestamp created_at
   uuid id PK
    %% ==========================================
    %% OBSERVABILITY: Usage Logs
    %% ==========================================

    USAGE_LOG {
        uuid id PK
        uuid project_id FK
        uuid user_id FK
        string event_type
        jsonb event_data
        timestamp created_at
    }        uuid project_id FK
        uuid user_id FK
        string event_type
        jsonb event_data
        timestamp created_at
    }

    %% ==========================================
    %% RELATIONSHIPS
    %% ==========================================

    %% Project Membership
    USER ||--o{ PROJECT_MEMBER : "participates in"
    PROJECT ||--o{ PROJECT_MEMBER : "has members"
    USER ||--o{ PROJECT : "creates"

    %% Tasks (Core Hybrid Model)
    PROJECT ||--o{ TASK : "contains"
    USER ||--o{ TASK : "creates"
    TASK ||--o{ SUBTASK : "has"
    TASK ||--o{ TASK_ASSIGNMENT : "assigned via"
    TASK ||--o{ TASK_COMMENT : "discussed in"
    USER ||--o{ TASK_ASSIGNMENT : "assigned to"
    USER ||--o{ TASK_COMMENT : "writes"
    TASK_COMMENT ||--o{ TASK_COMMENT : "replies to"

    USER ||--o{ TASKBOOK_ENTRY : "owns"
    PROJECT ||--o{ TASKBOOK_ENTRY : "has templates"
    TASKBOOK_ENTRY ||--o| TASK : "origin of"

    %% Canvas & Snapshots
    PROJECT ||--o{ PLAN_SNAPSHOT : "versioned by"
    USER ||--o{ PLAN_SNAPSHOT : "creates"

    %% Chat
    PROJECT ||--o{ CHAT_THREAD : "has conversations"
    CHAT_THREAD ||--o{ CHAT_MESSAGE : "contains"
    USER ||--o{ CHAT_THREAD : "starts"
    USER ||--o{ CHAT_MESSAGE : "sends"

    %% Context & References
    PROJECT ||--o{ REFLECTION : "has"
    PROJECT ||--o{ REFERENCE_NOTE : "includes"
    PROJECT ||--o{ FILE_SUMMARY : "includes"
    USER ||--o{ REFFILE_SUMMARY : "includes"
    USER ||--o{ REFLECTION : "writes"
    USER ||--o{ FILE_SUMMARY : "confirms"

    %% Collaboration
    PROJECT ||--o{ PENDING_INVITATION : "has invites"
    USER ||--o{ PENDING_INVITATION : "send
    %% Observability
    PROJECT ||--o{ USAGE_LOG : "generates"
    USER ||--o{ USAGE_LOG : "triggers"## Canvas State Schema

The `PLAN_SNAPSHOT.canvas_state` JSONB stores visual layout only, referencing Tasks by ID:

```typescript
interface CanvasState {
  nodes: Array<{
    id: string;           // Node ID (for ReactFlow)
    task_id: string;      // FK to tasks table
    type: 'task-card';
    position: { x: number; y: number };
    // Visual properties only - no task data duplication
  }>;
  edges: Array<{
    id: string;
    source: string;       // Node ID
    target: string;       // Node ID
    sourceHandle?: string;
    targetHandle?: string;
  }>;
  viewport?: {
    x: number;
    y: number;
    zoom: number;
  };
}
```

## Migration Notes

### From v1.0 (JSON Canvas) to v2.0 (Hybrid Model)

1. **Extract Tasks**: Parse existing `plan_snapshots.snapshot_data` and create `TASK` rows
2. **Extract Subtasks**: Create `SUBTASK` rows from task node subtask arrays
3. **Update Canvas State**: Replace embedded task data with `task_id` references
4. **Migrate Chat**: Move `chat_messages` to `CHAT_THREAD` + `CHAT_MESSAGE` structure

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Tasks as DB rows | Enables querying by status, individual addressing, API access |
| Subtasks as separate table | Supports reordering, individual tracking, future features |
| Canvas stores references | Separation of concerns - visual layout vs task data |
| TASKBOOK_ENTRY nullable user_id | Allows both global templates and user-specific templates |
| TASK_COMMENT self-reference | Enables threaded discussions without separate reply table |
 (v0.3)

| Decision | Rationale |
|----------|-----------|
| Tasks as DB rows | Enables querying by status, individual addressing, API access |
| Subtasks as separate table | Supports reordering, individual tracking, future features |
| Canvas stores references | Separation of concerns - visual layout vs task data |
| TASKBOOK_ENTRY nullable user_id | Allows both global templates and user-specific templates |
| TASK_ASSIGNMENT junction table | Efficient queries ("all my tasks"), audit trail, extensible for roles |
| Soft-delete everywhere | Can restore deleted items, audit trail, safer than hard delete |
| usage_log table kept | Rate limiting, business logic (PostHog for analytics dashboards) |
| No snapshot_type field | v0.3 only autosaves, will add AI-generated flag when needed |
| No threaded comments | Removed parent_comment_id for v0.3 simplicity |
| Simplified permissions | Owner vs Editor only (no Viewer role yet) |
| sort_order field kept | Required for drag-drop reordering on canvas