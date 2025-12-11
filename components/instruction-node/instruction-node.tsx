import { memo } from 'react';
import { X } from 'lucide-react';
import useStore from '@/stores/flow-store';

interface InstructionNodeProps {
    id?: string;
    data?: {
        label?: string;
        value?: string;
    };
}

function InstructionNode({ id, data }: InstructionNodeProps) {
    const deleteNode = useStore((state) => state.deleteNode);

    return (
        <div className="relative flex flex-col p-6 bg-none border border-border-light rounded-lg">
            <button
                onClick={() => id && deleteNode(id)}
                className='absolute top-2 right-2 flex items-center justify-center w-6 h-6 text-gray-400 hover:text-red-500 rounded-md transition-colors'
                title="Delete instruction node"
            >
                <X className='w-4 h-4' />
            </button>
            <h3 className="text-lg font-semibold mb-3 text-foreground pr-8">
                This is the future of planning. You ready?
            </h3>
            <div className="text-sm text-muted-foreground space-y-2">
                <ul className="space-y-1 list-disc list-inside">
                    <li>Prompt the AI to get started</li>
                    <li>Chat with AI to come up with a detailed plan</li>
                    <li>Manually adjust tasks, record time, change statuses</li>
                    <li>Change the status of the task to &quot;completed&quot; for task saving</li>
                    <li>The more tasks you complete, the more data AI has to improve plans</li>

                </ul>
            </div>
        </div>
    );
}

export default memo(InstructionNode);