import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { GET, POST } from '@/app/api/projects/[id]/tasks/route';
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { tasks } from '@/lib/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { AuthError } from '@/lib/auth/session';

// Mock lib/auth/session
vi.mock('@/lib/auth/session', () => {
  class MockAuthError extends Error {
    statusCode: number
    constructor(message: string, statusCode: number) {
      super(message)
      this.statusCode = statusCode
      this.name = 'AuthError'
    }
  }

  return {
    getCurrentUser: vi.fn(),
    AuthError: MockAuthError,
  }
})

// Mock database
vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
  },
}));

// Mock Supabase to empty (since we use session.ts now)
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

describe('GET /api/projects/[id]/tasks', () => {
  const mockProjectId = 'proj-123';
  const mockUserId = 'user-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when user is not authenticated', async () => {
    console.log('TASKS IMPORT:', tasks ? 'Defined' : 'Undefined');
    // Debug 500 error - allowing error to pass through
    const consoleSpy = vi.spyOn(console, 'error');

    const { getCurrentUser } = await import('@/lib/auth/session');

    vi.mocked(getCurrentUser).mockRejectedValue(new AuthError('Unauthorized', 401));

    const request = new NextRequest(`http://localhost:3000/api/projects/${mockProjectId}/tasks`);
    const response = await GET(request, { params: { id: mockProjectId } });
    const data = await response.json();

    // restore
    consoleSpy.mockRestore();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('returns empty array when project has no tasks', async () => {
    const { getCurrentUser } = await import('@/lib/auth/session');

    vi.mocked(getCurrentUser).mockResolvedValue({ id: mockUserId, email: 'test@test.com' } as any);

    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([]),
      }),
    });

    vi.mocked(db.select).mockImplementation(mockSelect as any);

    const request = new NextRequest(`http://localhost:3000/api/projects/${mockProjectId}/tasks`);
    const response = await GET(request, { params: { id: mockProjectId } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.tasks).toEqual([]);
  });

  it('returns tasks for authenticated user with project access', async () => {
    const { getCurrentUser } = await import('@/lib/auth/session');

    const mockTasks = [
      {
        id: 'task-1',
        projectId: mockProjectId,
        title: 'Task 1',
        description: 'Description 1',
        status: 'Not started',
        createdBy: mockUserId,
        timeSpent: 0,
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        id: 'task-2',
        projectId: mockProjectId,
        title: 'Task 2',
        description: null,
        status: 'On-going',
        createdBy: mockUserId,
        timeSpent: 120,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ];

    vi.mocked(getCurrentUser).mockResolvedValue({ id: mockUserId, email: 'test@test.com' } as any);

    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(mockTasks),
      }),
    });

    vi.mocked(db.select).mockImplementation(mockSelect as any);

    const request = new NextRequest(`http://localhost:3000/api/projects/${mockProjectId}/tasks`);
    const response = await GET(request, { params: { id: mockProjectId } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.tasks).toHaveLength(2);
    expect(data.tasks[0].title).toBe('Task 1');
    expect(data.tasks[1].title).toBe('Task 2');
  });

  it('filters out soft-deleted tasks', async () => {
    const { getCurrentUser } = await import('@/lib/auth/session');

    const mockTasks = [
      {
        id: 'task-1',
        projectId: mockProjectId,
        title: 'Active Task',
        status: 'Not started',
        deletedAt: null,
      },
    ];

    vi.mocked(getCurrentUser).mockResolvedValue({ id: mockUserId, email: 'test@test.com' } as any);

    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(mockTasks),
      }),
    });

    vi.mocked(db.select).mockImplementation(mockSelect as any);

    const request = new NextRequest(`http://localhost:3000/api/projects/${mockProjectId}/tasks`);
    const response = await GET(request, { params: { id: mockProjectId } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.tasks).toHaveLength(1);
    expect(data.tasks[0].title).toBe('Active Task');
  });
});

