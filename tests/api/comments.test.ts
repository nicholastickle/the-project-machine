import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET, POST } from '@/app/api/tasks/[id]/comments/route';
import { PATCH, DELETE } from '@/app/api/comments/[id]/route';
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
    update: vi.fn(),
  },
}));

describe('GET /api/tasks/[id]/comments', () => {
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

    const request = new NextRequest(`http://localhost:3000/api/tasks/${mockTaskId}/comments`);
    const response = await GET(request, { params: { id: mockTaskId } });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('returns empty array when task has no comments', async () => {
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

    const request = new NextRequest(`http://localhost:3000/api/tasks/${mockTaskId}/comments`);
    const response = await GET(request, { params: { id: mockTaskId } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.comments).toEqual([]);
  });

  it('returns comments ordered by creation time', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    
    const now = new Date();
    const mockComments = [
      {
        id: 'comment-1',
        taskId: mockTaskId,
        userId: mockUserId,
        content: 'First comment',
        createdAt: new Date(now.getTime() - 1000),
        updatedAt: new Date(now.getTime() - 1000),
        deletedAt: null,
      },
      {
        id: 'comment-2',
        taskId: mockTaskId,
        userId: mockUserId,
        content: 'Second comment',
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
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
          orderBy: vi.fn().mockResolvedValue(mockComments),
        }),
      }),
    });

    vi.mocked(db.select).mockImplementation(mockSelect as any);

    const request = new NextRequest(`http://localhost:3000/api/tasks/${mockTaskId}/comments`);
    const response = await GET(request, { params: { id: mockTaskId } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.comments).toHaveLength(2);
    expect(data.comments[0].content).toBe('First comment');
    expect(data.comments[1].content).toBe('Second comment');
  });

  it('filters out soft-deleted comments', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    
    const mockComments = [
      {
        id: 'comment-1',
        taskId: mockTaskId,
        userId: mockUserId,
        content: 'Active comment',
        deletedAt: null,
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
          orderBy: vi.fn().mockResolvedValue(mockComments),
        }),
      }),
    });

    vi.mocked(db.select).mockImplementation(mockSelect as any);

    const request = new NextRequest(`http://localhost:3000/api/tasks/${mockTaskId}/comments`);
    const response = await GET(request, { params: { id: mockTaskId } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.comments).toHaveLength(1);
  });
});

describe('POST /api/tasks/[id]/comments', () => {
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

    const request = new NextRequest(`http://localhost:3000/api/tasks/${mockTaskId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content: 'New comment' }),
    });
    
    const response = await POST(request, { params: { id: mockTaskId } });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('returns 400 when content is missing', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: mockUserId, email: 'test@test.com' } },
          error: null,
        }),
      },
    } as any);

    const request = new NextRequest(`http://localhost:3000/api/tasks/${mockTaskId}/comments`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
    
    const response = await POST(request, { params: { id: mockTaskId } });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Content is required');
  });

  it('returns 400 when content is only whitespace', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: mockUserId, email: 'test@test.com' } },
          error: null,
        }),
      },
    } as any);

    const request = new NextRequest(`http://localhost:3000/api/tasks/${mockTaskId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content: '   ' }),
    });
    
    const response = await POST(request, { params: { id: mockTaskId } });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Content is required');
  });

  it('creates comment and trims whitespace', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    
    const mockNewComment = {
      id: 'comment-new',
      taskId: mockTaskId,
      userId: mockUserId,
      content: 'New comment',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
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
        returning: vi.fn().mockResolvedValue([mockNewComment]),
      }),
    });

    vi.mocked(db.insert).mockImplementation(mockInsert as any);

    const request = new NextRequest(`http://localhost:3000/api/tasks/${mockTaskId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content: '  New comment  ' }),
    });
    
    const response = await POST(request, { params: { id: mockTaskId } });
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.comment.content).toBe('New comment'); // Trimmed
    expect(data.comment.userId).toBe(mockUserId);
  });
});

