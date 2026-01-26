import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import { initialNodes } from '@/components/canvas/initial-nodes';
import { initialEdges } from '@/components/canvas/initial-edges';
import { initialTasks } from '@/components/canvas/initial-tasks';
import { type AppState, type Node, type Edge, type Task, type Subtask } from './types';
import { v4 as uuidv4 } from 'uuid';
import useProjectStore from './project-store';
import { mapStatusToBackend } from '@/lib/canvas-sync';


const MAX_HISTORY = 50;
let updateTaskTimer: NodeJS.Timeout | null = null;
let subtaskTimers: Record<string, NodeJS.Timeout> = {};

const useStore = create<AppState>()(
    devtools(
        (set, get) => ({
            nodes: initialNodes,
            edges: initialEdges,
            tasks: initialTasks,
            history: [{ nodes: initialNodes, edges: initialEdges, tasks: initialTasks }],
            historyIndex: 0,
            projectId: null,
            lastSavedAt: null,
            isDirty: false,
            isSaving: false,
            cursorMode: 'select',

            setProjectId: (projectId) => {
                set({ projectId, isDirty: false });
            },

            markDirty: () => {
                set({ isDirty: true });
            },

            markClean: () => {
                set({ isDirty: false });
            },

            setCursorMode: (mode) => {
                set({ cursorMode: mode });
            },

            resetCanvas: () => {
                set({
                    nodes: initialNodes,
                    edges: initialEdges,
                    tasks: initialTasks,
                    history: [{ nodes: initialNodes, edges: initialEdges, tasks: initialTasks }],
                    historyIndex: 0,
                    projectId: null,
                    lastSavedAt: null,
                    isDirty: false,
                    isSaving: false,
                });
            },

            saveHistory: () => {
                const { nodes, edges, tasks, history, historyIndex } = get();
                const newHistory = history.slice(0, historyIndex + 1);
                newHistory.push({ nodes: [...nodes], edges: [...edges], tasks: [...tasks] });
                if (newHistory.length > MAX_HISTORY) {
                    newHistory.shift();
                }
                set({
                    history: newHistory,
                    historyIndex: newHistory.length - 1
                });
            },

            undo: () => {
                const { history, historyIndex } = get();
                if (historyIndex > 0) {
                    const prevState = history[historyIndex - 1];
                    set({
                        nodes: prevState.nodes,
                        edges: prevState.edges,
                        tasks: prevState.tasks,
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
                        tasks: nextState.tasks,
                        historyIndex: historyIndex + 1
                    });
                }
            },

            onNodesChange: (changes) => {
                const currentState = get();
                const deletedTaskIds: string[] = [];

                // Track nodes that will be modified to preserve custom properties
                const nodePropertiesMap = new Map<string, { content_id?: string, project_id?: string }>();
                currentState.nodes.forEach(node => {
                    nodePropertiesMap.set(node.id, {
                        content_id: node.content_id,
                        project_id: node.project_id
                    });
                });

                changes.forEach(change => {
                    if (change.type === 'remove') {
                        const nodeToDelete = currentState.nodes.find(node => node.id === change.id);
                        if (nodeToDelete?.content_id) {
                            deletedTaskIds.push(nodeToDelete.content_id);
                            console.log('ReactFlow deletion - removing task:', nodeToDelete.content_id, 'for node:', change.id);
                        }
                    }
                });


                const updatedNodes = applyNodeChanges(changes, currentState.nodes).map(node => {
                    // Restore custom properties after React Flow processing
                    const savedProps = nodePropertiesMap.get(node.id);
                    if (savedProps && savedProps.content_id && savedProps.project_id) {
                        return {
                            ...node,
                            content_id: savedProps.content_id,
                            project_id: savedProps.project_id
                        } as Node;
                    }
                    return node as Node;
                });

                const updatedTasks = deletedTaskIds.length > 0
                    ? currentState.tasks.filter(task => !deletedTaskIds.includes(task.id))
                    : currentState.tasks;

                set({
                    nodes: updatedNodes,
                    tasks: updatedTasks,
                    isDirty: true,
                });


                if (deletedTaskIds.length > 0) {
                    console.log('Tasks removed via ReactFlow deletion:', deletedTaskIds.length);
                    get().saveHistory();
                }
            },

            onEdgesChange: (changes) => {
                set({
                    edges: applyEdgeChanges(changes, get().edges) as Edge[],
                    isDirty: true,
                });
            },

            onConnect: (connection) => {


                const newEdge = {
                    ...connection,
                    project_id: 'p1', // TODO: Get from current project context
                    type: 'default',
                    markerEnd: {
                        type: 'arrowclosed',
                        color: 'hsl(var(--edges))'
                    },

                    animated: true,
                    style: {
                        stroke: 'hsl(var(--edges))',
                        strokeWidth: 10,
                        animationDuration: '1s',
                        strokeDasharray: '5,5',
                    },
                };
                set({
                    edges: addEdge(newEdge, get().edges) as Edge[],
                    isDirty: true,
                });
            },

            setNodes: (nodes) => {
                set({ nodes, isDirty: true });
            },

            setEdges: (edges) => {
                set({ edges, isDirty: true });
            },

            setTasks: (tasks) => {
                set({ tasks });
            },

            addTaskNode: async (task?: Partial<Task>, nodeOptions?: {
                position?: { x: number; y: number };
                id?: string;
            }) => {
                const projectId = get().projectId;

                if (!projectId) {
                    console.error('[Flow Store] Cannot add task: no project ID set');
                    return '';
                }

                // Create task in backend first
                try {
                    const response = await fetch(`/api/projects/${projectId}/tasks`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            title: task?.title || 'New Task',
                            description: task?.description || '',
                            status: task?.status || 'Backlog',
                            estimatedHours: task?.estimated_hours || 0
                        })
                    });

                    if (!response.ok) {
                        const errorData = await response.text();
                        console.error('[Flow Store] Failed to create task in backend:', errorData);
                        return '';
                    }

                    const data = await response.json();
                    const backendTask = data.task;

                    // Calculate position with FRESH state right before adding
                    const currentNodes = get().nodes;
                    let position = nodeOptions?.position || { x: 200, y: 200 };

                    // Horizontal layout - cards placed side by side
                    if (!nodeOptions?.position) {
                        const HORIZONTAL_SPACING = 700; // Space between cards horizontally
                        const START_X = -500;
                        const START_Y = 200;

                        const taskNodes = currentNodes.filter(n => n.type === 'task');
                        const cardIndex = taskNodes.length;

                        position = {
                            x: START_X + (cardIndex * HORIZONTAL_SPACING),
                            y: START_Y
                        };
                        
                        console.log(`[Flow Store] Positioning new task: index=${cardIndex}, x=${position.x}, y=${position.y}, existing tasks=${taskNodes.length}`);
                    }

                    // Create node with backend task ID
                    const nodeId = nodeOptions?.id || `node-${uuidv4()}`;
                    const newNode: Node = {
                        id: nodeId,
                        type: 'task',
                        position: position,
                        project_id: projectId,
                        content_id: backendTask.id,
                        data: {},
                    };

                    // Create local task matching backend structure
                    const newTask: Task = {
                        id: backendTask.id,
                        node_id: nodeId,
                        project_id: projectId,
                        title: backendTask.title,
                        status: backendTask.status ? backendTask.status.toLowerCase().replace(/ /g, '-') : 'backlog',
                        estimated_hours: backendTask.estimated_hours || 0,
                        time_spent: backendTask.time_spent || 0,
                        description: backendTask.description || '',
                        subtasks: [],
                        comments: [],
                        members: [],
                        sort_order: task?.sort_order ?? 0,
                        created_by: backendTask.created_by,
                        created_at: backendTask.created_at,
                        updated_at: backendTask.updated_at,
                    };

                    set({
                        nodes: [...get().nodes, newNode],
                        tasks: [...get().tasks, newTask]
                    });

                    get().saveHistory();

                    console.log('[Flow Store] Task created:', backendTask.id);
                    return newNode.id;
                } catch (error) {
                    console.error('[Flow Store] Error creating task:', error);
                    return '';
                }
            },

            updateNodeData: (id: string, data: Partial<Task>, saveToHistory: boolean = true) => {
                set({
                    nodes: get().nodes.map(node =>
                        node.id === id
                            ? { ...node, data: { ...node.data, ...data } }
                            : node
                    )
                });


                if (saveToHistory) {
                    get().saveHistory();
                }
            },


            getTaskByNodeId: (nodeId: string) => {
                const node = get().nodes.find(n => n.id === nodeId);
                if (!node) return undefined;
                return get().tasks.find(t => t.id === node.content_id);
            },

            getNodeByTaskId: (taskId: string) => {
                return get().nodes.find(n => n.content_id === taskId);
            },


            updateTask: async (taskId: string, data: Partial<Task>, saveToHistory: boolean = true) => {
                // Update local state immediately (optimistic)
                set({
                    tasks: get().tasks.map(task =>
                        task.id === taskId
                            ? { ...task, ...data, updated_at: new Date().toISOString() }
                            : task
                    )
                });

                if (saveToHistory) {
                    get().saveHistory();
                }

                // Debounce backend sync (500ms)
                if (updateTaskTimer) {
                    clearTimeout(updateTaskTimer);
                }

                updateTaskTimer = setTimeout(async () => {
                    try {
                        // Map status to backend format if present
                        const backendData: any = {};
                        if (data.title !== undefined) backendData.title = data.title;
                        if (data.description !== undefined) backendData.description = data.description;
                        if (data.status !== undefined) backendData.status = mapStatusToBackend(data.status);
                        if (data.estimated_hours !== undefined) backendData.estimatedHours = data.estimated_hours;
                        if (data.time_spent !== undefined) backendData.timeSpent = data.time_spent;

                        const response = await fetch(`/api/tasks/${taskId}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(backendData)
                        });

                        if (!response.ok) {
                            const errorText = await response.text();
                            console.error('[Flow Store] Failed to update task in backend:', errorText);
                        } else {
                            console.log('[Flow Store] Task updated in backend:', taskId);
                        }
                    } catch (error) {
                        console.error('[Flow Store] Error updating task:', error);
                    }
                }, 500);
            },

            deleteTaskNode: async (nodeId: string) => {
                const currentState = get();
                const nodeToDelete = currentState.nodes.find(node => node.id === nodeId);

                if (!nodeToDelete) {
                    console.warn('[Flow Store] Node not found for deletion:', nodeId);
                    return;
                }

                // Delete from backend first
                if (nodeToDelete.content_id) {
                    try {
                        const response = await fetch(`/api/tasks/${nodeToDelete.content_id}`, {
                            method: 'DELETE'
                        });

                        if (!response.ok) {
                            const errorText = await response.text();
                            console.error('[Flow Store] Failed to delete task from backend:', errorText);
                            // Don't continue with local deletion if backend fails
                            return;
                        } else {
                            console.log('[Flow Store] Task deleted from backend:', nodeToDelete.content_id);
                        }
                    } catch (error) {
                        console.error('[Flow Store] Error deleting task:', error);
                        // Don't continue with local deletion if backend fails
                        return;
                    }
                }

                // Local deletion - only if backend succeeded
                const filteredNodes = currentState.nodes.filter(node => node.id !== nodeId);
                const filteredEdges = currentState.edges.filter(edge =>
                    edge.source !== nodeId && edge.target !== nodeId
                );

                let filteredTasks = currentState.tasks;
                if (nodeToDelete.content_id) {
                    filteredTasks = currentState.tasks.filter(task => task.id !== nodeToDelete.content_id);
                }

                set({
                    nodes: filteredNodes,
                    edges: filteredEdges,
                    tasks: filteredTasks,
                    isDirty: true
                });

                get().saveHistory();
                
                // Trigger immediate autosave after deletion
                console.log('[Flow Store] Deletion complete, triggering autosave...');
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



            addSubtask: async (taskId: string) => {
                const task = get().tasks.find(t => t.id === taskId);
                if (!task) {
                    console.error('[Flow Store] Cannot add subtask: task not found', taskId);
                    return;
                }

                const newSubtask = {
                    id: uuidv4(),
                    task_id: taskId,
                    title: "New Subtask",
                    is_completed: false,
                    estimated_duration: 0,
                    time_spent: 0,
                    sort_order: (task.subtasks || []).length,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                };

                // Update local state immediately (optimistic)
                set({
                    tasks: get().tasks.map(task => {
                        if (task.id === taskId) {
                            const updatedSubtasks = [...(task.subtasks || []), newSubtask];
                            const totalEstimated = updatedSubtasks.reduce((sum, subtask) => sum + (subtask.estimated_duration || 0), 0);
                            const totalTimeSpent = updatedSubtasks.reduce((sum, subtask) => sum + (subtask.time_spent || 0), 0);
                            return {
                                ...task,
                                subtasks: updatedSubtasks,
                                estimated_hours: totalEstimated,
                                time_spent: totalTimeSpent,
                                updated_at: new Date().toISOString(),
                            };
                        }
                        return task;
                    })
                });

                get().saveHistory();

                // Sync to backend
                try {
                    const response = await fetch(`/api/tasks/${taskId}/subtasks`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            title: newSubtask.title,
                            estimatedDuration: newSubtask.estimated_duration,
                            sortOrder: newSubtask.sort_order
                        })
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('[Flow Store] Failed to create subtask in backend:', errorText);
                        // Rollback on failure
                        set({
                            tasks: get().tasks.map(task => {
                                if (task.id === taskId) {
                                    const updatedSubtasks = (task.subtasks || []).filter(st => st.id !== newSubtask.id);
                                    const totalEstimated = updatedSubtasks.reduce((sum, subtask) => sum + (subtask.estimated_duration || 0), 0);
                                    const totalTimeSpent = updatedSubtasks.reduce((sum, subtask) => sum + (subtask.time_spent || 0), 0);
                                    return {
                                        ...task,
                                        subtasks: updatedSubtasks,
                                        estimated_hours: totalEstimated,
                                        time_spent: totalTimeSpent,
                                    };
                                }
                                return task;
                            })
                        });
                    } else {
                        const data = await response.json();
                        const backendSubtask = data.subtask;
                        
                        // Update local subtask with backend ID
                        set({
                            tasks: get().tasks.map(task => {
                                if (task.id === taskId) {
                                    return {
                                        ...task,
                                        subtasks: (task.subtasks || []).map(st => 
                                            st.id === newSubtask.id ? { ...st, id: backendSubtask.id } : st
                                        )
                                    };
                                }
                                return task;
                            })
                        });
                        
                        console.log('[Flow Store] Subtask created in backend:', backendSubtask.id);
                    }
                } catch (error) {
                    console.error('[Flow Store] Error creating subtask:', error);
                }
            },

            updateSubtask: async (taskId: string, subtaskId: string, data: Partial<Subtask>) => {
                // Update local state immediately (optimistic)
                set({
                    tasks: get().tasks.map(task => {
                        if (task.id === taskId) {
                            const updatedSubtasks = (task.subtasks || []).map((subtask) =>
                                subtask.id === subtaskId
                                    ? { ...subtask, ...data, updated_at: new Date().toISOString() }
                                    : subtask
                            );

                            const totalEstimated = updatedSubtasks.reduce((sum, subtask) => sum + (subtask.estimated_duration || 0), 0);
                            const totalTimeSpent = updatedSubtasks.reduce((sum, subtask) => sum + (subtask.time_spent || 0), 0);

                            return {
                                ...task,
                                subtasks: updatedSubtasks,
                                estimated_hours: totalEstimated,
                                time_spent: totalTimeSpent,
                                updated_at: new Date().toISOString(),
                            };
                        }
                        return task;
                    })
                });

                get().saveHistory();

                // Checkbox changes sync immediately, title changes debounce
                const isCheckbox = data.is_completed !== undefined;
                const syncDelay = isCheckbox ? 0 : 500;

                // Clear any existing timer for this subtask
                const timerKey = `${taskId}-${subtaskId}`;
                if (subtaskTimers[timerKey]) {
                    clearTimeout(subtaskTimers[timerKey]);
                }

                subtaskTimers[timerKey] = setTimeout(async () => {
                    try {
                        // Map frontend fields to backend format
                        const backendData: any = {};
                        if (data.title !== undefined) backendData.title = data.title;
                        if (data.is_completed !== undefined) backendData.isCompleted = data.is_completed;
                        if (data.estimated_duration !== undefined) backendData.estimatedDuration = data.estimated_duration;
                        if (data.time_spent !== undefined) backendData.timeSpent = data.time_spent;
                        if (data.sort_order !== undefined) backendData.sortOrder = data.sort_order;

                        const response = await fetch(`/api/tasks/${taskId}/subtasks/${subtaskId}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(backendData)
                        });

                        if (!response.ok) {
                            const errorText = await response.text();
                            console.error('[Flow Store] Failed to update subtask in backend:', errorText);
                        } else {
                            console.log(`[Flow Store] Subtask updated in backend: ${subtaskId}`);
                        }
                    } catch (error) {
                        console.error('[Flow Store] Error updating subtask:', error);
                    }

                    delete subtaskTimers[timerKey];
                }, syncDelay);
            },

            deleteSubtask: async (taskId: string, subtaskId: string) => {
                // Delete from backend first
                try {
                    const response = await fetch(`/api/tasks/${taskId}/subtasks/${subtaskId}`, {
                        method: 'DELETE'
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('[Flow Store] Failed to delete subtask from backend:', errorText);
                        return; // Don't proceed with local deletion if backend fails
                    }

                    console.log('[Flow Store] Subtask deleted from backend:', subtaskId);
                } catch (error) {
                    console.error('[Flow Store] Error deleting subtask:', error);
                    return; // Don't proceed with local deletion if backend fails
                }

                // Local deletion - only if backend succeeded
                set({
                    tasks: get().tasks.map(task => {
                        if (task.id === taskId) {
                            const updatedSubtasks = (task.subtasks || []).filter((subtask) => subtask.id !== subtaskId);

                            // Calculate totals from remaining subtasks
                            const totalEstimated = updatedSubtasks.reduce((sum, subtask) => sum + (subtask.estimated_duration || 0), 0);
                            const totalTimeSpent = updatedSubtasks.reduce((sum, subtask) => sum + (subtask.time_spent || 0), 0);

                            return {
                                ...task,
                                subtasks: updatedSubtasks,
                                estimated_hours: totalEstimated,
                                time_spent: totalTimeSpent,
                                updated_at: new Date().toISOString(),
                            };
                        }
                        return task;
                    })
                });

                get().saveHistory();
            },

        })
    )
);

export { useStore };
export default useStore;