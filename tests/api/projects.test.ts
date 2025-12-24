import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET, POST } from '@/app/api/projects/route'
import { NextRequest } from 'next/server'

// Mock Supabase
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

describe('GET /api/projects', () => {
  it('returns 401 when user is not authenticated', async () => {
    const { createClient } = await import('@/lib/supabase/server')
    
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: { message: 'Unauthorized' },
        }),
      },
    } as any)

    const request = new NextRequest('http://localhost:3000/api/projects')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('returns projects for authenticated user', async () => {
    const mockProjects = [
      { id: '1', name: 'Test Project', created_by: 'user-1' },
    ]

    const { createClient } = await import('@/lib/supabase/server')
    
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'user-1', email: 'test@test.com' } },
          error: null,
        }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          is: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({
              data: mockProjects,
              error: null,
            }),
          }),
        }),
      }),
    } as any)

    const request = new NextRequest('http://localhost:3000/api/projects')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.projects).toEqual(mockProjects)
  })
})

describe('POST /api/projects', () => {
  it('creates project and adds creator to project_members', async () => {
    const mockProject = {
      id: 'proj-1',
      name: 'New Project',
      created_by: 'user-1',
    }

    const mockInsert = vi.fn().mockResolvedValue({ error: null })
    
    const { createClient } = await import('@/lib/supabase/server')
    
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'user-1', email: 'test@test.com' } },
          error: null,
        }),
      },
      from: vi.fn((table) => {
        if (table === 'projects') {
          return {
            insert: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: mockProject,
                  error: null,
                }),
              }),
            }),
          }
        }
        if (table === 'project_members' || table === 'usage_logs') {
          return {
            insert: mockInsert,
          }
        }
      }),
    } as any)

    const request = new NextRequest('http://localhost:3000/api/projects', {
      method: 'POST',
      body: JSON.stringify({ name: 'New Project' }),
    })
    
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.project).toEqual(mockProject)
    expect(mockInsert).toHaveBeenCalledWith({
      project_id: 'proj-1',
      user_id: 'user-1',
      role: 'editor',
    })
  })
})
