

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectValue,
} from "@/components/ui/select"

import CustomSelectTrigger from "@/components/task-card-node/custom-select-trigger";
import SaveTaskDialog from "@/components/task-card-node/save-task-dialog";
import useStore from "@/stores/flow-store";
import useTaskbookStore from "@/stores/taskbook-store";
import { useState } from "react";

interface SelectStatusProps {
    nodeId: string;
    status: string;
}

export default function SelectStatus({ nodeId, status }: SelectStatusProps) {
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [pendingStatus, setPendingStatus] = useState<string | null>(null);

    const updateNodeData = useStore((state) => state.updateNodeData);
    const addSavedTask = useTaskbookStore((state) => state.addSavedTask);
    const nodes = useStore((state) => state.nodes);

    const handleStatusChange = (newStatus: string) => {
        if (newStatus === "Complete") {
            // Store the pending status and show dialog
            setPendingStatus(newStatus);
            setShowSaveDialog(true);
        } else {
            updateNodeData(nodeId, { status: newStatus });
        }
    };

    const handleSaveConfirm = () => {
        // Find the current node to get its data
        const node = nodes.find(n => n.id === nodeId);
        if (node) {
            addSavedTask({
                title: node.data.title || "Untitled Task",
                status: "Complete",
                estimatedHours: node.data.estimatedHours,
                timeSpent: node.data.timeSpent || 0,
                subtasks: [], // Sprint 2: Empty for now
            });
        }
        
        // Update the node status
        if (pendingStatus) {
            updateNodeData(nodeId, { status: pendingStatus });
        }
        setPendingStatus(null);
    };

    const handleDialogOpenChange = (open: boolean) => {
        if (!open) {
            // If dialog is closed without confirmation, still update status
            if (pendingStatus) {
                updateNodeData(nodeId, { status: pendingStatus });
            }
            setPendingStatus(null);
        }
        setShowSaveDialog(open);
    };

    const currentNode = nodes.find(n => n.id === nodeId);

    return (
        <>
            <SaveTaskDialog
                isOpen={showSaveDialog}
                onOpenChange={handleDialogOpenChange}
                onConfirm={handleSaveConfirm}
                taskTitle={currentNode?.data.title || ""}
            />
            <Select value={status} onValueChange={handleStatusChange}>
                <CustomSelectTrigger className=" flex border-none p-0 focus:ring-0 focus:ring-offset-0 mr-10 bg-task-card-status-options-background">
                    <SelectValue placeholder="Select a status" />
                </CustomSelectTrigger>
                <SelectContent side="bottom" className=" bg-task-card-status-options-background text-task-card-status-options-foreground border border-task-card-status-options-border rounded-lg shadow-md">
                    <SelectGroup className="">

                        <SelectItem value="Not started" className="text-xs">
                            <span className="inline-block w-2 h-2 rounded-full mr-2 align-middle bg-task-card-not-started" />
                            Not started
                        </SelectItem>
                        <SelectItem value="On-going" className="text-xs">
                            <span className="inline-block w-2 h-2 rounded-full mr-2 align-middle bg-task-card-on-going" />
                            On-going
                        </SelectItem>
                        <SelectItem value="Stuck" className="text-xs">
                            <span className="inline-block w-2 h-2 rounded-full mr-2 align-middle bg-task-card-stuck" />
                            Stuck
                        </SelectItem>
                        <SelectItem value="Complete" className="text-xs">
                            <span className="inline-block w-2 h-2 rounded-full mr-2 align-middle bg-task-card-complete" />
                            Complete
                        </SelectItem>
                        <SelectItem value="Abandoned" className="text-xs">
                            <span className="inline-block w-2 h-2 rounded-full mr-2 align-middle bg-task-card-abandoned" />
                            Abandoned
                        </SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </>
    )
}