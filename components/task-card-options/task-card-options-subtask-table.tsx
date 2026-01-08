import SubtaskCheckbox from '@/components/task-card-options/task-card-options-subtask-checkbox';
import SubtaskDelete from "@/components/task-card-options/task-card-options-subtask-delete";
import SubtaskDuration from "@/components/task-card-options/task-card-options-subtask-durations";
import SubtaskTimer from "@/components/task-card-options/task-card-options-subtask-timer";
import SubtaskTitle from "@/components/task-card-options/task-card-options-subtask-title";

import useStore from '@/stores/flow-store';

interface SubtaskTableProps {
    nodeId: string;
    subtasks: { id: string; title: string; isCompleted: boolean; estimatedDuration: number; timeSpent: number; }[];
}

export default function SubtaskTable({ nodeId, subtasks }: SubtaskTableProps) {
    // Calculate totals
    const totalEstimated = subtasks.reduce((sum, subtask) => sum + subtask.estimatedDuration, 0);
    const totalTimeSpent = subtasks.reduce((sum, subtask) => sum + subtask.timeSpent, 0);
    const addSubtask = useStore((state) => state.addSubtask);

    // Format seconds to h:m:s for totals
    const formatTotalTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
    };

    // Don't render table if no subtasks
    if (subtasks.length === 0) {
        return null;
    }

    return (
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden border-collapse">
            {/* Table Header */}
            <thead >
                <tr className="h-7 text-muted-foreground">
                    <th className="w-[30px] "></th>
                    <th className=""></th>
                    <th className="w-[100px] text-center text-xs ">Duration Est.</th>
                    <th className="w-[160px] text-center text-xs ">Time Spent</th>
                    <th className="w-[30px]"></th>
                </tr>
            </thead>

            {/* Table Body */}
            <tbody>
                {subtasks.map((subtask) => (
                    <tr key={subtask.id} className="h-8 last:border-b-0">
                        <td className="w-[30px] text-center align-middle">
                            <SubtaskCheckbox
                                nodeId={nodeId}
                                subtaskId={subtask.id}
                                isCompleted={subtask.isCompleted}
                            />
                        </td>
                        <td className="px-2">
                            <SubtaskTitle
                                nodeId={nodeId}
                                subtaskId={subtask.id}
                                title={subtask.title}
                                isCompleted={subtask.isCompleted}
                            />
                        </td>
                        <td className="w-[100px] text-center">
                            <SubtaskDuration
                                nodeId={nodeId}
                                subtaskId={subtask.id}
                                duration={subtask.estimatedDuration}
                            />
                        </td>
                        <td className="w-[80px] text-left">
                            <SubtaskTimer
                                nodeId={nodeId}
                                subtaskId={subtask.id}
                                timeSpent={subtask.timeSpent}
                            />
                        </td>
                        <td className="w-[30px] text-center">
                            <SubtaskDelete
                                nodeId={nodeId}
                                subtaskId={subtask.id}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>

            {/* Table Footer */}
            <tfoot className="">
                <tr className="border-t border-gray-200">
                    <td className="w-[30px] h-8"></td>
                    <td className="px-2">
                        <button
                            onClick={() => addSubtask(nodeId)}
                            className="text-muted hover:text-muted-foreground cursor-pointer text-sm"
                        >
                            + Add subtask
                        </button>
                    </td>
                    <td className="w-[100px] text-center text-sm">{totalEstimated} h</td>
                    <td className="w-[160px] text-center text-sm">{formatTotalTime(totalTimeSpent)}</td>
                    <td className="w-[30px]"></td>
                </tr>
            </tfoot>
        </table>
    );
}