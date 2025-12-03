# Implementation Roadmap: Voice-First Storyboard

## Current State: Clean Slate ✅

The codebase has been aggressively cleaned to **only** support the 7-step storyboard. No marketing fluff, no legal pages, no unused components. You now have:

- Intro screen with "Begin" button → works
- Blank canvas with zoom controls → works  
- AI Orb (visual only) → present but not functional
- Task cards (draggable, editable) → works
- Zustand state management → works
- 17 essential dependencies (70% reduction)

---

## Build Order for Storyboard

### Phase 1: Voice Capture (Step 2)
**Goal**: User describes project via voice or text fallback

**Files to Create**:
1. `components/voice-input.tsx`
   - Request mic permission
   - Use Web Speech API (window.SpeechRecognition)
   - Show recording indicator
   - Text input fallback
   - Stop/cancel controls

**Files to Modify**:
1. `app/canvas/page.tsx`
   - Show VoiceInput on mount (first visit)
   - Hide after user provides description

**Implementation**:
```tsx
// components/voice-input.tsx
"use client"
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Mic, MicOff, Keyboard } from 'lucide-react'

export default function VoiceInput({ onComplete }: { onComplete: (text: string) => void }) {
  const [isRecording, setIsRecording] = useState(false)
  const [showTextFallback, setShowTextFallback] = useState(false)
  const [transcript, setTranscript] = useState('')
  
  const startRecording = async () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setShowTextFallback(true)
      return
    }
    
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    
    recognition.onresult = (event) => {
      const current = event.resultIndex
      const transcript = event.results[current][0].transcript
      setTranscript(transcript)
    }
    
    recognition.start()
    setIsRecording(true)
  }
  
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      {/* Voice or text input UI */}
    </div>
  )
}
```

**Test Criteria**:
- Mic permission prompt appears
- Recording indicator shows
- Transcript updates in real-time
- Text fallback works if no mic
- Complete button sends text to AI

---

### Phase 2: AI Integration (Steps 3-4)
**Goal**: AI repeats understanding, generates task cards

**Files to Create**:
1. `app/api/ai/route.ts` - AI endpoint (OpenAI/Claude)
2. `lib/ai-client.ts` - API wrapper
3. `components/ai-response.tsx` - AI message display

**Files to Modify**:
1. `components/ai-chat/ai-orb.tsx` - Wire to AI state
2. `stores/flow-store.ts` - Add `generateTasksFromAI()` action

**Implementation**:
```ts
// app/api/ai/route.ts
import { OpenAI } from 'openai'

export async function POST(req: Request) {
  const { message } = await req.json()
  
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are a project planning assistant. Convert project descriptions into tasks.' },
      { role: 'user', content: message }
    ]
  })
  
  return Response.json({ 
    reply: response.choices[0].message.content,
    tasks: extractTasks(response.choices[0].message.content)
  })
}

function extractTasks(aiResponse: string) {
  // Parse AI response into task objects
  // Return array of { title, description, dependencies }
}
```

**Test Criteria**:
- Voice input → AI receives description
- AI responds with confirmation
- AI generates 3-5 task cards
- Tasks appear on canvas
- Tasks positioned automatically

---

### Phase 3: Voice Updates (Step 6)
**Goal**: AI asks user to update task via voice

**Files to Create**:
1. `components/ai-prompt.tsx` - AI asking for updates

**Files to Modify**:
1. `components/ai-chat/ai-orb.tsx` - Trigger voice prompt
2. `stores/flow-store.ts` - Add `updateTaskViaVoice(taskId, changes)`

**Implementation**:
```ts
// AI triggers after user clicks task
const handleTaskUpdate = async (taskId: string) => {
  // AI: "What would you like to change about this task?"
  const voiceInput = await captureVoiceInput()
  
  // Send to AI: "User said: 'Make this due next week'"
  const aiResponse = await fetch('/api/ai', {
    method: 'POST',
    body: JSON.stringify({ 
      action: 'update_task',
      taskId,
      userInput: voiceInput 
    })
  })
  
  // AI returns: { field: 'deadline', value: '2025-12-08' }
  const { updates } = await aiResponse.json()
  updateNodeData(taskId, updates)
}
```

**Test Criteria**:
- User clicks task
- AI asks "What would you like to change?"
- User speaks update
- AI confirms understanding
- Task updates on canvas

---

### Phase 4: Export & Wiki (Step 7)
**Goal**: Complete task → save to wiki → export project

**Files to Create**:
1. `components/export-dialog.tsx` - Export UI
2. `lib/export.ts` - Export logic (JSON/PDF)
3. `components/wiki-panel.tsx` - Simple wiki UI

