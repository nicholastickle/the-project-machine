export default function TaskCardStatus({ status }: { status: string }) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Backlog':
                return 'bg-task-card-backlog';
            case 'Planned':
                return 'border-task-card-planned border-2 bg-transparent';
            case 'In Progress':
                return 'bg-task-card-in-progress';
            case 'Stuck':
                return 'bg-task-card-stuck';
            case 'Completed':
                return 'bg-task-card-complete';
            case 'Cancelled':
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
