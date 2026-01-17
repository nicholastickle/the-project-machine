import useTaskbookStore from '@/stores/taskbook-store';

interface TaskBookTaskSubtaskTitleProps {
    taskId: string;
    subtaskId: string;
    title: string;
    isCompleted: boolean;
}

export default function TaskBookTaskSubtaskTitle({ taskId, subtaskId, title, isCompleted }: TaskBookTaskSubtaskTitleProps) {

    const updateSubtask = useTaskbookStore((state) => state.updateSubtask);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateSubtask(taskId, subtaskId, { title: e.target.value });
    };

    return (
        <textarea
            value={title || ''}
            onChange={handleInputChange}
            className={`w-full bg-transparent border-none outline-none text-sm resize-none overflow-hidden flex items-center justify-start ${isCompleted && title ? 'line-through text-muted-foreground' : ''
                }`}
            placeholder="Enter subtask..."
            maxLength={200}
            autoComplete="off"
            spellCheck={true}
            rows={1}
            style={{ fieldSizing: "content", height: 'auto' }}
        />
    );
}
