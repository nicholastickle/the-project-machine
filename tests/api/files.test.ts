import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET } from '@/app/api/projects/[id]/files/route'
import { DELETE } from '@/app/api/projects/[id]/files/[fileId]/route'
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'

// Mock Supabase
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(),
    },
    storage: {
      from: vi.fn(),
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

// Mock OpenAI
vi.mock('openai', () => {
  class MockOpenAI {
    chat = {
      completions: {
        create: vi.fn(),
      },
    }
  }
  return {
    default: MockOpenAI,
  }
})

describe('GET /api/projects/[id]/files', () => {
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

    const request = new NextRequest('http://localhost:3000/api/projects/proj-1/files')
    const response = await GET(request, { params: Promise.resolve({ id: 'proj-1' }) })
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('returns files for authenticated user', async () => {
    const mockFiles = [
      {
        id: 'file-1',
        fileName: 'test.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
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
          orderBy: vi.fn().mockResolvedValue(mockFiles),
        }),
      }),
    })
    vi.mocked(db.select).mockImplementation(mockSelect as any)

    const request = new NextRequest('http://localhost:3000/api/projects/proj-1/files')
    const response = await GET(request, { params: Promise.resolve({ id: 'proj-1' }) })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.files).toEqual(mockFiles)
  })
})

describe('DELETE /api/projects/[id]/files/[fileId]', () => {
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

    const request = new NextRequest('http://localhost:3000/api/projects/proj-1/files/file-1', {
      method: 'DELETE',
    })
    const response = await DELETE(request, {
      params: Promise.resolve({ id: 'proj-1', fileId: 'file-1' }),
    })
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('deletes file successfully', async () => {
    const mockFile = {
      id: 'file-1',
      fileName: 'test.pdf',
      storagePath: 'path/to/file.pdf',
    }

    const { createClient } = await import('@/lib/supabase/server')
    const mockRemove = vi.fn().mockResolvedValue({ error: null })
    vi.mocked(createClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'user-1', email: 'test@test.com' } },
          error: null,
        }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: mockFile, error: null }),
        }),
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnThis(),
          match: vi.fn().mockResolvedValue({ error: null }),
        }),
      }),
      storage: {
        from: vi.fn().mockReturnValue({
          remove: mockRemove,
        }),
      },
    } as any)

    const mockSelect = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([mockFile]),
      }),
    })
    vi.mocked(db.select).mockImplementation(mockSelect as any)

    const mockDelete = vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue({}),
    })
    vi.mocked(db.delete).mockImplementation(mockDelete as any)

    const request = new NextRequest('http://localhost:3000/api/projects/proj-1/files/file-1', {
      method: 'DELETE',
    })
    const response = await DELETE(request, {
      params: Promise.resolve({ id: 'proj-1', fileId: 'file-1' }),
    })

    expect(response.status).toBe(200)
  })
})
