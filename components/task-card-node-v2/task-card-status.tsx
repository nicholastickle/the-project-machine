import { Task } from "@/stores/types";

export default function TaskCardStatus({ status }: { status: Task['status'] }) {
    const statusConfig = {
        backlog: { color: 'bg-task-card-backlog', label: 'Backlog' },
        planned: { color: 'border-task-card-planned border-2 bg-transparent', label: 'Planned' },
        in_progress: { color: 'bg-task-card-in-progress', label: 'In Progress' },
        stuck: { color: 'bg-task-card-stuck', label: 'Stuck' },
        completed: { color: 'bg-task-card-complete', label: 'Completed' },
        cancelled: { color: 'bg-task-card-cancelled', label: 'Cancelled' }
    };

    const config = statusConfig[status] || { color: 'bg-gray-300', label: status };

    return (
        <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
            <span className="text-md text-task-card-foreground">{config.label}</span>
        </div>
    );
}
