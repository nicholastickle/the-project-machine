import { type Node } from '@xyflow/react';

export const initialNodes: Node[] = [
    { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' }, type: 'input' },
    { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' }, type: 'output' },
];