import { Position, Handle } from '@xyflow/react';

export default function TaskHandles() {
    return (
        <>
            {/* Horizontal handles for cross-column connections */}
            <Handle 
            type="target" 
            position={Position.Left} 
            id="left" 
            className='!w-6 !h-6 !border-none !bg-task-card-handles-background !-left-[15px] hover:!cursor-pointer '
            />
            <Handle 
            type="source" 
            position={Position.Right} 
            id="right" 
            className='!w-6 !h-6 !border-none !bg-task-card-handles-background !-right-[15px] hover:!cursor-pointer'
            />
            
            {/* Vertical handles for same-column connections */}
            <Handle 
            type="target" 
            position={Position.Top} 
            id="top" 
            className='!w-6 !h-6 !border-none  !bg-task-card-handles-background !-top-[15px] hover:!cursor-pointer hover:!bg-indigo-100'
            />
            <Handle 
            type="source" 
            position={Position.Bottom} 
            id="bottom" 
            className='!w-6 !h-6 !border-none  !bg-task-card-handles-background !-bottom-[15px] hover:!cursor-pointer hover:!bg-indigo-100'
            />
        </>
    );
}