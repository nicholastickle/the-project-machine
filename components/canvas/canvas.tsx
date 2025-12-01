"use client"

import React from 'react';
import { useShallow } from 'zustand/react/shallow';

import {
    ReactFlow,
    SelectionMode,
    ConnectionMode,
    ConnectionLineType,
} from '@xyflow/react';


import useStore from '@/stores/flow-store';
import { type AppState } from '@/stores/types';

import CanvasBackground from '@/components/canvas/background';
import NavControlBar from '@/components/navigation-controls/nav-control-bar';
import TaskCard from '@/components/task-card-node/task-card-node';

const selector = (state: AppState) => ({
    nodes: state.nodes,
    edges: state.edges,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    onConnect: state.onConnect,
});


const nodeTypes = { taskCardNode: TaskCard };
const panOnDrag = [1, 2];

export default function Canvas() {
    const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore(
        useShallow(selector),
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
                connectionLineStyle={{ stroke: 'hsl(var(--edges))', strokeWidth: 2 }}
                fitView
                aria-label='Canvas Component'
                proOptions={{ hideAttribution: true }}
                connectionMode={ConnectionMode.Loose}
                minZoom={0.2}
                maxZoom={2}

            >
                <CanvasBackground />
                <NavControlBar />
            </ReactFlow>
        </div>
    );
}