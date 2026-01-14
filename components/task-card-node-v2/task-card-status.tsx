import { Task } from "@/stores/types";

export default function TaskCardStatus({ status }: { status: Task['status'] }) {
    const getStatusColor = (status: Task['status']) => {
        switch (status) {
            case 'backlog':
                return 'bg-task-card-backlog';
            case 'planned':
                return 'border-task-card-planned border-2 bg-transparent';
            case 'in_progress':
                return 'bg-task-card-in-progress';
            case 'stuck':
                return 'bg-task-card-stuck';
            case 'completed':
                return 'bg-task-card-complete';
            case 'cancelled':
                return 'bg-task-card-cancelled';
            default:
                return 'bg-gray-300';
        }
    };

    return (
        <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></div>
            <span className="text-md text-task-card-foreground">{status}</span>
        </div>
    );
}
