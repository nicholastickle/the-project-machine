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
import useStore from '@/stores/flow-store'

interface TaskBookDialogProps {
    children: React.ReactNode;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export default function TaskBookDialog({ children, isOpen, onOpenChange }: TaskBookDialogProps) {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const savedTasks = useStore((state) => state.savedTasks);

    // Combine mock tasks with saved tasks from store
    const allTasks = [
        ...mockSections.flatMap(section => section.tasks),
        ...savedTasks
    ];

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
                        <div className="flex flex-col flex-[3] border-r border-muted-foreground/30" >
                            <div className="flex flex-[0.5] justify-center items-center border-y border-muted-foreground/30">
                                <p className="text-xl font-semibold ">Tasks</p>
                            </div>
                            <div className="flex flex-[11.5] p-4 overflow-y-auto">
                                <div className="w-full space-y-1">
                                    {allTasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className={`p-2 rounded cursor-pointer flex items-center gap-3 text-xs hover:bg-muted/50 ${
                                                selectedTask?.id === task.id ? 'bg-muted' : ''
                                            }`}
                                            onClick={() => handleTaskClick(task)}
                                        >
                                            <span className="text-lg">•</span>
                                            <div className="font-medium">{task.title}</div>
                                        </div>
                                    ))}
                                    {allTasks.length === 0 && (
                                        <div className="text-center text-muted-foreground py-8">
                                            No saved tasks yet
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col flex-[9]">

                            <div className="flex flex-row flex-[1.5] border-y border-muted-foreground/30" >


                                <div className="flex flex-[5] items-center p-2 text-lg font-semibold">
                                    <h2>{selectedTask ? selectedTask.title : "No task selected"}</h2>
                                </div>
                                <div className="flex flex-[3] justify-center items-center gap-2">
                                    <Button 
                                        variant="outline" 
                                        className="flex items-center gap-2 hover:bg-background hover:text-foreground"
                                        onClick={handleEdit}
                                        disabled={!selectedTask}
                                    >
                                        <Edit size={16} />
                                        Edit
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        className="flex items-center gap-2 hover:bg-background hover:text-foreground"
                                        onClick={handleUse}
                                        disabled={!selectedTask}
                                    >
                                        <Play size={16} />
                                        Use
                                    </Button>
                                </div>
                                <div className="flex flex-col flex-[3]">

                                    <div className="flex flex-col flex-[6] p-1 text-xs items-center">

                                        <p>Last updated:</p>
                                        <p> {selectedTask ? selectedTask.lastUpdated : "-"}</p>
                                    </div>
                                    <div className="flex flex-col flex-[6] p-1 text-xs items-center">
                                        <p>Last used:</p>
                                        <p> {selectedTask ? selectedTask.lastUsed || "-" : "-"}</p>
                                    </div>

                                </div>

                            </div>

                            <div className="flex flex-col flex-[9] p-4 overflow-y-auto">
                                {selectedTask ? (
                                    <>
                                        <p className="text-lg font-semibold mb-2">Description:</p>
                                        <p className="mb-4 text-sm">{selectedTask.description || "No description available"}</p>
                                        
                                        {'totalDuration' in selectedTask && (
                                            <p className="mb-4 text-sm">
                                                <span className="font-semibold">Total Duration:</span> {selectedTask.totalDuration}
                                            </p>
                                        )}
                                        
                                        {selectedTask.estimatedHours && (
                                            <p className="mb-4 text-sm">
                                                <span className="font-semibold">Estimated Hours:</span> {selectedTask.estimatedHours}h
                                            </p>
                                        )}
                                        
                                        {selectedTask.timeSpent !== undefined && (
                                            <p className="mb-4 text-sm">
                                                <span className="font-semibold">Time Spent:</span> {selectedTask.timeSpent}h
                                            </p>
                                        )}
                                        
                                        {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
                                            <>
                                                <p className="text-lg font-semibold mb-3 mt-4">Subtasks:</p>
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Subtask</TableHead>
                                                            <TableHead>Estimated Duration</TableHead>
                                                            <TableHead>Time Spent</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {selectedTask.subtasks.map((subtask, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell className="font-medium">{subtask.name}</TableCell>
                                                                <TableCell>{subtask.estimated}</TableCell>
                                                                <TableCell>{subtask.timeSpent}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-muted-foreground">
                                        <p>Select a task to view details</p>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-row flex-[0.5] ">

                                <div className="flex flex-[9] ">

                                </div>
                                <div className="flex flex-[3] justify-center items-center mb-3">
                                    <Button 
                                        variant="outline" 
                                        className="flex items-center gap-2 hover:bg-background hover:text-foreground"
                                        onClick={handleArchive}
                                        disabled={!selectedTask}
                                    >
                                        <Archive size={16} />
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