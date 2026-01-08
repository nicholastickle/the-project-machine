// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableFooter,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table";
// import EditableSubtaskCheckbox from './editable-subtask-checkbox';
// import EditableSubtaskTitle from './editable-subtask-title';
// import EditableSubtaskDuration from './editable-subtask-duration';
// import SubtaskTimer from './subtask-timer';
// import SubtaskDeleteButton from './subtask-delete-button';
// import useStore from '@/stores/flow-store';

// interface SubtaskTableProps {
//     nodeId: string;
//     subtasks: { id: string; title: string; isCompleted: boolean; estimatedDuration: number; timeSpent: number; }[];
// }

// export default function SubtaskTable({ nodeId, subtasks }: SubtaskTableProps) {
//     // Calculate totals
//     const totalEstimated = subtasks.reduce((sum, subtask) => sum + subtask.estimatedDuration, 0);
//     const totalTimeSpent = subtasks.reduce((sum, subtask) => sum + subtask.timeSpent, 0);
//     const addSubtask = useStore((state) => state.addSubtask);

//     // Format seconds to h:m:s for totals
//     const formatTotalTime = (seconds: number) => {
//         const hours = Math.floor(seconds / 3600);
//         const minutes = Math.floor((seconds % 3600) / 60);
//         const secs = seconds % 60;

//         return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
//     };

//     // Don't render table if no subtasks
//     if (subtasks.length === 0) {
//         return null;
//     }

//     return (
//         <Table>
//             <TableHeader>
//                 <TableRow className="hover:bg-transparent border-task-card-border">
//                     <TableHead className="w-[30px]"></TableHead>
//                     <TableHead className="w-auto">Subtasks</TableHead>
//                     <TableHead className="text-center w-[100px]">Duration Est.</TableHead>
//                     <TableHead className="text-center w-[160px]">Time Spent</TableHead>
//                     <TableHead className="w-[30px]"></TableHead>
//                 </TableRow>
//             </TableHeader>
//             <TableBody>
//                 {subtasks.map((subtask) => (
//                     <TableRow key={subtask.id} className="hover:bg-transparent border-task-card-border">
//                         <TableCell className="w-[30px]">
//                             <EditableSubtaskCheckbox
//                                 nodeId={nodeId}
//                                 subtaskId={subtask.id}
//                                 isCompleted={subtask.isCompleted}
//                             />
//                         </TableCell>
//                         <TableCell className="w-auto">
//                             <EditableSubtaskTitle
//                                 nodeId={nodeId}
//                                 subtaskId={subtask.id}
//                                 title={subtask.title}
//                                 isCompleted={subtask.isCompleted}
//                             />
//                         </TableCell>
//                         <TableCell className="text-center w-[100px]">
//                             <EditableSubtaskDuration
//                                 nodeId={nodeId}
//                                 subtaskId={subtask.id}
//                                 duration={subtask.estimatedDuration}
//                             />
//                         </TableCell>
//                         <TableCell className="text-center w-[160px]">
//                             <SubtaskTimer
//                                 nodeId={nodeId}
//                                 subtaskId={subtask.id}
//                                 timeSpent={subtask.timeSpent}
//                             />
//                         </TableCell>
//                         <TableCell className="w-[30px]">
//                             <SubtaskDeleteButton
//                                 nodeId={nodeId}
//                                 subtaskId={subtask.id}
//                             />
//                         </TableCell>
//                     </TableRow>
//                 ))}
//             </TableBody>
//             <TableFooter className="bg-transparent border-task-card-border">
//                 <TableRow className="hover:bg-transparent border-task-card-border">
//                     <TableCell className="w-[30px]"></TableCell>
//                     <TableCell className="font-medium w-auto">
//                         <button
//                             onClick={() => addSubtask(nodeId)}
//                             className="text-task-card-foreground hover:text-blue-600 transition-colors cursor-pointer border border-task-card-border rounded-full px-3 py-1"
//                         >
//                             + Add subtask
//                         </button>
//                     </TableCell>
//                     <TableCell className="text-center font-medium w-[100px]">{totalEstimated} h</TableCell>
//                     <TableCell className="text-center font-medium w-[160px]">{formatTotalTime(totalTimeSpent)}</TableCell>
//                     <TableCell className="w-[30px]"></TableCell>
//                 </TableRow>
//             </TableFooter>
//         </Table>
//     );
// }