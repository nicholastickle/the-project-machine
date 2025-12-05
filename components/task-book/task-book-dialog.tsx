import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

import { Archive, Edit, Play } from "lucide-react"
import { mockSections, type Task } from './mock-data'
import { useState, useEffect } from 'react'

interface TaskBookDialogProps {
    children: React.ReactNode;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export default function TaskBookDialog({ children, isOpen, onOpenChange }: TaskBookDialogProps) {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    useEffect(() => {
        if (isOpen) {
            setSelectedTask(null);
        }
    }, [isOpen]);

    const handleTaskClick = (task: Task) => {
        setSelectedTask(task);
        console.log('Selected Task:', {
            id: task.id,
            title: task.title,
            description: task.description,
            totalDuration: task.totalDuration,
            lastUpdated: task.lastUpdated,
            lastUsed: task.lastUsed
        });
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
                            <div className="flex flex-[11.5] p-4">
                                <Accordion type="multiple" className="w-full">
                                    {mockSections.map((section) => (
                                        <AccordionItem key={section.id} value={section.id} className="border-none">
                                            <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline py-2">
                                                {section.title}
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="space-y-1">
                                                    {section.tasks.map((task) => (
                                                        <div
                                                            key={task.id}
                                                            className="p-1 rounded cursor-pointer flex items-center gap-3 text-xs"
                                                            onClick={() => handleTaskClick(task)}
                                                        >
                                                            <span className="text-lg">•</span>
                                                            <div className="font-medium">{task.title}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        </div>
                        <div className="flex flex-col flex-[9]">

                            <div className="flex flex-row flex-[1.5] border-y border-muted-foreground/30" >


                                <div className="flex flex-[5] items-center p-2 text-lg font-semibold">
                                    <h2>{selectedTask ? selectedTask.title : "No task selected"}</h2>
                                </div>
                                <div className="flex flex-[3] justify-center items-center gap-2">
                                    <Button variant="outline" className="flex items-center gap-2 hover:bg-background hover:text-foreground">
                                        <Edit size={16} />
                                        Edit
                                    </Button>
                                    <Button variant="outline" className="flex items-center gap-2 hover:bg-background hover:text-foreground">
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
                                        <p> {selectedTask ? selectedTask.lastUsed : "-"}</p>
                                    </div>

                                </div>

                            </div>

                            <div className="flex flex-col flex-[9] p-2">
                                {selectedTask ? (
                                    <>
                                        <p className="text-lg">Description:</p>
                                        <p className="mt-3 text-md">{selectedTask.description}</p>
                                        <br />
                                        <p>Total Duration: {selectedTask.totalDuration}</p>
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
                                    <Button variant="outline" className="flex items-center gap-2 hover:bg-background hover:text-foreground">
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