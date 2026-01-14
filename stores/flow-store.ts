import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import { initialNodes } from '@/components/canvas/initial-nodes';
import { initialEdges } from '@/components/canvas/initial-edges';
import { initialTasks } from '@/components/canvas/initial-tasks';
import { type AppState, type Node, type Edge, type Task, type Subtask } from './types';
import { v4 as uuidv4 } from 'uuid';

const MAX_HISTORY = 50;

const useStore = create<AppState>()(
    devtools(
        persist(
            (set, get) => ({
                nodes: initialNodes,
                edges: initialEdges,
                tasks: initialTasks,
                history: [{ nodes: initialNodes, edges: initialEdges, tasks: initialTasks }],
                historyIndex: 0,

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
                    set({
                        nodes: applyNodeChanges(changes, get().nodes),
                    });
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
                        edges: addEdge(newEdge, get().edges) as Edge[],
                    });
                },

                setNodes: (nodes) => {
                    set({ nodes });
                },

                setEdges: (edges) => {
                    set({ edges });
                },

                addTaskNode: (task?: Partial<Task>, nodeOptions?: {
                    position?: { x: number; y: number };
                    id?: string;
                }) => {
                    const nodes = get().nodes;
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

                    // Generate IDs
                    const nodeId = nodeOptions?.id || `node-${uuidv4()}`;
                    const taskId = `task-${uuidv4()}`;

                    // Create the node (canvas/positioning data)
                    const newNode: Node = {
                        id: nodeId,
                        type: 'task',
                        position: position,
                        project_id: 'p1', // TODO: Get from current project context
                        content_id: taskId, // Links to the task
                        data: {}, // Node data is now minimal - just for ReactFlow compatibility
                    };

                    // Create the task (content data)
                    const newTask: Task = {
                        id: taskId,
                        node_id: nodeId, // Links back to the node
                        project_id: 'p1', // TODO: Get from current project context
                        title: task?.title ?? "",
                        status: task?.status ?? 'backlog',
                        estimated_hours: task?.estimated_hours ?? 0,
                        time_spent: task?.time_spent ?? 0,
                        description: task?.description ?? "",
                        subtasks: task?.subtasks ?? [],
                        comments: task?.comments ?? [],
                        members: task?.members ?? [],
                        sort_order: task?.sort_order ?? 0,
                        created_by: 'user1', // TODO: Get from auth context
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    };

                    set({
                        nodes: [...get().nodes, newNode],
                        tasks: [...get().tasks, newTask]
                    });

                    // Save history AFTER the change
                    get().saveHistory();

                    return newNode.id;
                },

                updateNodeData: (id: string, data: Partial<Task>, saveToHistory: boolean = true) => {
                    set({
                        nodes: get().nodes.map(node =>
                            node.id === id
                                ? { ...node, data: { ...node.data, ...data } }
                                : node
                        )
                    });

                    // Only save history for user-initiated changes (not time tracking ticks)
                    if (saveToHistory) {
                        get().saveHistory();
                    }
                },

                // Helper methods
                getTaskByNodeId: (nodeId: string) => {
                    const node = get().nodes.find(n => n.id === nodeId);
                    if (!node) return undefined;
                    return get().tasks.find(t => t.id === node.content_id);
                },

                getNodeByTaskId: (taskId: string) => {
                    return get().nodes.find(n => n.content_id === taskId);
                },

                // New task update method
                updateTask: (taskId: string, data: Partial<Task>, saveToHistory: boolean = true) => {
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
                },

                deleteNode: (nodeId: string) => {
                    const nodeToDelete = get().nodes.find(node => node.id === nodeId);

                    set({
                        nodes: get().nodes.filter(node => node.id !== nodeId),
                        edges: get().edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId),
                        // Also delete the associated task if it exists
                        tasks: nodeToDelete?.content_id
                            ? get().tasks.filter(task => task.id !== nodeToDelete.content_id)
                            : get().tasks
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
                        tasks: initialTasks,
                    });

                    get().saveHistory();
                },

                // Development helper method to load mock data
                loadMockData: () => {
                    const { mockNodes, mockEdges, mockTasks } = require('@/lib/mock-data');
                    set({
                        nodes: mockNodes,
                        edges: mockEdges,
                        tasks: mockTasks,
                    });
                    get().saveHistory();
                },

                // Development helper to quickly add a sample task
                addSampleTask: () => {
                    get().addTaskNode({
                        title: "Sample Task",
                        description: "This is a sample task to test the new structure",
                        status: "backlog"
                    });
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

                                // Calculate totals from subtasks
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

                                // Calculate totals from subtasks
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

            }),
            {
                name: 'canvas-storage',
                partialize: (state) => ({
                    // Only persist certain parts of state. Not the functions or history.
                    nodes: state.nodes,
                    edges: state.edges,
                    tasks: state.tasks,
                }),
                version: 2, // Increment version for migration due to new tasks array
            }
        ),
        {
            name: 'flow-store'
        }
    )

);

export default useStore;