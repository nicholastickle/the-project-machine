import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import ExcelJS from 'exceljs'
import type { Node, Edge } from '@xyflow/react'

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const supabase = await createClient()
    const { id: projectId } = await context.params
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { nodes, edges } = body as { nodes: Node[]; edges: Edge[] }

    // Get project details
    const { data: project } = await supabase
      .from('projects')
      .select('name, description')
      .eq('id', projectId)
      .single()

    // Create workbook
    const workbook = new ExcelJS.Workbook()
    workbook.creator = user.email || 'Project Machine'
    workbook.created = new Date()

    // Tasks sheet
    const tasksSheet = workbook.addWorksheet('Tasks')
    tasksSheet.columns = [
      { header: 'Task ID', key: 'id', width: 15 },
      { header: 'Title', key: 'title', width: 40 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Description', key: 'description', width: 50 },
      { header: 'Estimated Hours', key: 'estimatedHours', width: 15 },
      { header: 'Time Spent (Hours)', key: 'timeSpent', width: 15 },
      { header: 'Progress', key: 'progress', width: 10 },
      { header: 'Dependencies', key: 'dependencies', width: 30 },
    ]

    // Filter task nodes only
    const taskNodes = nodes.filter(n => n.type === 'taskCardNode')

    // Build dependency map
    const dependencyMap = new Map<string, string[]>()
    edges.forEach(edge => {
      if (!dependencyMap.has(edge.target)) {
        dependencyMap.set(edge.target, [])
      }
      dependencyMap.get(edge.target)!.push(edge.source)
    })

    // Add task rows
    taskNodes.forEach(node => {
      const data: any = node.data || {}
      const subtasks: any[] = Array.isArray(data.subtasks) ? data.subtasks : []
      const completedSubtasks = subtasks.filter((s: any) => s.isCompleted).length
      const totalSubtasks = subtasks.length
      const progress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0

      const deps = dependencyMap.get(node.id) || []
      const depTitles = deps
        .map(depId => {
          const depNode = taskNodes.find(n => n.id === depId)
          return depNode?.data?.title || depId
        })
        .join(', ')

      tasksSheet.addRow({
        id: node.id,
        title: data.title || 'Untitled Task',
        status: data.status || 'Not started',
        description: data.description || '',
        estimatedHours: data.estimatedHours || 0,
        timeSpent: Math.round((Number(data.timeSpent) || 0) / 3600 * 100) / 100, // Convert seconds to hours
        progress: `${progress}%`,
        dependencies: depTitles
      })
    })

    // Subtasks sheet
    const subtasksSheet = workbook.addWorksheet('Subtasks')
    subtasksSheet.columns = [
      { header: 'Parent Task', key: 'parentTask', width: 30 },
      { header: 'Subtask Title', key: 'title', width: 40 },
      { header: 'Completed', key: 'isCompleted', width: 12 },
      { header: 'Estimated Duration (min)', key: 'estimatedDuration', width: 20 },
      { header: 'Time Spent (min)', key: 'timeSpent', width: 15 },
    ]

    taskNodes.forEach(node => {
      const data: any = node.data || {}
      const subtasks: any[] = Array.isArray(data.subtasks) ? data.subtasks : []
      subtasks.forEach((subtask: any) => {
        subtasksSheet.addRow({
          parentTask: data.title || 'Untitled Task',
          title: subtask.title || 'Untitled Subtask',
          isCompleted: subtask.isCompleted ? 'Yes' : 'No',
          estimatedDuration: subtask.estimatedDuration || 0,
          timeSpent: subtask.timeSpent || 0
        })
      })
    })

    // Project Info sheet
    const infoSheet = workbook.addWorksheet('Project Info')
    infoSheet.mergeCells('A1:B1')
    infoSheet.getCell('A1').value = project?.name || 'Untitled Project'
    infoSheet.getCell('A1').font = { size: 16, bold: true }
    infoSheet.getCell('A1').alignment = { horizontal: 'center' }

    infoSheet.addRow(['Description:', project?.description || 'No description'])
    infoSheet.addRow(['Exported by:', user.email])
    infoSheet.addRow(['Export date:', new Date().toLocaleDateString()])
    infoSheet.addRow(['Total tasks:', taskNodes.length])

    // Style headers
    ;[tasksSheet, subtasksSheet].forEach(sheet => {
      sheet.getRow(1).font = { bold: true }
      sheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      }
    })

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer()

    // Log usage
    await supabase.from('usage_logs').insert({
      project_id: projectId,
      user_id: user.id,
      event_type: 'export_excel',
      event_data: {
        task_count: taskNodes.length,
        file_size_bytes: buffer.byteLength
      }
    })

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="project-${projectId}-export.xlsx"`
      }
    })
  } catch (error: any) {
    console.error('Excel export error:', error)
    return NextResponse.json(
      { error: 'Failed to generate Excel export', details: error?.message },
      { status: 500 }
    )
  }
}
