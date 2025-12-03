"use client"

import React from 'react';
import { useShallow } from 'zustand/react/shallow';

import {
    ReactFlow,
    SelectionMode,
    ConnectionMode,
    ConnectionLineType,
    type ReactFlowInstance,
} from '@xyflow/react';


import useStore from '@/stores/flow-store';
import { type AppState } from '@/stores/types';

import CanvasBackground from '@/components/canvas/background';
import CanvasWatermark from '@/components/canvas/canvas-watermark';
import NavControlBar from '@/components/navigation-controls/nav-control-bar';
import CanvasToolbar from '@/components/toolbar/canvas-toolbar';
import ExportButtons from '@/components/export/export-buttons';
import TaskCard from '@/components/task-card-node/task-card-node';
import LogoNode from '@/components/logo/logo-node';

const selector = (state: AppState) => ({
    nodes: state.nodes,
    edges: state.edges,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    onConnect: state.onConnect,
});


const nodeTypes = { taskCardNode: TaskCard, logoNode: LogoNode };
const panOnDrag = [1, 2];

interface CanvasProps {
    onInit?: (instance: ReactFlowInstance) => void;
}

export default function Canvas({ onInit }: CanvasProps) {
    const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore(
        useShallow(selector),
    );

    return (
        <div className='w-full h-screen z-0 relative'>
            <CanvasWatermark />
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={onInit}
                panOnScroll
                selectionOnDrag
                panOnDrag={panOnDrag}
                selectionMode={SelectionMode.Partial}
                connectionLineType={ConnectionLineType.SmoothStep}
                connectionLineStyle={{ stroke: '#6366f1', strokeWidth: 2 }}
                fitView
                aria-label='Canvas Component'
                proOptions={{ hideAttribution: true }}
                connectionMode={ConnectionMode.Loose}
                minZoom={0.2}
                maxZoom={2}

            >
                <CanvasBackground />
                <CanvasToolbar />
                <NavControlBar />
                <ExportButtons />
            </ReactFlow>
        </div>
    );
}