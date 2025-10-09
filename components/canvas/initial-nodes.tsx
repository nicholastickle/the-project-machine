import { type Node } from '@xyflow/react';

export const initialNodes: Node[] = [
    { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1', value: 'Value 1' }, type: 'taskCardNode' },
    { id: 'n2', position: { x: 500, y: 0 }, data: { label: 'Node 2', value: 'Value 2' }, type: 'taskCardNode' },
    { id: 'n5', position: { x: 0, y: 0 }, data: { label: 'Canvas Logo', value: 'Logo Value' }, type: 'canvasLogo', draggable: false, selectable: false, deletable: false, zIndex: -10 },

];