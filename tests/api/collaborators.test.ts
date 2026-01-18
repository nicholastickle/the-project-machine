import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET, POST } from '@/app/api/projects/[id]/collaborators/route'
import { DELETE } from '@/app/api/projects/[id]/collaborators/[userId]/route'
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'

// Mock Supabase
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(),
      admin: {
        getUserById: vi.fn(),
      },
    },
  })),
}))

// Mock database
vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    delete: vi.fn(),
    update: vi.fn(),
  },
}))

describe('GET /api/projects/[id]/collaborators', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 when user is not authenticated', async () => {
    const { createClient } = await import('@/lib/supabase/server')
    vi.mocked(createClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: new Error('Unauthorized') }),
      },
    } as any)

    const request = new NextRequest('http://localhost:3000/api/projects/proj-1/collaborators')
    const response = await GET(request, { params: Promise.resolve({ id: 'proj-1' }) })
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('returns collaborators for project owner', async () => {
    const mockProject = {
      id: 'proj-1',
      created_by: 'user-1',
    }

    const mockCollaborators = [
      {
        user_id: 'user-2',
        role: 'editor',
        joined_at: new Date().toISOString(),
      },
    ]

    const { createClient } = await import('@/lib/supabase/server')
    vi.mocked(createClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'user-1', email: 'test@test.com' } },
          error: null,
        }),
      },
    } as any)

    const mockSelect = vi.fn()
      .mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([mockProject]),
        }),
      })
      .mockReturnValueOnce({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockResolvedValue(mockCollaborators),
          }),
        }),
      })
    vi.mocked(db.select).mockImplementation(mockSelect as any)

    const request = new NextRequest('http://localhost:3000/api/projects/proj-1/collaborators')
    const response = await GET(request, { params: Promise.resolve({ id: 'proj-1' }) })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.collaborators).toHaveLength(2)
    expect(data.collaborators[0].role).toBe('owner')
    expect(data.collaborators[1].role).toBe('editor')
  })
})

describe('POST /api/projects/[id]/collaborators', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 when user is not authenticated', async () => {
    const { createClient } = await import('@/lib/supabase/server')
    vi.mocked(createClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: new Error('Unauthorized') }),
      },
    } as any)

    const request = new NextRequest('http://localhost:3000/api/projects/proj-1/collaborators', {
      method: 'POST',
      body: JSON.stringify({
        email: 'collaborator@test.com',
      }),
    })
    const response = await POST(request, { params: Promise.resolve({ id: 'proj-1' }) })
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('sends invitation for new collaborator', async () => {
    const mockProject = {
      id: 'proj-1',
      created_by: 'user-1',
      name: 'Test Project',
    }

    const { createClient } = await import('@/lib/supabase/server')
    vi.mocked(createClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'user-1', email: 'owner@test.com' } },
          error: null,
        }),
        admin: {
          getUserById: vi.fn().mockResolvedValue({
            data: { user: null },
            error: null,
          }),
        },
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      }),
    } as any)

    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([mockProject]),
      }),
    })
    vi.mocked(db.select).mockImplementation(mockSelect as any)

    const mockInsert = vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([{ id: 'invite-1' }]),
      }),
    })
    vi.mocked(db.insert).mockImplementation(mockInsert as any)

    const request = new NextRequest('http://localhost:3000/api/projects/proj-1/collaborators', {
      method: 'POST',
      body: JSON.stringify({
        email: 'collaborator@test.com',
      }),
    })
    const response = await POST(request, { params: Promise.resolve({ id: 'proj-1' }) })

    expect(response.status).toBe(200)
  })
})

describe('DELETE /api/projects/[id]/collaborators/[userId]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 when user is not authenticated', async () => {
    const { createClient } = await import('@/lib/supabase/server')
    vi.mocked(createClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: new Error('Unauthorized') }),
      },
    } as any)

    const request = new NextRequest('http://localhost:3000/api/projects/proj-1/collaborators/user-2', {
      method: 'DELETE',
    })
    const response = await DELETE(request, {
      params: Promise.resolve({ id: 'proj-1', userId: 'user-2' }),
    })
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('removes collaborator successfully', async () => {
    const mockProject = {
      id: 'proj-1',
      created_by: 'user-1',
    }

    const { createClient } = await import('@/lib/supabase/server')
    vi.mocked(createClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'user-1', email: 'test@test.com' } },
          error: null,
        }),
      },
      from: vi.fn((table) => {
        if (table === 'projects') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnThis(),
              single: vi.fn().mockResolvedValue({ data: mockProject, error: null }),
            }),
          }
        }
        if (table === 'project_members') {
          return {
            delete: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnThis(),
            }),
          }
        }
        if (table === 'usage_logs') {
          return {
            insert: vi.fn().mockResolvedValue({ error: null }),
          }
        }
        return {}
      }),
    } as any)

    const request = new NextRequest('http://localhost:3000/api/projects/proj-1/collaborators/user-2', {
      method: 'DELETE',
    })
    const response = await DELETE(request, {
      params: Promise.resolve({ id: 'proj-1', userId: 'user-2' }),
    })

    expect(response.status).toBe(200)
  })
})
