import { type Edge } from '@xyflow/react';

export const initialEdges: Edge[] = [
    {
        id: 'n1-n2',
        source: 'n1',
        target: 'n2',
        type: 'smoothstep',
        label: '',
        animated: true,
        sourceHandle: 'b',
        targetHandle: 'a',
        markerEnd: { type: 'arrowclosed' },
        style: {
            stroke: 'hsl(var(--edges))',
            strokeWidth: 2,
        }
    }
];