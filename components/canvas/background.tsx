"use client"

import { Background, BackgroundVariant, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './background.css';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function CanvasBackground() {

    const { getZoom } = useReactFlow();
    const [zoom, setZoom] = useState(1);

    useEffect(() => {
        const updateZoom = () => {
            setZoom(getZoom());
        };

        updateZoom();

        const interval = setInterval(updateZoom, 100);
        return () => clearInterval(interval);
    }, [getZoom]);

    const getGridConfig = () => {
        if (zoom >= 1.5) {
            // Very zoomed in - show fine grid + medium grid (20px + 100px = 5:1 ratio)
            return {
                primary: { gap: 20, lineWidth: 0.5, color: 'hsl(var(--grid-secondary))' },
                secondary: { gap: 100, lineWidth: 1.3, color: 'hsl(var(--grid-primary))' },
            };
        } else if (zoom >= 0.8) {
            // Medium zoom - show medium grid + coarse grid (40px + 200px = 5:1 ratio)
            return {
                primary: { gap: 40, lineWidth: 0.5, color: 'hsl(var(--grid-secondary))' },
                secondary: { gap: 200, lineWidth: 1.3, color: 'hsl(var(--grid-primary))' },
            };
        } else if (zoom >= 0.4) {
            // Zoomed out - show coarse grid (80px + 400px = 5:1 ratio)
            return {
                primary: { gap: 80, lineWidth: 0.5, color: 'hsl(var(--grid-secondary))' },
                secondary: { gap: 400, lineWidth: 1.3, color: 'hsl(var(--grid-primary))' },
            };
        } else if (zoom >= 0.1) {
            // Zoomed out - show coarse grid (80px + 400px = 5:1 ratio)
            return {
                primary: { gap: 160, lineWidth: 0.5, color: 'hsl(var(--grid-secondary))' },
                secondary: { gap: 800, lineWidth: 1.3, color: 'hsl(var(--grid-primary))' },
            };
        } else {
            // Very zoomed out - show very coarse grid (160px + 800px = 5:1 ratio)
            return {
                primary: { gap: 200, lineWidth: 0.5, color: 'hsl(var(--grid-secondary))' },
                secondary: { gap: 1000, lineWidth: 1.3, color: 'hsl(var(--grid-primary))' },
            };
        }
    };

    const gridConfig = getGridConfig();

    return (
        <>
            {/* <div className="canvas-logo-layer">
                <div className="canvas-logo-container">
                    <Image
                        src="/logos/logo.svg"
                        alt="Project Machine"
                        width={400}
                        height={400}
                        className="canvas-logo-image"
                        priority
                    />
                </div>
            </div> */}

            {/* Secondary grid - thicker lines */}
            <Background
                id='1'
                variant={BackgroundVariant.Lines}
                gap={gridConfig.secondary.gap}
                lineWidth={gridConfig.secondary.lineWidth}
                color={gridConfig.secondary.color}
                offset={1}
                className="bg-background"
                style={{ zIndex: 1 }}

            />

            {/* Primary grid - fine lines */}
            <Background
                id='2'
                variant={BackgroundVariant.Lines}
                gap={gridConfig.primary.gap}
                lineWidth={gridConfig.primary.lineWidth}
                color={gridConfig.primary.color}
                className="bg-background"
                style={{ zIndex: 0 }}
                offset={1}
            />




        </>
    );
} 