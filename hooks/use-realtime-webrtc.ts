import { useRef, useState, useCallback } from 'react';

interface RealtimeWebRTCHook {
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnected: boolean;
  isSpeaking: boolean;
}

export function useRealtimeWebRTC(
  onTasksGenerated: (tasks: any[]) => void,
  onConnectTasks: (connections: { from: number; to: number }[]) => void,
  onClearCanvas: () => void
): RealtimeWebRTCHook {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const sessionStartRef = useRef<number | null>(null);

  const connect = useCallback(async () => {
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
      
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      // Step 6: Create data channel for events
      const dc = pc.createDataChannel('oai-events');
      dataChannelRef.current = dc;

      dc.onopen = () => {
        console.log('Data channel opened');
        setIsConnected(true);
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
            instructions: `You're PM, a British AI helping with project planning. Be quick, encouraging, and get straight to business. Ask "What are you building?" then immediately generate 3-10 tasks with time estimates. Say things like "Brilliant!", "Let's crack on", "Sorted!", "Right then". Keep responses under 10 words when possible. For small projects, assume 3-10 tasks. Larger projects can have 8-10+. If they say "clear the board", call clear_canvas.`,
            turn_detection: {
              type: 'server_vad',
              threshold: 0.6,
              prefix_padding_ms: 500,
              silence_duration_ms: 700,
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
          
          // Track speaking state
          if (message.type === 'response.audio.delta' || message.type === 'response.audio_transcript.delta') {
            setIsSpeaking(true);
          } else if (message.type === 'response.done') {
            setIsSpeaking(false);
          }

          // Handle function calls
          if (message.type === 'response.function_call_arguments.done') {
            const { name, call_id, arguments: argsString } = message;
            const args = JSON.parse(argsString);

            if (name === 'create_tasks' && args.tasks) {
              onTasksGenerated(args.tasks);
            } else if (name === 'connect_tasks' && args.connections) {
              onConnectTasks(args.connections);
            } else if (name === 'clear_canvas') {
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

            // Trigger response
            dc.send(JSON.stringify({ type: 'response.create' }));
          }
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
    } catch (error) {
      console.error('Failed to connect:', error);
      setIsConnected(false);
      disconnect();
    }
  }, [onTasksGenerated, onConnectTasks, onClearCanvas]);

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

    setIsConnected(false);
    setIsSpeaking(false);
  }, []);

  return {
    connect,
    disconnect,
    isConnected,
    isSpeaking,
  };
}
