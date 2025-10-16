import { Position, Handle } from '@xyflow/react';

export default function TaskHandles() {
    return (
        <>
            <Handle 
            type="target" 
            position={Position.Left} 
            id="in" 
            className='!w-6 !h-6 !border-none !bg-task-card-handles-background !-left-[15px] hover:!cursor-pointer '
            />
            <Handle 
            type="source" 
            position={Position.Right} 
            id="out" 
            className='!w-6 !h-6 !border-none !bg-task-card-handles-background !-right-[15px] hover:!cursor-pointer'
            />
        </>
    );
}