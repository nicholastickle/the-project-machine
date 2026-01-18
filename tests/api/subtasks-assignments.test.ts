import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET, POST } from '@/app/api/tasks/[id]/subtasks/route';
import { GET as getAssignments, POST as postAssignment, DELETE as deleteAssignment } from '@/app/api/tasks/[id]/assignments/route';
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';

// Mock Supabase
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

// Mock database
vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('GET /api/tasks/[id]/subtasks', () => {
  const mockTaskId = 'task-123';
  const mockUserId = 'user-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when user is not authenticated', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: { message: 'Unauthorized' },
        }),
      },
    } as any);

    const request = new NextRequest(`http://localhost:3000/api/tasks/${mockTaskId}/subtasks`);
    const response = await GET(request, { params: { id: mockTaskId } });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('returns empty array when task has no subtasks', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: mockUserId, email: 'test@test.com' } },
          error: null,
        }),
      },
    } as any);

    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockResolvedValue([]),
        }),
      }),
    });

    vi.mocked(db.select).mockImplementation(mockSelect as any);

    const request = new NextRequest(`http://localhost:3000/api/tasks/${mockTaskId}/subtasks`);
    const response = await GET(request, { params: { id: mockTaskId } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.subtasks).toEqual([]);
  });

  it('returns subtasks ordered by sortOrder', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    
    const mockSubtasks = [
      {
        id: 'subtask-1',
        taskId: mockTaskId,
        title: 'First subtask',
        isCompleted: false,
        estimatedDuration: 30,
        timeSpent: 0,
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'subtask-2',
        taskId: mockTaskId,
        title: 'Second subtask',
        isCompleted: true,
        estimatedDuration: 60,
        timeSpent: 45,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: mockUserId, email: 'test@test.com' } },
          error: null,
        }),
      },
    } as any);

    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockResolvedValue(mockSubtasks),
        }),
      }),
    });

    vi.mocked(db.select).mockImplementation(mockSelect as any);

    const request = new NextRequest(`http://localhost:3000/api/tasks/${mockTaskId}/subtasks`);
    const response = await GET(request, { params: { id: mockTaskId } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.subtasks).toHaveLength(2);
    expect(data.subtasks[0].sortOrder).toBe(0);
    expect(data.subtasks[1].sortOrder).toBe(1);
  });
});

describe('POST /api/tasks/[id]/subtasks', () => {
  const mockTaskId = 'task-123';
  const mockUserId = 'user-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when user is not authenticated', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: { message: 'Unauthorized' },
        }),
      },
    } as any);

    const request = new NextRequest(`http://localhost:3000/api/tasks/${mockTaskId}/subtasks`, {
      method: 'POST',
      body: JSON.stringify({ title: 'New Subtask' }),
    });
    
    const response = await POST(request, { params: { id: mockTaskId } });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('returns 400 when title is missing', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: mockUserId, email: 'test@test.com' } },
          error: null,
        }),
      },
    } as any);

    const request = new NextRequest(`http://localhost:3000/api/tasks/${mockTaskId}/subtasks`, {
      method: 'POST',
      body: JSON.stringify({ estimatedDuration: 30 }),
    });
    
    const response = await POST(request, { params: { id: mockTaskId } });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Title is required');
  });

  it('creates subtask with minimal fields', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    
    const mockNewSubtask = {
      id: 'subtask-new',
      taskId: mockTaskId,
      title: 'New Subtask',
      isCompleted: false,
      estimatedDuration: 0,
      timeSpent: 0,
      sortOrder: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: mockUserId, email: 'test@test.com' } },
          error: null,
        }),
      },
    } as any);

    const mockInsert = vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([mockNewSubtask]),
      }),
    });

    vi.mocked(db.insert).mockImplementation(mockInsert as any);

    const request = new NextRequest(`http://localhost:3000/api/tasks/${mockTaskId}/subtasks`, {
      method: 'POST',
      body: JSON.stringify({ title: 'New Subtask' }),
    });
    
    const response = await POST(request, { params: { id: mockTaskId } });
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.subtask.title).toBe('New Subtask');
    expect(data.subtask.isCompleted).toBe(false);
    expect(data.subtask.timeSpent).toBe(0);
  });

  it('creates subtask with all fields', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    
    const mockNewSubtask = {
      id: 'subtask-new',
      taskId: mockTaskId,
      title: 'Complex Subtask',
      isCompleted: false,
      estimatedDuration: 90,
      timeSpent: 0,
      sortOrder: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: mockUserId, email: 'test@test.com' } },
          error: null,
        }),
      },
    } as any);

    const mockInsert = vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([mockNewSubtask]),
      }),
    });

    vi.mocked(db.insert).mockImplementation(mockInsert as any);

    const request = new NextRequest(`http://localhost:3000/api/tasks/${mockTaskId}/subtasks`, {
      method: 'POST',
      body: JSON.stringify({
        title: 'Complex Subtask',
        estimatedDuration: 90,
        sortOrder: 5,
      }),
    });
    
    const response = await POST(request, { params: { id: mockTaskId } });
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.subtask.title).toBe('Complex Subtask');
    expect(data.subtask.estimatedDuration).toBe(90);
    expect(data.subtask.sortOrder).toBe(5);
  });
});

