import { SavedTask } from '@/stores/types';

interface TaskBookArrayOfTasksProps {
    tasks: SavedTask[];
    selectedTask: SavedTask | null;
    onTaskClick: (task: SavedTask) => void;
}

export default function TaskBookArrayOfTasks({ tasks, selectedTask, onTaskClick }: TaskBookArrayOfTasksProps) {
    return (
        <div className="w-full space-y-1">
            {tasks.map((task) => (
                <div
                    key={task.id}
                    className={`p-1 cursor-pointer flex items-center gap-3 text-sm rounded-sm  hover:bg-task-book-accent-foreground ${selectedTask?.id === task.id ? 'font-bold bg-task-book-accent-foreground' : ''
                        }`}
                    onClick={() => onTaskClick(task)}
                >
                    <div>{task.title}</div>
                </div>
            ))}
            {tasks.length === 0 && (
                <div className="text-center text-muted-foreground py-8 text-sm">
                    No saved tasks yet
                </div>
            )}
        </div>
    );
}
