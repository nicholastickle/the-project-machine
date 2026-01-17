import useStore from '@/stores/flow-store';
import { TaskData } from '@/stores/types';

interface SubtaskTitleProps {
    nodeId: string;
    subtaskId: NonNullable<TaskData['subtasks']>[0]['id'];
    title: NonNullable<TaskData['subtasks']>[0]['title'];
    isCompleted: NonNullable<TaskData['subtasks']>[0]['isCompleted'];
}

export default function SubtaskTitle({ nodeId, subtaskId, title, isCompleted }: SubtaskTitleProps) {
    const updateSubtask = useStore((state) => state.updateSubtask);
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateSubtask(nodeId, subtaskId, { title: e.target.value });
    };

    return (
        <textarea
         
            value={title || ''}
            onChange={handleInputChange}
            className={`w-full bg-transparent border-none outline-none text-sm resize-none flex items-center overflow-auto justify-start ${isCompleted && title ? 'line-through text-muted-foreground' : ''
                }`}
            placeholder="Enter subtask..."
            maxLength={200}
            autoComplete="off"
            spellCheck={true}
            rows={1}
            style={{ height: 'auto', fieldSizing: "content" }}
        />
    );
}
