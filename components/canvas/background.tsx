import { Background, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './background.css';

export default function CanvasBackground() {
    return (
        <>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-purple-50/30 pointer-events-none" />
            <Background
                variant={BackgroundVariant.Dots}
                gap={24}
                size={1.5}
                color="hsl(var(--border-dark))"
                aria-label='Canvas Background'
                className="canvas-background"
            />
        </>
    );
}   