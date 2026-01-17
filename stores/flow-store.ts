import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import { initialNodes } from '@/components/canvas/initial-nodes';
import { initialEdges } from '@/components/canvas/initial-edges';
import { initialTasks } from '@/components/canvas/initial-tasks';
import { type AppState, type Node, type Edge, type Task, type Subtask } from './types';
import { v4 as uuidv4 } from 'uuid';

const MAX_HISTORY = 50;

const useStore = create<AppState>()(
    devtools(
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
                const currentState = get();
                const deletedTaskIds: string[] = [];
                changes.forEach(change => {
                    if (change.type === 'remove') {
                        const nodeToDelete = currentState.nodes.find(node => node.id === change.id);
                        if (nodeToDelete?.content_id) {
                            deletedTaskIds.push(nodeToDelete.content_id);
                            console.log('ReactFlow deletion - removing task:', nodeToDelete.content_id, 'for node:', change.id);
                        }
                    }
                });


                const updatedNodes = applyNodeChanges(changes, currentState.nodes);
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
                const nodeId = nodeOptions?.id || `node-${uuidv4()}`;
                const taskId = `task-${uuidv4()}`;
                const newNode: Node = {
                    id: nodeId,
                    type: 'task',
                    position: position,
                    project_id: 'p1', // TODO: Get from current project context
                    content_id: taskId,
                    data: {},
                };


                const newTask: Task = {
                    id: taskId,
                    node_id: nodeId,
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

            resetCanvas: () => {
                set({
                    nodes: initialNodes,
                    edges: initialEdges,
                    tasks: initialTasks,
                });

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

        }),
        {
            name: 'flow-store'
        }
    )

);

export default useStore;