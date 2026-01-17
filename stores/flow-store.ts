import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { addEdge, applyNodeChanges, applyEdgeChanges, type Node } from '@xyflow/react';
import { initialNodes } from '@/components/canvas/initial-nodes';
import { initialEdges } from '@/components/canvas/initial-edges';
import { type AppState } from './types';
import { v4 as uuidv4 } from 'uuid';
import { 
  loadProjectCanvas, 
  saveCanvasSnapshot, 
  updateTaskInBackend,
  subscribeToProjectUpdates,
  type TaskFromBackend
} from '@/lib/canvas-sync';

// Type for task data updates (camelCase to match API)
type TaskDataUpdate = Partial<{
    title: string;
    description: string;
    status: string;
    estimatedHours: number;
    timeSpent: number;
}>;

const MAX_HISTORY = 50;

const useStore = create<AppState>()(
    devtools(
        (set, get) => ({
            nodes: initialNodes,
            edges: initialEdges,
            history: [{ nodes: initialNodes, edges: initialEdges }],
            historyIndex: 0,
            projectId: null,
            lastSavedAt: null,
            isDirty: false,
            isSaving: false,

                setProjectId: (projectId) => {
                    set({ projectId, isDirty: false });
                },

                markDirty: () => {
                    set({ isDirty: true });
                },

                markClean: () => {
                    set({ isDirty: false });
                },

                saveHistory: () => {
                    const { nodes, edges, history, historyIndex } = get();
                    const newHistory = history.slice(0, historyIndex + 1);
                    newHistory.push({ nodes: [...nodes], edges: [...edges] });
                    if (newHistory.length > MAX_HISTORY) {
                        newHistory.shift();
                    }
                    set({
                        history: newHistory,
                        historyIndex: newHistory.length - 1,
                        isDirty: true, // Mark as dirty when history changes
                    });
                },

                undo: () => {
                    const { history, historyIndex } = get();
                    if (historyIndex > 0) {
                        const prevState = history[historyIndex - 1];
                        set({
                            nodes: prevState.nodes,
                            edges: prevState.edges,
                            historyIndex: historyIndex - 1
                        });
                    }
                },

                redo: () => {
                    const { history, historyIndex } = get();
                    if (historyIndex < history.length - 1) {
                        const nextState = history[historyIndex + 1];
                        set({
                            nodes: nextState.nodes,
                            edges: nextState.edges,
                            historyIndex: historyIndex + 1
                        });
                    }
                },

                onNodesChange: (changes) => {
                    set({
                        nodes: applyNodeChanges(changes, get().nodes),
                    });
                },

                onEdgesChange: (changes) => {
                    set({
                        edges: applyEdgeChanges(changes, get().edges),
                    });
                },

                onConnect: (connection) => {
                    // Check if vertical connection (bottom to top)
                    const isVertical = connection.sourceHandle === 'bottom' && connection.targetHandle === 'top';

                    const newEdge = {
                        ...connection,
                        type: 'smoothstep',
                        markerEnd: {
                            type: 'arrowclosed',
                            color: 'hsl(var(--edges))'
                        },

                        animated: true,
                        style: {
                            stroke: 'hsl(var(--edges))',
                            strokeWidth: 2,
                            animationDuration: '1s',
                        },
                    };
                    set({
                        edges: addEdge(newEdge, get().edges),
                    });

                    get().saveHistory();
                    
                    // Save snapshot to persist edge to backend
                    const { projectId } = get()
                    if (projectId) {
                        setTimeout(() => get().saveSnapshot('manual'), 100)
                    }
                },

                setNodes: (nodes) => {
                    set({ nodes, isDirty: true });
                },

                setEdges: (edges) => {
                    set({ edges, isDirty: true });
                },

                addTaskNode: async (nodeData?: {
                    title?: string;
                    position?: { x: number; y: number }
                    status?: string;
                    estimatedHours?: number;
                    timeSpent?: number;
                    description?: string;
                    subtasks?: { id: string; title: string; isCompleted: boolean; estimatedDuration: number; timeSpent: number; }[];
                }) => {
                    const { projectId } = get()
                    const nodes = get().nodes;
                    let position = nodeData?.position || { x: 200, y: 200 };

                    // Horizontal layout - cards placed side by side
                    if (!nodeData?.position) {
                        const HORIZONTAL_SPACING = 700; // Space between cards horizontally
                        const START_X = -500;
                        const START_Y = 200;

                        const taskNodes = nodes.filter(n => n.type === 'taskCardNode');
                        const cardIndex = taskNodes.length;

                        position = {
                            x: START_X + (cardIndex * HORIZONTAL_SPACING),
                            y: START_Y
                        };
                    }

                    // If we have a projectId, create task in backend first
                    let taskId: string | null = null
                    if (projectId) {
                        try {
                            console.log('[Store] Creating task in backend for project:', projectId)
                            
                            // Build request body - only include non-null values
                            const taskData: {
                                title: string
                                status: string
                                description?: string
                                estimatedHours?: number
                            } = {
                                title: nodeData?.title || 'New Task',
                                status: nodeData?.status || 'Backlog',
                            }
                            
                            if (nodeData?.description) {
                                taskData.description = nodeData.description
                            }
                            
                            if (nodeData?.estimatedHours != null) {
                                taskData.estimatedHours = nodeData.estimatedHours
                            }
                            
                            const response = await fetch(`/api/projects/${projectId}/tasks`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(taskData)
                            })
                            
                            if (response.ok) {
                                const data = await response.json()
                                taskId = data.task.id
                                console.log('[Store] ✅ Task created in backend:', taskId)
                            } else {
                                const errorText = await response.text()
                                console.error('[Store] ❌ Failed to create task in backend:', response.status, errorText)
                            }
                        } catch (error) {
                            console.error('[Store] Error creating task:', error)
                        }
                    } else {
                        console.warn('[Store] ⚠️ No projectId - task will only exist locally')
                    }

                    const newNode: Node = {
                        id: `task-${uuidv4()}`,
                        type: 'taskCardNode',
                        position: position,
                        data: {
                            taskId: taskId, // Link to backend task
                            title: nodeData?.title ?? "New Task",
                            status: nodeData?.status ?? 'Not started',
                            estimatedHours: nodeData?.estimatedHours,
                            timeSpent: nodeData?.timeSpent ?? 0,
                            description: nodeData?.description ?? "",
                            subtasks: nodeData?.subtasks ?? [],
                        },
                    };

                    set({
                        nodes: [...get().nodes, newNode]
                    });

                    // Save history AFTER the change
                    get().saveHistory();
                    
                    // If we have projectId, also save snapshot (positions)
                    if (projectId) {
                        setTimeout(() => {
                            get().saveSnapshot('manual')
                        }, 100)
                    }

                    return newNode.id;
                },

                updateNodeData: (nodeId: string, newData: Partial<{ title: string; status: string; timeSpent: number; estimatedHours: number; description: string; subtasks: { id: string; title: string; isCompleted: boolean; estimatedDuration: number; timeSpent: number; }[] }>, saveToHistory: boolean = true) => {
                    set({
                        nodes: get().nodes.map(node =>
                            node.id === nodeId
                                ? { ...node, data: { ...node.data, ...newData } }
                                : node
                        )
                    });

                    // Only save history for user-initiated changes (not time tracking ticks)
                    if (saveToHistory) {
                        get().saveHistory();
                        
                        // Also persist to backend if we have projectId
                        const { projectId } = get()
                        if (projectId) {
                            get().updateTaskData(nodeId, newData)
                        }
                    }
                },

                deleteNode: (nodeId: string) => {
                    set({
                        nodes: get().nodes.filter(node => node.id !== nodeId),
                        edges: get().edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId)
                    });

                    get().saveHistory();
                },

                connectTasks: (sourceId: string, targetId: string, handles?: { sourceHandle: string; targetHandle: string }) => {
                    const connection = {
                        source: sourceId,
                        target: targetId,
                        sourceHandle: handles?.sourceHandle || 'right',
                        targetHandle: handles?.targetHandle || 'left'
                    };
                    get().onConnect(connection);

                    get().saveHistory();
                },

                resetCanvas: () => {
                    // Clear persisted data from localStorage
                    localStorage.removeItem('canvas-storage');
                    localStorage.removeItem('taskbook-storage');

                    set({
                        nodes: initialNodes,
                        edges: initialEdges,
                    });

                    get().saveHistory();
                },

                addSubtask: (nodeId: string) => {
                    const newSubtask = {
                        id: uuidv4(),
                        title: "",
                        isCompleted: false,
                        estimatedDuration: 0,
                        timeSpent: 0
                    };

                    set({
                        nodes: get().nodes.map(node => {
                            if (node.id === nodeId) {
                                const updatedSubtasks = [...((node.data.subtasks as any[]) || []), newSubtask];

                                // Calculate totals from subtasks
                                const totalEstimated = updatedSubtasks.reduce((sum: number, subtask: any) => sum + (subtask.estimatedDuration || 0), 0);
                                const totalTimeSpent = updatedSubtasks.reduce((sum: number, subtask: any) => sum + (subtask.timeSpent || 0), 0);

                                return {
                                    ...node,
                                    data: {
                                        ...node.data,
                                        subtasks: updatedSubtasks,
                                        estimatedHours: totalEstimated,
                                        timeSpent: totalTimeSpent
                                    }
                                };
                            }
                            return node;
                        })
                    });

                    get().saveHistory();
                },

                updateSubtask: (nodeId: string, subtaskId: string, data: Partial<{ id: string; title: string; isCompleted: boolean; estimatedDuration: number; timeSpent: number; }>) => {
                    set({
                        nodes: get().nodes.map(node => {
                            if (node.id === nodeId) {
                                const updatedSubtasks = ((node.data.subtasks as any[]) || []).map((subtask: any) =>
                                    subtask.id === subtaskId
                                        ? { ...subtask, ...data }
                                        : subtask
                                );

                                // Calculate totals from subtasks
                                const totalEstimated = updatedSubtasks.reduce((sum: number, subtask: any) => sum + (subtask.estimatedDuration || 0), 0);
                                const totalTimeSpent = updatedSubtasks.reduce((sum: number, subtask: any) => sum + (subtask.timeSpent || 0), 0);

                                return {
                                    ...node,
                                    data: {
                                        ...node.data,
                                        subtasks: updatedSubtasks,
                                        estimatedHours: totalEstimated,
                                        timeSpent: totalTimeSpent
                                    }
                                };
                            }
                            return node;
                        })
                    });

                    get().saveHistory();
                },

                deleteSubtask: (nodeId: string, subtaskId: string) => {
                    set({
                        nodes: get().nodes.map(node => {
                            if (node.id === nodeId) {
                                const updatedSubtasks = ((node.data.subtasks as any[]) || []).filter((subtask: any) => subtask.id !== subtaskId);

                                // Calculate totals from remaining subtasks
                                const totalEstimated = updatedSubtasks.reduce((sum: number, subtask: any) => sum + (subtask.estimatedDuration || 0), 0);
                                const totalTimeSpent = updatedSubtasks.reduce((sum: number, subtask: any) => sum + (subtask.timeSpent || 0), 0);

                                return {
                                    ...node,
                                    data: {
                                        ...node.data,
                                        subtasks: updatedSubtasks,
                                        estimatedHours: totalEstimated,
                                        timeSpent: totalTimeSpent
                                    }
                                };
                            }
                            return node;
                        })
                    });

                    get().saveHistory();
                },

                // ========================================
                // BACKEND SYNC METHODS (Sprint 3)
                // ========================================

                /**
                 * Load project from backend (snapshots + tasks)
                 */
                loadProject: async (projectId: string) => {
                    console.log(`[Store] Loading project: ${projectId}`)
                    set({ projectId, isSaving: true })
                    
                    try {
                        const { nodes, edges } = await loadProjectCanvas(projectId)
                        set({ 
                            nodes, 
                            edges, 
                            isDirty: false,
                            isSaving: false 
                        })
                        
                        // Initialize history with loaded state
                        get().saveHistory()
                        
                        console.log(`[Store] ✅ Project loaded: ${nodes.length} nodes`)
                    } catch (error) {
                        console.error('[Store] Failed to load project:', error)
                        set({ isSaving: false })
                    }
                },

                /**
                 * Save canvas snapshot (debounced, positions only)
                 */
                saveSnapshot: async (type: 'manual' | 'autosave' = 'autosave') => {
                    const { projectId, nodes, edges, isSaving } = get()
                    
                    if (!projectId) {
                        console.warn('[Store] Cannot save: No projectId')
                        return false
                    }
                    
                    if (isSaving) {
                        console.warn('[Store] Save already in progress')
                        return false
                    }
                    
                    set({ isSaving: true })
                    const success = await saveCanvasSnapshot(projectId, nodes, edges, type)
                    
                    if (success) {
                        set({ 
                            isDirty: false, 
                            lastSavedAt: new Date().toISOString(),
                            isSaving: false 
                        })
                    } else {
                        set({ isSaving: false })
                    }
                    
                    return success
                },

                /**
                 * Update task business data (title, status, etc.)
                 */
                updateTaskData: async (nodeId: string, updates: TaskDataUpdate) => {
                    const { projectId, nodes } = get()
                    
                    if (!projectId) {
                        console.warn('[Store] Cannot update: No projectId')
                        return false
                    }
                    
                    const node = nodes.find(n => n.id === nodeId)
                    const taskId = node?.data?.taskId as string | undefined
                    
                    if (!taskId) {
                        console.warn('[Store] Cannot update: No taskId found for node:', nodeId)
                        return false
                    }
                    
                    console.log('[Store] Updating task:', taskId, 'with:', updates)
                    
                    // Optimistic update to local state
                    get().updateNodeData(nodeId, updates, false)
                    
                    // Persist to backend (updates already in camelCase)
                    const success = await updateTaskInBackend(projectId, taskId, updates)
                    
                    if (!success) {
                        console.error('[Store] Task update failed, state may be inconsistent')
                    }
                    
                    return success
                },

                /**
                 * Handle realtime updates from other users
                 */
                handleRealtimeUpdate: (task: TaskFromBackend) => {
                    const { nodes } = get()
                    
                    // Find node with this taskId
                    const nodeIndex = nodes.findIndex(n => n.data?.taskId === task.id)
                    
                    if (nodeIndex >= 0) {
                        const updatedNodes = [...nodes]
                        updatedNodes[nodeIndex] = {
                            ...updatedNodes[nodeIndex],
                            data: {
                                ...updatedNodes[nodeIndex].data,
                                title: task.title,
                                description: task.description || '',
                                status: task.status,
                                estimatedHours: task.estimated_hours,
                                timeSpent: task.time_spent
                            }
                        }
                        
                        set({ nodes: updatedNodes })
                        console.log(`[Store] 🔄 Realtime update applied: ${task.title}`)
                    }
                },

                /**
                 * Subscribe to realtime updates for current project
                 */
                subscribeToRealtime: () => {
                    const { projectId, handleRealtimeUpdate } = get()
                    
                    if (!projectId) {
                        console.warn('[Store] Cannot subscribe: No projectId')
                        return () => {}
                    }
                    
                    console.log(`[Store] 📡 Subscribing to realtime for project: ${projectId}`)
                    return subscribeToProjectUpdates(projectId, handleRealtimeUpdate)
                },

            }),
        {
            name: 'flow-store'
        }
    )

);

export { useStore };
export default useStore;