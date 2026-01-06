import { Background, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './background.css';

export default function CanvasBackground() {
    return (
        <Background
            variant={BackgroundVariant.Dots}
            gap={40}
            lineWidth={0.247}
            color="hsl(var(--border))"
            aria-label='Canvas Background'
            className="bg-background canvas-background"
        />
    );
}   