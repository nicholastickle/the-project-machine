import { Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './controls.css';


export default function CanvasControls() {
    return (
        <Controls
            showZoom={true}
            showFitView={true}
            showInteractive={true}
            fitViewOptions={{ duration: 1000 }}
            // onZoomIn={() => console.log('Zoom In')}
            // onZoomOut={() => console.log('Zoom Out')}
            // onFitView={() => console.log('Fit View')}
            // onInteractiveChange={(state) => console.log('Interactive State:', state)}
            position='center-right'
            aria-label='Canvas Controls'
            orientation='vertical'
           

        />
    );
}   