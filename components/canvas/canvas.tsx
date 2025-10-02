import { useState, useCallback } from 'react';
import {
    ReactFlow,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    SelectionMode,
    type Node,
    type Edge,
    type NodeChange,
    type EdgeChange,
    type Connection
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CanvasBackground from '@/components/canvas/background';
import CanvasControls from '@/components/canvas/controls';
import CanvasMinimap from '@/components/canvas/minimap';

import { initialNodes } from './initial-nodes';
import { initialEdges } from './initial-edges';

import TaskCard from './task-card-node';

const nodeTypes = { textUpdater: TaskCard };



const panOnDrag = [1, 2];

export default function Canvas() {
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        [],
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [],
    );
    const onConnect = useCallback(
        (params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        [],
    );

    return (
        <div className="w-full h-screen z-0">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                panOnScroll
                selectionOnDrag
                panOnDrag={panOnDrag}
                selectionMode={SelectionMode.Partial}
                fitView
                aria-label='Canvas Component'
                proOptions={{ hideAttribution: true }}

            >
                <CanvasBackground />
                <CanvasControls />
                <CanvasMinimap />
            </ReactFlow>
        </div>
    );
}