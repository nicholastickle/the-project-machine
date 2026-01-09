import useStore from '@/stores/flow-store';
import { TaskData } from '@/stores/types';
import { useRef, useEffect, useState } from 'react';
import { AlignLeft } from 'lucide-react';

interface TaskCardOptionsDescriptionProps {
    nodeId: string;
    description?: TaskData['description'];
}

export default function TaskCardOptionsDescription({ nodeId, description }: TaskCardOptionsDescriptionProps) {

    const updateNodeData = useStore((state) => state.updateNodeData);
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateNodeData(nodeId, { description: e.target.value });
    };

    return (
        <div className="w-full flex flex-col p-3">
            <div className="flex items-center gap-2 mb-1">
                <AlignLeft size={16} className="text-muted-foreground" />
                <span className="text-lg font-medium text-muted-foreground">Description:</span>
            </div>
            <textarea
                value={description || ''}
                onChange={handleInputChange}
                className="w-full text-md placeholder:text-muted-foreground text-muted-foreground border border-gray-200 outline-none resize-none overflow-auto p-2 rounded-md"
                placeholder="Enter description..."
                maxLength={1000}
                autoComplete="off"
                spellCheck={true}
                rows={3}
                 style={{ fieldSizing: "content", minHeight: '100px', height: 'auto' }}
            />
        </div>
    );
}

