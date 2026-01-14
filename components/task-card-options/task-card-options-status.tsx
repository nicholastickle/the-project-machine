import { Check } from 'lucide-react';
import useStore from '@/stores/flow-store';
import { Task } from '@/stores/types';

export default function TaskCardOptionsStatus({ task }: { task: Task }) {
    const updateNodeData = useStore((state) => state.updateNodeData);

    const statusOptions = [
        {
            value: 'backlog',
            label: 'Backlog',
            color: 'bg-task-card-backlog'
        },
        {
            value: 'planned',
            label: 'Planned',
            color: 'border-task-card-planned border-2 bg-transparent'
        },
        {
            value: 'in_progress',
            label: 'In Progress',
            color: 'bg-task-card-in-progress'
        },
        {
            value: 'stuck',
            label: 'Stuck',
            color: 'bg-task-card-stuck'
        },
        {
            value: 'completed',
            label: 'Completed',
            color: 'bg-task-card-complete'
        },
        {
            value: 'cancelled',
            label: 'Cancelled',
            color: 'bg-task-card-cancelled'
        }
    ];

    const handleStatusChange = (newStatus: string) => {
        updateNodeData(task.id, { task: { status: newStatus } } as Partial<Task>);
    };

    return (
        <div className="flex flex-col p-3 space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground ">Status:</h3>
            <div className="flex flex-col space-y-1">
                {statusOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => handleStatusChange(option.value)}
                        className={`flex items-center gap-2 p-2 border rounded-md text-sm transition-all duration-200 hover:bg-gray-100 ${task.status === option.value
                                ? 'border-1 border-black-500'
                                : 'border'
                            }`}
                    >
                        <div
                            className={`w-3 h-3 rounded-full ${option.color}`}
                        />
                        <span className="flex-1 text-left">{option.label}</span>
                        {task.status === option.value && (
                            <Check className="w-4 h-4 text-blue-500" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
