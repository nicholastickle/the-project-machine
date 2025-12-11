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
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

import { Archive, Edit, Play } from "lucide-react"
import { mockSections, type Task } from './mock-data'
import { useState, useEffect } from 'react'
import useTaskbookStore from '@/stores/taskbook-store'

interface TaskBookDialogProps {
    children: React.ReactNode;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export default function TaskBookDialog({ children, isOpen, onOpenChange }: TaskBookDialogProps) {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const savedTasks = useTaskbookStore((state) => state.savedTasks);

    // Use only saved tasks from the taskbook store (which includes seed data)
    const allTasks = savedTasks;

    useEffect(() => {
        if (isOpen) {
            setSelectedTask(null);
        }
    }, [isOpen]);

    const handleTaskClick = (task: Task | typeof savedTasks[0]) => {
        setSelectedTask(task as Task);
    };

    const handleEdit = () => {
        alert('Edit functionality will be implemented in a future version.');
    };

    const handleUse = () => {
        alert('Use functionality will be implemented in a future version. This will populate the canvas with this task structure.');
    };

    const handleArchive = () => {
        alert('Archive functionality will be implemented in a future version.');
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>


            <DialogContent className="border-none p-0 max-w-4xl w-full h-[90vh] focus:outline-none">
                <div className="flex flex-col h-full bg-background text-foreground rounded-2xl">
                    <div className="flex flex-col flex-[1]">
                        <DialogHeader className="p-6">
                            <DialogTitle className="text-2xl font-bold text-center w-full">Saved completed tasks</DialogTitle>
                        </DialogHeader>
                    </div>
                    <div className="flex flex-[11] flex-row">
                        <div className="flex flex-col flex-[3] border-r border-border" >
                            <div className="flex flex-[0.5] justify-center items-center border-b border-border py-3">
                                <p className="text-base font-semibold">Tasks</p>
                            </div>
                            <div className="flex flex-[11.5] p-4 overflow-y-auto">
                                <div className="w-full space-y-1">
                                    {allTasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className={`p-2 cursor-pointer flex items-center gap-3 text-sm ${
                                                selectedTask?.id === task.id ? 'font-semibold' : ''
                                            }`}
                                            onClick={() => handleTaskClick(task)}
                                        >
                                            <span className="text-lg">•</span>
                                            <div>{task.title}</div>
                                        </div>
                                    ))}
                                    {allTasks.length === 0 && (
                                        <div className="text-center text-muted-foreground py-8 text-sm">
                                            No saved tasks yet
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col flex-[9]">

                            <div className="flex flex-row flex-[1.5] border-b border-border" >


                                <div className="flex flex-[5] items-center px-4 py-3">
                                    <h2 className="text-base font-semibold">{selectedTask ? selectedTask.title : "No task selected"}</h2>
                                </div>
                                <div className="flex flex-[3] justify-center items-center gap-2 border-l border-border px-3">
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={handleEdit}
                                        disabled={!selectedTask}
                                    >
                                        <Edit size={14} className="mr-1" />
                                        Edit
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={handleUse}
                                        disabled={!selectedTask}
                                    >
                                        <Play size={14} className="mr-1" />
                                        Use
                                    </Button>
                                </div>
                                <div className="flex flex-col flex-[3] border-l border-border">

                                    <div className="flex flex-col flex-1 justify-center items-center border-b border-border px-2 py-1">
                                        <p className="text-xs text-muted-foreground">Last updated</p>
                                        <p className="text-xs">{selectedTask ? selectedTask.lastUpdated : "-"}</p>
                                    </div>
                                    <div className="flex flex-col flex-1 justify-center items-center px-2 py-1">
                                        <p className="text-xs text-muted-foreground">Last used</p>
                                        <p className="text-xs">{selectedTask ? selectedTask.lastUsed || "-" : "-"}</p>
                                    </div>

                                </div>

                            </div>

                            <div className="flex flex-col flex-[9] p-4 overflow-y-auto">
                                {selectedTask ? (
                                    <>
                                        <p className="text-sm font-semibold mb-2">Description</p>
                                        <p className="mb-4 text-sm">{selectedTask.description || "No description available"}</p>
                                        
                                        {'totalDuration' in selectedTask && (
                                            <p className="mb-3 text-sm">
                                                <span className="font-semibold">Total Duration:</span> {selectedTask.totalDuration}
                                            </p>
                                        )}
                                        
                                        {selectedTask.estimatedHours && (
                                            <p className="mb-3 text-sm">
                                                <span className="font-semibold">Estimated Hours:</span> {selectedTask.estimatedHours}h
                                            </p>
                                        )}
                                        
                                        {selectedTask.timeSpent !== undefined && (
                                            <p className="mb-3 text-sm">
                                                <span className="font-semibold">Time Spent:</span> {selectedTask.timeSpent}h
                                            </p>
                                        )}
                                        
                                        {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
                                            <>
                                                <p className="text-sm font-semibold mb-2 mt-3">Subtasks</p>
                                                <div className="border border-border rounded-md max-h-[300px] overflow-y-auto">
                                                    <Table>
                                                        <TableHeader className="sticky top-0 bg-background">
                                                            <TableRow>
                                                                <TableHead className="text-xs">Subtask</TableHead>
                                                                <TableHead className="text-xs">Estimated Duration</TableHead>
                                                                <TableHead className="text-xs">Time Spent</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {selectedTask.subtasks.map((subtask, index) => (
                                                                <TableRow key={index}>
                                                                    <TableCell className="text-xs">{subtask.name}</TableCell>
                                                                    <TableCell className="text-xs">{subtask.estimated}</TableCell>
                                                                    <TableCell className="text-xs">{subtask.timeSpent}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-muted-foreground">
                                        <p className="text-sm">Select a task to view details</p>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-row flex-[0.5] border-t border-border">

                                <div className="flex flex-[9]">

                                </div>
                                <div className="flex flex-[3] justify-center items-center py-3">
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={handleArchive}
                                        disabled={!selectedTask}
                                    >
                                        <Archive size={14} className="mr-1" />
                                        Archive
                                    </Button>
                                </div>

                            </div>



                        </div>
                    </div>
                </div>
            </DialogContent>


        </Dialog>
    );
}