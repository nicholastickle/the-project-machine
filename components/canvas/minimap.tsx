import { MiniMap } from '@xyflow/react';

export default function CanvasMinimap() {
    return (
        <MiniMap
            
            position='bottom-right'
            // onClick={(event) => {
            //     event.stopPropagation();
            // }}
            nodeColor={"#10B981"}
            nodeStrokeColor={"#047857"}
            nodeBorderRadius={10}
            nodeStrokeWidth={3}
            bgColor='#1E293B'
            maskColor='#0F172A'
            maskStrokeColor='#334155'
            maskStrokeWidth={2}
            // onNodeClick={(event, node) => {
            //     event.stopPropagation();
            //     console.log('Node clicked:', node);
            // }}
            zoomable
            pannable
            aria-label='Canvas Minimap'
            inversePan={false}
            // style={{ width: 200, height: 150, border: '1px solid #334155', borderRadius: '8px', backgroundColor: '#1E293B' }}
            zoomStep={1}
            offsetScale={20}

        />
    );
}