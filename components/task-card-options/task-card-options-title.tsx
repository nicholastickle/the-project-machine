
import useStore from '@/stores/flow-store';
import { TaskData } from '@/stores/types';

interface TaskCardPanelTitleProps {
    nodeId: string
    title: TaskData['title'];
}

export default function TaskCardPanelTitle({ nodeId, title }: TaskCardPanelTitleProps) {
    const updateNodeData = useStore((state) => state.updateNodeData);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateNodeData(nodeId, { title: e.target.value });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.currentTarget.blur();
        }
    };

    return (
        <textarea

            value={title || ''}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent resize-none border-none outline-none overflow-hidden"
            placeholder="Enter task..."
            maxLength={200}
            autoComplete="off"
            spellCheck={true}
            rows={1}
            style={{ fieldSizing: "content", height: 'auto' }}
        />
    );
}