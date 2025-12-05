import { useRef, useState, useCallback } from 'react';

interface RealtimeWebRTCHook {
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnected: boolean;
  isSpeaking: boolean;
  isConnecting: boolean;
  isMuted: boolean;
  toggleMute: () => void;
  currentActivity: string;
}

export function useRealtimeWebRTC(
  onTasksGenerated: (tasks: any[]) => void,
  onConnectTasks: (connections: { from: number; to: number }[]) => void,
  onClearCanvas: () => void,
  onUpdateTask: (taskIndex: number, updates: { status?: string; estimatedHours?: number; title?: string }) => void,
  onDeleteTask: (taskIndex: number) => void,
  hasTaskNodes: boolean,
  taskCount: number
): RealtimeWebRTCHook {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<string>('Idle');
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const sessionStartRef = useRef<number | null>(null);

  const connect = useCallback(async () => {
    // Prevent multiple simultaneous connections
    if (isConnecting || isConnected || peerConnectionRef.current) {
      console.log('Connection already in progress or established');
      return;
    }
    
    setIsConnecting(true);
    try {
      // Step 1: Get ephemeral token from our backend
      const sessionResponse = await fetch('/api/session', {
        method: 'POST',
      });

      if (!sessionResponse.ok) {
        throw new Error('Failed to create session');
      }

      const sessionData = await sessionResponse.json();
      const { client_secret } = sessionData;

      // Step 2: Set up RTCPeerConnection
      const pc = new RTCPeerConnection();
      peerConnectionRef.current = pc;

      // Step 3: Create audio element for playback
      if (!audioElementRef.current) {
        const audio = document.createElement('audio');
        audio.autoplay = true;
        audioElementRef.current = audio;
      }

      // Step 4: Handle incoming audio track
      pc.ontrack = (event) => {
        console.log('Received audio track');
        if (audioElementRef.current && event.streams[0]) {
          audioElementRef.current.srcObject = event.streams[0];
        }
      };

      // Step 5: Get microphone and add to peer connection
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });
      audioStreamRef.current = stream;
      
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      // Step 6: Create data channel for events
      const dc = pc.createDataChannel('oai-events');
      dataChannelRef.current = dc;

      dc.onopen = () => {
        console.log('Data channel opened');
        // Don't set connected yet - wait for session.updated and first AI response
        sessionStartRef.current = Date.now();
        
        // Track session start
        fetch('/api/usage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            action: 'start',
            model: 'gpt-4o-mini-realtime-preview-2024-12-17'
          }),
        }).catch(console.error);

        // Send session update with instructions and tools
        dc.send(JSON.stringify({
          type: 'session.update',
          session: {
            instructions: `You're PM, a British AI helping with project planning. Be quick, friendly, and get straight to business.

CRITICAL RULES:
1. Always greet first and wait for user input
2. After calling ANY function, you MUST respond with speech to acknowledge it
3. Follow the TASK CREATION RULES below carefully

CANVAS STATE: ${taskCount > 0 ? `Canvas has ${taskCount} tasks` : 'Canvas is empty'}

GREETING: ${hasTaskNodes 
  ? `Canvas has ${taskCount} tasks - say something brief like "Back to it! You've got ${taskCount} tasks. What needs updating?" or "Ready when you are!"`
  : 'Empty canvas - say "Hi! Tell me about your project and I\'ll break it into tasks. Try: Design a bridge foundation, or Plan a residential development."'
}

TASK CREATION RULES:
${hasTaskNodes 
  ? `- Canvas HAS ${taskCount} tasks: When user wants to add more, FIRST ask verbally: "I\'ll add [N] tasks for [thing]. Sound good?" Wait for confirmation, THEN call create_tasks.`
  : '- Canvas EMPTY: When user describes a project, call create_tasks IMMEDIATELY (no asking), then confirm: "Added [N] tasks! What needs tweaking?"'
}

WHEN TO CREATE TASKS (use your judgment):
✅ CREATE when user says:
- "I need to [project]" → auto-create
- "Plan [project]" → auto-create  
- "Create/add tasks for [project]" → auto-create
- "Let\'s [action]" → auto-create
- Direct project description as statement → auto-create

❌ DON\'T CREATE when user asks questions:
- "What tasks would I need..." → just answer verbally
- "How would you..." → just answer verbally
- "Tell me about..." → just answer verbally

IMPORTANT: You know the canvas has ${taskCount} tasks but cannot see their titles or details. When users ask about specific tasks, respond helpfully: "You have ${taskCount} tasks on the canvas. Which task number should I update?" or "Got ${taskCount} tasks here - tell me the number and what to change!"

AVAILABLE FUNCTIONS:
- create_tasks: Create 3-10 tasks with estimatedHours. Use immediately when canvas empty, ask first when canvas has tasks.
- update_task(taskIndex, {status/estimatedHours/title}): "mark task 3 done", "change task 2 to 5 hours", "rename task 1 to Setup"
- delete_task(taskIndex): "delete task 3", "remove the second task"
- clear_canvas: "clear the board", "start over"

TASK NUMBERS: Tasks are numbered 1, 2, 3, etc. in the order they appear on canvas (top to bottom, left to right). Users must tell you which task number to modify.

STATUS VALUES (use exactly these):
- "Not started" - task hasn't begun
- "On-going" - task is in progress (NOT "In progress")
- "Complete" - task is finished (NOT "Done")
- "Stuck" - task is blocked
- "Abandoned" - task was cancelled

EXAMPLES:
- "Mark task 1 as done" → update_task(1, {status: "Complete"}) then say "Done!"
- "Start task 2" → update_task(2, {status: "On-going"}) then say "Started!"
- "Task 3 is stuck" → update_task(3, {status: "Stuck"}) then say "Marked as stuck!"
- "Change task 3 to 8 hours" → update_task(3, {estimatedHours: 8}) then say "Updated to 8 hours!"
- "Delete the second task" → delete_task(2) then say "Removed!"
- "Rename task 1 to Setup database" → update_task(1, {title: "Setup database"}) then say "Renamed!"

Keep confirmations brief: "Done!", "Sorted!", "Updated!", "Removed!"`,
            turn_detection: {
              type: 'server_vad',
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 900,
            },
            input_audio_transcription: null,
            max_response_output_tokens: 1000,
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
                          description: { type: 'string', description: 'Task description' },
                          estimatedHours: { type: 'number', description: 'Estimated hours to complete this task' }
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
                name: 'update_task',
                description: 'Update a task\'s status, time estimate, or title. Use when user says "mark as done", "start task", "change to X hours", "rename task", etc.',
                parameters: {
                  type: 'object',
                  properties: {
                    taskIndex: { type: 'number', description: 'Task number (1-based, as user would say it)' },
                    status: { type: 'string', enum: ['Not started', 'On-going', 'Complete', 'Stuck', 'Abandoned'], description: 'New status - use exact values' },
                    estimatedHours: { type: 'number', description: 'New time estimate in hours' },
                    title: { type: 'string', description: 'New task title' }
                  },
                  required: ['taskIndex']
                }
              },
              {
                type: 'function',
                name: 'delete_task',
                description: 'Delete a specific task from the canvas. Use when user says "delete task 3", "remove the second task", etc.',
                parameters: {
                  type: 'object',
                  properties: {
                    taskIndex: { type: 'number', description: 'Task number to delete (1-based, as user would say it)' }
                  },
                  required: ['taskIndex']
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
        }));
      };

      dc.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          // When session is ready, mark as connected and immediately trigger AI greeting
          if (message.type === 'session.updated') {
            setIsConnected(true);
            setIsConnecting(false);
            setCurrentActivity('Session ready, requesting greeting');
            dc.send(JSON.stringify({
              type: 'response.create'
            }));
          }
          
          // Track speaking state
          if (message.type === 'response.audio.delta' || message.type === 'response.audio_transcript.delta') {
            setIsSpeaking(true);
            setCurrentActivity('AI speaking');
          } else if (message.type === 'response.done') {
            setIsSpeaking(false);
            setCurrentActivity('Listening');
          }
          
          // Handle conversation interruptions/errors
          if (message.type === 'error') {
            console.error('OpenAI error:', message);
            setCurrentActivity(`Error: ${message.error?.message || 'Unknown'}`);
          }
          
          // If conversation gets truncated, trigger new response
          if (message.type === 'conversation.item.truncated') {
            console.log('Conversation truncated, requesting continuation');
            setCurrentActivity('Recovering from interruption...');
            dc.send(JSON.stringify({ type: 'response.create' }));
          }

          // Handle function calls
          if (message.type === 'response.function_call_arguments.done') {
            const { name, call_id, arguments: argsString } = message;
            const args = JSON.parse(argsString);

            console.log('Function call:', name, args);

            if (name === 'create_tasks' && args.tasks) {
              setCurrentActivity(`Creating ${args.tasks.length} tasks...`);
              onTasksGenerated(args.tasks);
            } else if (name === 'connect_tasks' && args.connections) {
              setCurrentActivity(`Connecting ${args.connections.length} tasks...`);
              onConnectTasks(args.connections);
            } else if (name === 'update_task') {
              setCurrentActivity(`Updating task ${args.taskIndex}...`);
              const { taskIndex, ...updates } = args;
              onUpdateTask(taskIndex, updates);
            } else if (name === 'delete_task') {
              setCurrentActivity(`Deleting task ${args.taskIndex}...`);
              onDeleteTask(args.taskIndex);
            } else if (name === 'clear_canvas') {
              setCurrentActivity('Clearing canvas...');
              onClearCanvas();
            }

            // Send function output
            dc.send(JSON.stringify({
              type: 'conversation.item.create',
              item: {
                type: 'function_call_output',
                call_id: call_id,
                output: JSON.stringify({ success: true })
              }
            }));
          }
          
          // After a response completes with function calls, the conversation needs to continue
          // Don't trigger new response here - let the natural flow handle it or user speak next
        } catch (error) {
          console.error('Error handling data channel message:', error);
        }
      };

      dc.onclose = () => {
        console.log('Data channel closed');
        setIsConnected(false);
      };

      // Step 7: Create SDP offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Step 8: Send offer to OpenAI and get answer
      const sdpResponse = await fetch(
        `https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${client_secret.value}`,
            'Content-Type': 'application/sdp',
          },
          body: offer.sdp,
        }
      );

      if (!sdpResponse.ok) {
        throw new Error('Failed to connect to OpenAI');
      }

      const answerSdp = await sdpResponse.text();
      await pc.setRemoteDescription({
        type: 'answer',
        sdp: answerSdp,
      });

      console.log('WebRTC connection established');
      // Keep isConnecting=true until session.updated triggers in onmessage
    } catch (error) {
      console.error('Failed to connect:', error);
      setIsConnected(false);
      setIsConnecting(false);
      disconnect();
    }
    // Don't clear isConnecting here - let session.updated handler do it for smooth transition
  }, [onTasksGenerated, onConnectTasks, onClearCanvas, onUpdateTask]);

  const toggleMute = useCallback(() => {
    if (audioStreamRef.current) {
      const audioTracks = audioStreamRef.current.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!audioTracks[0]?.enabled);
    }
  }, []);

  const disconnect = useCallback(() => {
    // Track session end
    if (sessionStartRef.current) {
      const duration = Date.now() - sessionStartRef.current;
      fetch('/api/usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'end',
          duration
        }),
      }).catch(console.error);
      sessionStartRef.current = null;
    }
    
    if (dataChannelRef.current) {
      dataChannelRef.current.close();
      dataChannelRef.current = null;
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (audioElementRef.current) {
      audioElementRef.current.srcObject = null;
    }

    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
      audioStreamRef.current = null;
    }

    setIsConnected(false);
    setIsSpeaking(false);
    setIsMuted(false);
    setCurrentActivity('Disconnected');
  }, []);

  return {
    connect,
    disconnect,
    isConnected,
    isSpeaking,
    isConnecting,
    isMuted,
    currentActivity,
    toggleMute,
  };
}
