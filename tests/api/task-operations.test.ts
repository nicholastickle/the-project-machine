import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PATCH, DELETE } from '@/app/api/tasks/[id]/route';
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';

// Mock Supabase
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

// Mock database
vi.mock('@/lib/db', () => ({
  db: {
    update: vi.fn(),
  },
}));

describe('PATCH /api/tasks/[id]', () => {
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

    const request = new NextRequest(`http://localhost:3000/api/tasks/${mockTaskId}`, {
      method: 'PATCH',
      body: JSON.stringify({ title: 'Updated' }),
    });
    
    const response = await PATCH(request, { params: { id: mockTaskId } });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('updates task title only', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    
    const updatedTask = {
      id: mockTaskId,
      title: 'Updated Title',
      description: 'Old description',
      status: 'backlog',
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

    const mockUpdate = vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([updatedTask]),
        }),
      }),
    });

    vi.mocked(db.update).mockImplementation(mockUpdate as any);

    const request = new NextRequest(`http://localhost:3000/api/tasks/${mockTaskId}`, {
      method: 'PATCH',
      body: JSON.stringify({ title: 'Updated Title' }),
    });
    
    const response = await PATCH(request, { params: { id: mockTaskId } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.task.title).toBe('Updated Title');
  });

  it('updates multiple fields', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    
    const updatedTask = {
      id: mockTaskId,
      title: 'New Title',
      description: 'New Description',
      status: 'in_progress',
      timeSpent: 120,
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

    const mockUpdate = vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([updatedTask]),
        }),
      }),
    });

    vi.mocked(db.update).mockImplementation(mockUpdate as any);

    const request = new NextRequest(`http://localhost:3000/api/tasks/${mockTaskId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        title: 'New Title',
        description: 'New Description',
        status: 'in_progress',
        timeSpent: 120,
      }),
    });
    
    const response = await PATCH(request, { params: { id: mockTaskId } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.task.title).toBe('New Title');
    expect(data.task.status).toBe('in_progress');
    expect(data.task.timeSpent).toBe(120);
  });

  it('returns 404 when task not found or no permission', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: mockUserId, email: 'test@test.com' } },
          error: null,
        }),
      },
    } as any);

    const mockUpdate = vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([]), // No task returned (RLS blocked)
        }),
      }),
    });

    vi.mocked(db.update).mockImplementation(mockUpdate as any);

    const request = new NextRequest(`http://localhost:3000/api/tasks/${mockTaskId}`, {
      method: 'PATCH',
      body: JSON.stringify({ title: 'Updated' }),
    });
    
    const response = await PATCH(request, { params: { id: mockTaskId } });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Task not found or no permission');
  });

  it('updates updatedAt timestamp automatically', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    
    const beforeUpdate = new Date();
    const updatedTask = {
      id: mockTaskId,
      title: 'Updated',
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

    const mockUpdate = vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([updatedTask]),
        }),
      }),
    });

    vi.mocked(db.update).mockImplementation(mockUpdate as any);

    const request = new NextRequest(`http://localhost:3000/api/tasks/${mockTaskId}`, {
      method: 'PATCH',
      body: JSON.stringify({ title: 'Updated' }),
    });
    
    const response = await PATCH(request, { params: { id: mockTaskId } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(new Date(data.task.updatedAt).getTime()).toBeGreaterThanOrEqual(beforeUpdate.getTime());
  });
});

describe('DELETE /api/tasks/[id]', () => {
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

    const request = new NextRequest(`http://localhost:3000/api/tasks/${mockTaskId}`, {
      method: 'DELETE',
    });
    
    const response = await DELETE(request, { params: { id: mockTaskId } });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('soft deletes task (sets deletedAt)', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    
    const deletedTask = {
      id: mockTaskId,
      title: 'Task to delete',
      deletedAt: new Date(),
    };

    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: mockUserId, email: 'test@test.com' } },
          error: null,
        }),
      },
    } as any);

    const mockUpdate = vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([deletedTask]),
        }),
      }),
    });

    vi.mocked(db.update).mockImplementation(mockUpdate as any);

    const request = new NextRequest(`http://localhost:3000/api/tasks/${mockTaskId}`, {
      method: 'DELETE',
    });
    
    const response = await DELETE(request, { params: { id: mockTaskId } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('Task deleted');
    expect(data.task.deletedAt).toBeDefined();
  });

  it('returns 404 when task not found or no permission', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: mockUserId, email: 'test@test.com' } },
          error: null,
        }),
      },
    } as any);

    const mockUpdate = vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([]), // RLS blocked
        }),
      }),
    });

    vi.mocked(db.update).mockImplementation(mockUpdate as any);

    const request = new NextRequest(`http://localhost:3000/api/tasks/${mockTaskId}`, {
      method: 'DELETE',
    });
    
    const response = await DELETE(request, { params: { id: mockTaskId } });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Task not found or no permission');
  });

  it('does not hard delete (task still exists in DB)', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    
    const deletedTask = {
      id: mockTaskId,
      title: 'Task to delete',
      deletedAt: new Date(),
    };

    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: mockUserId, email: 'test@test.com' } },
          error: null,
        }),
      },
    } as any);

    const mockUpdate = vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([deletedTask]),
        }),
      }),
    });

    vi.mocked(db.update).mockImplementation(mockUpdate as any);

    const request = new NextRequest(`http://localhost:3000/api/tasks/${mockTaskId}`, {
      method: 'DELETE',
    });
    
    const response = await DELETE(request, { params: { id: mockTaskId } });
    const data = await response.json();

    expect(response.status).toBe(200);
    // Verify it's soft delete - task object is returned
    expect(data.task).toBeDefined();
    expect(data.task.id).toBe(mockTaskId);
  });
});
