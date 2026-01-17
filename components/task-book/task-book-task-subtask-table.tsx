import TaskBookTaskSubtaskDelete from "@/components/task-book/task-book-task-subtask-delete";
import TaskBookTaskSubtaskDurations from "@/components/task-book/task-book-task-subtask-durations";
import TaskBookTaskSubtaskTimeSpent from "@/components/task-book/task-book-task-subtask-time-spent";
import TaskBookTaskSubtaskTitle from "@/components/task-book/task-book-task-subtask-title";

import useTaskbookStore from '@/stores/taskbook-store';

interface TaskBookTaskSubtaskTableProps {
    taskId: string;
    subtasks: { id: string; title: string; isCompleted: boolean; estimatedDuration: number; timeSpent: number; }[];
}

export default function TaskBookTaskSubtaskTable({ taskId, subtasks }: TaskBookTaskSubtaskTableProps) {

    const totalEstimated = subtasks.reduce((sum, subtask) => sum + subtask.estimatedDuration, 0);
    const totalTimeSpent = subtasks.reduce((sum, subtask) => sum + subtask.timeSpent, 0);
    const addSubtask = useTaskbookStore((state) => state.addSubtask);


    const formatTotalTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
    };


    return (
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden border-collapse">
          
            <thead >
                <tr className="h-7 text-muted-foreground">
                    <th className=""></th>
                    <th className="w-[100px] text-center text-xs ">Duration Est.</th>
                    <th className="w-[160px] text-center text-xs ">Time Spent</th>
                    <th className="w-[30px]"></th>
                </tr>
            </thead>

        
            <tbody>
                {subtasks.map((subtask) => (
                    <tr key={subtask.id} className="h-8 last:border-b-0">
                        <td className="px-2">
                            <TaskBookTaskSubtaskTitle
                                taskId={taskId}
                                subtaskId={subtask.id}
                                title={subtask.title}
                                isCompleted={subtask.isCompleted}
                            />
                        </td>
                        <td className="w-[100px] text-center">
                            <TaskBookTaskSubtaskDurations
                                taskId={taskId}
                                subtaskId={subtask.id}
                                duration={subtask.estimatedDuration}
                            />
                        </td>
                        <td className="w-[80px] text-left">
                            <TaskBookTaskSubtaskTimeSpent
                                taskId={taskId}
                                subtaskId={subtask.id}
                                timeSpent={subtask.timeSpent}
                            />
                        </td>
                        <td className="w-[30px] text-center">
                            <TaskBookTaskSubtaskDelete
                                taskId={taskId}
                                subtaskId={subtask.id}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>

         
            <tfoot className="">
                <tr className="border-t border-gray-200">
                    <td className="px-2">
                        <button
                            onClick={() => addSubtask(taskId)}
                            className="text-muted hover:text-muted-foreground cursor-pointer text-sm"
                        >
                            + Add subtask
                        </button>
                    </td>
                    <td className="w-[100px] text-center text-sm">
                        <div className="flex items-center justify-center text-sm">
                            <input
                                type="text"
                                value={totalEstimated.toString()}
                                readOnly
                                className="w-9 text-center bg-transparent border-none outline-none text-sm cursor-default"
                            />
                            <span>h</span>
                        </div>
                    </td>
                    <td className="w-[160px] text-center text-sm">{formatTotalTime(totalTimeSpent)}</td>
                    <td className="w-[30px]"></td>
                </tr>
            </tfoot>
        </table>
    );
}
