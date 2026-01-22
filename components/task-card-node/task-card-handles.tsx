import { Position, Handle } from '@xyflow/react';

export default function TaskHandles() {
    return (
        <>
            <Handle 
            type="source" 
            position={Position.Left} 
            id="left" 
            className='!w-4 !h-4 !border-none !bg-task-card-handles-background  !-left-[15px] hover:!cursor-pointer hover:!bg-gray-600 hover:!w-8 hover:!h-8 hover:!-left-[18px] '
            />
            <Handle 
            type="source" 
            position={Position.Right} 
            id="right" 
            className='!w-4 !h-4 !border-none !bg-task-card-handles-background !-right-[15px] hover:!cursor-pointer hover:!bg-gray-700 hover:!w-8 hover:!h-8 hover:!-right-[18px]'
            />
            <Handle 
            type="source" 
            position={Position.Top} 
            id="top" 
            className='!w-4 !h-4 !border-none  !bg-task-card-handles-background !-top-[15px] hover:!cursor-pointer hover:!bg-gray-700 hover:!w-8 hover:!h-8 hover:!-top-[18px]'
            />
            <Handle 
            type="source" 
            position={Position.Bottom} 
            id="bottom" 
            className='!w-4 !h-4 !border-none  !bg-task-card-handles-background !-bottom-[15px] hover:!cursor-pointer hover:!bg-gray-700 hover:!w-8 hover:!h-8 hover:!-bottom-[18px]'
            />
        </>
    );
}