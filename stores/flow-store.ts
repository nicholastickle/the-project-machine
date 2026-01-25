import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import { initialNodes } from '@/components/canvas/initial-nodes';
import { initialEdges } from '@/components/canvas/initial-edges';
import { initialTasks } from '@/components/canvas/initial-tasks';
import { type AppState, type Node, type Edge, type Task, type Subtask } from './types';
import { v4 as uuidv4 } from 'uuid';
import useProjectStore from './project-store';


const MAX_HISTORY = 50;

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
                    });

                   
                    if (deletedTaskIds.length > 0) {
                        console.log('Tasks removed via ReactFlow deletion:', deletedTaskIds.length);
                        get().saveHistory();
                    }
                },

                onEdgesChange: (changes) => {
                    set({
                        edges: applyEdgeChanges(changes, get().edges) as Edge[],
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
                    const nodes = get().nodes;
                    const projectId = get().projectId;
                    
                    if (!projectId) {
                        console.error('[Flow Store] Cannot add task: no project ID set');
                        return '';
                    }

                    let position = nodeOptions?.position || { x: 200, y: 200 };

                    // Horizontal layout - cards placed side by side
                    if (!nodeOptions?.position) {
                        const HORIZONTAL_SPACING = 700; // Space between cards horizontally
                        const START_X = -500;
                        const START_Y = 200;

                        const taskNodes = nodes.filter(n => n.type === 'task');
                        const cardIndex = taskNodes.length;

                        position = {
                            x: START_X + (cardIndex * HORIZONTAL_SPACING),
                            y: START_Y
                        };
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
                    // Update local state first
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

                    // Sync to backend
                    try {
                        const response = await fetch(`/api/tasks/${taskId}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                title: data.title,
                                description: data.description,
                                status: data.status,
                                estimatedHours: data.estimated_hours,
                                timeSpent: data.time_spent
                            })
                        });

                        if (!response.ok) {
                            console.error('[Flow Store] Failed to update task in backend');
                        }
                    } catch (error) {
                        console.error('[Flow Store] Error updating task:', error);
                    }
                },

                deleteTaskNode: (nodeId: string) => {
                    const currentState = get();
                    const nodeToDelete = currentState.nodes.find(node => node.id === nodeId);

                  

                    
                    const filteredNodes = currentState.nodes.filter(node => node.id !== nodeId);
                    const filteredEdges = currentState.edges.filter(edge =>
                        edge.source !== nodeId && edge.target !== nodeId
                    );

                    let filteredTasks = currentState.tasks;
                    if (nodeToDelete?.content_id) {
                        filteredTasks = currentState.tasks.filter(task => task.id !== nodeToDelete.content_id);
                    }

                    set({
                        nodes: filteredNodes,
                        edges: filteredEdges,
                        tasks: filteredTasks
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



                addSubtask: (taskId: string) => {
                    const newSubtask = {
                        id: uuidv4(),
                        task_id: taskId,
                        title: "",
                        is_completed: false,
                        estimated_duration: 0,
                        time_spent: 0,
                        sort_order: 0,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    };

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
                },

                updateSubtask: (taskId: string, subtaskId: string, data: Partial<Subtask>) => {
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
                },

                deleteSubtask: (taskId: string, subtaskId: string) => {
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