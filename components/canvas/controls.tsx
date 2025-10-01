import { Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';


export default function CanvasControls() {
    return (
        <Controls
            showZoom={true}
            showFitView={true}
            showInteractive={true}
            // fitViewOptions={}
            // onZoomIn={() => console.log('Zoom In')}
            // onZoomOut={() => console.log('Zoom Out')}
            // onFitView={() => console.log('Fit View')}
            // onInteractiveChange={(state) => console.log('Interactive State:', state)}
            position='top-right'
            aria-label='Canvas Controls'
            orientation='vertical'
            // style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', borderRadius: '8px', padding: '4px' }}
            // className='bg-[#0F172A] rounded-md p-1' 

            
        />
    );
}   