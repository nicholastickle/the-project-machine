import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import ExcelJS from 'exceljs'
import type { Node } from '@xyflow/react'

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
    const { nodes } = body as { nodes: Node[] }

    // Get project details
    const { data: project } = await supabase
      .from('projects')
      .select('name')
      .eq('id', projectId)
      .single()

    // Create workbook
    const workbook = new ExcelJS.Workbook()
    workbook.creator = user.email || 'Project Machine'
    workbook.created = new Date()

    // Timesheet sheet
    const sheet = workbook.addWorksheet('Timesheet')
    sheet.columns = [
      { header: 'Date', key: 'date', width: 12 },
      { header: 'Task', key: 'task', width: 40 },
      { header: 'Subtask', key: 'subtask', width: 40 },
      { header: 'Hours Spent', key: 'hours', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Notes', key: 'notes', width: 50 },
    ]

    // Style header
    sheet.getRow(1).font = { bold: true }
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    }

    // Add project title
    sheet.insertRow(1, [])
    sheet.mergeCells('A1:F1')
    sheet.getCell('A1').value = `Timesheet: ${project?.name || 'Untitled Project'}`
    sheet.getCell('A1').font = { size: 14, bold: true }
    sheet.getCell('A1').alignment = { horizontal: 'center' }
    
    sheet.insertRow(2, [])
    sheet.mergeCells('A2:F2')
    sheet.getCell('A2').value = `Generated: ${new Date().toLocaleString()}`
    sheet.getCell('A2').alignment = { horizontal: 'center' }

    sheet.insertRow(3, [])

    // Filter task nodes
    const taskNodes = nodes.filter(n => n.type === 'taskCardNode')

    let totalHours = 0

    // Add time entries
    taskNodes.forEach(node => {
      const data: any = node.data || {}
      const taskTitle = data.title || 'Untitled Task'
      const status = data.status || 'Not started'
      const subtasks: any[] = Array.isArray(data.subtasks) ? data.subtasks : []

      if (subtasks.length === 0) {
        // Task without subtasks
        const hours = Math.round((Number(data.timeSpent) || 0) / 3600 * 100) / 100
        if (hours > 0) {
          totalHours += hours
          sheet.addRow({
            date: new Date().toLocaleDateString(),
            task: taskTitle,
            subtask: '-',
            hours: hours.toFixed(2),
            status,
            notes: data.description || ''
          })
        }
      } else {
        // Task with subtasks
        subtasks.forEach((subtask: any) => {
          const hours = Math.round((subtask.timeSpent || 0) / 60 * 100) / 100 // Convert minutes to hours
          if (hours > 0) {
            totalHours += hours
            sheet.addRow({
              date: new Date().toLocaleDateString(),
              task: taskTitle,
              subtask: subtask.title || 'Untitled Subtask',
              hours: hours.toFixed(2),
              status: subtask.isCompleted ? 'Completed' : 'In Progress',
              notes: ''
            })
          }
        })
      }
    })

    // Add total row
    sheet.addRow([])
    const totalRow = sheet.addRow({
      date: '',
      task: '',
      subtask: 'TOTAL:',
      hours: totalHours.toFixed(2),
      status: '',
      notes: ''
    })
    totalRow.font = { bold: true }
    totalRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFEB3B' }
    }

    // Add summary section
    sheet.addRow([])
    sheet.addRow([])
    sheet.addRow(['Summary', '', '', '', '', ''])
    sheet.getCell(`A${sheet.rowCount}`).font = { bold: true, size: 12 }
    
    sheet.addRow(['Total Tasks:', taskNodes.length, '', '', '', ''])
    sheet.addRow(['Total Hours:', totalHours.toFixed(2), '', '', '', ''])
    sheet.addRow(['Hourly Rate:', '$0.00', '', '(Update as needed)', '', ''])
    sheet.addRow(['Total Cost:', `$${(totalHours * 0).toFixed(2)}`, '', '(Update rate above)', '', ''])

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer()

    // Log usage
    await supabase.from('usage_logs').insert({
      project_id: projectId,
      user_id: user.id,
      event_type: 'export_timesheet',
      event_data: {
        task_count: taskNodes.length,
        total_hours: totalHours,
        file_size_bytes: buffer.byteLength
      }
    })

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="project-${projectId}-timesheet.xlsx"`
      }
    })
  } catch (error: any) {
    console.error('Timesheet export error:', error)
    return NextResponse.json(
      { error: 'Failed to generate timesheet', details: error?.message },
      { status: 500 }
    )
  }
}
