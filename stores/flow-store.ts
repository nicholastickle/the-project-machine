import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { addEdge, applyNodeChanges, applyEdgeChanges, type Node } from '@xyflow/react'; // ✅ Added Node import
import { initialNodes } from '@/components/canvas/initial-nodes';
import { initialEdges } from '@/components/canvas/initial-edges';
import { type AppState } from './types';
import { v4 as uuidv4 } from 'uuid';

const useStore = create<AppState>()(
    devtools((set, get) => ({
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

    }), {
        name: 'flow-store'
    })
);

export default useStore;