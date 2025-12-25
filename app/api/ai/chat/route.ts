import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildAIContext } from '@/lib/ai/context-builder'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { projectId, message, history, currentSnapshot } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }

    // Build grounded context
    const context = await buildAIContext(projectId, currentSnapshot)

    // Construct system prompt
    const systemPrompt = `You are Project Machine's AI planning assistant - a scaffolding and thinking partner, NOT an authority.

CRITICAL RULES:
- You are a collaborator who helps users think through their plans
- Always label sources of information explicitly
- Surface uncertainty and limitations clearly
- Never hallucinate data not in the provided context
- Suggest next steps, don't dictate them
- When you don't know something, say so and suggest how to gather that information

AVAILABLE CONTEXT:
${JSON.stringify(context, null, 2)}

SOURCE CITATION GUIDELINES:
- When referencing the current plan: "Based on your current canvas with ${context.current_plan?.node_count || 0} tasks..."
- When referencing reflections: "In your reflection from [date]..."
- When referencing notes: "According to your reference note '[title]'..."
- When referencing files: "Based on the [filename] summary you provided..."
- When uncertain: "I don't have information about X. Would it help to add a reference note or reflection about this?"

CONVERSATION STYLE:
- Be concise but thorough
- Ask clarifying questions
- Acknowledge what you don't know
- Suggest ways to improve context (add notes, reflections, file summaries)
- Help break down complex work into tasks
- Point out potential risks or dependencies

COMMAND EXECUTION:
When the user asks you to modify the canvas (add/update/delete tasks), embed a command in your response using this format:
[COMMAND:{"action":"addTask","title":"Task Name","status":"not-started","description":"Description","subtasks":[{"title":"Subtask","duration":30}],"position":{"x":200,"y":200}}]

Available commands:
- addTask: Create new task node
  {"action":"addTask","title":"string","status":"not-started|in-progress|completed","description":"string","subtasks":[],"position":{"x":number,"y":number}}
- updateTask: Modify existing task
  {"action":"updateTask","taskName":"string","updates":{"status":"completed","description":"Updated"}}
- deleteTask: Remove task
  {"action":"deleteTask","taskName":"string"}

The user will see a confirmation dialog before any changes are applied. Keep your conversational response separate from the command.`

    // Prepare messages for OpenAI
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt }
    ]

    // Add conversation history if provided
    if (history && Array.isArray(history)) {
      history.forEach((msg: any) => {
        if (msg.role === 'user' || msg.role === 'assistant') {
          messages.push({
            role: msg.role,
            content: msg.content
          })
        }
      })
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: message
    })

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 1000
    })

    const response = completion.choices[0].message.content

    // Log usage
    await supabase.from('usage_logs').insert({
      project_id: projectId,
      user_id: user.id,
      event_type: 'ai_query',
      event_data: {
        message_length: message.length,
        response_length: response?.length || 0,
        model: 'gpt-4o-mini',
        tokens_used: completion.usage?.total_tokens
      }
    })

    return NextResponse.json({
      response: response || 'Sorry, I encountered an error generating a response.',
      sources: context._metadata.sources,
      tokens_used: completion.usage?.total_tokens
    })
  } catch (error: any) {
    console.error('AI chat error:', error)
    
    // Handle specific OpenAI errors
    if (error?.status === 401) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
    }
    
    return NextResponse.json(
      { error: 'Failed to generate AI response', details: error?.message },
      { status: 500 }
    )
  }
}
