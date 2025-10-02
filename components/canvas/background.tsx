import { Background, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './background.css';

export default function CanvasBackground() {
    return (
        <Background
            variant={BackgroundVariant.Lines}
            gap={20}
            lineWidth={0.247}
            color="#2a2a2a"
            aria-label='Canvas Background'
            style={{ backgroundColor: 'oklch(14.5% 0 0)' }}
        />
    );
}   