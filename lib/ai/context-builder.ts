import { createClient } from '@/lib/supabase/server'
import type { PlanSnapshot, Reflection, ReferenceNote, FileSummary } from '@/lib/supabase/types'

interface AIContext {
  current_plan: {
    node_count: number
    edge_count: number
    tasks: Array<{
      title: string
      status: string
      estimated_hours?: number
      has_subtasks: boolean
    }>
  } | null
  last_saved_plan: {
    snapshot_id: string
    saved_at: string
    node_count: number
  } | null
  recent_reflections: Array<{
    type: 'start_of_day' | 'end_of_day'
    date: string
    content: string
  }>
  reference_notes: Array<{
    title: string
    content: string
    created_at: string
  }>
  file_summaries: Array<{
    filename: string
    type: string | null
    summary: string
  }>
  _metadata: {
    sources: string[]
    timestamp: string
  }
}

export async function buildAIContext(
  projectId: string,
  currentSnapshot?: { nodes: any[]; edges: any[] }
): Promise<AIContext> {
  const supabase = await createClient()

  // 1. Process current plan (if provided)
  let current_plan = null
  if (currentSnapshot) {
    current_plan = {
      node_count: currentSnapshot.nodes.length,
      edge_count: currentSnapshot.edges.length,
      tasks: currentSnapshot.nodes
        .filter((node: any) => node.type === 'task-card')
        .map((node: any) => ({
          title: node.data?.title || 'Untitled',
          status: node.data?.status || 'not-started',
          estimated_hours: node.data?.estimatedHours,
          has_subtasks: Array.isArray(node.data?.subtasks) && node.data.subtasks.length > 0
        }))
    }
  }

  // 2. Get last saved snapshot (for comparison)
  const { data: lastSnapshot } = await supabase
    .from('plan_snapshots')
    .select('id, created_at, snapshot_data')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  let last_saved_plan = null
  if (lastSnapshot) {
    const data = lastSnapshot.snapshot_data as any
    last_saved_plan = {
      snapshot_id: lastSnapshot.id,
      saved_at: lastSnapshot.created_at,
      node_count: data.nodes?.length || 0
    }
  }

  // 3. Get recent reflections (last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { data: reflections } = await supabase
    .from('reflections')
    .select('reflection_type, content, created_at')
    .eq('project_id', projectId)
    .gte('created_at', sevenDaysAgo.toISOString())
    .order('created_at', { ascending: false })
    .limit(10)

  const recent_reflections = (reflections || []).map((r) => ({
    type: r.reflection_type as 'start_of_day' | 'end_of_day',
    date: new Date(r.created_at).toLocaleDateString(),
    content: r.content
  }))

  // 4. Get reference notes
  const { data: notes } = await supabase
    .from('reference_notes')
    .select('title, content, created_at')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  const reference_notes = (notes || []).map((n) => ({
    title: n.title,
    content: n.content,
    created_at: new Date(n.created_at).toLocaleDateString()
  }))

  // 5. Get file summaries
  const { data: files } = await supabase
    .from('file_summaries')
    .select('filename, file_type, summary')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  const file_summaries = (files || []).map((f) => ({
    filename: f.filename,
    type: f.file_type,
    summary: f.summary
  }))

  // Build metadata about available sources
  const sources: string[] = []
  if (current_plan) sources.push('current_plan')
  if (last_saved_plan) sources.push('last_saved_plan')
  if (recent_reflections.length > 0) sources.push('reflections')
  if (reference_notes.length > 0) sources.push('reference_notes')
  if (file_summaries.length > 0) sources.push('file_summaries')

  return {
    current_plan,
    last_saved_plan,
    recent_reflections,
    reference_notes,
    file_summaries,
    _metadata: {
      sources,
      timestamp: new Date().toISOString()
    }
  }
}
