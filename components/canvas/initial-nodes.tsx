import { type Node } from '@xyflow/react';

export const initialNodes: Node[] = [
    { id: 'CanvasLogo', position: { x: 0, y: 0 }, data: { label: 'Canvas Logo', value: 'Logo Value' }, type: 'canvasLogo', draggable: false, selectable: false, deletable: false, zIndex: -10 },

    { id: 'n1', position: { x: 100, y: 250 }, data: { title: 'Node 1' }, type: 'taskCardNode' },
    { id: 'n2', position: { x: 600, y: 250 }, data: { title: 'Node 2' }, type: 'taskCardNode' },


];