import { type Node } from '@xyflow/react';

export const initialNodes: Node[] = [
    { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1', value: 'Value 1' }, type: 'input' },
    { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2', value: 'Value 2' }, type: 'output' },
    { id: 'n3', position: { x: 0, y: 200 }, data: { label: 'Node 3', value: 'Value 3' }, type: 'textUpdater' },
];