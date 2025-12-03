import { type Node } from '@xyflow/react';

export const initialNodes: Node[] = [
    {
        id: 'logo-node',
        type: 'logoNode',
        position: { x: 0, y: 0 },
        data: {},
        draggable: false,
        selectable: false,
        focusable: false,
        deletable: false,
    }
];