import { MiniMap } from '@xyflow/react';

export default function CanvasMinimap() {
    return (
        <MiniMap

            position='top-right'
            // onClick={(event) => {
            //     event.stopPropagation();
            // }}
            // nodeColor={"#10B981"}
            // nodeStrokeColor={"#212529"}
            nodeBorderRadius={10}
            nodeStrokeWidth={1}
            bgColor='#262626'
            maskColor="#00000066"
            maskStrokeColor='#00000066'
            maskStrokeWidth={1}
            // onNodeClick={(event, node) => {
            //     event.stopPropagation();
            //     console.log('Node clicked:', node);
            // }}
            zoomable
            pannable
            aria-label='Canvas Minimap'
            inversePan={false}
            className="shadow-lg rounded-3xl overflow-hidden"
            zoomStep={1}
            offsetScale={20}
        // className='bg-[#0F172A] rounded-md p-1'

        />
    );
}