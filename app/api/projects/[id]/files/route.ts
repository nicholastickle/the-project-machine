import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { fileSummaries } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

type RouteContext = {
  params: Promise<{ id: string }>
}

const ALLOWED_MIME_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-excel', // .xls
  'text/csv',
  'application/pdf'
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

// GET /api/projects/[id]/files - List uploaded files
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const supabase = await createClient()
    const { id: projectId } = await context.params
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Use Drizzle to get file summaries from database with RLS
    const files = await db
      .select()
      .from(fileSummaries)
      .where(eq(fileSummaries.projectId, projectId))
      .orderBy(desc(fileSummaries.createdAt));

    return NextResponse.json({ files })
  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/projects/[id]/files - Upload file and generate summary
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const supabase = await createClient()
    const { id: projectId } = await context.params
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const extractStructure = formData.get('extractStructure') === 'true'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only Excel (.xlsx, .xls), CSV, and PDF files are allowed.' 
      }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 10MB.' 
      }, { status: 400 })
    }

    // Upload to Supabase Storage
    const timestamp = Date.now()
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const storagePath = `${projectId}/${timestamp}_${sanitizedFilename}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('project-files')
      .upload(storagePath, file)

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
    }

    // Extract basic structure
    let extractedStructure = null
    if (extractStructure) {
      try {
        // For Excel/CSV: Extract headers and basic structure
        if (file.type.includes('spreadsheet') || file.type.includes('csv')) {
          const buffer = await file.arrayBuffer()
          const text = new TextDecoder().decode(buffer)
          
          // Simple CSV parsing for structure
          const lines = text.split('\n').slice(0, 5) // First 5 lines
          extractedStructure = {
            type: 'tabular',
            headers: lines[0]?.split(',').map(h => h.trim()) || [],
            row_count_sample: lines.length - 1,
            preview: lines.slice(0, 3).join('\n')
          }
        } else if (file.type === 'application/pdf') {
          // For PDF: Basic metadata
          extractedStructure = {
            type: 'document',
            page_count: 'unknown',
            size_kb: Math.round(file.size / 1024)
          }
        }
      } catch (extractError) {
        console.error('Structure extraction error:', extractError)
        // Continue without structure if extraction fails
      }
    }

    // Generate AI summary (mandatory for confirmation)
    let aiSummary = 'File uploaded. Please confirm what you want to extract from this file.'
    
    try {
      const structurePrompt = extractedStructure 
        ? `\n\nExtracted Structure:\n${JSON.stringify(extractedStructure, null, 2)}`
        : ''

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{
          role: 'user',
          content: `You are analyzing a file upload for project context.

File: ${file.name}
Type: ${file.type}
Size: ${Math.round(file.size / 1024)}KB${structurePrompt}

Generate a brief summary (2-3 sentences) of what this file likely contains and how it might be useful for project planning. Be specific if structure was extracted. DO NOT make authoritative claims about contents you haven't seen.

If it's a spreadsheet/CSV, mention the headers/columns if available.
If it's a PDF, mention it's a document that needs review.

Format: "This appears to be a [type] containing [structure]. It might be useful for [potential use]."`
        }],
        temperature: 0.3,
        max_tokens: 200
      })

      aiSummary = completion.choices[0].message.content || aiSummary
    } catch (aiError) {
      console.error('AI summary error:', aiError)
      // Continue with default summary if AI fails
    }

    // Save to file_summaries (unconfirmed)
    const { data: fileSummary, error: summaryError } = await supabase
      .from('file_summaries')
      .insert({
        project_id: projectId,
        filename: file.name,
        file_type: file.type,
        file_size_bytes: file.size,
        storage_path: storagePath,
        extracted_structure: extractedStructure,
        ai_generated_summary: aiSummary,
        summary: null, // User must confirm
        confirmed_at: null,
        uploaded_by: user.id
      })
      .select()
      .single()

    if (summaryError) {
      console.error('Summary insert error:', summaryError)
      // Try to delete uploaded file
      await supabase.storage.from('project-files').remove([storagePath])
      return NextResponse.json({ error: 'Failed to save file metadata' }, { status: 500 })
    }

    // Log upload event
    await supabase.from('usage_logs').insert({
      project_id: projectId,
      user_id: user.id,
      event_type: 'file_upload',
      event_data: {
        filename: file.name,
        file_type: file.type,
        size_bytes: file.size,
        file_id: fileSummary.id
      }
    })

    return NextResponse.json({
      file: fileSummary,
      message: 'File uploaded successfully. Please confirm the AI-generated summary before it can be used.'
    })
  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error?.message 
    }, { status: 500 })
  }
}
