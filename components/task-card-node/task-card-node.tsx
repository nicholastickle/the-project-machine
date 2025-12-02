import { Play, Pause, X, Clock } from 'lucide-react';
import TaskHandles from '@/components/task-card-node/task-handles';
import EditableTitle from '@/components/task-card-node/editable-title';
import SelectStatus from '@/components/task-card-node/status-options';
import { useState, useEffect, useRef } from 'react';
import useStore from '@/stores/flow-store';

interface TaskCardProps {
    id: string;
    data: {
        title: string;
        status: string;
        timeSpent?: number;
        estimatedHours?: number;
    };
}


export default function TaskCard({ id, data }: TaskCardProps) {
    const deleteNode = useStore((state) => state.deleteNode);
    const updateNodeData = useStore((state) => state.updateNodeData);
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
                return 'bg-task-card-background-accent';
            case 'On-going':
                return 'bg-task-card-on-going/20';
            case 'Stuck':
                return 'bg-task-card-stuck/20';
            case 'Complete':
                return 'bg-task-card-complete/20';
            case 'Abandoned':
                return 'bg-task-card-abandoned/20';
            default:
                return 'bg-task-card-background-accent';
        }
    })();


    // Stagger animation - use a stable delay based on position rather than random
    const nodeIndex = id.split('-').pop() || '0';
    const animationDelay = `${(parseInt(nodeIndex.substring(0, 4), 16) % 5) * 150}ms`;
    
    return (
        <div 
            className="w-[350px] h-[175px] border border-task-card-border bg-task-card-background flex flex-col shadow-lg rounded-xl animate-in fade-in zoom-in-95 duration-500"
            style={{ animationDelay, animationFillMode: 'both' }}
        >
            <div className='flex flex-[3] flex-row'>
                <div className='flex-[11] items-center flex px-4 text-md font-medium text-task-card-foreground'>
                    <EditableTitle
                        nodeId={id}
                        title={data.title}
                    />
                </div>
                <button
                    onClick={() => deleteNode(id)}
                    className='flex items-center justify-center w-8 h-8 mr-2 mt-2 text-task-card-icon-foreground hover:bg-red-500/20 hover:text-red-500 rounded-md transition-colors'
                    title="Delete task"
                >
                    <X className='w-4 h-4' />
                </button>
            </div>
            <div className={`flex flex-[6] flex-row ${statusColorClass} rounded-3xl mx-1 items-center justify-center`}>
                {data.estimatedHours && (
                    <div className="flex items-center gap-1 text-xs text-task-card-foreground/60">
                        <Clock className="w-3 h-3" />
                        <span>Est: {data.estimatedHours}h</span>
                    </div>
                )}
            </div>
            <div className="flex flex-[3] flex-row">
                <div className='flex flex-[6] items-center px-4 text-sm'>
                    <SelectStatus nodeId={id} status={data.status} />
                </div>
                <div className='flex flex-[6] flex-row items-center justify-end gap-2 px-2'>
                    <div className='text-xs text-task-card-foreground font-mono'>
                        {isTracking 
                            ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
                            : hours > 0 
                                ? `${hours}h ${minutes}m` 
                                : `${minutes}m`
                        }
                    </div>
                    <button
                        onClick={() => setIsTracking(!isTracking)}
                        className='flex items-center justify-center p-2 text-task-card-icon-foreground hover:bg-task-card-background-accent rounded-md transition-colors cursor-pointer'
                    >
                        {isTracking ? <Pause className='w-4 h-4' /> : <Play className='w-4 h-4' />}
                    </button>
                </div>
            </div>
            <TaskHandles />
        </div>
    );
}
