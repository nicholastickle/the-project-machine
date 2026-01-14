import useTaskbookStore from '@/stores/taskbook-store';
import { TaskbookEntry } from '@/stores/types';
import { AlignLeft } from 'lucide-react';

interface TaskBookTaskDescriptionProps {
    task: TaskbookEntry | null;
}

export default function TaskBookTaskDescription({ task }: TaskBookTaskDescriptionProps) {
    const updateSavedTask = useTaskbookStore((state) => state.updateSavedTask);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!task) return;
        updateSavedTask(task.id, { description: e.target.value });
    };

    if (!task) {
        return null;
    }

    return (
        <div className="w-full flex flex-col p-3">
            <div className="flex items-center gap-2 mb-1">
                <AlignLeft size={16} className="text-muted-foreground" />
                <span className="text-lg font-medium text-muted-foreground">Description:</span>
            </div>
            <textarea
                value={task?.description || ''}
                onChange={handleInputChange}
                className="w-full text-md placeholder:text-muted-foreground text-muted-foreground border border-gray-200 outline-none p-2 rounded-md resize-none overflow-hidden"
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