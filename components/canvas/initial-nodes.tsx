import { type Node } from '@xyflow/react';

export const initialNodes: Node[] = [
    { id: 'n3', position: { x: 0, y: 200 }, data: { label: 'Node 3', value: 'Value 3' }, type: 'textUpdater' },
    { id: 'n4', position: { x: 0, y: 0 }, data: { label: 'Canvas Logo', value: 'Logo Value' }, type: 'canvasLogo', draggable: false, selectable: false, deletable: false, zIndex: -10 },
];