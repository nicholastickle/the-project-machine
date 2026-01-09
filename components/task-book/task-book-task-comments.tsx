import useTaskbookStore from '@/stores/taskbook-store';
import { SavedTask } from '@/stores/types';
import { MessageSquare } from 'lucide-react';

interface TaskBookTaskCommentsProps {
    task: SavedTask | null;
}

export default function TaskBookTaskComments({ task }: TaskBookTaskCommentsProps) {
    const updateSavedTask = useTaskbookStore((state) => state.updateSavedTask);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!task) return;
        updateSavedTask(task.id, { comments: e.target.value });
    };

    if (!task) {
        return null;
    }

    return (
        <div className="w-full flex flex-col p-3">
            <div className="flex items-center gap-2 mb-1">
                <MessageSquare size={16} className="text-muted-foreground" />
                <span className="text-lg font-medium text-muted-foreground">Comments & Notes:</span>
            </div>
            <textarea
                value={task?.comments || ''}
                onChange={handleInputChange}
                className="w-full text-md placeholder:text-muted-foreground text-muted-foreground resize-none overflow-hidden border border-gray-200 outline-none p-2 rounded-md"
                placeholder="Enter comments or notes..."
                maxLength={1000}
                autoComplete="off"
                spellCheck={true}
                rows={3}
                style={{ fieldSizing: "content", minHeight: '100px', height: 'auto' }}
            />
        </div>
    );
}