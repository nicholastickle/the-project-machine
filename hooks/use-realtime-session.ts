"use client"

import { useEffect, useRef, useState } from 'react'

interface RealtimeSession {
  connect: () => Promise<void>
  disconnect: () => void
  isConnected: boolean
  isSpeaking: boolean
}

export function useRealtimeSession(
  onTasksGenerated: (tasks: any[]) => string[],
  onConnectTasks: (connections: { from: number; to: number }[]) => void,
  onClearCanvas: () => void
): RealtimeSession {
  const [isConnected, setIsConnected] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const audioStreamRef = useRef<MediaStream | null>(null)

  const connect = async () => {
    try {
      // Get mic permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioStreamRef.current = stream

      // Create audio context
      const audioContext = new AudioContext({ sampleRate: 24000 })
      audioContextRef.current = audioContext

      // Connect to OpenAI Realtime API
      const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
      const ws = new WebSocket(
        'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01',
        ['realtime', `openai-insecure-api-key.${apiKey}`, 'openai-beta.realtime-v1']
      )

      ws.addEventListener('open', () => {
        console.log('✅ Connected to OpenAI Realtime API')
        setIsConnected(true)

        // Send session configuration
        ws.send(JSON.stringify({
          type: 'session.update',
          session: {
            modalities: ['text', 'audio'],
            instructions: `You are PM (Project Machine), a helpful AI assistant for project planning. Have a natural conversation with the user about their project. When they describe what they want to build, call create_tasks with the appropriate number of tasks (could be 3, 5, 8, 10+ - whatever makes sense for the project scope). Tasks are automatically connected sequentially, so just focus on creating good task descriptions. Be brief in your responses to avoid interrupting the user. Stay connected for follow-up requests. If asked to "clear the board", call clear_canvas.`,
            voice: 'alloy',
            input_audio_format: 'pcm16',
            output_audio_format: 'pcm16',
            turn_detection: {
              type: 'server_vad',
              threshold: 0.6,
              prefix_padding_ms: 500,
              silence_duration_ms: 1000
            },
            input_audio_transcription: {
              model: 'whisper-1'
            },
            tools: [
              {
                type: 'function',
                name: 'create_tasks',
                description: 'Create project tasks on the canvas. Returns task IDs that can be used with connect_tasks.',
                parameters: {
                  type: 'object',
                  properties: {
                    tasks: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          title: { type: 'string', description: 'Task title' },
                          description: { type: 'string', description: 'Task description' }
                        },
                        required: ['title']
                      }
                    }
                  },
                  required: ['tasks']
                }
              },
              {
                type: 'function',
                name: 'connect_tasks',
                description: 'Create arrows connecting tasks on the canvas. Use task indices from the most recent create_tasks call (0-indexed).',
                parameters: {
                  type: 'object',
                  properties: {
                    connections: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          from: { type: 'number', description: 'Source task index (0-based)' },
                          to: { type: 'number', description: 'Target task index (0-based)' }
                        },
                        required: ['from', 'to']
                      }
                    }
                  },
                  required: ['connections']
                }
              },
              {
                type: 'function',
                name: 'clear_canvas',
                description: 'Clear all tasks from the canvas',
                parameters: {
                  type: 'object',
                  properties: {}
                }
              }
            ]
          }
        }))

        // Start conversation
        ws.send(JSON.stringify({
          type: 'conversation.item.create',
          item: {
            type: 'message',
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: 'Hello'
              }
            ]
          }
        }))

        ws.send(JSON.stringify({ type: 'response.create' }))
      })

      ws.addEventListener('message', async (event) => {
        const data = JSON.parse(event.data)

        // Handle audio responses
        if (data.type === 'response.audio.delta') {
          setIsSpeaking(true)
          // Play audio chunk
          const audioData = atob(data.delta)
          const audioBuffer = new Uint8Array(audioData.length)
          for (let i = 0; i < audioData.length; i++) {
            audioBuffer[i] = audioData.charCodeAt(i)
          }
          await playAudioChunk(audioBuffer)
        }

        if (data.type === 'response.audio.done') {
          setIsSpeaking(false)
        }

        // Handle function calls
        if (data.type === 'response.function_call_arguments.done') {
          const args = JSON.parse(data.arguments)
          
          if (data.name === 'create_tasks' && args.tasks) {
            onTasksGenerated(args.tasks)
          } else if (data.name === 'connect_tasks' && args.connections) {
            onConnectTasks(args.connections)
          } else if (data.name === 'clear_canvas') {
            onClearCanvas()
          }
        }
      })

      ws.addEventListener('error', (error) => {
        console.error('WebSocket error:', error)
        setIsConnected(false)
      })

      ws.addEventListener('close', () => {
        console.log('Disconnected from OpenAI Realtime API')
        setIsConnected(false)
      })

      wsRef.current = ws

      // Start sending audio
      startAudioCapture(stream, ws)
    } catch (error) {
      console.error('Failed to connect:', error)
      setIsConnected(false)
    }
  }

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop())
      audioStreamRef.current = null
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    setIsConnected(false)
    setIsSpeaking(false)
  }

  const startAudioCapture = (stream: MediaStream, ws: WebSocket) => {
    const audioContext = audioContextRef.current!
    const source = audioContext.createMediaStreamSource(stream)
    const processor = audioContext.createScriptProcessor(4096, 1, 1)

    source.connect(processor)
    processor.connect(audioContext.destination)

    processor.onaudioprocess = (e) => {
      if (ws.readyState === WebSocket.OPEN) {
        const inputData = e.inputBuffer.getChannelData(0)
        const pcm16 = new Int16Array(inputData.length)
        for (let i = 0; i < inputData.length; i++) {
          pcm16[i] = Math.max(-32768, Math.min(32767, inputData[i] * 32768))
        }
        const base64Audio = btoa(String.fromCharCode(...new Uint8Array(pcm16.buffer)))
        ws.send(JSON.stringify({
          type: 'input_audio_buffer.append',
          audio: base64Audio
        }))
      }
    }
  }

  const audioQueueRef = useRef<AudioBufferSourceNode[]>([])
  const nextPlayTimeRef = useRef(0)

  const playAudioChunk = async (audioData: Uint8Array) => {
    const audioContext = audioContextRef.current!
    
    if (audioContext.state === 'suspended') {
      await audioContext.resume()
    }

    const int16Array = new Int16Array(audioData.buffer)
    const float32Array = new Float32Array(int16Array.length)
    for (let i = 0; i < int16Array.length; i++) {
      float32Array[i] = int16Array[i] / 32768
    }
    
    const audioBuffer = audioContext.createBuffer(1, float32Array.length, 24000)
    audioBuffer.getChannelData(0).set(float32Array)
    
    const source = audioContext.createBufferSource()
    source.buffer = audioBuffer
    source.connect(audioContext.destination)
    
    const now = audioContext.currentTime
    const startTime = Math.max(now, nextPlayTimeRef.current)
    source.start(startTime)
    nextPlayTimeRef.current = startTime + audioBuffer.duration
    
    audioQueueRef.current.push(source)
  }

  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [])

  return {
    connect,
    disconnect,
    isConnected,
    isSpeaking
  }
}
