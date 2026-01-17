"use client"

import React, { useCallback } from 'react';
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
import NavControlBar from '@/components/navigation-controls/nav-control-bar';
import TaskCard from '@/components/task-card-node/task-card-node';
import LogoNode from '@/components/logo/logo-node';
import InstructionNode from '@/components/instruction-node/instruction-node';

const nodeTypes = { taskCardNode: TaskCard, canvasLogo: LogoNode, instructionNode: InstructionNode };
const panOnDrag = [1, 2];

const selector = (state: AppState) => ({
    nodes: state.nodes,
    edges: state.edges,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    onConnect: state.onConnect,
    saveSnapshot: state.saveSnapshot,
    markDirty: state.markDirty,
    projectId: state.projectId,
});

interface CanvasProps {
    onInit?: (instance: ReactFlowInstance) => void;
}

export default function Canvas({ onInit }: CanvasProps) {
    const { nodes, edges, onNodesChange, onEdgesChange, onConnect, saveSnapshot, markDirty, projectId } = useStore(
        useShallow(selector),
    );

    // Sprint 3: Save snapshot after connecting edges
    const handleConnect = useCallback((connection: any) => {
        console.log('[Canvas] Edge connected - saving snapshot')
        onConnect(connection)
        // Save snapshot to persist connections
        if (projectId) {
            setTimeout(() => saveSnapshot('manual'), 100)
        }
    }, [onConnect, saveSnapshot, projectId])

    // Sprint 3: Save snapshot on drag stop (not during drag)
    const handleNodeDragStop = useCallback(() => {
        console.log('[Canvas] Node drag stopped - saving snapshot')
        markDirty()
        // Debounced save (300ms)
        setTimeout(() => {
            saveSnapshot('autosave')
        }, 300)
    }, [saveSnapshot, markDirty])

    return (
        <div className='w-full h-screen z-0'>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={handleConnect}
                onNodeDragStop={handleNodeDragStop}
                onInit={onInit}
                panOnScroll
                selectionOnDrag
                panOnDrag={panOnDrag}
                selectionMode={SelectionMode.Partial}
                connectionLineType={ConnectionLineType.SmoothStep}
                connectionLineStyle={{ stroke: 'hsl(var(--edges))', strokeWidth: 2 }}
                fitViewOptions={{ padding: 0.2, duration: 600, maxZoom: 1 }}
                aria-label='Canvas Component'
                proOptions={{ hideAttribution: true }}
                connectionMode={ConnectionMode.Strict}
                connectionRadius={20}
                minZoom={0.1}
                maxZoom={2}
                zoomOnDoubleClick={false}

            >
                <CanvasBackground />
                <NavControlBar />
            </ReactFlow>
        </div>
    );
}