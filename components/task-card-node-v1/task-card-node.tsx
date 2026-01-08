import { Play, Pause, X } from 'lucide-react';
import TaskHandles from '@/components/task-card-node-v1/task-handles';
import EditableTitle from '@/components/task-card-node-v1/editable-title';
import EditableDescription from '@/components/task-card-node-v1/editable-description';
import SelectStatus from '@/components/task-card-node-v1/status-options';
import SubtaskTable from '@/components/task-card-node-v1/subtask-table';
import { useState, useEffect, useRef } from 'react';
import useStore from '@/stores/flow-store';

interface TaskCardProps {
    id: string;
    data: {
        title: string;
        status: string;
        timeSpent?: number;
        estimatedHours?: number;
        description?: string;
        subtasks?: { id: string; title: string; isCompleted: boolean; estimatedDuration: number; timeSpent: number; }[];
    };
}


export default function TaskCard({ id, data }: TaskCardProps) {
    const deleteNode = useStore((state) => state.deleteNode);
    const updateNodeData = useStore((state) => state.updateNodeData);
    const addSubtask = useStore((state) => state.addSubtask);
    const [isTracking, setIsTracking] = useState(false);
    const [currentTime, setCurrentTime] = useState(data.timeSpent || 0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Update currentTime when data.timeSpent changes externally
    useEffect(() => {
        setCurrentTime(data.timeSpent || 0);
    }, [data.timeSpent]);

    // Time tracking logic
    useEffect(() => {
        if (isTracking) {
            intervalRef.current = setInterval(() => {
                setCurrentTime(prev => {
                    const newTime = prev + 1;
                    updateNodeData(id, { timeSpent: newTime }, false); // Don't save to history for time ticks
                    return newTime;
                });
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isTracking, id, updateNodeData]);

    const hours = Math.floor(currentTime / 3600);
    const minutes = Math.floor((currentTime % 3600) / 60);
    const seconds = currentTime % 60;

    const statusColorClass = (() => {
        switch (data.status) {
            case 'Not started':
                return 'bg-task-card-background';
            case 'On-going':
                return 'bg-task-card-on-going/30';
            case 'Stuck':
                return 'bg-task-card-stuck/30';
            case 'Complete':
                return 'bg-task-card-complete/30';
            case 'Abandoned':
                return 'bg-task-card-abandoned/30';
            default:
                return 'bg-task-card-background';
        }
    })();


    // Stagger animation - use a stable delay based on position rather than random
    const nodeIndex = id.split('-').pop() || '0';
    const animationDelay = `${(parseInt(nodeIndex.substring(0, 4), 16) % 5) * 150}ms`;

    return (
        <div
            className={`w-[600px] min-h-[200px] border-2 border-task-card-border bg-task-card-background flex flex-col rounded-xl shadow-lg`}
            style={{
                animationDelay,
                animationFillMode: 'both',
                animation: 'card-entrance 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
        >
            <div className={`${statusColorClass} h-full flex flex-col rounded-xl `}>
                <div className='flex flex-row  '>
                    <div className='flex-[11] items-center flex px-4 py-5 text-3xl font-medium text-task-card-foreground overflow-y-auto'>
                        <EditableTitle
                            nodeId={id}
                            title={data.title}
                        />
                    </div>
                    <button
                        onClick={() => deleteNode(id)}
                        className='flex items-center justify-center w-8 h-8 m-2 text-gray-600 hover:text-red-500 rounded-md transition-colors'
                        title="Delete task"
                    >
                        <X className='w-4 h-4' />
                    </button>
                </div>




                <div className='flex flex-row'>
                    <div className='flex flex-[8] px-4 text-md font-medium text-task-card-foreground overflow-y-auto'>
                        <EditableDescription
                            nodeId={id}
                            description={data.description}
                        />
                    </div>
                    <div className='flex flex-[4] items-center justify-center p-2'>
                        <div className='bg-task-card-background-accent border border-task-card-border rounded-full px-4 py-2 w-32 text-center'>
                            <SelectStatus nodeId={id} status={data.status} />
                        </div>
                    </div>
                </div>





                <div className="flex flex-row rounded-3xl mx-1 items-center justify-center p-2">
                    <SubtaskTable nodeId={id} subtasks={data.subtasks || []} />
                </div>




                <div className="flex flex-row ">
                    <div className='flex flex-[3] p-3 pl-6'>
                        {(!data.subtasks || data.subtasks.length === 0) && (
                            <button
                                onClick={() => addSubtask(id)}
                                className="text-task-card-foreground hover:text-blue-600 transition-colors cursor-pointer"
                            >
                                + Add subtask
                            </button>
                        )}
                    </div>
                    <div className='flex flex-[10] flex-row'>

                    </div>
                </div>
                <TaskHandles />
            </div>
        </div>
    );
}






