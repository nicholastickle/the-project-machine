import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET, POST } from '@/app/api/projects/[id]/notes/route'
import { GET as GET_SINGLE, PATCH, DELETE } from '@/app/api/projects/[id]/notes/[noteId]/route'
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
    update: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('GET /api/projects/[id]/notes', () => {
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

    const request = new NextRequest('http://localhost:3000/api/projects/proj-1/notes')
    const response = await GET(request, { params: Promise.resolve({ id: 'proj-1' }) })
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('returns notes for authenticated user', async () => {
    const mockNotes = [
      {
        id: 'note-1',
        title: 'Test Note',
        content: 'Test content',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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
          orderBy: vi.fn().mockResolvedValue(mockNotes),
        }),
      }),
    })
    vi.mocked(db.select).mockImplementation(mockSelect as any)

    const request = new NextRequest('http://localhost:3000/api/projects/proj-1/notes')
    const response = await GET(request, { params: Promise.resolve({ id: 'proj-1' }) })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.notes).toEqual(mockNotes)
  })
})

describe('POST /api/projects/[id]/notes', () => {
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

    const request = new NextRequest('http://localhost:3000/api/projects/proj-1/notes', {
      method: 'POST',
      body: JSON.stringify({
        title: 'New Note',
        content: 'Note content',
      }),
    })
    const response = await POST(request, { params: Promise.resolve({ id: 'proj-1' }) })
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('creates note with valid data', async () => {
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
        returning: vi.fn().mockResolvedValue([{ id: 'note-1', title: 'New Note' }]),
      }),
    })
    vi.mocked(db.insert).mockImplementation(mockInsert as any)

    const request = new NextRequest('http://localhost:3000/api/projects/proj-1/notes', {
      method: 'POST',
      body: JSON.stringify({
        title: 'New Note',
        content: 'Note content',
      }),
    })
    const response = await POST(request, { params: Promise.resolve({ id: 'proj-1' }) })

    expect(response.status).toBe(200)
  })
})

describe('PATCH /api/projects/[id]/notes/[noteId]', () => {
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

    const request = new NextRequest('http://localhost:3000/api/projects/proj-1/notes/note-1', {
      method: 'PATCH',
      body: JSON.stringify({
        title: 'Updated Note',
      }),
    })
    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'proj-1', noteId: 'note-1' }),
    })
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('updates note successfully', async () => {
    const { createClient } = await import('@/lib/supabase/server')
    vi.mocked(createClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'user-1', email: 'test@test.com' } },
          error: null,
        }),
      },
    } as any)

    const mockUpdate = vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{ id: 'note-1', title: 'Updated Note' }]),
        }),
      }),
    })
    vi.mocked(db.update).mockImplementation(mockUpdate as any)

    const request = new NextRequest('http://localhost:3000/api/projects/proj-1/notes/note-1', {
      method: 'PATCH',
      body: JSON.stringify({
        title: 'Updated Note',
      }),
    })
    const response = await PATCH(request, {
      params: Promise.resolve({ id: 'proj-1', noteId: 'note-1' }),
    })

    expect(response.status).toBe(200)
  })
})

describe('DELETE /api/projects/[id]/notes/[noteId]', () => {
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

    const request = new NextRequest('http://localhost:3000/api/projects/proj-1/notes/note-1', {
      method: 'DELETE',
    })
    const response = await DELETE(request, {
      params: Promise.resolve({ id: 'proj-1', noteId: 'note-1' }),
    })
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('deletes note successfully', async () => {
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

    const request = new NextRequest('http://localhost:3000/api/projects/proj-1/notes/note-1', {
      method: 'DELETE',
    })
    const response = await DELETE(request, {
      params: Promise.resolve({ id: 'proj-1', noteId: 'note-1' }),
    })

    expect(response.status).toBe(200)
  })
})