describe('Assignments Endpoints', () => {
  const mockTaskId = 'task-123';
  const mockUserId = 'user-123';
  const mockAssigneeId = 'user-456';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/tasks/[id]/assignments', () => {
    it('returns 401 when user is not authenticated', async () => {
      const { createClient } = await import('@/lib/supabase/server');
      
      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
            error: { message: 'Unauthorized' },
          }),
        },
      } as any);

      const request = new NextRequest(`http://localhost:3000/api/tasks/${mockTaskId}/assignments`);
      const response = await getAssignments(request, { params: { id: mockTaskId } });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('returns assignments for task', async () => {
      const { createClient } = await import('@/lib/supabase/server');
      
      const mockAssignments = [
        {
          id: 'assignment-1',
          taskId: mockTaskId,
          userId: mockAssigneeId,
          role: 'assignee',
          assignedBy: mockUserId,
          assignedAt: new Date(),
        },
      ];

      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: mockUserId, email: 'test@test.com' } },
            error: null,
          }),
        },
      } as any);

      const mockSelect = vi.fn().mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(mockAssignments),
        }),
      });

      vi.mocked(db.select).mockImplementation(mockSelect as any);

      const request = new NextRequest(`http://localhost:3000/api/tasks/${mockTaskId}/assignments`);
      const response = await getAssignments(request, { params: { id: mockTaskId } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.assignments).toHaveLength(1);
      expect(data.assignments[0].userId).toBe(mockAssigneeId);
    });
  });

  describe('POST /api/tasks/[id]/assignments', () => {
    it('returns 400 when userId is missing', async () => {
      const { createClient } = await import('@/lib/supabase/server');
      
      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: mockUserId, email: 'test@test.com' } },
            error: null,
          }),
        },
      } as any);

      const request = new NextRequest(`http://localhost:3000/api/tasks/${mockTaskId}/assignments`, {
        method: 'POST',
        body: JSON.stringify({ role: 'assignee' }),
      });
      
      const response = await postAssignment(request, { params: { id: mockTaskId } });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('userId is required');
    });

    it('creates assignment with assignee role by default', async () => {
      const { createClient } = await import('@/lib/supabase/server');
      
      const mockNewAssignment = {
        id: 'assignment-new',
        taskId: mockTaskId,
        userId: mockAssigneeId,
        role: 'assignee',
        assignedBy: mockUserId,
        assignedAt: new Date(),
      };

      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: mockUserId, email: 'test@test.com' } },
            error: null,
          }),
        },
      } as any);

      const mockInsert = vi.fn().mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockNewAssignment]),
        }),
      });

      vi.mocked(db.insert).mockImplementation(mockInsert as any);

      const request = new NextRequest(`http://localhost:3000/api/tasks/${mockTaskId}/assignments`, {
        method: 'POST',
        body: JSON.stringify({ userId: mockAssigneeId }),
      });
      
      const response = await postAssignment(request, { params: { id: mockTaskId } });
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.assignment.userId).toBe(mockAssigneeId);
      expect(data.assignment.role).toBe('assignee');
      expect(data.assignment.assignedBy).toBe(mockUserId);
    });

    it('creates assignment with reviewer role', async () => {
      const { createClient } = await import('@/lib/supabase/server');
      
      const mockNewAssignment = {
        id: 'assignment-new',
        taskId: mockTaskId,
        userId: mockAssigneeId,
        role: 'reviewer',
        assignedBy: mockUserId,
        assignedAt: new Date(),
      };

      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: mockUserId, email: 'test@test.com' } },
            error: null,
          }),
        },
      } as any);

      const mockInsert = vi.fn().mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockNewAssignment]),
        }),
      });

      vi.mocked(db.insert).mockImplementation(mockInsert as any);

      const request = new NextRequest(`http://localhost:3000/api/tasks/${mockTaskId}/assignments`, {
        method: 'POST',
        body: JSON.stringify({ userId: mockAssigneeId, role: 'reviewer' }),
      });
      
      const response = await postAssignment(request, { params: { id: mockTaskId } });
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.assignment.role).toBe('reviewer');
    });
  });

  describe('DELETE /api/tasks/[id]/assignments', () => {
    it('returns 400 when userId query param is missing', async () => {
      const { createClient } = await import('@/lib/supabase/server');
      
      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: mockUserId, email: 'test@test.com' } },
            error: null,
          }),
        },
      } as any);

      const request = new NextRequest(`http://localhost:3000/api/tasks/${mockTaskId}/assignments`, {
        method: 'DELETE',
      });
      
      const response = await deleteAssignment(request, { params: { id: mockTaskId } });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('userId query param required');
    });

    it('removes assignment successfully', async () => {
      const { createClient } = await import('@/lib/supabase/server');
      
      vi.mocked(createClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: mockUserId, email: 'test@test.com' } },
            error: null,
          }),
        },
      } as any);

      const mockDelete = vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      });

      vi.mocked(db.delete).mockImplementation(mockDelete as any);

      const request = new NextRequest(
        `http://localhost:3000/api/tasks/${mockTaskId}/assignments?userId=${mockAssigneeId}`,
        { method: 'DELETE' }
      );
      
      const response = await deleteAssignment(request, { params: { id: mockTaskId } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Assignment removed');
    });
  });
});
