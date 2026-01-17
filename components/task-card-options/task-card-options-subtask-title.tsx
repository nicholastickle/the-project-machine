import useStore from '@/stores/flow-store';
import { Task, Subtask } from '@/stores/types';


export default function SubtaskTitle({ taskId, subtaskId, title, isCompleted }: { taskId: Task['id']; subtaskId: Subtask['id']; title: Subtask['title']; isCompleted: Subtask['is_completed'] }) {
    const updateSubtask = useStore((state) => state.updateSubtask);
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateSubtask(taskId, subtaskId, { title: e.target.value });
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
