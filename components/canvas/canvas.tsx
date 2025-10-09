import { useState, useCallback } from 'react';
import {
    ReactFlow,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    SelectionMode,
    ConnectionMode,
    ConnectionLineType,
    type Node,
    type Edge,
    type NodeChange,
    type EdgeChange,
    type Connection
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CanvasBackground from '@/components/canvas/background';
import NavControlBar from '@/components/navigation-controls/nav-control-bar';

import { initialNodes } from './initial-nodes';
import { initialEdges } from './initial-edges';

import TaskCard from '@/components/task-card/task-card-node';
import LogoNode from '@/components/logo/logo-node';
import { animate } from 'framer-motion';

const nodeTypes = { taskCardNode: TaskCard, canvasLogo: LogoNode };


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
        (params: Connection) => {
            const newEdge = {
                ...params,
                type: 'smoothstep',
                markerEnd: { type: 'arrowclosed' },
                animated: true,
                style: {
                    stroke: 'hsl(var(--edges))',
                    strokeWidth: 2,
                    animationDuration: '1s',
                },
            };
            setEdges((edgesSnapshot) => addEdge(newEdge, edgesSnapshot));
        },
        [],
    );

    return (
        <div className='w-full h-screen z-0'>
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
                connectionLineType={ConnectionLineType.SmoothStep}
                connectionLineStyle={{stroke: 'hsl(var(--edges))',strokeWidth: 2}}
                fitView
                aria-label='Canvas Component'
                proOptions={{ hideAttribution: true }}
                connectionMode={ConnectionMode.Loose}

            >
                <CanvasBackground />
                <NavControlBar />
            </ReactFlow>
        </div>
    );
}