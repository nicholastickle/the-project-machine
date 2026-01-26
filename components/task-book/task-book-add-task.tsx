
import useTaskbookStore from '@/stores/taskbook-store';

export default function TaskBookAddTask() {
    const addSavedTask = useTaskbookStore((state) => state.addSavedTask);

    const handleAddNewTask = () => {
        const newTask = {
            title: "New task",
            description: undefined,
            category: undefined,
            comments: undefined,
            subtasks: undefined,
            usage_count: 0
        };

        addSavedTask(newTask);
    };

    return (
        <button
            onClick={handleAddNewTask}
            className="p-1 text-muted flex text-sm hover:text-task-book-foreground focus:outline-none outline-none"
        >
            + Add new task
        </button>
    );
}