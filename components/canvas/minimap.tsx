import { MiniMap } from '@xyflow/react';
import './minimap.css'
import { useSidebar } from "@/components/ui/sidebar"

export default function CanvasMinimap() {
    const { open, isMobile } = useSidebar()
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
            className={`z-50 shadow-md rounded-lg overflow-hidden border border-minimap-border w-[200px] transition-all duration-300  ${
               !isMobile && open ? 'left-[240px]' : 'left-[5px] md:left-[30px]'} ${isMobile && !open ? 'left-[0px]' : ''}`}
            zoomStep={1}
            offsetScale={80}


        />
    );
}