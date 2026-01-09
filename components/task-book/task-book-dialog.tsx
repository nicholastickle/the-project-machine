import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import TaskBookDelete from "@/components/task-book/task-book-task-delete"
import TaskBookArrayOfTasks from "@/components/task-book/task-book-array-of-tasks"
import TaskBookAddTask from "@/components/task-book/task-book-add-task"

import { Play, BookType } from "lucide-react"
import { useState, useEffect } from 'react'
import useTaskbookStore from '@/stores/taskbook-store'
import { SavedTask } from '@/stores/types'

interface TaskBookDialogProps {
    children: React.ReactNode;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export default function TaskBookDialog({ children, isOpen, onOpenChange }: TaskBookDialogProps) {
    const [selectedTask, setSelectedTask] = useState<SavedTask | null>(null);
    const savedTasks = useTaskbookStore((state) => state.savedTasks);

    // Use only saved tasks from the taskbook store (which includes seed data)
    const allTasks = savedTasks;

    useEffect(() => {
        if (isOpen) {
            setSelectedTask(null);
        }
    }, [isOpen]);

    const handleTaskClick = (task: SavedTask) => {
        setSelectedTask(task);
    };

    const handleUse = () => {
        alert('Use functionality will be implemented in a future version. This will populate the canvas with this task structure.');
    };

    const handleDeleteComplete = () => {
        // Clear selected task when deleted
        setSelectedTask(null);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>


            <DialogContent className="border-none p-0 max-w-4xl w-full h-[90vh] max-h-[90vh] focus:outline-none outline-none rounded-2xl">
                <div className="flex flex-col h-full  text-task-book-foreground border bg-task-book-background border-task-book-border rounded-2xl">
                    <div className="flex flex-col flex-[1] bg-task-book-accent">
                        <DialogHeader className="p-6">
                            <DialogTitle className="text-3xl font-bold text-left w-full flex flex-row items-center gap-2 "><span><BookType size={36} /></span>Task book</DialogTitle>
                            <p className="text-xs text-task-book-foreground">All your saved tasks are stored here for you and your AI. Create new tasks, manage existing ones, import a task into your canvas</p>
                        </DialogHeader>
                    </div>
                    <div className="flex flex-[11] flex-row">
                        <div className="flex flex-col flex-[3] border-r border-task-book-border" >
                            <div className="flex flex-[0.5] justify-center items-center border-y border-task-book-border py-1 bg-task-book-accent">
                                <p className="text-task-book-foreground font-semibold">Saved Tasks</p>
                            </div>
                            <div className="flex flex-col flex-[11.5]  bg-task-book-accent rounded-bl-2xl ">
                                <div className="border-b flex border-task-book-border px-4 items-center justify-center">
                                    <TaskBookAddTask />
                                </div>
                                <div
                                    className="space-y-2 w-full max-h-[70vh] overflow-y-scroll scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent px-4 py-2"
                                    style={{
                                        scrollbarWidth: 'thin',
                                        scrollbarColor: 'hsl(var(--border)) transparent'
                                    }}
                                >

                                    <TaskBookArrayOfTasks
                                        tasks={allTasks}
                                        selectedTask={selectedTask}
                                        onTaskClick={handleTaskClick}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col flex-[9]">

                            <div className="flex flex-row flex-[1.5] border-y border-task-book-border" >


                                <div className="flex flex-[5] items-center px-4 py-3">
                                    <h2 className="text-task-book-foreground font-semibold">{selectedTask ? selectedTask.title : "No task selected"}</h2>
                                </div>
                                <div className="flex flex-[3] justify-center items-center gap-2 px-2">

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleUse}
                                        disabled={!selectedTask}
                                        className="bg-task-book-background text-task-book-foreground hover:bg-task-book-accent hover:text-task-book-accent-foreground border-task-book-border"
                                    >
                                        <Play size={14} className="mr-1" />
                                        Use
                                    </Button>
                                </div>
                                <div className="flex flex-col flex-[3]">

                                    <div className="flex flex-col flex-1 justify-center items-center px-2 py-1">
                                        <p className="text-xs text-muted-foreground">Last updated</p>
                                        <p className="text-xs text-task-book-foreground">{selectedTask ? selectedTask.lastUpdated : "-"}</p>
                                    </div>
                                    <div className="flex flex-col flex-1 justify-center items-center px-2 py-1">
                                        <p className="text-xs text-muted-foreground">Last used</p>
                                        <p className="text-xs text-task-book-foreground">{selectedTask ? selectedTask.lastUsed || "-" : "-"}</p>
                                    </div>

                                </div>

                            </div>

                            <div className="flex flex-col flex-[9] max-h-[60vh] overflow-hidden">
                                {selectedTask ? (
                                    <div
                                        className="p-4 overflow-y-scroll h-full scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
                                        style={{
                                            scrollbarWidth: 'thin',
                                            scrollbarColor: 'hsl(var(--border)) transparent'
                                        }}
                                    >
                                        <p className="text-sm font-semibold mb-2">Description</p>
                                        <p className="mb-4 text-sm">{selectedTask.description || "No description available"}</p>

                                        {selectedTask.estimatedHours && (
                                            <p className="mb-3 text-sm">
                                                <span className="font-semibold">Estimated Total Hours:</span> {selectedTask.estimatedHours}h
                                            </p>
                                        )}

                                        {selectedTask.timeSpent !== undefined && (
                                            <p className="mb-3 text-sm">
                                                <span className="font-semibold">Total Time Spent:</span> {(() => {
                                                    const seconds = selectedTask.timeSpent;
                                                    const hours = Math.floor(seconds / 3600);
                                                    const minutes = Math.floor((seconds % 3600) / 60);
                                                    const secs = seconds % 60;
                                                    return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
                                                })()}
                                            </p>
                                        )}

                                        {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
                                            <>
                                                <p className="text-sm font-semibold mb-2 mt-3">Subtasks</p>
                                                <div className="border border-task-book-border rounded-md">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow className="hover:bg-transparent border-task-card-border">
                                                                <TableHead className="w-auto">Subtasks</TableHead>
                                                                <TableHead className="text-center w-[100px]">Duration Est.</TableHead>
                                                                <TableHead className="text-center w-[160px]">Time Spent</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {selectedTask.subtasks.map((subtask) => (
                                                                <TableRow key={subtask.id} className="hover:bg-transparent border-task-card-border">
                                                                    <TableCell className="w-auto">
                                                                        {subtask.title}
                                                                    </TableCell>
                                                                    <TableCell className="text-center w-[100px]">{subtask.estimatedDuration} h</TableCell>
                                                                    <TableCell className="text-center w-[160px]">
                                                                        {(() => {
                                                                            const seconds = subtask.timeSpent;
                                                                            const hours = Math.floor(seconds / 3600);
                                                                            const minutes = Math.floor((seconds % 3600) / 60);
                                                                            const secs = seconds % 60;
                                                                            return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
                                                                        })()}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                        <TableFooter className="bg-transparent border-task-card-border">
                                                            <TableRow className="hover:bg-transparent border-task-card-border">
                                                                <TableCell className="font-medium w-auto">Total</TableCell>
                                                                <TableCell className="text-center font-medium w-[100px]">
                                                                    {selectedTask.subtasks.reduce((sum, subtask) => sum + subtask.estimatedDuration, 0)} h
                                                                </TableCell>
                                                                <TableCell className="text-center font-medium w-[160px]">
                                                                    {(() => {
                                                                        const totalSeconds = selectedTask.subtasks.reduce((sum, subtask) => sum + subtask.timeSpent, 0);
                                                                        const hours = Math.floor(totalSeconds / 3600);
                                                                        const minutes = Math.floor((totalSeconds % 3600) / 60);
                                                                        const secs = totalSeconds % 60;
                                                                        return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
                                                                    })()}
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableFooter>
                                                    </Table>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-muted-foreground">
                                        <p className="text-sm">Select a task to view details</p>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-row flex-[0.5] border-t border-task-book-border">

                                <div className="flex flex-[9]">

                                </div>
                                <div className="flex flex-[3] justify-center items-center py-3">
                                    <TaskBookDelete
                                        taskId={selectedTask?.id || null}
                                        disabled={!selectedTask}
                                        onDeleteComplete={handleDeleteComplete}
                                    />
                                </div>

                            </div>



                        </div>
                    </div>
                </div>
            </DialogContent>


        </Dialog>
    );
}