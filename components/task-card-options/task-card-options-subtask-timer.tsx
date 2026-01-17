import { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import useStore from '@/stores/flow-store';
import { Task, Subtask } from '@/stores/types';


export default function SubtaskTimer({ taskId, subtaskId, timeSpent }: { taskId: Task['id']; subtaskId: Subtask['id']; timeSpent: Subtask['time_spent'] }) {

    const [isTracking, setIsTracking] = useState(false);
    const [currentTime, setCurrentTime] = useState(timeSpent);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const updateSubtask = useStore((state) => state.updateSubtask);

    useEffect(() => {
        setCurrentTime(timeSpent);
    }, [timeSpent]);

 
    useEffect(() => {
        if (isTracking) {
            intervalRef.current = setInterval(() => {
                setCurrentTime(prev => {
                    const newTime = prev + 1;
                  
                    setTimeout(() => {
                        updateSubtask(taskId, subtaskId, { time_spent: newTime });
                    }, 0);
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
    }, [isTracking, taskId, subtaskId, updateSubtask]);

   
    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
    };

    const handleToggleTimer = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsTracking(!isTracking);
    };

    return (
        <div className="flex items-center justify-end gap-2 text-sm">
            <span className={`${isTracking ? 'text-red-500' : ''}`}>
                {formatTime(currentTime)}
            </span>
            <button
                onClick={handleToggleTimer}
                className={`flex items-center justify-center w-6 h-6 hover:bg-task-card-accent rounded-full transition-colors opacity-60 hover:opacity-100 ${isTracking
                        ? 'text-red-500 border border-red-500'
                        : 'text-muted'
                    }`}
                title={isTracking ? "Pause timer" : "Start timer"}
            >
                {isTracking ? (
                    <Pause className="w-6 h-6" />
                ) : (
                    <Play className="w-6 h-6" />
                )}
            </button>
        </div>
    );
}