describe('PATCH /api/comments/[id]', () => {
  const mockCommentId = 'comment-123';
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

    const request = new NextRequest(`http://localhost:3000/api/comments/${mockCommentId}`, {
      method: 'PATCH',
      body: JSON.stringify({ content: 'Updated' }),
    });
    
    const response = await PATCH(request, { params: { id: mockCommentId } });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('returns 400 when content is missing', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: mockUserId, email: 'test@test.com' } },
          error: null,
        }),
      },
    } as any);

    const request = new NextRequest(`http://localhost:3000/api/comments/${mockCommentId}`, {
      method: 'PATCH',
      body: JSON.stringify({}),
    });
    
    const response = await PATCH(request, { params: { id: mockCommentId } });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Content is required');
  });

  it('updates comment content and timestamp', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    
    const updatedComment = {
      id: mockCommentId,
      userId: mockUserId,
      content: 'Updated content',
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
          returning: vi.fn().mockResolvedValue([updatedComment]),
        }),
      }),
    });

    vi.mocked(db.update).mockImplementation(mockUpdate as any);

    const request = new NextRequest(`http://localhost:3000/api/comments/${mockCommentId}`, {
      method: 'PATCH',
      body: JSON.stringify({ content: 'Updated content' }),
    });
    
    const response = await PATCH(request, { params: { id: mockCommentId } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.comment.content).toBe('Updated content');
  });

  it('returns 404 when comment not found or not owned by user', async () => {
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
          returning: vi.fn().mockResolvedValue([]), // RLS blocked or not found
        }),
      }),
    });

    vi.mocked(db.update).mockImplementation(mockUpdate as any);

    const request = new NextRequest(`http://localhost:3000/api/comments/${mockCommentId}`, {
      method: 'PATCH',
      body: JSON.stringify({ content: 'Updated' }),
    });
    
    const response = await PATCH(request, { params: { id: mockCommentId } });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Comment not found or no permission');
  });
});

describe('DELETE /api/comments/[id]', () => {
  const mockCommentId = 'comment-123';
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

    const request = new NextRequest(`http://localhost:3000/api/comments/${mockCommentId}`, {
      method: 'DELETE',
    });
    
    const response = await DELETE(request, { params: { id: mockCommentId } });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('soft deletes comment (sets deletedAt)', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    
    const deletedComment = {
      id: mockCommentId,
      userId: mockUserId,
      content: 'Comment to delete',
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
          returning: vi.fn().mockResolvedValue([deletedComment]),
        }),
      }),
    });

    vi.mocked(db.update).mockImplementation(mockUpdate as any);

    const request = new NextRequest(`http://localhost:3000/api/comments/${mockCommentId}`, {
      method: 'DELETE',
    });
    
    const response = await DELETE(request, { params: { id: mockCommentId } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('Comment deleted');
    expect(data.comment.deletedAt).toBeDefined();
  });

  it('returns 404 when comment not found or not owned by user', async () => {
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
          returning: vi.fn().mockResolvedValue([]),
        }),
      }),
    });

    vi.mocked(db.update).mockImplementation(mockUpdate as any);

    const request = new NextRequest(`http://localhost:3000/api/comments/${mockCommentId}`, {
      method: 'DELETE',
    });
    
    const response = await DELETE(request, { params: { id: mockCommentId } });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Comment not found or no permission');
  });

  it('only allows author to delete their own comment', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    const differentUserId = 'user-456';
    
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: differentUserId, email: 'other@test.com' } },
          error: null,
        }),
      },
    } as any);

    const mockUpdate = vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([]), // RLS blocks different user
        }),
      }),
    });

    vi.mocked(db.update).mockImplementation(mockUpdate as any);

    const request = new NextRequest(`http://localhost:3000/api/comments/${mockCommentId}`, {
      method: 'DELETE',
    });
    
    const response = await DELETE(request, { params: { id: mockCommentId } });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Comment not found or no permission');
  });
});
