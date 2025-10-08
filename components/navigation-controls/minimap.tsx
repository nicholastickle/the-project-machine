import { MiniMap } from '@xyflow/react';

export default function CanvasMinimap() {
    return (
        <MiniMap
            nodeBorderRadius={10}
            nodeStrokeWidth={1}
            bgColor='hsl(var(--minimap-background))'
            maskColor="hsl(var(--minimap-mask))"
            maskStrokeColor='hsl(var(--minimap-mask-stroke))'
            maskStrokeWidth={1}
            zoomable
            pannable
            aria-label='Canvas Minimap'
            inversePan={false}
            className=""
            offsetScale={80}
             style={{
                    position: 'static',
                    margin: '0',
                }}


        />
    );
}