import { Play, Pause, X } from 'lucide-react';
import TaskHandles from '@/components/task-card-node/task-handles';
import EditableTitle from '@/components/task-card-node/editable-title';
import EditableEstimate from '@/components/task-card-node/editable-estimate';
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
            className="w-[350px] h-[175px] border-2 border-indigo-200/50 bg-gradient-to-br from-white via-indigo-50/40 to-purple-50/30 flex flex-col rounded-2xl hover:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.4)] transition-all duration-300 backdrop-blur-sm hover:scale-[1.02] hover:border-indigo-300/70 shadow-lg"
            style={{ 
                animationDelay, 
                animationFillMode: 'both',
                animation: 'card-entrance 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
        >
            <div className='flex flex-[3] flex-row'>
                <div className='flex-[11] items-center flex px-4 text-md font-medium text-gray-800'>
                    <EditableTitle
                        nodeId={id}
                        title={data.title}
                    />
                </div>
                <button
                    onClick={() => deleteNode(id)}
                    className='flex items-center justify-center w-8 h-8 mr-2 mt-2 text-gray-600 hover:bg-red-500/20 hover:text-red-500 rounded-md transition-colors'
                    title="Delete task"
                >
                    <X className='w-4 h-4' />
                </button>
            </div>
            <div className={`flex flex-[6] flex-row ${statusColorClass} rounded-3xl mx-1 items-center justify-center border border-gray-200/30`}>
                <EditableEstimate nodeId={id} estimatedHours={data.estimatedHours} />
            </div>
            <div className="flex flex-[3] flex-row">
                <div className='flex flex-[6] items-center px-4 text-sm'>
                    <SelectStatus nodeId={id} status={data.status} />
                </div>
                <div className='flex flex-[6] flex-row items-center justify-end gap-2 px-2'>
                    <div className='text-xs text-gray-700 font-mono'>
                        {isTracking 
                            ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
                            : hours > 0 
                                ? `${hours}h ${minutes}m` 
                                : `${minutes}m`
                        }
                    </div>
                    <button
                        onClick={() => setIsTracking(!isTracking)}
                        className='flex items-center justify-center p-2 text-gray-600 hover:bg-indigo-100 rounded-md transition-colors cursor-pointer'
                    >
                        {isTracking ? <Pause className='w-4 h-4' /> : <Play className='w-4 h-4' />}
                    </button>
                </div>
            </div>
            <TaskHandles />
        </div>
    );
}
