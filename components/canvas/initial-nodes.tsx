import { type Node } from '@xyflow/react';

export const initialNodes: Node[] = [
    { id: 'InstructionNode', position: { x: 325, y: -100 }, data: { label: 'Instructions', value: 'Getting Started' }, type: 'instructionNode', draggable: false, selectable: true, deletable: true, zIndex: -5 },
    { id: 'CanvasLogo', position: { x: 0, y: 0 }, data: { label: 'Canvas Logo', value: 'Logo Value' }, type: 'canvasLogo', draggable: false, selectable: false, deletable: false, zIndex: -10 },
];