
import useStore from '@/stores/flow-store';
import { Task } from '@/stores/types';

export default function TaskCardPanelTitle({ task }: { task: Task }) {
    const updateNodeData = useStore((state) => state.updateNodeData);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateNodeData(task.id, { title: e.target.value });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.currentTarget.blur();
        }
    };

    return (
        <textarea

            value={task.title || ''}
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