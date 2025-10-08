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
import NavControlBar from '../navigation-controls/nav-control-bar';

import { initialNodes } from './initial-nodes';
import { initialEdges } from './initial-edges';

import TaskCard from './task-card-node';
import LogoNode from '@/components/logo/logo-node';

const nodeTypes = { textUpdater: TaskCard, canvasLogo: LogoNode };



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
                <NavControlBar />
            </ReactFlow>
        </div>
    );
}