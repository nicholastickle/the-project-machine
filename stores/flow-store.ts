import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { addEdge, applyNodeChanges, applyEdgeChanges, type Node } from '@xyflow/react';
import { initialNodes } from '@/components/canvas/initial-nodes';
import { initialEdges } from '@/components/canvas/initial-edges';
import { type AppState } from './types';
import { v4 as uuidv4 } from 'uuid';

const MAX_HISTORY = 50;

const useStore = create<AppState>()(
    devtools(
        persist(
            (set, get) => ({
                nodes: initialNodes,
                edges: initialEdges,
                history: [{ nodes: initialNodes, edges: initialEdges }],
                historyIndex: 0,

                saveHistory: () => {
                    const { nodes, edges, history, historyIndex } = get();
                    const newHistory = history.slice(0, historyIndex + 1);
                    newHistory.push({ nodes: [...nodes], edges: [...edges] });
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
                },

                setNodes: (nodes) => {
                    set({ nodes });
                },

                setEdges: (edges) => {
                    set({ edges });
                },

                addTaskNode: (nodeData?: {
                    title?: string;
                    position?: { x: number; y: number }
                    status?: string;
                    estimatedHours?: number;
                    timeSpent?: number;
                    description?: string;
                    subtasks?: { id: string; title: string; isCompleted: boolean; estimatedDuration: number; timeSpent: number; }[];
                }) => {
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

                    const newNode: Node = {
                        id: `task-${uuidv4()}`,
                        type: 'taskCardNode',
                        position: position,
                        data: {
                            title: nodeData?.title ?? "",
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

            }),
            {
                name: 'canvas-storage',
                partialize: (state) => ({
                    // Only persist certain parts of state. Not the functions or history.
                    nodes: state.nodes,
                    edges: state.edges,
                }),
                version: 1, // Version for migrations
            }
        ),
        {
            name: 'flow-store'
        }
    )

);

export default useStore;