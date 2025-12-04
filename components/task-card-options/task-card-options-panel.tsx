import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Textarea } from "@/components/ui/textarea";

import useStore from '@/stores/flow-store';

interface TaskCardOptionsPanelProps {
    nodeId: string;
    title: string;
    status: string;
}

import { Ellipsis, Play } from 'lucide-react';

export default function TaskCardOptionsPanel({ nodeId, title, status }: TaskCardOptionsPanelProps) {

    const node = useStore((state) => state.nodes.find(n => n.id === nodeId));


    return (
        <Dialog >
            <DialogTrigger> <Ellipsis /></DialogTrigger>
            {/* We'll need to make this responsive */}
            <DialogContent className=" border-none p-0 max-w-3xl w-full h-[85vh] focus:outline-none">
                <div className="flex flex-col border border-4 border-task-card-panel-border rounded-xl shadow-md h-full bg-task-card-panel-background text-task-card-panel-foreground p-3">

                    <div className="flex flex-col flex-[1.5]">
                        <div className="flex flex-[4] items-center ">
                            <DialogHeader className="">
                                <DialogTitle className="text-3xl ">{title}</DialogTitle>
                            </DialogHeader>

                        </div>
                        <div className="flex flex-row flex-[8]">

                            <div className="flex flex-col flex-[3] ">
                                <div className="flex flex-[6] text-xs items-end">Start:</div>
                                <div className="flex flex-[6] text-sm">12 June 2025</div>

                            </div>
                            <div className="flex flex-col flex-[3]">
                                <div className="flex flex-[6] text-xs items-end">Duration:</div>
                                <div className="flex flex-[6] text-sm">2 days</div>

                            </div>
                            <div className="flex flex-col flex-[3]">
                                <div className="flex flex-[6] text-xs items-end">End:</div>
                                <div className="flex flex-[6] text-sm">14 June 2025</div>

                            </div>
                            <div className="flex flex-row flex-[3]">
                                <div className="flex flex-[6] flex-col">
                                    <div className="flex flex-[6] text-xs items-end">Timer:</div>
                                    <div className="flex flex-[6] text-sm">00:00:00</div>
                                </div>
                                <div className="flex flex-[6] flex-col items-start justify-center ">
                                    <Play size={30} />
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="flex flex-row flex-[11.5] mt-3">
                        <div className="flex flex-col flex-[9]">
                            <div className="flex flex-col flex-[3.5]">
                                <div className="flex flex-[2] items-center text-sm">Description</div>
                                <div className="flex flex-[10]"> 
                                    <Textarea className="w-full bg-task-card-panel-background-accent focus:outline-none focus:ring-0 resize-none text-xs rounded-2xl" placeholder="Enter task description..." /> </div>
                            </div>
                            <div className="flex flex-col flex-[5] mt-1">
                                <div className="flex flex-[1]">Checklist</div>
                                <div className="flex flex-[1]">100% (Progress bar) </div>
                                <div className="flex flex-[9]">Checklist items</div>
                                <div className="flex flex-[1]">Add an item</div>
                            </div>
                            <div className="flex flex-col flex-[3.5] border">

                                <div className="flex flex-[2] border">Activity:</div>
                                <div className="flex flex-[3] border"><span>[A]</span> Write a comment</div>
                                <div className="flex flex-[7] border"><span>[A]</span> Comment summary</div>
                            </div>

                        </div>
                        <div className="flex flex-col flex-[3] border">

                            <div className="flex flex-col flex-[4] border">

                                <div className="flex flex-[2] border">Status:</div>
                                <div className="flex flex-col flex-[10] border">

                                    <div className="flex flex-[2] border">Not Started</div>
                                    <div className="flex flex-[2] border">On-going</div>
                                    <div className="flex flex-[2] border">Stuck</div>
                                    <div className="flex flex-[2] border">Complete</div>
                                    <div className="flex flex-[2] border">Abandoned</div>
                                </div>

                            </div>
                            <div className="flex flex-col flex-[8] border">
                                <div className="flex flex-[2] border">Actions</div>
                                <div className="flex flex-col flex-[10] border">
                                    <div className="flex flex-[2] border">Attachments</div>
                                    <div className="flex flex-[2] border">Save as template</div>
                                    <div className="flex flex-[2] border">Archive</div>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>


            </DialogContent>
        </Dialog>
    )
}

