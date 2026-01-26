import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET, POST } from '@/app/api/taskbook/route';
import { PATCH, DELETE } from '@/app/api/taskbook/[id]/route';
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

describe('GET /api/taskbook', () => {
  const mockUserId = 'user-123';
  const mockTemplates = [
    {
      id: 'template-1',
      userId: mockUserId,
      title: 'Bug Fix Template',
      description: 'Standard bug fixing workflow',
      category: 'Development',
      defaultSubtasks: [
        { text: 'Reproduce issue', completed: false },
        { text: 'Fix issue', completed: false },
      ],
      usageCount: 5,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
      deletedAt: null,
    },
  ];

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

    const request = new NextRequest('http://localhost:3000/api/taskbook');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('returns user taskbook templates successfully', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: mockUserId } },
          error: null,
        }),
      },
    } as any);

    const mockDbChain = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockResolvedValue(mockTemplates),
    };

    vi.mocked(db.select).mockReturnValue(mockDbChain as any);

    const request = new NextRequest('http://localhost:3000/api/taskbook');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.taskbook).toHaveLength(1);
    expect(data.taskbook[0].title).toBe('Bug Fix Template');
    expect(data.taskbook[0].userId).toBe(mockUserId);
  });

  it('returns empty array when user has no templates', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: mockUserId } },
          error: null,
        }),
      },
    } as any);

    const mockDbChain = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockResolvedValue([]),
    };

    vi.mocked(db.select).mockReturnValue(mockDbChain as any);

    const request = new NextRequest('http://localhost:3000/api/taskbook');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.taskbook).toEqual([]);
  });
});

describe('POST /api/taskbook', () => {
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

    const request = new NextRequest('http://localhost:3000/api/taskbook', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Test Template',
        subtasks: [{ text: 'Task 1', completed: false }],
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('returns 400 when title is missing', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: mockUserId } },
          error: null,
        }),
      },
    } as any);

    const request = new NextRequest('http://localhost:3000/api/taskbook', {
      method: 'POST',
      body: JSON.stringify({
        subtasks: [{ text: 'Task 1', completed: false }],
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Title is required');
  });

  it('creates template without defaultSubtasks', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: mockUserId } },
          error: null,
        }),
      },
    } as any);

    const newTemplate = {
      id: 'template-new',
      userId: mockUserId,
      title: 'Simple Template',
      description: null,
      category: null,
      defaultSubtasks: null,
      usageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    const mockDbChain = {
      values: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([newTemplate]),
    };

    vi.mocked(db.insert).mockReturnValue(mockDbChain as any);

    const request = new NextRequest('http://localhost:3000/api/taskbook', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Simple Template',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.entry.title).toBe('Simple Template');
  });

  it('creates new template successfully', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: mockUserId } },
          error: null,
        }),
      },
    } as any);

    const newTemplate = {
      id: 'template-new',
      userId: mockUserId,
      title: 'Code Review Template',
      description: 'Thorough code review',
      category: 'Quality',
      defaultSubtasks: [
        { text: 'Check code style', completed: false },
        { text: 'Review logic', completed: false },
      ],
      usageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    const mockDbChain = {
      values: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([newTemplate]),
    };

    vi.mocked(db.insert).mockReturnValue(mockDbChain as any);

    const request = new NextRequest('http://localhost:3000/api/taskbook', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Code Review Template',
        description: 'Thorough code review',
        category: 'Quality',
        defaultSubtasks: [
          { text: 'Check code style', completed: false },
          { text: 'Review logic', completed: false },
        ],
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.entry.title).toBe('Code Review Template');
    expect(data.entry.category).toBe('Quality');
  });
});

