"use client"

import { useShallow } from 'zustand/react/shallow';
import {
    ReactFlow,
    SelectionMode,
    ConnectionMode,

} from '@xyflow/react';

import useStore from '@/stores/flow-store';
import { type AppState, type CanvasProps } from '@/stores/types';
import CanvasBackground from '@/components/canvas/background';
import NavControlBar from '@/components/navigation-controls/nav-control-bar';
import TaskCard from '@/components/task-card-node/task-card-node';

const nodeTypes = { task: TaskCard };
const panOnDrag = [1, 2];
const selector = (state: AppState) => ({
    nodes: state.nodes,
    edges: state.edges,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    onConnect: state.onConnect,
    cursorMode: state.cursorMode,
});

export default function Canvas({ onInit }: CanvasProps) {
    const { nodes, edges, onNodesChange, onEdgesChange, onConnect, cursorMode } = useStore(
        useShallow(selector),
    );

    const panOnDrag = cursorMode === 'pan' ? true : [1, 2];
    const nodesDraggable = cursorMode === 'select';
    const nodesConnectable = cursorMode === 'select';
    const elementsSelectable = cursorMode === 'select';

    return (
        <div className='w-full h-screen z-0'>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={onInit}
                panOnScroll
                selectionOnDrag={cursorMode === 'select'}
                elementsSelectable={elementsSelectable}
                nodesDraggable={nodesDraggable}
                nodesConnectable={nodesConnectable}
                defaultEdgeOptions={{
                    interactionWidth: 20
                }}
                panOnDrag={panOnDrag}
                selectionMode={SelectionMode.Partial}
                connectionLineStyle={{
                    stroke: 'hsl(var(--edges))',
                    strokeWidth: 9,
                    strokeDasharray: '5,5',
                }}
                fitViewOptions={{
                    padding: 0.2,
                    duration: 600,
                    maxZoom: 1
                }}
                aria-label='Canvas Component'
                proOptions={{ hideAttribution: true }}
                connectionMode={ConnectionMode.Loose}
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