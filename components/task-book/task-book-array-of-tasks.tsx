import { useState, useRef, useEffect } from 'react';
import useTaskbookStore from '@/stores/taskbook-store';
import { SavedTask } from '@/stores/types';

interface TaskBookArrayOfTasksProps {
    tasks: SavedTask[];
    selectedTask: SavedTask | null;
    onTaskClick: (task: SavedTask) => void;
}

export default function TaskBookArrayOfTasks({ tasks, selectedTask, onTaskClick }: TaskBookArrayOfTasksProps) {
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const updateSavedTask = useTaskbookStore((state) => state.updateSavedTask);

    // Focus input when entering edit mode
    useEffect(() => {
        if (editingTaskId && inputRef.current) {
            inputRef.current.focus();
            // Place cursor at the end of the text
            const length = inputRef.current.value.length;
            inputRef.current.setSelectionRange(length, length);
        }
    }, [editingTaskId]);

    const handleClick = (task: SavedTask) => {
        if (selectedTask?.id === task.id && editingTaskId !== task.id) {
            // Task is already selected, enter edit mode
            setEditingTaskId(task.id);
            setEditValue(task.title);
        } else {
            // Select the task
            onTaskClick(task);
            setEditingTaskId(null);
        }
    };

    const handleSave = () => {
        if (!editingTaskId) return;

        const trimmedValue = editValue.trim();
        const task = tasks.find(t => t.id === editingTaskId);

        if (task && trimmedValue !== task.title && trimmedValue.length > 0) {
            updateSavedTask(editingTaskId, { title: trimmedValue });
        } else if (task && trimmedValue.length === 0) {
            // Reset to original title if empty
            setEditValue(task.title);
        }

        setEditingTaskId(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.stopPropagation();
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            const task = tasks.find(t => t.id === editingTaskId);
            if (task) {
                setEditValue(task.title);
            }
            setEditingTaskId(null);
        }
    };

    return (
        <div className="w-full space-y-1 ">
            {tasks.map((task) => (
                <div
                    key={task.id}
                    className={`p-1 cursor-pointer flex items-center text-sm rounded-sm hover:bg-task-book-accent-foreground w-full max-w-[180px] ${selectedTask?.id === task.id ? 'font-bold bg-task-book-accent-foreground' : ''
                        }`}
                    onClick={() => handleClick(task)}
                >
                    {editingTaskId === task.id ? (
                        <input
                            ref={inputRef}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={handleSave}
                            onKeyDown={handleKeyDown}
                            onClick={(e) => e.stopPropagation()}
                            maxLength={200}
                            className="w-full bg-transparent border-none outline-none text-task-book-foreground font-semibold focus:ring-1 focus:ring-task-book-border rounded px-1 max-w-[180px]"
                            autoComplete="off"
                            spellCheck={true}
                        />
                    ) : (
                        <div className="overflow-hidden text-ellipsis w-full whitespace-nowrap">{task.title}</div>
                    )}
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