describe('PATCH /api/taskbook/[id]', () => {
  const mockUserId = 'user-123';
  const mockTemplateId = 'template-1';

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

    const request = new NextRequest(`http://localhost:3000/api/taskbook/${mockTemplateId}`, {
      method: 'PATCH',
      body: JSON.stringify({ title: 'Updated Title' }),
    });

    const response = await PATCH(request, { params: { id: mockTemplateId } });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('returns 404 when user is not template owner', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: mockUserId } },
          error: null,
        }),
      },
    } as any);

    const mockDbChain = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue([]),
    };

    vi.mocked(db.select).mockReturnValue(mockDbChain as any);

    const request = new NextRequest(`http://localhost:3000/api/taskbook/${mockTemplateId}`, {
      method: 'PATCH',
      body: JSON.stringify({ title: 'Updated Title' }),
    });

    const response = await PATCH(request, { params: { id: mockTemplateId } });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Taskbook entry not found');
  });

  it('returns 404 when template does not exist', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: mockUserId } },
          error: null,
        }),
      },
    } as any);

    const mockDbChain = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue([]),
    };

    vi.mocked(db.select).mockReturnValue(mockDbChain as any);

    const request = new NextRequest(`http://localhost:3000/api/taskbook/${mockTemplateId}`, {
      method: 'PATCH',
      body: JSON.stringify({ title: 'Updated Title' }),
    });

    const response = await PATCH(request, { params: { id: mockTemplateId } });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Taskbook entry not found');
  });

  it('updates template successfully', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: mockUserId } },
          error: null,
        }),
      },
    } as any);

    const existingTemplate = {
      id: mockTemplateId,
      userId: mockUserId,
      title: 'Original Title',
      description: 'Original description',
    };

    const updatedTemplate = {
      ...existingTemplate,
      title: 'Updated Title',
      description: 'Updated description',
      updatedAt: new Date(),
    };

    const mockSelectChain = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue([existingTemplate]),
    };

    const mockUpdateChain = {
      set: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([updatedTemplate]),
    };

    vi.mocked(db.select).mockReturnValue(mockSelectChain as any);
    vi.mocked(db.update).mockReturnValue(mockUpdateChain as any);

    const request = new NextRequest(`http://localhost:3000/api/taskbook/${mockTemplateId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        title: 'Updated Title',
        description: 'Updated description',
      }),
    });

    const response = await PATCH(request, { params: { id: mockTemplateId } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.entry.title).toBe('Updated Title');
    expect(data.entry.description).toBe('Updated description');
  });
});

describe('DELETE /api/taskbook/[id]', () => {
  const mockUserId = 'user-123';
  const mockTemplateId = 'template-1';

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

    const request = new NextRequest(`http://localhost:3000/api/taskbook/${mockTemplateId}`, {
      method: 'DELETE',
    });

    const response = await DELETE(request, { params: { id: mockTemplateId } });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('returns 404 when user is not template owner', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: mockUserId } },
          error: null,
        }),
      },
    } as any);

    const mockDbChain = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue([]),
    };

    vi.mocked(db.select).mockReturnValue(mockDbChain as any);

    const request = new NextRequest(`http://localhost:3000/api/taskbook/${mockTemplateId}`, {
      method: 'DELETE',
    });

    const response = await DELETE(request, { params: { id: mockTemplateId } });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Taskbook entry not found');
  });

  it('returns 404 when template does not exist', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: mockUserId } },
          error: null,
        }),
      },
    } as any);

    const mockDbChain = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue([]),
    };

    vi.mocked(db.select).mockReturnValue(mockDbChain as any);

    const request = new NextRequest(`http://localhost:3000/api/taskbook/${mockTemplateId}`, {
      method: 'DELETE',
    });

    const response = await DELETE(request, { params: { id: mockTemplateId } });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Taskbook entry not found');
  });

  it('soft deletes template successfully', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: mockUserId } },
          error: null,
        }),
      },
    } as any);

    const existingTemplate = {
      id: mockTemplateId,
      userId: mockUserId,
      title: 'Template to Delete',
    };

    const mockSelectChain = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue([existingTemplate]),
    };

    const mockUpdateChain = {
      set: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue([{ ...existingTemplate, deletedAt: new Date() }]),
    };

    vi.mocked(db.select).mockReturnValue(mockSelectChain as any);
    vi.mocked(db.update).mockReturnValue(mockUpdateChain as any);

    const request = new NextRequest(`http://localhost:3000/api/taskbook/${mockTemplateId}`, {
      method: 'DELETE',
    });

    const response = await DELETE(request, { params: { id: mockTemplateId } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('Taskbook entry deleted');
  });
});
