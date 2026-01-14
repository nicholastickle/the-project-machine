import SubtaskCheckbox from '@/components/task-card-options/task-card-options-subtask-checkbox';
import SubtaskDelete from "@/components/task-card-options/task-card-options-subtask-delete";
import SubtaskDuration from "@/components/task-card-options/task-card-options-subtask-durations";
import SubtaskTimer from "@/components/task-card-options/task-card-options-subtask-timer";
import SubtaskTitle from "@/components/task-card-options/task-card-options-subtask-title";

import useStore from '@/stores/flow-store';
import { Task } from '@/stores/types';


export default function SubtaskTable({ task }: { task: Task }) {

    const subtasks = task.subtasks || [];
    const totalEstimated = subtasks.reduce((sum, subtask) => sum + (subtask.estimated_duration || 0), 0);
    const totalTimeSpent = subtasks.reduce((sum, subtask) => sum + (subtask.time_spent || 0), 0);
    const addSubtask = useStore((state) => state.addSubtask);


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
                    <th className="w-[30px] "></th>
                    <th className=""></th>
                    <th className="w-[100px] text-center text-xs ">Duration Est.</th>
                    <th className="w-[160px] text-center text-xs ">Time Spent</th>
                    <th className="w-[30px]"></th>
                </tr>
            </thead>

        
            <tbody>
                {subtasks.map((subtask) => (
                    <tr key={subtask.id} className="h-8 last:border-b-0">
                        <td className="w-[30px] text-center">
                            <SubtaskCheckbox
                                taskId={task.id}
                                subtaskId={subtask.id}
                                isCompleted={subtask.is_completed}
                            />
                        </td>
                        <td className="px-2">
                            <SubtaskTitle
                                taskId={task.id}
                                subtaskId={subtask.id}
                                title={subtask.title}
                                isCompleted={subtask.is_completed}
                            />
                        </td>
                        <td className="w-[100px] text-center">
                            <SubtaskDuration
                                taskId={task.id}
                                subtaskId={subtask.id}
                                duration={subtask.estimated_duration}
                            />
                        </td>
                        <td className="w-[80px] text-left">
                            <SubtaskTimer
                                taskId={task.id}
                                subtaskId={subtask.id}
                                timeSpent={subtask.time_spent}
                            />
                        </td>
                        <td className="w-[30px] text-center">
                            <SubtaskDelete
                                taskId={task.id}
                                subtaskId={subtask.id}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>

        
            <tfoot className="">
                <tr className="border-t border-gray-200">
                    <td className="w-[30px] h-8"></td>
                    <td className="px-2">
                        <button
                            onClick={() => addSubtask(task.id)}
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