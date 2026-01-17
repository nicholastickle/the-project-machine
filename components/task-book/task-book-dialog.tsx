import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import TaskBookDelete from "@/components/task-book/task-book-task-delete"
import TaskBookArrayOfTasks from "@/components/task-book/task-book-array-of-tasks"
import TaskBookAddTask from "@/components/task-book/task-book-add-task"
import TaskBookUse from "@/components/task-book/task-book-task-use"
import TaskBookTaskTitle from "@/components/task-book/task-book-task-title"
import TaskBookTaskDescription from "@/components/task-book/task-book-task-description"
import TaskBookTaskSubtask from "@/components/task-book/task-book-task-subtask"
import TaskBookTaskComments from "@/components/task-book/task-book-task-comments"

import { BookType } from "lucide-react"
import { useState, useEffect } from 'react'
import useTaskbookStore from '@/stores/taskbook-store'
import { SavedTask } from '@/stores/types'

interface TaskBookDialogProps {
    children: React.ReactNode;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export default function TaskBookDialog({ children, isOpen, onOpenChange }: TaskBookDialogProps) {
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const savedTasks = useTaskbookStore((state) => state.savedTasks);
    const selectedTask = selectedTaskId ? savedTasks.find(task => task.id === selectedTaskId) || null : null;

    useEffect(() => {
        if (isOpen) {
            setSelectedTaskId(null);
        }
    }, [isOpen]);

    const handleTaskClick = (task: SavedTask) => {
        setSelectedTaskId(task.id);
    };

    const handleDeleteComplete = () => {
        setSelectedTaskId(null);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>


            <DialogContent className="border-none p-0 max-w-4xl w-full h-[90vh] max-h-[90vh] focus:outline-none outline-none rounded-2xl">
                <div className="flex flex-col h-full  text-task-book-foreground border bg-task-book-background border-task-book-border rounded-2xl">
                    <div className="flex flex-col flex-[1] bg-task-book-accent rounded-t-2xl">
                        <DialogHeader className="p-6  ">
                            <DialogTitle className="text-3xl font-bold text-left w-full flex flex-row items-center gap-2 "><span><BookType size={36} /></span>Task book</DialogTitle>
                            <DialogDescription className="text-xs text-task-book-foreground">All your saved tasks are stored here for you and your AI. Create new tasks, manage existing ones, import a task into your canvas</DialogDescription>
                        </DialogHeader>
                    </div>
                    <div className="flex flex-[11] flex-row">
                        <div className="flex flex-col flex-[3] " >
                            <div className="flex flex-col flex-[12]  bg-task-book-accent rounded-bl-2xl ">
                                <div className="border-y flex border-task-book-border px-4 items-center justify-center">
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
                                        tasks={savedTasks}
                                        selectedTask={selectedTask}
                                        onTaskClick={handleTaskClick}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col flex-[9]">
                            <div className="flex flex-row flex-[1.5] border-y border-task-book-border" >
                                <div className="flex flex-[5] items-center px-4 py-3">
                                    <TaskBookTaskTitle task={selectedTask} />
                                </div>
                                <div className="flex flex-[3] justify-center items-center gap-2 px-2">
                                    <TaskBookUse
                                        selectedTask={selectedTask}
                                        onClose={() => onOpenChange?.(false)}
                                    />
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
                                        <TaskBookTaskDescription task={selectedTask} />
                                        <TaskBookTaskSubtask task={selectedTask} />
                                        <TaskBookTaskComments task={selectedTask} />
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