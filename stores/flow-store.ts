import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { addEdge, applyNodeChanges, applyEdgeChanges, type Node } from '@xyflow/react';
import { initialNodes } from '@/components/canvas/initial-nodes';
import { initialEdges } from '@/components/canvas/initial-edges';
import { type AppState } from './types';
import { v4 as uuidv4 } from 'uuid';

const useStore = create<AppState>()(
    devtools(
        persist(
            (set, get) => ({
                nodes: initialNodes,
                edges: initialEdges,

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
                        markerEnd: { type: 'arrowclosed' },
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
                }) => {
                    const centerPosition = nodeData?.position || {
                        x: 200,
                        y: 200,
                    };

                    const newNode: Node = {
                        id: `task-${uuidv4()}`,
                        type: 'taskCardNode',
                        position: centerPosition,
                        data: {
                            title: nodeData?.title || 'New Task',
                        },
                    };

                    set({
                        nodes: [...get().nodes, newNode]
                    });

                    return newNode.id;
                },

                resetCanvas: () => {
                    set({
                        nodes: initialNodes,
                        edges: initialEdges,
                    });
                },

            }),
            {
                name: 'canvas-storage',
                partialize: (state) => ({
                    // Only persist certain parts of state. Not the functions.
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