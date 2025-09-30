import { Background, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';


export default function CanvasBackground() {
    return (
        <Background
            variant={BackgroundVariant.Lines}
            gap={20}
            lineWidth={0.247}
            color="#2a2a2a"
            aria-label='Canvas Background'
        />
    );
}   