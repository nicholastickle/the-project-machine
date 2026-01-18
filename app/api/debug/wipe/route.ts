import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { projects } from '@/lib/db/schema'
import { getCurrentUser } from '@/lib/auth/session'
import { eq } from 'drizzle-orm'

export async function DELETE(request: NextRequest) {
    try {
        const user = await getCurrentUser()

        // Safety check: ensure only the specific user can run this (optional, but good practice)
        // console.log('Wiping projects for user:', user.id)

        // Delete all projects created by this user
        await db.delete(projects).where(eq(projects.createdBy, user.id))

        return NextResponse.json({ message: 'All your projects have been deleted.' })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to wipe projects' }, { status: 500 })
    }
}