**Files to Modify**:
1. `stores/flow-store.ts` - Add `completeTask()`, `saveToWiki()`
2. `app/canvas/page.tsx` - Add export button

**Implementation**:
```ts
// lib/export.ts
export function exportProject(nodes: Node[], edges: Edge[]) {
  const project = {
    name: 'My Project',
    tasks: nodes.map(node => ({
      id: node.id,
      title: node.data.title,
      status: node.data.status,
      dependencies: edges.filter(e => e.target === node.id).map(e => e.source)
    }))
  }
  
  const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'project.json'
  a.click()
}
```

**Test Criteria**:
- Task marked complete
- AI asks "Save anything to wiki?"
- Wiki entry created
- Export button works
- JSON file downloads

---

## Environment Setup

### Required Environment Variables
```env
# .env.local
OPENAI_API_KEY=sk-...
# OR
ANTHROPIC_API_KEY=sk-ant-...
```

### Install Additional Dependencies
```bash
npm install openai
# OR
npm install @anthropic-ai/sdk
```

---

## Storyboard Flow Diagram

```
┌─────────────────┐
│  1. Intro Screen │ ✅ Done
│  "Begin" button  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  2. Voice Input Dialog  │ ⚠️ To Build
│  Mic permission prompt   │
│  Record or type         │
└────────┬────────────────┘
         │ (sends description to AI)
         ▼
┌──────────────────────────┐
│  3. AI Confirmation      │ ⚠️ To Build
│  "You want to build X"   │
│  "Add more details?"     │
└────────┬─────────────────┘
         │ (user confirms)
         ▼
┌──────────────────────────┐
│  4. Canvas + Task Cards  │ ✅ Canvas Done, AI Gen Pending
│  AI generates 3-5 tasks  │
│  Positioned automatically│
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  5. User Interaction     │ ✅ Done
│  Drag, connect, edit     │
└────────┬─────────────────┘
         │ (after ~30 sec)
         ▼
┌──────────────────────────┐
│  6. AI Voice Update      │ ⚠️ To Build
│  "Update this task?"     │
│  User speaks changes     │
└────────┬─────────────────┘
         │ (user marks task complete)
         ▼
┌──────────────────────────┐
│  7. Wiki + Export        │ ⚠️ To Build
│  "Save to wiki?"         │
│  Export project          │
└──────────────────────────┘
```

---

## Minimal API Contract

### POST /api/ai
**Request**:
```json
{
  "action": "generate_tasks" | "update_task" | "confirm_understanding",
  "message": "Build a todo app with React",
  "taskId": "optional-task-id"
}
```

**Response**:
```json
{
  "reply": "I understand you want to build...",
  "tasks": [
    { "title": "Set up React project", "description": "..." },
    { "title": "Create components", "description": "..." }
  ],
  "updates": { "deadline": "2025-12-08", "status": "in-progress" }
}
```

---

## Testing Strategy

### Manual Testing Checklist
1. ✅ Intro screen → Begin button
2. ⚠️ Mic permission appears
3. ⚠️ Voice recording works
4. ⚠️ Text fallback works
5. ⚠️ AI generates tasks
6. ✅ Tasks draggable
7. ✅ Status changes
8. ⚠️ Voice update works
9. ⚠️ Export works

### Edge Cases to Handle
- Mic permission denied → show text input
- No internet → show error message
- AI fails to parse → ask user to clarify
- Empty canvas → guide user to describe project
- Task update fails → revert and notify

---

## Success Criteria

### User Interview Ready
- ✅ Clean, distraction-free UI
- ⚠️ Voice input works (or clear text fallback)
- ⚠️ AI generates believable tasks
- ✅ Canvas interaction smooth
- ⚠️ Export produces shareable artifact

### Technical Quality
- No console errors
- Fast response times (<2s for AI)
- Graceful error handling
- Works on Chrome/Edge (WebKit voice API)

---

## Next Commands to Run

```bash
# Install AI SDK
npm install openai

# Create API route
mkdir -p app/api/ai
touch app/api/ai/route.ts

# Create voice component
touch components/voice-input.tsx

# Create export component
touch components/export-dialog.tsx

# Test dev server
npm run dev
```

---

## Time Estimates

- **Phase 1 (Voice)**: 2-3 hours
- **Phase 2 (AI Integration)**: 3-4 hours  
- **Phase 3 (Voice Updates)**: 2 hours
- **Phase 4 (Export/Wiki)**: 2 hours

**Total**: 9-11 hours for full storyboard implementation

---

## Current Blockers: NONE ✅

The codebase is clean, dependencies installed, server running. You can start building Phase 1 (Voice Input) immediately.
