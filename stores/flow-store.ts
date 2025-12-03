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
                history: [],
                historyIndex: -1,

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
                    const newEdge = {
                        ...connection,
                        type: 'smoothstep',
                        markerEnd: {
                            type: 'arrowclosed',
                            color: '#6366f1',
                            width: 20,
                            height: 20
                        },
                        animated: true,
                        style: {
                            stroke: '#6366f1',
                            strokeWidth: 3,
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
                }) => {
                    get().saveHistory();
                    
                    const nodes = get().nodes;
                    let position = nodeData?.position || { x: 200, y: 200 };

                    // Smart positioning: check for overlaps and spread out nicely
                    if (!nodeData?.position) {
                        const occupiedPositions = nodes.map(n => n.position);
                        let foundGoodSpot = false;
                        
                        // Try spreading horizontally with slight vertical variation for visual interest
                        for (let row = 0; row < 10; row++) {
                            for (let col = 0; col < 10; col++) {
                                // Alternate vertical positions slightly for more organic flow
                                const verticalOffset = (col % 2 === 0) ? 0 : 80;
                                const testPos = { 
                                    x: 100 + (col * 450), 
                                    y: 150 + (row * 280) + verticalOffset 
                                };
                                const hasOverlap = occupiedPositions.some(
                                    p => Math.abs(p.x - testPos.x) < 50 && Math.abs(p.y - testPos.y) < 50
                                );
                                if (!hasOverlap) {
                                    position = testPos;
                                    foundGoodSpot = true;
                                    break;
                                }
                            }
                            if (foundGoodSpot) break;
                        }
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
                        },
                    };

                    set({
                        nodes: [...get().nodes, newNode]
                    });

                    return newNode.id;
                },

                updateNodeData: (nodeId: string, newData: Partial<{ title: string; status: string; timeSpent: number; estimatedHours: number }>, saveToHistory: boolean = true) => {
                    // Only save history for user-initiated changes (not time tracking ticks)
                    if (saveToHistory) {
                        get().saveHistory();
                    }
                    set({
                        nodes: get().nodes.map(node =>
                            node.id === nodeId
                                ? { ...node, data: { ...node.data, ...newData } }
                                : node
                        )
                    });
                },

                deleteNode: (nodeId: string) => {
                    get().saveHistory();
                    set({
                        nodes: get().nodes.filter(node => node.id !== nodeId),
                        edges: get().edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId)
                    });
                },

                connectTasks: (sourceId: string, targetId: string) => {
                    get().saveHistory();
                    const connection = {
                        source: sourceId,
                        target: targetId,
                        sourceHandle: 'right',
                        targetHandle: 'left'
                    };
                    get().onConnect(connection);
                },

                resetCanvas: () => {
                    get().saveHistory();
                    set({
                        nodes: initialNodes,
                        edges: initialEdges,
                    });
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