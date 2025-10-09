import { Position, Handle } from '@xyflow/react';

export function TaskHandles() {
    return (
        <>
            <Handle 
            type="target" 
            position={Position.Left} 
            id="a" 
            className='!w-5 !h-5 !border-none !bg-task-card-handles-background !-left-[15px]'
            />
            <Handle 
            type="source" 
            position={Position.Right} 
            id="b" 
            className='!w-5 !h-5 !border-none !bg-task-card-handles-background !-right-[15px] '
            />
        </>
    );
}