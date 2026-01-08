import { useRef } from 'react';
import useStore from '@/stores/flow-store';
import { TaskData } from '@/stores/types';

interface TaskCardPanelTitleProps {
    nodeId: string
    title: TaskData['title'];
}

export default function TaskCardPanelTitle({ nodeId, title }: TaskCardPanelTitleProps) {
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const updateNodeData = useStore((state) => state.updateNodeData);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateNodeData(nodeId, { title: e.target.value });

        // Auto-resize the textarea
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
        }
    };

    return (
        <textarea
            ref={inputRef}
            value={title || ''}
            onChange={handleInputChange}
            className="w-full bg-transparent resize-none border-none outline-none"
            placeholder="Enter task..."
            maxLength={200}
            autoComplete="off"
            spellCheck={true}
            rows={1}
            style={{ minHeight: 'auto', height: 'auto' }}
        />
    );
}