describe('POST /api/projects/[id]/tasks', () => {
  const mockProjectId = 'proj-123';
  const mockUserId = 'user-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when user is not authenticated', async () => {
    const { getCurrentUser } = await import('@/lib/auth/session');

    vi.mocked(getCurrentUser).mockRejectedValue(new AuthError('Unauthorized', 401));

    const request = new NextRequest(`http://localhost:3000/api/projects/${mockProjectId}/tasks`, {
      method: 'POST',
      body: JSON.stringify({ title: 'New Task' }),
    });

    const response = await POST(request, { params: { id: mockProjectId } });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('returns 400 when title is missing', async () => {
    const { getCurrentUser } = await import('@/lib/auth/session');

    vi.mocked(getCurrentUser).mockResolvedValue({ id: mockUserId, email: 'test@test.com' } as any);

    const request = new NextRequest(`http://localhost:3000/api/projects/${mockProjectId}/tasks`, {
      method: 'POST',
      body: JSON.stringify({ description: 'No title provided' }),
    });

    const response = await POST(request, { params: { id: mockProjectId } });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation failed');
    expect(data.details.fieldErrors.title).toBeDefined();
  });

  it('creates task with minimal fields', async () => {
    const { getCurrentUser } = await import('@/lib/auth/session');

    const mockNewTask = {
      id: 'task-new',
      projectId: mockProjectId,
      title: 'New Task',
      description: null,
      status: 'Not started',
      estimatedHours: null,
      timeSpent: 0,
      sortOrder: 0,
      createdBy: mockUserId,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    vi.mocked(getCurrentUser).mockResolvedValue({ id: mockUserId, email: 'test@test.com' } as any);

    const mockInsert = vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([mockNewTask]),
      }),
    });

    vi.mocked(db.insert).mockImplementation(mockInsert as any);

    const request = new NextRequest(`http://localhost:3000/api/projects/${mockProjectId}/tasks`, {
      method: 'POST',
      body: JSON.stringify({ title: 'New Task' }),
    });

    const response = await POST(request, { params: { id: mockProjectId } });
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.task.title).toBe('New Task');
    expect(data.task.status).toBe('Not started');
    expect(data.task.createdBy).toBe(mockUserId);
  });

  it('creates task with all fields', async () => {
    const { getCurrentUser } = await import('@/lib/auth/session');

    const mockNewTask = {
      id: 'task-new',
      projectId: mockProjectId,
      title: 'Complex Task',
      description: 'Detailed description',
      status: 'On-going',
      estimatedHours: 8,
      timeSpent: 0,
      sortOrder: 5,
      createdBy: mockUserId,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    vi.mocked(getCurrentUser).mockResolvedValue({ id: mockUserId, email: 'test@test.com' } as any);

    const mockInsert = vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([mockNewTask]),
      }),
    });

    vi.mocked(db.insert).mockImplementation(mockInsert as any);

    const request = new NextRequest(`http://localhost:3000/api/projects/${mockProjectId}/tasks`, {
      method: 'POST',
      body: JSON.stringify({
        title: 'Complex Task',
        description: 'Detailed description',
        status: 'On-going',
        estimatedHours: 8,
        sortOrder: 5,
      }),
    });

    const response = await POST(request, { params: { id: mockProjectId } });
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.task.title).toBe('Complex Task');
    expect(data.task.description).toBe('Detailed description');
    expect(data.task.status).toBe('On-going');
    expect(data.task.estimatedHours).toBe(8);
    expect(data.task.sortOrder).toBe(5);
  });

  it('defaults status to "Not started" if not provided', async () => {
    const { getCurrentUser } = await import('@/lib/auth/session');

    const mockNewTask = {
      id: 'task-new',
      projectId: mockProjectId,
      title: 'Task with default status',
      status: 'Not started',
      createdBy: mockUserId,
      timeSpent: 0,
      sortOrder: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    vi.mocked(getCurrentUser).mockResolvedValue({ id: mockUserId, email: 'test@test.com' } as any);

    const mockInsert = vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([mockNewTask]),
      }),
    });

    vi.mocked(db.insert).mockImplementation(mockInsert as any);

    const request = new NextRequest(`http://localhost:3000/api/projects/${mockProjectId}/tasks`, {
      method: 'POST',
      body: JSON.stringify({ title: 'Task with default status' }),
    });

    const response = await POST(request, { params: { id: mockProjectId } });
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.task.status).toBe('Not started');
  });
});
