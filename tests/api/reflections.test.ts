import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET, POST } from '@/app/api/projects/[id]/reflections/route'
import { DELETE } from '@/app/api/projects/[id]/reflections/[reflectionId]/route'
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'

// Mock Supabase
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(),
    },
  })),
}))

// Mock database
vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('GET /api/projects/[id]/reflections', () => {
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

    const request = new NextRequest('http://localhost:3000/api/projects/proj-1/reflections')
    const response = await GET(request, { params: Promise.resolve({ id: 'proj-1' }) })
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('returns reflections for authenticated user', async () => {
    const mockReflections = [
      {
        id: 'ref-1',
        projectId: 'proj-1',
        content: 'Test reflection',
        createdAt: new Date().toISOString(),
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

    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          orderBy: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue(mockReflections),
          }),
        }),
      }),
    })
    vi.mocked(db.select).mockImplementation(mockSelect as any)

    const request = new NextRequest('http://localhost:3000/api/projects/proj-1/reflections')
    const response = await GET(request, { params: Promise.resolve({ id: 'proj-1' }) })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.reflections).toEqual(mockReflections)
  })
})

describe('POST /api/projects/[id]/reflections', () => {
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

    const request = new NextRequest('http://localhost:3000/api/projects/proj-1/reflections', {
      method: 'POST',
      body: JSON.stringify({
        content: 'New reflection',
      }),
    })
    const response = await POST(request, { params: Promise.resolve({ id: 'proj-1' }) })
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('creates reflection with valid data', async () => {
    const { createClient } = await import('@/lib/supabase/server')
    vi.mocked(createClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'user-1', email: 'test@test.com' } },
          error: null,
        }),
      },
    } as any)

    const mockInsert = vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([{ id: 'ref-1', content: 'New reflection' }]),
      }),
    })
    vi.mocked(db.insert).mockImplementation(mockInsert as any)

    const request = new NextRequest('http://localhost:3000/api/projects/proj-1/reflections', {
      method: 'POST',
      body: JSON.stringify({
        reflection_type: 'start_of_day',
        content: 'New reflection',
      }),
    })
    const response = await POST(request, { params: Promise.resolve({ id: 'proj-1' }) })

    expect(response.status).toBe(201)
  })
})

describe('DELETE /api/projects/[id]/reflections/[reflectionId]', () => {
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

    const request = new NextRequest('http://localhost:3000/api/projects/proj-1/reflections/ref-1', {
      method: 'DELETE',
    })
    const response = await DELETE(request, {
      params: Promise.resolve({ id: 'proj-1', reflectionId: 'ref-1' }),
    })
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('deletes reflection successfully', async () => {
    const { createClient } = await import('@/lib/supabase/server')
    vi.mocked(createClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'user-1', email: 'test@test.com' } },
          error: null,
        }),
      },
    } as any)

    const mockDelete = vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue({}),
    })
    vi.mocked(db.delete).mockImplementation(mockDelete as any)

    const request = new NextRequest('http://localhost:3000/api/projects/proj-1/reflections/ref-1', {
      method: 'DELETE',
    })
    const response = await DELETE(request, {
      params: Promise.resolve({ id: 'proj-1', reflectionId: 'ref-1' }),
    })

    expect(response.status).toBe(200)
  })
})
