import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET, POST } from '@/app/api/projects/[id]/snapshots/route'
import { GET as GET_SINGLE } from '@/app/api/projects/[id]/snapshots/[snapshotId]/route'
import { POST as POST_RESTORE } from '@/app/api/projects/[id]/snapshots/[snapshotId]/restore/route'
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
  },
}))

describe('GET /api/projects/[id]/snapshots', () => {
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

    const request = new NextRequest('http://localhost:3000/api/projects/proj-1/snapshots')
    const response = await GET(request, { params: Promise.resolve({ id: 'proj-1' }) })
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('returns snapshots for authenticated user', async () => {
    const mockSnapshots = [
      {
        id: 'snap-1',
        projectId: 'proj-1',
        snapshotData: { nodes: [], edges: [] },
        snapshotType: 'manual',
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
            limit: vi.fn().mockResolvedValue(mockSnapshots),
          }),
        }),
      }),
    })
    vi.mocked(db.select).mockImplementation(mockSelect as any)

    const request = new NextRequest('http://localhost:3000/api/projects/proj-1/snapshots')
    const response = await GET(request, { params: Promise.resolve({ id: 'proj-1' }) })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.snapshots).toEqual(mockSnapshots)
  })
})

describe('POST /api/projects/[id]/snapshots', () => {
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

    const request = new NextRequest('http://localhost:3000/api/projects/proj-1/snapshots', {
      method: 'POST',
      body: JSON.stringify({
        snapshot_data: { nodes: [], edges: [] },
      }),
    })
    const response = await POST(request, { params: Promise.resolve({ id: 'proj-1' }) })
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('creates snapshot with valid data', async () => {
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
        returning: vi.fn().mockResolvedValue([{ id: 'snap-1' }]),
      }),
    })
    vi.mocked(db.insert).mockImplementation(mockInsert as any)

    const request = new NextRequest('http://localhost:3000/api/projects/proj-1/snapshots', {
      method: 'POST',
      body: JSON.stringify({
        snapshot_data: { nodes: [], edges: [] },
        snapshot_type: 'manual',
      }),
    })
    const response = await POST(request, { params: Promise.resolve({ id: 'proj-1' }) })

    expect(response.status).toBe(201)
  })
})

describe('GET /api/projects/[id]/snapshots/[snapshotId]', () => {
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

    const request = new NextRequest('http://localhost:3000/api/projects/proj-1/snapshots/snap-1')
    const response = await GET_SINGLE(request, {
      params: Promise.resolve({ id: 'proj-1', snapshotId: 'snap-1' }),
    })
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('returns snapshot by id', async () => {
    const mockSnapshot = {
      id: 'snap-1',
      projectId: 'proj-1',
      snapshotData: { nodes: [], edges: [] },
      snapshotType: 'manual',
      createdAt: new Date().toISOString(),
    }

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
        where: vi.fn().mockResolvedValue([mockSnapshot]),
      }),
    })
    vi.mocked(db.select).mockImplementation(mockSelect as any)

    const request = new NextRequest('http://localhost:3000/api/projects/proj-1/snapshots/snap-1')
    const response = await GET_SINGLE(request, {
      params: Promise.resolve({ id: 'proj-1', snapshotId: 'snap-1' }),
    })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.snapshot).toEqual(mockSnapshot)
  })
})

describe('POST /api/projects/[id]/snapshots/[snapshotId]/restore', () => {
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

    const request = new NextRequest('http://localhost:3000/api/projects/proj-1/snapshots/snap-1/restore', {
      method: 'POST',
    })
    const response = await POST_RESTORE(request, {
      params: Promise.resolve({ id: 'proj-1', snapshotId: 'snap-1' }),
    })
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('restores snapshot successfully', async () => {
    const mockSnapshot = {
      id: 'snap-1',
      projectId: 'proj-1',
      snapshotData: { nodes: [], edges: [] },
      snapshotType: 'manual',
      createdAt: new Date().toISOString(),
    }

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
        where: vi.fn().mockResolvedValue([mockSnapshot]),
      }),
    })
    vi.mocked(db.select).mockImplementation(mockSelect as any)

    const mockUpdate = vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue({}),
      }),
    })
    vi.mocked(db.update).mockImplementation(mockUpdate as any)

    const request = new NextRequest('http://localhost:3000/api/projects/proj-1/snapshots/snap-1/restore', {
      method: 'POST',
    })
    const response = await POST_RESTORE(request, {
      params: Promise.resolve({ id: 'proj-1', snapshotId: 'snap-1' }),
    })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.snapshot.snapshot_data).toEqual({ nodes: [], edges: [] })
  })
})
