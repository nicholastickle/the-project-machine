"use client"

import { useShallow } from 'zustand/react/shallow';
import { useEffect, useState, useCallback } from 'react';
import {
    ReactFlow,
    SelectionMode,
    ConnectionMode,
    useReactFlow,
} from '@xyflow/react';

import useStore from '@/stores/flow-store';
import { type AppState, type CanvasProps } from '@/stores/types';
import CanvasBackground from '@/components/canvas/background';
import NavControlBar from '@/components/navigation-controls/nav-control-bar';
import TaskCard from '@/components/task-card-node/task-card-node';
import { useAutosave } from '@/lib/autosave';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
} from "@/components/ui/alert-dialog";

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

// Component that handles keyboard delete - must be inside ReactFlow
function DeleteKeyHandler() {
    const { getNodes } = useReactFlow();
    const deleteTaskNode = useStore((state) => state.deleteTaskNode);
    const [nodesToDelete, setNodesToDelete] = useState<string[]>([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Backspace' || event.key === 'Delete') {
                // Check if we're not in an input field
                const target = event.target as HTMLElement;
                if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
                    return;
                }

                const selectedNodes = getNodes().filter(node => node.selected);
                if (selectedNodes.length > 0) {
                    event.preventDefault();
                    setNodesToDelete(selectedNodes.map(n => n.id));
                    setShowDeleteConfirm(true);
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [getNodes]);

    const handleConfirmDelete = useCallback(() => {
        nodesToDelete.forEach(nodeId => {
            deleteTaskNode(nodeId);
        });
        setShowDeleteConfirm(false);
        setNodesToDelete([]);
    }, [nodesToDelete, deleteTaskNode]);

    const handleCancelDelete = useCallback(() => {
        setShowDeleteConfirm(false);
        setNodesToDelete([]);
    }, []);

    return (
        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
            <AlertDialogContent className="w-64 p-4 bg-white">
                <div className="space-y-3">
                    <div className="text-sm font-medium text-foreground">
                        Delete {nodesToDelete.length} task{nodesToDelete.length > 1 ? 's' : ''}?
                    </div>
                    <div className="flex gap-2">
                        <AlertDialogAction 
                            onClick={handleConfirmDelete}
                            className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Yes, delete
                        </AlertDialogAction>
                        <AlertDialogCancel 
                            onClick={handleCancelDelete}
                            className="flex-1"
                        >
                            Cancel
                        </AlertDialogCancel>
                    </div>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default function Canvas({ onInit }: CanvasProps) {
    const { nodes, edges, onNodesChange, onEdgesChange, onConnect, cursorMode } = useStore(
        useShallow(selector),
    );

    // Autosave functionality
    const { performAutosave, canSave } = useAutosave();

    // Interval-based autosave (every 2 minutes)
    useEffect(() => {
        const interval = setInterval(() => {
            if (canSave) {
                performAutosave();
            }
        }, 120000); // 2 minutes

        return () => clearInterval(interval);
    }, [canSave, performAutosave]);

    // Debounced autosave on changes (3 seconds after last change)
    useEffect(() => {
        if (!canSave) return;

        const timer = setTimeout(() => {
            performAutosave();
        }, 3000);

        return () => clearTimeout(timer);
    }, [canSave, performAutosave]);

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
                deleteKeyCode={null}
                defaultEdgeOptions={{
                    interactionWidth: 20,
                    style: {
                        stroke: 'hsl(var(--edges))',
                        strokeWidth: 9,
                        strokeDasharray: '5,5',
                    }
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
                <DeleteKeyHandler />
            </ReactFlow>
        </div>
    );
}
