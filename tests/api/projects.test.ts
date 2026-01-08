import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET, POST } from '@/app/api/projects/route'
import { NextRequest } from 'next/server'
import { AuthError } from '@/lib/auth/session'
import { db } from '@/lib/db'

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
    delete: vi.fn(),
  },
}))

// Mock Supabase
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

describe('GET /api/projects', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 when user is not authenticated', async () => {
    const { getCurrentUser } = await import('@/lib/auth/session')

    vi.mocked(getCurrentUser).mockRejectedValue(new AuthError('Unauthorized', 401))

    const request = new NextRequest('http://localhost:3000/api/projects')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('returns projects for authenticated user', async () => {
    const mockProjects = [
      { id: '1', name: 'Test Project', createdBy: 'user-1' },
    ]

    const { getCurrentUser } = await import('@/lib/auth/session')
    vi.mocked(getCurrentUser).mockResolvedValue({ id: 'user-1', email: 'test@test.com' } as any)

    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockResolvedValue(mockProjects)
        })
      }),
    })
    vi.mocked(db.select).mockImplementation(mockSelect as any)

    const request = new NextRequest('http://localhost:3000/api/projects')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.projects).toEqual(mockProjects)
  })
})

describe('POST /api/projects', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates project and adds creator to project_members', async () => {
    const mockProject = {
      id: 'proj-1',
      name: 'New Project',
      createdBy: 'user-1',
    }

    const { getCurrentUser } = await import('@/lib/auth/session')
    vi.mocked(getCurrentUser).mockResolvedValue({ id: 'user-1', email: 'test@test.com' } as any)

    const mockInsert = vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([mockProject]),
      }),
    })
    vi.mocked(db.insert).mockImplementation(mockInsert as any)

    const request = new NextRequest('http://localhost:3000/api/projects', {
      method: 'POST',
      body: JSON.stringify({ name: 'New Project' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.project).toEqual(mockProject)

    // Check for membership insertion (second insert call)
    expect(db.insert).toHaveBeenCalledTimes(3) // Projects, Members, Log (maybe)
  })
})
