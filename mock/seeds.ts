// =========================================================================
// MOCK DATA TO SEED LOCAL STORAGE
// =========================================================================

import type { User, Project, Task, Subtask, TaskComment, ProjectMember, Node, Edge, ProjectData } from '@/stores/types';

export const mockUser: User = {
  id: 'user-dev-123',
  email: 'dev@example.com',
  name: 'Dev User',
  avatar_url: undefined,
  created_at: new Date().toISOString(),
};

export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Marketing Campaign',
    description: 'Q1 2024 Marketing Campaign Planning',
    created_by: mockUser.id,
    viewport: { x: 0, y: 0, zoom: 1 },
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z',
  },
  {
    id: 'proj-2',
    name: 'Product Roadmap',
    description: 'Product development roadmap',
    created_by: mockUser.id,
    viewport: { x: 0, y: 0, zoom: 1 },
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
];

export const mockProjectData: Record<string, ProjectData> = {
  'proj-1': {
    project: mockProjects[0],
    tasks: [
      {
        id: 'task-1',
        node_id: 'node-1',
        project_id: 'proj-1',
        title: 'Design Homepage',
        description: 'Create new homepage design',
        status: 'in_progress',
        estimated_hours: 28800, // 8 hours in seconds
        time_spent: 10800, // 3 hours in seconds
        sort_order: 1,
        created_by: mockUser.id,
        created_at: '2024-01-10T10:00:00Z',
        updated_at: '2024-01-10T10:00:00Z',
      },
      {
        id: 'task-2',
        node_id: 'node-2',
        project_id: 'proj-1',
        title: 'Write Copy',
        description: 'Marketing copy for campaign',
        status: 'planned',
        estimated_hours: 14400, // 4 hours in seconds
        time_spent: 0,
        sort_order: 2,
        created_by: mockUser.id,
        created_at: '2024-01-10T11:00:00Z',
        updated_at: '2024-01-10T11:00:00Z',
      },
    ],
    subtasks: [
      {
        id: 'subtask-1',
        task_id: 'task-1',
        title: 'Create wireframes',
        is_completed: true,
        estimated_duration: 7200, // 2 hours in seconds
        time_spent: 7200,
        sort_order: 1,
        created_at: '2024-01-10T10:30:00Z',
        updated_at: '2024-01-10T10:30:00Z',
      },
      {
        id: 'subtask-2',
        task_id: 'task-1',
        title: 'Design mockups',
        is_completed: false,
        estimated_duration: 10800, // 3 hours in seconds
        time_spent: 3600, // 1 hour in seconds
        sort_order: 2,
        created_at: '2024-01-10T10:31:00Z',
        updated_at: '2024-01-10T10:31:00Z',
      },
    ],
    comments: [
      {
        id: 'comment-1',
        task_id: 'task-1',
        user_id: mockUser.id,
        user_name: mockUser.name || 'Dev User',
        content: 'Looking great so far!',
        created_at: '2024-01-10T14:00:00Z',
        updated_at: '2024-01-10T14:00:00Z',
      },
    ],
    nodes: [
      {
        id: 'node-1',
        project_id: 'proj-1',
        content_id: 'task-1',
        type: 'task',
        position: { x: 100, y: 100 },
        data: { label: 'Design Homepage' },
      },
      {
        id: 'node-2',
        project_id: 'proj-1',
        content_id: 'task-2',
        type: 'task',
        position: { x: 400, y: 100 },
        data: { label: 'Write Copy' },
      },
    ],
    edges: [
      {
        id: 'edge-1',
        project_id: 'proj-1',
        source: 'node-1',
        target: 'node-2',
      },
    ],
    members: [
      {
        project_id: 'proj-1',
        user_id: mockUser.id,
        name: mockUser.name,
        role: 'admin',
      },
    ],
  },
  'proj-2': {
    project: mockProjects[1],
    tasks: [],
    subtasks: [],
    comments: [],
    nodes: [],
    edges: [],
    members: [
      {
        project_id: 'proj-2',
        user_id: mockUser.id,
        name: mockUser.name,
        role: 'admin',
      },
    ],
  },
};